from utils.downloader import (
    download_file,
    get_file_info_from_url,
)
import asyncio
from pathlib import Path
from contextlib import asynccontextmanager
import aiofiles
from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Form, Response
from fastapi.responses import FileResponse, JSONResponse
from config import ADMIN_PASSWORD, MAX_FILE_SIZE, STORAGE_CHANNEL
from utils.clients import initialize_clients
from utils.directoryHandler import getRandomID
from utils.extra import auto_ping_website, convert_class_to_dict, reset_cache_dir
from utils.streamer import media_streamer
from utils.uploader import start_file_uploader
from utils.logger import Logger
import urllib.parse


# Startup Event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Reset the cache directory, delete cache files
    reset_cache_dir()

    # Initialize the clients
    await initialize_clients()

    # Start the website auto ping task
    asyncio.create_task(auto_ping_website())

    yield


app = FastAPI(docs_url=None, redoc_url=None, lifespan=lifespan)
logger = Logger(__name__)


@app.get("/")
async def home_page():
    return FileResponse("website/home.html")


@app.get("/stream")
async def home_page():
    return FileResponse("website/VideoPlayer.html")


@app.get("/static/{file_path:path}")
async def static_files(file_path):
    if "apiHandler.js" in file_path:
        with open(Path("website/static/js/apiHandler.js")) as f:
            content = f.read()
            content = content.replace("MAX_FILE_SIZE__SDGJDG", str(MAX_FILE_SIZE))
        return Response(content=content, media_type="application/javascript")
    return FileResponse(f"website/static/{file_path}")


@app.get("/file")
async def dl_file(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    path = request.query_params["path"]
    file = DRIVE_DATA.get_file(path)
    return await media_streamer(STORAGE_CHANNEL, file.file_id, file.name, request)


# Api Routes


@app.post("/api/checkPassword")
async def check_password(request: Request):
    data = await request.json()
    if data["pass"] == ADMIN_PASSWORD:
        return JSONResponse({"status": "ok"})
    return JSONResponse({"status": "Invalid password"})


@app.post("/api/createNewFolder")
async def api_new_folder(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"createNewFolder {data}")
    folder_data = DRIVE_DATA.get_directory(data["path"]).contents
    for id in folder_data:
        f = folder_data[id]
        if f.type == "folder":
            if f.name == data["name"]:
                return JSONResponse(
                    {
                        "status": "Folder with the name already exist in current directory"
                    }
                )

    DRIVE_DATA.new_folder(data["path"], data["name"])
    return JSONResponse({"status": "ok"})


@app.post("/api/getDirectory")
async def api_get_directory(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    data = await request.json()

    if data["password"] == ADMIN_PASSWORD:
        is_admin = True
    else:
        is_admin = False

    auth = data.get("auth")

    logger.info(f"getFolder {data}")

    if data["path"] == "/trash":
        data = {"contents": DRIVE_DATA.get_trashed_files_folders()}
        folder_data = convert_class_to_dict(data, isObject=False, showtrash=True)

    elif "/search_" in data["path"]:
        query = urllib.parse.unquote(data["path"].split("_", 1)[1])
        print(query)
        data = {"contents": DRIVE_DATA.search_file_folder(query)}
        print(data)
        folder_data = convert_class_to_dict(data, isObject=False, showtrash=False)
        print(folder_data)

    elif "/share_" in data["path"]:
        path = data["path"].split("_", 1)[1]
        folder_data, auth_home_path = DRIVE_DATA.get_directory(path, is_admin, auth)
        auth_home_path= auth_home_path.replace("//", "/") if auth_home_path else None
        folder_data = convert_class_to_dict(folder_data, isObject=True, showtrash=False)
        return JSONResponse(
            {"status": "ok", "data": folder_data, "auth_home_path": auth_home_path}
        )

    else:
        folder_data = DRIVE_DATA.get_directory(data["path"])
        folder_data = convert_class_to_dict(folder_data, isObject=True, showtrash=False)
    return JSONResponse({"status": "ok", "data": folder_data, "auth_home_path": None})


SAVE_PROGRESS = {}


@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    path: str = Form(...),
    password: str = Form(...),
    id: str = Form(...),
    total_size: str = Form(...),
):
    global SAVE_PROGRESS

    if password != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    total_size = int(total_size)
    SAVE_PROGRESS[id] = ("running", 0, total_size)

    ext = file.filename.lower().split(".")[-1]

    cache_dir = Path("./cache")
    cache_dir.mkdir(parents=True, exist_ok=True)
    file_location = cache_dir / f"{id}.{ext}"

    file_size = 0

    async with aiofiles.open(file_location, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):  # Read file in chunks of 1MB
            SAVE_PROGRESS[id] = ("running", file_size, total_size)
            file_size += len(chunk)
            if file_size > MAX_FILE_SIZE:
                await buffer.close()
                file_location.unlink()  # Delete the partially written file
                raise HTTPException(
                    status_code=400,
                    detail=f"File size exceeds {MAX_FILE_SIZE} bytes limit",
                )
            await buffer.write(chunk)

    SAVE_PROGRESS[id] = ("completed", file_size, file_size)

    asyncio.create_task(
        start_file_uploader(file_location, id, path, file.filename, file_size)
    )

    return JSONResponse({"id": id, "status": "ok"})


@app.post("/api/getSaveProgress")
async def get_save_progress(request: Request):
    global SAVE_PROGRESS

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"getUploadProgress {data}")
    try:
        progress = SAVE_PROGRESS[data["id"]]
        return JSONResponse({"status": "ok", "data": progress})
    except:
        return JSONResponse({"status": "not found"})


@app.post("/api/getUploadProgress")
async def get_upload_progress(request: Request):
    from utils.uploader import PROGRESS_CACHE

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"getUploadProgress {data}")

    try:
        progress = PROGRESS_CACHE[data["id"]]
        return JSONResponse({"status": "ok", "data": progress})
    except:
        return JSONResponse({"status": "not found"})


@app.post("/api/cancelUpload")
async def cancel_upload(request: Request):
    from utils.uploader import STOP_TRANSMISSION
    from utils.downloader import STOP_DOWNLOAD

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"cancelUpload {data}")
    STOP_TRANSMISSION.append(data["id"])
    STOP_DOWNLOAD.append(data["id"])
    return JSONResponse({"status": "ok"})


@app.post("/api/renameFileFolder")
async def rename_file_folder(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"renameFileFolder {data}")
    DRIVE_DATA.rename_file_folder(data["path"], data["name"])
    return JSONResponse({"status": "ok"})


@app.post("/api/trashFileFolder")
async def trash_file_folder(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"trashFileFolder {data}")
    DRIVE_DATA.trash_file_folder(data["path"], data["trash"])
    return JSONResponse({"status": "ok"})


@app.post("/api/deleteFileFolder")
async def delete_file_folder(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"deleteFileFolder {data}")
    DRIVE_DATA.delete_file_folder(data["path"])
    return JSONResponse({"status": "ok"})


@app.post("/api/getFileInfoFromUrl")
async def getFileInfoFromUrl(request: Request):

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"getFileInfoFromUrl {data}")
    try:
        file_info = await get_file_info_from_url(data["url"])
        return JSONResponse({"status": "ok", "data": file_info})
    except Exception as e:
        return JSONResponse({"status": str(e)})


@app.post("/api/startFileDownloadFromUrl")
async def startFileDownloadFromUrl(request: Request):
    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"startFileDownloadFromUrl {data}")
    try:
        id = getRandomID()
        asyncio.create_task(
            download_file(data["url"], id, data["path"], data["filename"], data["singleThreaded"])
        )
        return JSONResponse({"status": "ok", "id": id})
    except Exception as e:
        return JSONResponse({"status": str(e)})


@app.post("/api/getFileDownloadProgress")
async def getFileDownloadProgress(request: Request):
    from utils.downloader import DOWNLOAD_PROGRESS

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"getFileDownloadProgress {data}")

    try:
        progress = DOWNLOAD_PROGRESS[data["id"]]
        return JSONResponse({"status": "ok", "data": progress})
    except:
        return JSONResponse({"status": "not found"})


@app.post("/api/getFolderShareAuth")
async def getFolderShareAuth(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"getFolderShareAuth {data}")

    try:
        auth = DRIVE_DATA.get_folder_auth(data["path"])
        return JSONResponse({"status": "ok", "auth": auth})
    except:
        return JSONResponse({"status": "not found"})


@app.post("/api/moveFiles")
async def move_files(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"moveFiles {data}")

    try:
        moved_items = DRIVE_DATA.move_files(data["file_ids"], data["destination_path"])
        return JSONResponse({"status": "ok", "moved_items": moved_items})
    except Exception as e:
        logger.error(f"Error moving files: {e}")
        return JSONResponse({"status": f"Error: {str(e)}"})


@app.post("/api/getAllFolders")
async def get_all_folders(request: Request):
    from utils.directoryHandler import DRIVE_DATA

    data = await request.json()

    if data["password"] != ADMIN_PASSWORD:
        return JSONResponse({"status": "Invalid password"})

    logger.info(f"getAllFolders {data}")

    try:
        folders = DRIVE_DATA.get_all_folders()
        return JSONResponse({"status": "ok", "folders": folders})
    except Exception as e:
        logger.error(f"Error getting folders: {e}")
        return JSONResponse({"status": f"Error: {str(e)}"})


# Google Drive API Endpoints
@app.get("/api/suggestions/folders")
async def get_folder_suggestions():
    """Get suggested folders for Beranda page"""
    try:
        from utils.directoryHandler import DRIVE_DATA
        from utils.extra import convert_class_to_dict
        
        # Get folders from root directory
        root_data = DRIVE_DATA.get_directory('/')
        folder_data = convert_class_to_dict(root_data, isObject=True, showtrash=False)
        
        suggestions = []
        contents = folder_data.get('contents', {})
        
        # Get top 6 folders for suggestions
        folder_count = 0
        for item_id, item in contents.items():
            if item.get('type') == 'folder' and folder_count < 6:
                suggestions.append({
                    'name': item['name'],
                    'path': item['path'],
                    'id': item_id,
                    'type': 'folder'
                })
                folder_count += 1
        
        return JSONResponse({
            'success': True,
            'folders': suggestions
        })
        
    except Exception as e:
        logger.error(f"❌ Error getting folder suggestions: {str(e)}")
        return JSONResponse({
            'success': False,
            'error': str(e),
            'folders': []
        })


@app.get("/api/suggestions/files")
async def get_file_suggestions():
    """Get suggested files for Beranda page"""
    try:
        from utils.directoryHandler import DRIVE_DATA
        from utils.extra import convert_class_to_dict
        import random
        
        suggestions = []
        
        # Get files from root directory
        root_data = DRIVE_DATA.get_directory('/')
        folder_data = convert_class_to_dict(root_data, isObject=True, showtrash=False)
        
        contents = folder_data.get('contents', {})
        all_files = []
        
        # Collect all files from root
        for item_id, item in contents.items():
            if item.get('type') == 'file':
                all_files.append({
                    'id': item_id,
                    'name': item['name'],
                    'extension': item['name'].split('.')[-1] if '.' in item['name'] else '',
                    'path': item['path'],
                    'size': item.get('size', 0),
                    'location': 'Drive Saya'
                })
        
        # Create suggestions with reasons
        reasons = [
            "Anda menguploadnya • 18.53",
            "Anda membuatnya • 20.44", 
            "Anda mengubahnya • 20.44",
            "Anda menguploadnya • 20.44",
            "Anda membukanya • 20.43",
            "Anda mengakses terakhir • 20.43"
        ]
        
        # Randomly select files and assign reasons
        selected_files = random.sample(all_files, min(len(all_files), 8))
        
        for i, file in enumerate(selected_files):
            reason = reasons[i % len(reasons)]
            suggestions.append({
                'id': file['id'],
                'name': file['name'],
                'extension': file['extension'],
                'reason': reason,
                'location': file['location'],
                'path': file['path'],
                'size': file['size']
            })
        
        return JSONResponse({
            'success': True,
            'files': suggestions
        })
        
    except Exception as e:
        logger.error(f"❌ Error getting file suggestions: {str(e)}")
        return JSONResponse({
            'success': False,
            'error': str(e),
            'files': []
        })


@app.get("/api/storage/info")
async def get_storage_info():
    """Get storage usage information"""
    try:
        import os
        from pathlib import Path
        
        # Calculate total storage used
        total_size = 0
        
        def get_folder_size(path):
            total = 0
            try:
                for item in Path(path).rglob('*'):
                    if item.is_file():
                        total += item.stat().st_size
            except:
                pass
            return total
        
        # Calculate size of data directory (where files are stored)
        data_path = Path('data')
        if data_path.exists():
            total_size = get_folder_size(data_path)
        
        # Also check cache directory
        cache_path = Path('cache')
        if cache_path.exists():
            total_size += get_folder_size(cache_path)
        
        return JSONResponse({
            'success': True,
            'used': total_size,
            'used_formatted': format_file_size(total_size),
            'quota': 'unlimited',
            'percentage': 0  # Always 0% for unlimited storage
        })
        
    except Exception as e:
        logger.error(f"❌ Error getting storage info: {str(e)}")
        return JSONResponse({
            'success': False,
            'error': str(e),
            'used': 0,
            'used_formatted': '0 B',
            'quota': 'unlimited',
            'percentage': 0
        })


@app.get("/api/files/recent")
async def get_recent_files():
    """Get recently accessed/modified files"""
    try:
        from utils.directoryHandler import DRIVE_DATA
        from utils.extra import convert_class_to_dict
        import random
        
        recent_files = []
        
        # Get files from root directory and some subfolders
        root_data = DRIVE_DATA.get_directory('/')
        folder_data = convert_class_to_dict(root_data, isObject=True, showtrash=False)
        
        contents = folder_data.get('contents', {})
        all_files = []
        
        # Collect files from root
        for item_id, item in contents.items():
            if item.get('type') == 'file':
                all_files.append({
                    'id': item_id,
                    'name': item['name'],
                    'extension': item['name'].split('.')[-1] if '.' in item['name'] else '',
                    'path': item['path'],
                    'size': item.get('size', 0)
                })
            elif item.get('type') == 'folder':
                # Get some files from subfolders
                try:
                    subfolder_data = DRIVE_DATA.get_directory(item['path'])
                    subfolder_contents = convert_class_to_dict(subfolder_data, isObject=True, showtrash=False)
                    
                    for sub_id, sub_item in subfolder_contents.get('contents', {}).items():
                        if sub_item.get('type') == 'file' and len(all_files) < 50:  # Limit collection
                            all_files.append({
                                'id': sub_id,
                                'name': sub_item['name'],
                                'extension': sub_item['name'].split('.')[-1] if '.' in sub_item['name'] else '',
                                'path': sub_item['path'],
                                'size': sub_item.get('size', 0)
                            })
                except:
                    continue
        
        # Shuffle and take top 20 files
        random.shuffle(all_files)
        selected_files = all_files[:20]
        
        # Add mock modification times
        mod_times = [
            "17 Nov 2024", "18 Okt 2024", "2 Jun", "29 Jun", "26 Jun",
            "16 Mei 2024", "11 Jan 2024", "2 Mei", "5 Jun", "30 Jun"
        ]
        
        for i, file in enumerate(selected_files):
            mod_time = mod_times[i % len(mod_times)]
            recent_files.append({
                'id': file['id'],
                'name': file['name'],
                'extension': file['extension'],
                'modified_at': mod_time,
                'size_formatted': format_file_size(file['size']),
                'path': file['path'],
                'type': 'file'
            })
        
        return JSONResponse({
            'success': True,
            'files': recent_files
        })
        
    except Exception as e:
        logger.error(f"❌ Error getting recent files: {str(e)}")
        return JSONResponse({
            'success': False,
            'error': str(e),
            'files': []
        })


def format_file_size(size_bytes):
    """Format file size in human readable format"""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    import math
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {size_names[i]}"
