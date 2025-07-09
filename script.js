// Mock data for files and folders based on the screenshot
const mockFolders = [
    { name: "All File", type: "folder", icon: "folder", owner: "saya", modified: "—", size: "—" },
    { name: "App", type: "folder", icon: "folder", owner: "saya", modified: "2 Jun", size: "—" },
    { name: "BACKUP JUNI 2025", type: "folder", icon: "folder", owner: "saya", modified: "29 Jun", size: "—" },
    { name: "BackupCache", type: "folder", icon: "folder", owner: "saya", modified: "29 Jun", size: "—" },
    { name: "BackupDestination", type: "folder", icon: "folder", owner: "saya", modified: "30 Jun", size: "—" },
    { name: "Colab Notebooks", type: "folder", icon: "folder", owner: "saya", modified: "26 Jun", size: "—" },
    { name: "Data baru", type: "folder", icon: "folder", owner: "saya", modified: "16 Mei 2024", size: "—" },
    { name: "Data PT", type: "folder", icon: "folder", owner: "saya", modified: "16 Mei 2024", size: "—" },
    { name: "Folder tanpa nama", type: "folder", icon: "folder", owner: "saya", modified: "11 Jan 2024", size: "—" },
    { name: "KEY SSH", type: "folder", icon: "folder", owner: "saya", modified: "2 Mei", size: "—" },
    { name: "LOG_TRANSFER", type: "folder", icon: "folder", owner: "saya", modified: "29 Jun", size: "—" },
    { name: "Paspor", type: "folder", icon: "folder", owner: "saya", modified: "5 Jun", size: "—" },
    { name: "Proof of transaction", type: "file", icon: "insert_drive_file", owner: "saya", modified: "18 Okt 2024", size: "—" },
    { name: "tes", type: "file", icon: "insert_drive_file", owner: "saya", modified: "17 Nov 2024", size: "—" },
    { name: "Toy", type: "folder", icon: "folder", owner: "saya", modified: "29 Jun", size: "—" }
];

const mockFiles = [
    {
        id: 1,
        name: "clone drive fix.ipynb",
        type: "notebook",
        icon: "description",
        reason: "Anda mengubahnya",
        time: "18.53",
        location: "Colab Notebooks",
        locationIcon: "folder"
    },
    {
        id: 2,
        name: "IMG-20240117-WA0101.jpg",
        type: "image",
        icon: "image",
        reason: "Anda menguploadnya",
        time: "20.44",
        location: "WhatsApp Images",
        locationIcon: "folder"
    },
    {
        id: 3,
        name: "IMG-20240117-WA0117.jpg",
        type: "image",
        icon: "image",
        reason: "Anda membuatnya",
        time: "20.44",
        location: "WhatsApp Images",
        locationIcon: "folder"
    },
    {
        id: 4,
        name: "IMG-20240118-WA0001.jpg",
        type: "image",
        icon: "image",
        reason: "Anda membuatnya",
        time: "20.44",
        location: "WhatsApp Images",
        locationIcon: "folder"
    },
    {
        id: 5,
        name: "IMG-20240117-WA0107.jpg",
        type: "image",
        icon: "image",
        reason: "Anda membuatnya",
        time: "20.44",
        location: "WhatsApp Images",
        locationIcon: "folder"
    },
    {
        id: 6,
        name: "IMG-20240117-WA0120.jpg",
        type: "image",
        icon: "image",
        reason: "Anda membuatnya",
        time: "20.44",
        location: "WhatsApp Images",
        locationIcon: "folder"
    },
    {
        id: 7,
        name: "IMG-20240117-WA0114.jpg",
        type: "image",
        icon: "image",
        reason: "Anda membuatnya",
        time: "20.44",
        location: "WhatsApp Images",
        locationIcon: "folder"
    },
    {
        id: 8,
        name: "IMG-20240119-WA0000.jpg",
        type: "image",
        icon: "image",
        reason: "Anda menguploadnya",
        time: "20.43",
        location: "WhatsApp Images",
        locationIcon: "folder"
    },
    {
        id: 9,
        name: "IMG-20240118-WA0000.jpg",
        type: "image",
        icon: "image",
        reason: "Anda menguploadnya",
        time: "20.44",
        location: "WhatsApp Images",
        locationIcon: "folder"
    },
    {
        id: 10,
        name: "IMG-20240119-WA0003.jpg",
        type: "image",
        icon: "image",
        reason: "Anda menguploadnya",
        time: "20.43",
        location: "WhatsApp Images",
        locationIcon: "folder"
    }
];

const sharedDrives = [
    { name: "04", owner: "File milik 影化藝术高中", members: "2 grup • 4 orang" },
    { name: "24/10/04 admin@faxxy.web.id", owner: "File milik faxxy.web.id", members: "2 orang" },
    { name: "admin@bunga.web.id", owner: "File milik backup file", members: "2 orang" },
    { name: "admin@erza.email 15/09/24", owner: "File milik Kuromey", members: "2 grup • 8 orang" },
    { name: "admin@meicez.my.id", owner: "File milik sellvps", members: "2 grup • 3 orang" },
    { name: "admin@reddigitalprinting.web.id", owner: "File milik rorona", members: "2 grup • 3 orang" },
    { name: "NEW 09/2024", owner: "File milik sellvps", members: "2 grup • 7 orang" },
    { name: "Rahmat", owner: "File milik sellvps", members: "2 grup • 3 orang" },
    { name: "SD1", owner: "File milik SAIS Dubai", members: "2 grup • 4 orang" },
    { name: "tes DF", owner: "File milik Digital Flazz", members: "2 grup • 2 orang" }
];

// State management
let currentView = 'my-drive';
let currentLayout = 'list';
let searchQuery = '';

// DOM elements
const navItems = document.querySelectorAll('.nav-item');
const viewBtns = document.querySelectorAll('.view-btn');
const fileList = document.getElementById('fileList');
const searchInput = document.querySelector('.search-input');
const pageTitle = document.querySelector('.page-title');
const mainContent = document.querySelector('.main-content');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    // Pastikan "Drive Saya" aktif saat load
    setActiveNavigation('Drive Saya');
    renderContent();
});

function setActiveNavigation(sectionName) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const text = item.querySelector('span:last-child').textContent;
        if (text === sectionName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function initializeEventListeners() {
    // Navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const text = item.querySelector('span:last-child').textContent;
            handleNavigation(text, item);
        });
    });

    // View toggle buttons
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (view) {
                toggleView(view, btn);
            }
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderContent();
    });

    // New button functionality
    const newBtn = document.querySelector('.new-btn');
    newBtn.addEventListener('click', () => {
        showNewMenu();
    });

    // Menu button (sidebar toggle for mobile)
    const menuBtn = document.querySelector('.menu-btn');
    menuBtn.addEventListener('click', () => {
        toggleSidebar();
    });

    // Info button
    const infoBtn = document.querySelector('.info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            alert('Informasi tentang Google Drive');
        });
    }

    // Dropdown button
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', () => {
            alert('Dropdown menu untuk Drive Saya');
        });
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn-toolbar');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.querySelector('span:first-child').textContent;
            alert(`Filter: ${filterType}`);
        });
    });

    // Folder cards
    const folderCards = document.querySelectorAll('.folder-card');
    folderCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.folder-menu-btn')) {
                const folderName = card.querySelector('.folder-name').textContent;
                alert(`Membuka folder: ${folderName}`);
            }
        });
    });
}

function handleNavigation(section, navItem) {
    // Update active state
    navItems.forEach(item => item.classList.remove('active'));
    navItem.classList.add('active');

    // Update current view
    switch(section) {
        case 'Beranda':
            currentView = 'home';
            break;
        case 'Drive Saya':
            currentView = 'my-drive';
            break;
        case 'Drive bersama':
            currentView = 'shared-drives';
            break;
        case 'Komputer':
            currentView = 'computer';
            break;
        case 'Terbaru':
            currentView = 'recent';
            break;
        case 'Berbintang':
            currentView = 'starred';
            break;
        case 'Spam':
            currentView = 'spam';
            break;
        case 'Sampah':
            currentView = 'trash';
            break;
        case 'Penyimpanan':
            currentView = 'storage';
            break;
        default:
            currentView = 'home';
    }

    renderContent();
}

function toggleView(view, btn) {
    // Update active state
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentLayout = view;
    
    // Apply grid view class
    const filesTable = document.querySelector('.suggested-files-table');
    if (filesTable) {
        if (view === 'grid') {
            filesTable.classList.add('grid-view');
        } else {
            filesTable.classList.remove('grid-view');
        }
    }
    
    renderContent();
}

function renderContent() {
    console.log('Rendering content for view:', currentView);
    switch(currentView) {
        case 'home':
            renderHomePage();
            break;
        case 'my-drive':
            console.log('Calling renderMyDrive()');
            renderMyDrive();
            break;
        case 'shared-drives':
            renderSharedDrives();
            break;
        case 'recent':
            renderRecentFiles();
            break;
        case 'starred':
            renderStarredFiles();
            break;
        case 'trash':
            renderTrashFiles();
            break;
        default:
            renderHomePage();
    }
}

function renderHomePage() {
    // For home page, we need to replace the content with the original welcome layout
    const pageTitle = document.querySelector('.page-title');
    const mainContent = document.querySelector('.main-content');
    
    if (pageTitle) pageTitle.textContent = 'Selamat datang di Drive';
    
    mainContent.innerHTML = `
        <div class="content-header">
            <h1 class="page-title">Selamat datang di Drive</h1>
            <button class="info-btn">
                <span class="material-icons">info_outline</span>
            </button>
        </div>

        <!-- Suggested Folders Section -->
        <section class="suggested-folders-section">
            <div class="section-header-with-arrow">
                <span class="material-icons expand-icon">expand_more</span>
                <h2>Folder yang disarankan</h2>
            </div>
            <div class="suggested-folders-grid">
                <div class="folder-card">
                    <div class="folder-card-content">
                        <span class="material-icons folder-icon-large">folder</span>
                        <div class="folder-info">
                            <div class="folder-name">All File</div>
                            <div class="folder-location">Di Dibagikan kepada saya</div>
                        </div>
                    </div>
                    <button class="folder-menu-btn">
                        <span class="material-icons">more_vert</span>
                    </button>
                </div>
                <div class="folder-card">
                    <div class="folder-card-content">
                        <span class="material-icons folder-icon-large">folder</span>
                        <div class="folder-info">
                            <div class="folder-name">BackupDestination</div>
                            <div class="folder-location">Di Drive Saya</div>
                        </div>
                    </div>
                    <button class="folder-menu-btn">
                        <span class="material-icons">more_vert</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Suggested Files Section -->
        <section class="suggested-files-section">
            <div class="section-header-with-controls">
                <div class="section-title-with-arrow">
                    <span class="material-icons expand-icon">expand_more</span>
                    <h2>File yang disarankan</h2>
                </div>
                <div class="view-controls">
                    <button class="view-btn active" data-view="list">
                        <span class="material-icons">view_list</span>
                    </button>
                    <button class="view-btn" data-view="grid">
                        <span class="material-icons">view_module</span>
                    </button>
                </div>
            </div>
            
            <div class="suggested-files-table">
                <div class="table-header">
                    <div class="col-name">Nama</div>
                    <div class="col-reason">Alasan file disarankan</div>
                    <div class="col-location">Lokasi</div>
                </div>
                
                <div class="file-list" id="fileList">
                    <!-- Files will be populated by JavaScript -->
                </div>
            </div>
        </section>

        <div class="show-more">
            <button class="show-more-btn">Tampilkan lainnya</button>
        </div>
    `;
    
    // Show default home content with suggested folders and files
    const filteredFiles = filterFiles(mockFiles);
    renderFileList(filteredFiles);
    
    // Add expand/collapse functionality
    addExpandCollapseHandlers();
}

function renderMyDrive() {
    console.log('renderMyDrive() called');
    // Pastikan content HTML sudah tepat untuk Drive Saya
    const mainContent = document.querySelector('.main-content');
    
    // Update page title
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = 'Drive Saya';
    
    // Pastikan main content memiliki struktur yang benar
    if (!document.getElementById('folderList')) {
        mainContent.innerHTML = `
            <div class="content-header">
                <div class="page-title-container">
                    <h1 class="page-title">Drive Saya</h1>
                    <button class="dropdown-btn">
                        <span class="material-icons">arrow_drop_down</span>
                    </button>
                </div>
                <div class="header-actions">
                    <button class="info-btn">
                        <span class="material-icons">info_outline</span>
                    </button>
                </div>
            </div>

            <div class="toolbar">
                <div class="filter-controls">
                    <button class="filter-btn-toolbar">
                        <span>Jenis</span>
                        <span class="material-icons">arrow_drop_down</span>
                    </button>
                    <button class="filter-btn-toolbar">
                        <span>Orang</span>
                        <span class="material-icons">arrow_drop_down</span>
                    </button>
                    <button class="filter-btn-toolbar">
                        <span>Dimodifikasi</span>
                        <span class="material-icons">arrow_drop_down</span>
                    </button>
                    <button class="filter-btn-toolbar">
                        <span>Sumber</span>
                        <span class="material-icons">arrow_drop_down</span>
                    </button>
                </div>
                <div class="view-controls">
                    <button class="view-btn active" data-view="list">
                        <span class="material-icons">view_list</span>
                    </button>
                    <button class="view-btn" data-view="grid">
                        <span class="material-icons">view_module</span>
                    </button>
                </div>
            </div>
            
            <div class="my-drive-table">
                <div class="table-header">
                    <div class="col-name">
                        <span>Nama</span>
                        <span class="material-icons sort-icon">arrow_drop_up</span>
                    </div>
                    <div class="col-owner">Pemilik</div>
                    <div class="col-modified">Tanggal diubah</div>
                    <div class="col-size">Ukuran file</div>
                    <div class="col-actions"></div>
                </div>
                <div class="folder-list" id="folderList">
                    <!-- Files and folders will be populated by JavaScript -->
                </div>
            </div>
        `;
        
        // Re-attach event listeners untuk tombol baru
        attachMyDriveEventListeners();
    }
    
    // Populate data
    renderMyDriveFolders();
}

function attachMyDriveEventListeners() {
    // Dropdown button
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', () => {
            alert('Dropdown menu untuk Drive Saya');
        });
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn-toolbar');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.querySelector('span:first-child').textContent;
            alert(`Filter: ${filterType}`);
        });
    });

    // View toggle buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (view) {
                toggleView(view, btn);
            }
        });
    });

    // Info button
    const infoBtn = document.querySelector('.info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            alert('Informasi tentang Google Drive');
        });
    }
}

function renderSharedDrives() {
    pageTitle.textContent = 'Drive bersama';
    
    mainContent.innerHTML = `
        <div class="content-header">
            <h1 class="page-title">Drive bersama</h1>
            <a href="#" class="help-link">Drive bersama yang disembunyikan</a>
            <div class="view-controls">
                <button class="view-btn active" data-view="list">
                    <span class="material-icons">view_list</span>
                </button>
                <button class="view-btn" data-view="grid">
                    <span class="material-icons">view_module</span>
                </button>
            </div>
        </div>
        
        <div class="search-container-page">
            <span class="material-icons">search</span>
            <input type="text" placeholder="Nama drive bersama" class="search-input-page">
        </div>
        
        <div class="shared-drives-table">
            <div class="table-header">
                <div class="col-name">Nama</div>
                <div class="col-members">Anggota</div>
            </div>
            <div class="shared-drives-list" id="sharedDrivesList"></div>
        </div>
    `;
    
    renderSharedDrivesList();
}

function renderMyDriveFolders() {
    const folderList = document.getElementById('folderList');
    if (!folderList) {
        console.log('folderList element not found');
        return;
    }
    
    const filteredFolders = mockFolders.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery)
    );
    
    folderList.innerHTML = filteredFolders.map(item => `
        <div class="folder-item" data-item-name="${item.name}" data-item-type="${item.type}">
            <div class="folder-info">
                <span class="material-icons ${item.type === 'folder' ? 'folder-icon' : 'file-icon'}">${item.icon}</span>
                <span class="folder-name">${item.name}</span>
            </div>
            <div class="folder-owner">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNFNzRDM0MiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CjxjaXJjbGUgY3g9IjEyIiBjeT0iOSIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDE1Yy0zLjMxIDAtNiAxLjM0LTYgM3YzaDEydi0zYzAtMS42Ni0yLjY5LTMtNi0zeiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=" alt="Owner" class="owner-img">
                <span>${item.owner}</span>
            </div>
            <div class="folder-modified">${item.modified}</div>
            <div class="folder-size">${item.size}</div>
            <button class="item-menu">
                <span class="material-icons">more_vert</span>
            </button>
        </div>
    `).join('');
    
    // Add click handlers untuk file/folder items
    const folderItems = document.querySelectorAll('.folder-item');
    folderItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.item-menu')) {
                const itemName = item.dataset.itemName;
                const itemType = item.dataset.itemType;
                if (itemType === 'folder') {
                    alert(`Membuka folder: ${itemName}`);
                } else {
                    alert(`Membuka file: ${itemName}`);
                }
            }
        });
        
        // Menu button click handler
        const menuBtn = item.querySelector('.item-menu');
        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemName = item.dataset.itemName;
                alert(`Menu untuk: ${itemName}`);
            });
        }
    });
}

function renderSharedDrivesList() {
    const sharedDrivesList = document.getElementById('sharedDrivesList');
    const filteredDrives = sharedDrives.filter(drive => 
        drive.name.toLowerCase().includes(searchQuery)
    );
    
    sharedDrivesList.innerHTML = filteredDrives.map(drive => `
        <div class="shared-drive-item">
            <div class="drive-info">
                <div class="drive-avatar">
                    ${drive.name.charAt(0).toUpperCase()}
                </div>
                <div class="drive-details">
                    <div class="drive-name">${drive.name}</div>
                    <div class="drive-owner">${drive.owner}</div>
                </div>
            </div>
            <div class="drive-members">${drive.members}</div>
            <button class="item-menu">
                <span class="material-icons">more_vert</span>
            </button>
        </div>
    `).join('');
}

function renderRecentFiles() {
    pageTitle.textContent = 'Terbaru';
    renderFileList(mockFiles.slice(0, 5));
}

function renderStarredFiles() {
    pageTitle.textContent = 'Berbintang';
    renderFileList([]);
}

function renderTrashFiles() {
    pageTitle.textContent = 'Sampah';
    renderFileList([]);
}

function filterFiles(files) {
    if (!searchQuery) return files;
    return files.filter(file => 
        file.name.toLowerCase().includes(searchQuery)
    );
}

function renderFileList(files) {
    if (!fileList) return;
    
    fileList.innerHTML = files.map(file => `
        <div class="file-item" data-file-id="${file.id}">
            <div class="file-info">
                <span class="material-icons file-icon ${file.type}">${file.icon}</span>
                <span class="file-name">${file.name}</span>
            </div>
            <div class="file-reason">${file.reason} • ${file.time}</div>
            <div class="file-location">
                <span class="material-icons location-icon">${file.locationIcon}</span>
                <span>${file.location}</span>
            </div>
        </div>
    `).join('');

    // Add click handlers for file items
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const fileId = item.dataset.fileId;
            openFile(fileId);
        });
    });
}

function openFile(fileId) {
    const file = mockFiles.find(f => f.id == fileId);
    if (file) {
        console.log('Opening file:', file.name);
        // Here you would implement file opening logic
        alert(`Membuka file: ${file.name}`);
    }
}

function showNewMenu() {
    // Create a simple dropdown menu
    const menu = document.createElement('div');
    menu.className = 'new-menu';
    menu.innerHTML = `
        <div class="menu-item">
            <span class="material-icons">folder</span>
            <span>Folder baru</span>
        </div>
        <div class="menu-item">
            <span class="material-icons">upload_file</span>
            <span>Upload file</span>
        </div>
        <div class="menu-item">
            <span class="material-icons">create_new_folder</span>
            <span>Upload folder</span>
        </div>
        <hr>
        <div class="menu-item">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..." class="menu-icon" alt="Docs">
            <span>Google Dokumen</span>
        </div>
        <div class="menu-item">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..." class="menu-icon" alt="Sheets">
            <span>Google Spreadsheet</span>
        </div>
        <div class="menu-item">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..." class="menu-icon" alt="Slides">
            <span>Google Slide</span>
        </div>
    `;

    // Position and show menu
    const newBtn = document.querySelector('.new-btn');
    const rect = newBtn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 8 + 'px';
    menu.style.left = rect.left + 'px';
    menu.style.zIndex = '1000';

    document.body.appendChild(menu);

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-hidden');
}

function addExpandCollapseHandlers() {
    // Add click handlers for expand/collapse arrows
    const expandIcons = document.querySelectorAll('.expand-icon');
    expandIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            icon.style.transform = icon.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
            
            // Find the content section and toggle visibility
            const section = icon.closest('section');
            const content = section.querySelector('.suggested-folders-grid, .suggested-files-table');
            if (content) {
                content.style.display = content.style.display === 'none' ? '' : 'none';
            }
        });
    });
}

// CSS for dynamic elements
const style = document.createElement('style');
style.textContent = `
    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .filter-controls {
        display: flex;
        gap: 8px;
    }

    .filter-select, .filter-input {
        padding: 8px 12px;
        border: 1px solid #dadce0;
        border-radius: 4px;
        font-size: 14px;
        background: white;
    }

    .my-drive-table, .shared-drives-table {
        background: white;
        border-radius: 8px;
        overflow: hidden;
    }

    .my-drive-table .table-header {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 16px;
        padding: 12px 16px;
        background: #f8f9fa;
        border-bottom: 1px solid #e8eaed;
        font-size: 12px;
        font-weight: 500;
        color: #5f6368;
        text-transform: uppercase;
        align-items: center;
    }

    .shared-drives-table .table-header {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 16px;
        padding: 12px 16px;
        background: #f8f9fa;
        border-bottom: 1px solid #e8eaed;
        font-size: 12px;
        font-weight: 500;
        color: #5f6368;
        text-transform: uppercase;
    }

    .col-name {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .folder-item, .shared-drive-item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 16px;
        padding: 12px 16px;
        border-bottom: 1px solid #f1f3f4;
        cursor: pointer;
        transition: background-color 0.2s;
        align-items: center;
    }

    .shared-drive-item {
        grid-template-columns: 2fr 1fr;
    }

    .folder-item:hover, .shared-drive-item:hover {
        background-color: #f8f9fa;
    }

    .folder-info, .drive-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .folder-owner {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #5f6368;
    }

    .owner-img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }

    .drive-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #1a73e8;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: 14px;
    }

    .drive-details {
        flex: 1;
    }

    .drive-name {
        font-weight: 500;
        color: #202124;
        margin-bottom: 2px;
    }

    .drive-owner {
        font-size: 12px;
        color: #5f6368;
    }

    .search-container-page {
        display: flex;
        align-items: center;
        background: #f1f3f4;
        border-radius: 8px;
        padding: 0 16px;
        margin-bottom: 24px;
        height: 48px;
        max-width: 400px;
    }

    .search-input-page {
        flex: 1;
        border: none;
        background: none;
        font-size: 16px;
        outline: none;
        margin-left: 12px;
    }

    .help-link {
        color: #1a73e8;
        text-decoration: none;
        font-size: 14px;
    }

    .help-link:hover {
        text-decoration: underline;
    }

    .new-menu {
        background: white;
        border: 1px solid #e8eaed;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 8px 0;
        min-width: 200px;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .menu-item:hover {
        background-color: #f1f3f4;
    }

    .menu-icon {
        width: 20px;
        height: 20px;
    }

    .new-menu hr {
        border: none;
        border-top: 1px solid #e8eaed;
        margin: 8px 0;
    }

    .mobile-hidden {
        display: none;
    }

    @media (max-width: 768px) {
        .sidebar {
            position: fixed;
            top: 64px;
            left: 0;
            height: calc(100vh - 64px);
            z-index: 99;
            background: white;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }

        .sidebar:not(.mobile-hidden) {
            transform: translateX(0);
        }

        .toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
        }

        .filter-controls {
            flex-wrap: wrap;
        }
    }
`;

document.head.appendChild(style);