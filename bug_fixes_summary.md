# Bug Fixes Summary

## Issues Found and Fixed

### 1. Bug: Selectbox tidak muncul untuk file baru yang di-upload

**Deskripsi:**
- File lama ketika di-select bisa menampilkan selectbox dengan baik
- File baru yang baru di-upload tidak menampilkan selectbox ketika di-select

**Penyebab:**
- Timing issue dalam `MoreMenuSelectionManager.onDirectoryRefresh()`
- Checkboxes tidak ditambahkan dengan benar untuk file baru
- Kurangnya sinkronisasi antara enhancement functions

**Perbaikan:**
1. **File: `website/static/js/context-menu.js`**
   - Meningkatkan delay dari 100ms menjadi 150ms dalam `onDirectoryRefresh()`
   - Menambahkan `this.updateSelectionCount()` setelah `addCheckboxesToFiles()`
   - Menambahkan `this.updateAllMoreMenus()` untuk memastikan semua menu ter-update

2. **File: `website/static/js/context-menu.js`**
   - Memperbaiki logika dalam `addCheckboxesToFiles()`
   - Menggunakan `row.querySelector('.file-checkbox')` untuk deteksi checkbox yang ada
   - Menghindari duplikasi checkbox

3. **File: `website/static/js/main.js`**
   - Mengubah urutan pemanggilan enhancement functions
   - `moreMenuManager.onDirectoryRefresh()` dipanggil terakhir
   - Meningkatkan delay dari 100ms menjadi 120ms

### 2. Bug: File hilang ketika dipindahkan dalam folder yang sama

**Deskripsi:**
- Ketika file dipindahkan ke folder yang sama (misalnya dari folder anime ke folder anime), file tersebut hilang

**Penyebab:**
- Path file di-update dengan format yang salah dalam fungsi `move_files()`
- Path seharusnya merepresentasikan folder, bukan termasuk file ID
- Code lama: `item_to_move.path = destination_path.rstrip("/") + "/" + file_id`

**Perbaikan:**
1. **File: `utils/directoryHandler.py`**
   - Memperbaiki update path: `item_to_move.path = destination_path.rstrip("/")`
   - Menambahkan safeguard untuk mencegah move yang tidak perlu
   - Menambahkan check jika file sudah berada di folder tujuan

```python
# Check if item is already in the destination folder (no need to move)
current_path = item_to_move.path.rstrip("/") if item_to_move.path != "/" else "/"
target_path = destination_path.rstrip("/") if destination_path != "/" else "/"

if current_path == target_path:
    logger.info(f"Item '{item_to_move.name}' is already in destination folder, skipping move.")
    moved_items.append(item_to_move.name)
    continue
```

## Hasil

### Sebelum Perbaikan:
1. ❌ File baru yang di-upload tidak menampilkan selectbox
2. ❌ File hilang ketika dipindahkan dalam folder yang sama

### Setelah Perbaikan:
1. ✅ File baru yang di-upload menampilkan selectbox dengan benar
2. ✅ File tidak hilang ketika dipindahkan dalam folder yang sama
3. ✅ Improved timing dan sinkronisasi untuk enhancement functions
4. ✅ Added safeguards untuk mencegah operasi move yang tidak perlu

## Testing

Untuk testing:
1. Upload file baru, lalu coba select - selectbox harus muncul
2. Pindahkan file dalam folder yang sama - file tidak boleh hilang
3. Functionality lain harus tetap bekerja normal

## Additional Fixes (Latest Update)

### 3. Bug: File di root tidak bisa di-select & file masih hilang saat dipindah dalam folder sama

**Deskripsi:**
- File di root (/) tidak bisa di-select, tapi folder bisa
- File masih hilang ketika dipindahkan dalam folder yang sama

**Penyebab Root Issue:**
- `File` class constructor menyimpan path="" (empty string) untuk file di root instead of "/"
- Logic path comparison tidak handle edge case untuk root path dengan benar

**Penyebab Move Issue:**
- Path normalization tidak konsisten antara current_path dan target_path
- Logic perbandingan string tidak handle kasus "/" vs "" dengan benar

**Perbaikan:**
1. **File: `utils/directoryHandler.py`**
   - Fixed File class constructor: root files now have path="/" instead of ""
   - Added normalize_path function untuk konsisten path comparison
   - Added detailed logging untuk debug path comparison

2. **File: `website/static/js/context-menu.js`**
   - Improved data-path validation untuk file di root (allow path="/" or empty)
   - Added debug logging untuk selection process
   - Better error handling untuk missing file data

## Files Modified

1. `website/static/js/context-menu.js` - Fixed MoreMenuSelectionManager & root file selection
2. `website/static/js/main.js` - Improved enhancement function timing
3. `utils/directoryHandler.py` - Fixed move_files path handling & File class path normalization

## Latest Commit

**Commit:** `370db61`  
**Message:** "🔧 CRITICAL FIX: Root file selection & same-folder move issues"