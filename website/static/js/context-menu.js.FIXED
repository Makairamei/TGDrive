// Google Drive Style Context Menu & Enhanced UI
class GoogleDriveUI {
    constructor() {
        this.contextMenu = null;
        this.selectedFiles = new Set();
        this.isMultiSelectMode = false;
        this.isDragging = false;
        this.currentView = 'list'; // 'list' or 'grid'
        this.isRenaming = false;
        
        this.init();
    }

    init() {
        this.createContextMenu();
        this.setupEventListeners();
        this.createToastContainer();
        this.createLoadingOverlay();
        this.enhanceFileItems();
    }

    // Create context menu HTML
    createContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.id = 'context-menu';
        contextMenu.className = 'context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="open">
                <svg class="context-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                </svg>
                <span class="context-menu-item-text">Open</span>
            </div>

            <div class="context-menu-item" data-action="download">
                <svg class="context-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                </svg>
                <span class="context-menu-item-text">Download</span>
            </div>

            <div class="context-menu-divider"></div>

            <div class="context-menu-item" data-action="select">
                <svg class="context-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
                <span class="context-menu-item-text">Select</span>
            </div>

            <div class="context-menu-item" data-action="move">
                <svg class="context-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16,3L21,8L16,13V10H8V13L3,8L8,3V6H16V3M16,14V17H8V14L3,19L8,24V21H16V24L21,19L16,14Z"/>
                </svg>
                <span class="context-menu-item-text">Move to...</span>
            </div>

            <div class="context-menu-item" data-action="rename">
                <svg class="context-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                </svg>
                <span class="context-menu-item-text">Rename</span>
            </div>

            <div class="context-menu-item" data-action="copy-link">
                <svg class="context-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"/>
                </svg>
                <span class="context-menu-item-text">Copy link</span>
            </div>

            <div class="context-menu-divider"></div>

            <div class="context-menu-item" data-action="delete">
                <svg class="context-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
                <span class="context-menu-item-text">Move to trash</span>
            </div>

            <div class="context-menu-divider"></div>

            <div class="context-menu-item" data-action="properties">
                <svg class="context-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                </svg>
                <span class="context-menu-item-text">File information</span>
            </div>
        `;
        
        document.body.appendChild(contextMenu);
        this.contextMenu = contextMenu;
    }

    // Setup all event listeners
    setupEventListeners() {
        // Right-click context menu
        this.contextMenuHandler = (e) => {
            const fileItem = e.target.closest('.file-item, tr');
            if (fileItem && fileItem.dataset.path) {
                console.log('🖱️ Context menu triggered for:', fileItem.dataset.name || fileItem.dataset.path);
                e.preventDefault();
                this.showContextMenu(e, fileItem);
            } else if (fileItem) {
                console.log('⚠️ File item found but missing data-path:', fileItem);
            }
        };
        
        document.addEventListener('contextmenu', this.contextMenuHandler);

        // Click outside to hide context menu
        document.addEventListener('click', (e) => {
            if (!this.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
        });

        // Context menu item clicks
        this.contextMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (item) {
                const action = item.dataset.action;
                this.handleContextAction(action);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Double-click for rename
        document.addEventListener('dblclick', (e) => {
            const nameCell = e.target.closest('.file-name');
            if (nameCell) {
                e.preventDefault();
                this.startInlineRename(nameCell);
            }
        });

        // Enhance drag and drop
        this.setupDragAndDrop();
    }

    // Show context menu at mouse position
    showContextMenu(event, fileItem) {
        this.activeFileItem = fileItem;
        this.contextMenu.style.left = event.pageX + 'px';
        this.contextMenu.style.top = event.pageY + 'px';
        this.contextMenu.classList.add('show');

        // Update context menu based on file type
        this.updateContextMenuItems(fileItem);

        // Add active styling to file
        document.querySelectorAll('.file-item.context-active').forEach(item => {
            item.classList.remove('context-active');
        });
        fileItem.classList.add('context-active');
    }

    // Hide context menu
    hideContextMenu() {
        this.contextMenu.classList.remove('show');
        document.querySelectorAll('.file-item.context-active').forEach(item => {
            item.classList.remove('context-active');
        });
        this.activeFileItem = null;
    }

    // Update context menu items based on file type
    updateContextMenuItems(fileItem) {
        const isFolder = fileItem.dataset.type === 'folder';
        const openItem = this.contextMenu.querySelector('[data-action="open"]');
        const downloadItem = this.contextMenu.querySelector('[data-action="download"]');

        if (isFolder) {
            openItem.querySelector('.context-menu-item-text').textContent = 'Open folder';
            downloadItem.style.display = 'none';
        } else {
            openItem.querySelector('.context-menu-item-text').textContent = 'Open';
            downloadItem.style.display = 'flex';
        }
    }

    // Handle context menu actions
    async handleContextAction(action) {
        if (!this.activeFileItem) return;

        const filePath = this.activeFileItem.dataset.path;
        const fileName = this.activeFileItem.dataset.name;
        const fileType = this.activeFileItem.dataset.type;

        this.hideContextMenu();

        switch (action) {
            case 'open':
                if (fileType === 'folder') {
                    await openFolder(filePath);
                } else {
                    this.openFile(filePath);
                }
                break;

            case 'download':
                if (fileType !== 'folder') {
                    this.downloadFile(filePath, fileName);
                }
                break;

            case 'select':
                // Use MoreMenuSelectionManager for more menu selection
                if (window.moreMenuManager) {
                    window.moreMenuManager.selectFileFromMore(this.activeFileItem);
                } else {
                    this.selectFile(this.activeFileItem);
                }
                break;

            case 'move':
                this.startMoveFile([filePath]);
                break;

            case 'rename':
                this.startInlineRename(this.activeFileItem.querySelector('.file-name'));
                break;

            case 'copy-link':
                await this.copyFileLink(filePath);
                break;

            case 'delete':
                await this.deleteFile(filePath, fileName);
                break;

            case 'properties':
                this.showFileProperties(this.activeFileItem);
                break;
        }
    }

    // Keyboard shortcuts handler
    handleKeyboardShortcuts(e) {
        // Escape key
        if (e.key === 'Escape') {
            this.hideContextMenu();
            this.exitSelectionMode();
            return;
        }

        // Don't process shortcuts if user is typing
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case 'F2':
                e.preventDefault();
                if (this.activeFileItem) {
                    this.startInlineRename(this.activeFileItem.querySelector('.file-name'));
                }
                break;

            case 'Delete':
                e.preventDefault();
                if (this.activeFileItem) {
                    this.deleteFile(this.activeFileItem.dataset.path, this.activeFileItem.dataset.name);
                }
                break;

            case 'a':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.selectAllFiles();
                }
                break;

            case 'c':
                if (e.ctrlKey && this.activeFileItem) {
                    e.preventDefault();
                    this.copyFileLink(this.activeFileItem.dataset.path);
                }
                break;
        }
    }

    // Start inline rename
    startInlineRename(nameElement) {
        if (this.isRenaming || !nameElement) return;

        this.isRenaming = true;
        const currentName = nameElement.textContent.trim();
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'inline-rename-input';
        input.value = currentName;

        // Replace text with input
        nameElement.textContent = '';
        nameElement.appendChild(input);
        input.focus();
        input.select();

        // Handle rename completion
        const finishRename = async (save = false) => {
            if (save && input.value.trim() !== currentName && input.value.trim()) {
                const newName = input.value.trim();
                await this.renameFile(this.activeFileItem.dataset.path, newName);
            }

            nameElement.textContent = currentName;
            this.isRenaming = false;
        };

        input.addEventListener('blur', () => finishRename(true));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                finishRename(true);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                finishRename(false);
            }
        });
    }

    // Setup drag and drop functionality
    setupDragAndDrop() {
        document.addEventListener('dragstart', (e) => {
            const fileItem = e.target.closest('.file-item, tr');
            if (fileItem && fileItem.dataset.path) {
                this.isDragging = true;
                fileItem.classList.add('dragging');
                e.dataTransfer.setData('text/plain', fileItem.dataset.path);
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        document.addEventListener('dragend', (e) => {
            this.isDragging = false;
            document.querySelectorAll('.file-item.dragging').forEach(item => {
                item.classList.remove('dragging');
            });
            document.querySelectorAll('.folder-item.drop-target').forEach(item => {
                item.classList.remove('drop-target');
            });
        });

        document.addEventListener('dragover', (e) => {
            const folderItem = e.target.closest('[data-type="folder"]');
            if (folderItem && this.isDragging) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                folderItem.classList.add('drop-target');
            }
        });

        document.addEventListener('dragleave', (e) => {
            const folderItem = e.target.closest('[data-type="folder"]');
            if (folderItem) {
                folderItem.classList.remove('drop-target');
            }
        });

        document.addEventListener('drop', (e) => {
            const folderItem = e.target.closest('[data-type="folder"]');
            if (folderItem && this.isDragging) {
                e.preventDefault();
                const sourcePath = e.dataTransfer.getData('text/plain');
                const destinationPath = folderItem.dataset.path;
                
                if (sourcePath !== destinationPath) {
                    this.moveFileByDrag(sourcePath, destinationPath);
                }
            }
        });
    }

    // Enhanced file operations
    async renameFile(filePath, newName) {
        this.showLoading('Renaming file...');
        try {
            const response = await renameFileFolder(filePath, newName);
            if (response.status === 'ok') {
                this.showToast('File renamed successfully', 'success');
                await refreshDirectory();
            } else {
                this.showToast('Failed to rename file', 'error');
            }
        } catch (error) {
            this.showToast('Error renaming file', 'error');
        }
        this.hideLoading();
    }

    async deleteFile(filePath, fileName) {
        if (!confirm(`Are you sure you want to move "${fileName}" to trash?`)) return;

        this.showLoading('Moving to trash...');
        try {
            const response = await deleteFileFolder(filePath);
            if (response.status === 'ok') {
                this.showToast('File moved to trash', 'success');
                await refreshDirectory();
            } else {
                this.showToast('Failed to delete file', 'error');
            }
        } catch (error) {
            this.showToast('Error deleting file', 'error');
        }
        this.hideLoading();
    }

    async copyFileLink(filePath) {
        try {
            // Generate share link logic here
            const shareLink = `${window.location.origin}/share/${encodeURIComponent(filePath)}`;
            await navigator.clipboard.writeText(shareLink);
            this.showToast('Link copied to clipboard', 'success');
        } catch (error) {
            this.showToast('Failed to copy link', 'error');
        }
    }

    async moveFileByDrag(sourcePath, destinationPath) {
        this.showLoading('Moving file...');
        try {
            const response = await moveFiles([sourcePath], destinationPath);
            if (response.status === 'ok') {
                this.showToast('File moved successfully', 'success');
                await refreshDirectory();
            } else {
                this.showToast('Failed to move file', 'error');
            }
        } catch (error) {
            this.showToast('Error moving file', 'error');
        }
        this.hideLoading();
    }

    // UI Enhancement functions
    selectFile(fileItem) {
        if (!this.isMultiSelectMode) {
            this.enterSelectionMode();
        }
        
        const fileId = fileItem.dataset.path;
        if (this.selectedFiles.has(fileId)) {
            this.selectedFiles.delete(fileId);
            fileItem.classList.remove('selected');
        } else {
            this.selectedFiles.add(fileId);
            fileItem.classList.add('selected');
        }
        
        this.updateSelectionUI();
    }

    selectAllFiles() {
        this.enterSelectionMode();
        document.querySelectorAll('.file-item[data-path]').forEach(item => {
            this.selectedFiles.add(item.dataset.path);
            item.classList.add('selected');
        });
        this.updateSelectionUI();
    }

    enterSelectionMode() {
        this.isMultiSelectMode = true;
        document.body.classList.add('selection-mode');
        // Show selection UI elements
    }

    exitSelectionMode() {
        this.isMultiSelectMode = false;
        this.selectedFiles.clear();
        document.body.classList.remove('selection-mode');
        document.querySelectorAll('.file-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        const count = this.selectedFiles.size;
        // Update selection count display, show/hide action buttons, etc.
    }

    // Utility functions
    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        this.toastContainer = container;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        document.body.appendChild(overlay);
        this.loadingOverlay = overlay;
    }

    showLoading(message = 'Loading...') {
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    enhanceFileItems() {
        // Add draggable attribute and enhance existing file items
        document.querySelectorAll('tr[data-path], .file-item[data-path]').forEach(item => {
            item.draggable = true;
            item.style.cursor = 'pointer';
            
            // Add necessary data attributes for context menu
            if (!item.dataset.type) {
                if (item.classList.contains('folder-tr')) {
                    item.dataset.type = 'folder';
                } else if (item.classList.contains('file-tr')) {
                    item.dataset.type = 'file';
                }
            }
            
            // Add file name from the first td content if not exists
            if (!item.dataset.name && item.querySelector('td .td-align')) {
                const nameElement = item.querySelector('td .td-align');
                if (nameElement) {
                    const textContent = nameElement.textContent.trim();
                    item.dataset.name = textContent;
                }
            }
        });
    }
    
    // Re-attach event listeners to new files
    reAttachEventListeners() {
        console.log('🔧 Re-attaching context menu event listeners...');
        
        // Context menu is already globally attached, but we need to ensure
        // new items have proper data attributes and styling
        this.enhanceFileItems();
        
        // Re-setup drag and drop for new items
        this.setupDragAndDropForNewItems();
        
        // Debug: Count how many files now have proper attributes
        const filesWithPath = document.querySelectorAll('tr[data-path]').length;
        const filesWithType = document.querySelectorAll('tr[data-type]').length;
        const filesWithName = document.querySelectorAll('tr[data-name]').length;
        
        console.log(`📊 Files enhanced: ${filesWithPath} with path, ${filesWithType} with type, ${filesWithName} with name`);
    }
    
    // Setup drag and drop for newly added items
    setupDragAndDropForNewItems() {
        document.querySelectorAll('tr[data-path]').forEach(item => {
            if (!item.hasAttribute('data-drag-setup')) {
                item.setAttribute('data-drag-setup', 'true');
                item.draggable = true;
            }
        });
    }

    // View toggle functionality
    toggleView() {
        this.currentView = this.currentView === 'list' ? 'grid' : 'list';
        const container = document.querySelector('.directory-content');
        
        if (this.currentView === 'grid') {
            container.classList.add('grid-view');
        } else {
            container.classList.remove('grid-view');
        }
    }

    // File properties dialog
    showFileProperties(fileItem) {
        const fileName = fileItem.dataset.name;
        const fileType = fileItem.dataset.type;
        const fileSize = fileItem.dataset.size || 'Unknown';
        
        alert(`File Properties:\nName: ${fileName}\nType: ${fileType}\nSize: ${fileSize}`);
        // TODO: Create proper modal dialog for file properties
    }

    openFile(filePath) {
        // Open file in new tab or appropriate viewer
        window.open(`/api/getFile?path=${encodeURIComponent(filePath)}`, '_blank');
    }

    downloadFile(filePath, fileName) {
        // Trigger file download
        const link = document.createElement('a');
        link.href = `/api/getFile?path=${encodeURIComponent(filePath)}&download=true`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    startMoveFile(filePaths) {
        // Integrate with existing move files functionality
        if (typeof openMoveDialog === 'function') {
            selectedFiles = new Set(filePaths);
            openMoveDialog();
        }
    }
}

// Initialize Google Drive UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.googleDriveUI = new GoogleDriveUI();
});

// Enhanced Selection Manager for More Menu
class MoreMenuSelectionManager {
    constructor() {
        this.selectedFiles = new Set();
        this.isSelectionMode = false;
    }

    selectFileFromMore(fileItem) {
        console.log('🎯 Starting selection from more menu for:', fileItem.dataset.name);
        console.log('📍 Current selection mode:', this.isSelectionMode);
        console.log('📁 File item:', fileItem);
        
        // Ensure file has proper data attributes
        if (fileItem.dataset.path === undefined || fileItem.dataset.path === null || !fileItem.dataset.id) {
            console.error('❌ File item missing data-path or data-id!');
            console.log('File path:', fileItem.dataset.path);
            console.log('File ID:', fileItem.dataset.id);
            console.log('File dataset:', fileItem.dataset);
            return;
        }
        
        // Enter selection mode FIRST
        if (!this.isSelectionMode) {
            console.log('🔘 Entering selection mode...');
            this.enterSelectionMode();
        }

        // Add this specific file to selection using file ID (for API compatibility)
        const fileId = fileItem.dataset.id;
        const filePath = fileItem.dataset.path;
        console.log('➕ Adding file to selection - ID:', fileId, 'Path:', filePath);
        
        // Store both ID and path for maximum compatibility
        this.selectedFiles.add(fileId);
        this.selectedFilePaths = this.selectedFilePaths || new Set();
        this.selectedFilePaths.add(filePath);
        
        fileItem.classList.add('selected');
        
        // Force update checkboxes after a small delay to ensure they're created
        setTimeout(() => {
            console.log('☑️ Updating checkboxes...');
            
            // Find the checkbox for this file
            const checkbox = fileItem.querySelector('.file-checkbox');
            if (checkbox) {
                checkbox.checked = true;
                console.log('✅ Checkbox found and checked for:', fileItem.dataset.name);
            } else {
                console.log('⚠️ Checkbox not found, re-adding checkboxes...');
                this.addCheckboxesToFiles();
                
                // Try again after re-adding
                setTimeout(() => {
                    const newCheckbox = fileItem.querySelector('.file-checkbox');
                    if (newCheckbox) {
                        newCheckbox.checked = true;
                        console.log('✅ Checkbox created and checked for:', fileItem.dataset.name);
                    }
                }, 100);
            }
        }, 100);
        
        // Update counts and UI
        this.updateSelectionCount();
        this.updateAllMoreMenus();
        
        // Show toast notification
        this.showToast(`"${fileItem.dataset.name}" selected. Select more files with checkboxes.`, 'success');
        
        console.log('🎯 Selection completed. Total selected:', this.selectedFiles.size);
    }

    addFileToSelection(fileItem) {
        const fileId = fileItem.dataset.id;
        const filePath = fileItem.dataset.path;
        const fileName = fileItem.dataset.name;

        console.log(`🔄 addFileToSelection called for: ${fileName} (ID: ${fileId}, Path: '${filePath}')`);

        if (this.selectedFiles.has(fileId)) {
            // Remove from selection
            this.selectedFiles.delete(fileId);
            this.selectedFilePaths = this.selectedFilePaths || new Set();
            this.selectedFilePaths.delete(filePath);
            fileItem.classList.remove('selected');
            this.showToast(`"${fileName}" removed from selection`, 'info');
            console.log(`❌ Removed from selection: ${fileName}`);
        } else {
            // Add to selection
            this.selectedFiles.add(fileId);
            this.selectedFilePaths = this.selectedFilePaths || new Set();
            this.selectedFilePaths.add(filePath);
            fileItem.classList.add('selected');
            this.showToast(`"${fileName}" added to selection`, 'success');
            console.log(`✅ Added to selection: ${fileName}`);
        }

        this.updateSelectionCount();
        this.updateAllMoreMenus();
    }

    enterSelectionMode() {
        console.log('🔘 Entering selection mode from more menu');
        
        // Set selection mode flag FIRST
        this.isSelectionMode = true;
        document.body.classList.add('selection-mode');
        
        console.log('📋 Added selection-mode class to body');
        
        // Show checkboxes column header
        document.querySelectorAll('.checkbox-column').forEach(el => {
            el.classList.remove('hidden');
            console.log('👁️ Showed checkbox column');
        });

        // Update header buttons
        const selectBtn = document.getElementById('select-mode-btn');
        const cancelBtn = document.getElementById('cancel-select-btn');
        const moveBtn = document.getElementById('move-files-btn');

        if (selectBtn) {
            selectBtn.classList.add('hidden');
            console.log('🙈 Hid select button');
        }
        if (cancelBtn) {
            cancelBtn.classList.remove('hidden');
            console.log('👁️ Showed cancel button');
        }
        if (moveBtn) {
            moveBtn.classList.remove('hidden');
            moveBtn.classList.remove('disabled');
            moveBtn.disabled = false;
            console.log('👁️ Showed move button');
        }

        // Add checkboxes to all files
        console.log('☑️ Adding checkboxes to all files...');
        this.addCheckboxesToFiles();
        
        // Update selection count and move button state
        this.updateSelectionCount();
        
        console.log('✅ Selection mode entered successfully. Selected files:', this.selectedFiles.size);
        console.log('📊 Current state:', {
            isSelectionMode: this.isSelectionMode,
            selectedFilesCount: this.selectedFiles.size,
            bodyHasClass: document.body.classList.contains('selection-mode')
        });
    }

    exitSelectionMode() {
        console.log('❌ Exiting selection mode');
        this.isSelectionMode = false;
        this.selectedFiles.clear();
        
        document.body.classList.remove('selection-mode');
        
        // Hide checkboxes
        document.querySelectorAll('.checkbox-column').forEach(el => {
            el.classList.add('hidden');
        });

        // Clear visual selections
        document.querySelectorAll('tr.selected').forEach(row => {
            row.classList.remove('selected');
        });

        // Update header buttons
        const selectBtn = document.getElementById('select-mode-btn');
        const cancelBtn = document.getElementById('cancel-select-btn');
        const moveBtn = document.getElementById('move-files-btn');

        if (selectBtn) selectBtn.classList.remove('hidden');
        if (cancelBtn) cancelBtn.classList.add('hidden');
        if (moveBtn) {
            moveBtn.classList.add('disabled');
            moveBtn.disabled = true;
        }

        // Update all more menus
        this.updateAllMoreMenus();
        this.updateSelectionCount();
    }

    addCheckboxesToFiles() {
        console.log('☑️ Adding checkboxes to files...');
        
        const allRows = document.querySelectorAll('#directory-data tr[data-path]');
        console.log(`📁 Found ${allRows.length} file rows`);
        
        allRows.forEach((row, index) => {
            const firstCell = row.querySelector('td');
            const fileId = row.dataset.id;
            const filePath = row.dataset.path;
            const fileName = row.dataset.name;
            const isSelected = this.selectedFiles.has(fileId);
            
            console.log(`📄 Processing row ${index + 1}: ${fileName} (ID: ${fileId}, Path: '${filePath}', selected: ${isSelected})`);
            
            // Skip if missing essential data
            if (!fileId) {
                console.log(`⚠️ Skipping row without file ID: ${fileName}`);
                return;
            }
            
            // Check if checkbox already exists in any cell
            const existingCheckbox = row.querySelector('.file-checkbox');
            
            if (!existingCheckbox && firstCell) {
                console.log(`➕ Creating new checkbox for: ${fileName}`);
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'file-checkbox';
                checkbox.checked = isSelected;
                
                // Ensure visual selection matches checkbox state
                if (isSelected) {
                    row.classList.add('selected');
                    console.log(`🔵 Added selected class to: ${fileName}`);
                } else {
                    row.classList.remove('selected');
                }
                
                checkbox.addEventListener('change', (e) => {
                    const fileId = row.dataset.id;
                    const filePath = row.dataset.path;
                    const fileName = row.dataset.name;
                    if (e.target.checked) {
                        this.selectedFiles.add(fileId);
                        this.selectedFilePaths = this.selectedFilePaths || new Set();
                        this.selectedFilePaths.add(filePath);
                        row.classList.add('selected');
                        this.showToast(`"${fileName}" added to selection`, 'success');
                        console.log(`✅ Added to selection: ${fileName} (ID: ${fileId})`);
                    } else {
                        this.selectedFiles.delete(fileId);
                        this.selectedFilePaths = this.selectedFilePaths || new Set();
                        this.selectedFilePaths.delete(filePath);
                        row.classList.remove('selected');
                        this.showToast(`"${fileName}" removed from selection`, 'info');
                        console.log(`❌ Removed from selection: ${fileName} (ID: ${fileId})`);
                    }
                    this.updateSelectionCount();
                    this.updateAllMoreMenus();
                });
                
                const checkboxCell = document.createElement('td');
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, firstCell);
                
                console.log(`✅ Checkbox created for: ${fileName} (checked: ${checkbox.checked})`);
            } else if (existingCheckbox) {
                console.log(`🔄 Updating existing checkbox for: ${fileName}`);
                existingCheckbox.checked = isSelected;
                
                // Ensure visual selection matches checkbox state
                if (isSelected) {
                    row.classList.add('selected');
                    console.log(`🔵 Added selected class to: ${fileName}`);
                } else {
                    row.classList.remove('selected');
                }
                
                console.log(`🔄 Updated checkbox for: ${fileName} (checked: ${existingCheckbox.checked})`);
            } else {
                console.log(`⚠️ Could not create checkbox for: ${fileName} - no first cell found`);
            }
        });
        
        console.log('✅ Checkbox processing completed');
        console.log(`📊 Total selected files: ${this.selectedFiles.size}`);
    }

    updateSelectionCount() {
        const count = this.selectedFiles.size;
        const countElement = document.getElementById('selected-count-header');
        if (countElement) {
            countElement.textContent = count;
        }

        // Update move button state
        const moveBtn = document.getElementById('move-files-btn');
        if (moveBtn) {
            if (count > 0) {
                moveBtn.classList.remove('disabled');
                moveBtn.disabled = false;
            } else {
                moveBtn.classList.add('disabled');
                moveBtn.disabled = true;
            }
        }

        // Update select all checkbox state
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        if (selectAllCheckbox) {
            const totalFiles = document.querySelectorAll('#directory-data tr[data-path]').length;
            if (count === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (count === totalFiles) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }

        console.log(`📊 Selection count updated: ${count} files selected`);
    }

    async moveSelectedFiles() {
        if (this.selectedFiles.size === 0) {
            this.showToast('No files selected', 'warning');
            return;
        }

        const selectedArray = Array.from(this.selectedFiles);
        console.log('🔄 Moving selected files (IDs):', selectedArray);
        console.log('📊 MoreMenuManager selection size:', this.selectedFiles.size);

        // Call openMoveDialog directly - it will detect this.selectedFiles
        if (typeof openMoveDialog === 'function') {
            console.log('📂 Calling openMoveDialog...');
            // The openMoveDialog function already checks for window.moreMenuManager.selectedFiles
            await openMoveDialog();
        } else {
            this.showToast('Move functionality not available', 'error');
        }
    }

    directMoveFile(fileItem) {
        console.log('🎯 Direct move for:', fileItem.dataset.name);
        
        // Automatically select this file for move using file ID
        const fileId = fileItem.dataset.id;
        const filePath = fileItem.dataset.path;
        console.log('📁 Direct move file ID:', fileId, 'Path:', filePath);
        
        this.selectedFiles.clear(); // Clear previous selections
        this.selectedFilePaths = this.selectedFilePaths || new Set();
        this.selectedFilePaths.clear();
        
        this.selectedFiles.add(fileId);
        this.selectedFilePaths.add(filePath);
        
        // Add visual selection
        document.querySelectorAll('tr.selected').forEach(row => {
            row.classList.remove('selected');
        });
        fileItem.classList.add('selected');
        
        // Show toast notification
        this.showToast(`Moving "${fileItem.dataset.name}"...`, 'info');
        
        // Open move dialog directly
        if (typeof openMoveDialog === 'function') {
            openMoveDialog();
        } else {
            this.showToast('Move functionality not available', 'error');
        }
    }

    updateAllMoreMenus() {
        document.querySelectorAll('.more-btn').forEach(btn => {
            this.updateSingleMoreMenu(btn);
        });
    }

    updateSingleMoreMenu(btn) {
        const btnId = btn.dataset.id;
        const menu = document.getElementById(`more-option-${btnId}`);
        const fileItem = btn.closest('tr[data-path]');
        
        if (!menu || !fileItem) return;

        const fileId = fileItem.dataset.id;
        const filePath = fileItem.dataset.path;
        const isSelected = this.selectedFiles.has(fileId);
        const selectedCount = this.selectedFiles.size;

        // Remove existing dynamic items
        menu.querySelectorAll('.dynamic-menu-item').forEach(item => item.remove());

        // Create dynamic menu items based on current state
        const dynamicItems = this.createDynamicMenuItems(isSelected, selectedCount, fileItem);
        
        // Insert dynamic items at the beginning
        const firstStaticItem = menu.querySelector('div:not(.dynamic-menu-item)');
        dynamicItems.forEach((item, index) => {
            if (firstStaticItem) {
                menu.insertBefore(item, firstStaticItem);
            } else {
                menu.appendChild(item);
            }
        });

        // Add separator after dynamic items if they exist
        if (dynamicItems.length > 0 && firstStaticItem) {
            const separator = document.createElement('hr');
            separator.className = 'dynamic-menu-item';
            menu.insertBefore(separator, firstStaticItem);
        }
    }

    createDynamicMenuItems(isSelected, selectedCount, fileItem) {
        const items = [];

        if (!this.isSelectionMode) {
            // Default state - show Select and Move to...
            const selectItem = this.createMenuItem('select', '☑️', 'Select', () => {
                this.selectFileFromMore(fileItem);
                // Don't close menu immediately - let user see the checkboxes
                setTimeout(() => {
                    this.closeMoreMenu(fileItem);
                }, 500);
            });
            
            const moveItem = this.createMenuItem('move-direct', '🔄', 'Move to...', () => {
                this.directMoveFile(fileItem);
                this.closeMoreMenu(fileItem);
            });

            items.push(selectItem, moveItem);
        } else {
            // Selection mode active
            if (isSelected) {
                const removeItem = this.createMenuItem('remove-selection', '➖', 'Remove from selection', () => {
                    this.addFileToSelection(fileItem);
                    this.closeMoreMenu(fileItem);
                });
                items.push(removeItem);
            } else {
                const addItem = this.createMenuItem('add-selection', '➕', 'Add to selection', () => {
                    this.addFileToSelection(fileItem);
                    this.closeMoreMenu(fileItem);
                });
                items.push(addItem);
            }

            if (selectedCount > 0) {
                const moveSelectedItem = this.createMenuItem('move-selected', '🔄', `Move selected (${selectedCount})`, () => {
                    this.moveSelectedFiles();
                    this.closeMoreMenu(fileItem);
                });
                items.push(moveSelectedItem);
            }

            const cancelItem = this.createMenuItem('cancel-selection', '❌', 'Cancel selection', () => {
                this.exitSelectionMode();
                this.closeMoreMenu(fileItem);
            });
            items.push(cancelItem);
        }

        return items;
    }

    createMenuItem(action, icon, text, clickHandler) {
        const item = document.createElement('div');
        item.className = 'more-menu-item dynamic-menu-item';
        item.dataset.action = action;
        item.innerHTML = `
            <span class="more-menu-icon">${icon}</span>
            <span class="more-menu-text">${text}</span>
        `;
        item.addEventListener('click', clickHandler);
        return item;
    }

    closeMoreMenu(fileItem) {
        const moreBtn = fileItem.querySelector('.more-btn');
        if (!moreBtn) {
            console.warn('⚠️ No more button found in file item');
            return;
        }
        
        const btnId = moreBtn.dataset.id;
        const menu = document.getElementById(`more-option-${btnId}`);
        if (menu) {
            menu.style.opacity = '0';
            menu.style.zIndex = '-1';
            console.log('✅ More menu closed for file:', fileItem.dataset.name);
        } else {
            console.warn('⚠️ More menu not found for ID:', btnId);
        }
    }

    showToast(message, type = 'info') {
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast(message, type);
        } else {
            console.log(`🍞 Toast: ${message}`);
        }
    }

    // Refresh/cleanup state when directory changes
    refreshState() {
        console.log('🔄 Refreshing MoreMenuSelectionManager state');
        
        // Clear selection if files no longer exist
        const existingFileIds = new Set();
        const existingFilePaths = new Set();
        document.querySelectorAll('#directory-data tr[data-path]').forEach(row => {
            if (row.dataset.id) existingFileIds.add(row.dataset.id);
            if (row.dataset.path) existingFilePaths.add(row.dataset.path);
        });

        // Remove selections for files that no longer exist
        for (const fileId of this.selectedFiles) {
            if (!existingFileIds.has(fileId)) {
                this.selectedFiles.delete(fileId);
            }
        }

        // Clean up paths too
        if (this.selectedFilePaths) {
            for (const filePath of this.selectedFilePaths) {
                if (!existingFilePaths.has(filePath)) {
                    this.selectedFilePaths.delete(filePath);
                }
            }
        }

        // Update UI
        this.updateSelectionCount();
        this.updateAllMoreMenus();

        // If no files selected, exit selection mode
        if (this.selectedFiles.size === 0 && this.isSelectionMode) {
            // Don't exit automatically - let user decide
            // this.exitSelectionMode();
        }
    }

    // Method to handle directory refresh from external sources
    onDirectoryRefresh() {
        console.log('📁 Directory refreshed - updating more menu state');
        
        setTimeout(() => {
            this.refreshState();
            
            // Re-add checkboxes if in selection mode
            if (this.isSelectionMode) {
                console.log('🔄 Re-adding checkboxes after directory refresh');
                this.addCheckboxesToFiles();
                this.updateSelectionCount();
            }
            
            // Update all more menus for new files
            this.updateAllMoreMenus();
        }, 150);
    }
}

// Global instance
window.moreMenuManager = new MoreMenuSelectionManager();

// Enhanced more menu functionality
function enhanceMoreMenu() {
    document.querySelectorAll('.more-btn').forEach(btn => {
        const btnId = btn.dataset.id;
        const menu = document.getElementById(`more-option-${btnId}`);
        
        if (menu && !menu.hasAttribute('data-enhanced')) {
            menu.setAttribute('data-enhanced', 'true');
            
            // Update this specific more menu
            window.moreMenuManager.updateSingleMoreMenu(btn);
        }
    });
}

// Call enhance more menu when directory is refreshed
if (typeof showDirectory === 'function') {
    const originalShowDirectory = showDirectory;
    showDirectory = function(...args) {
        const result = originalShowDirectory.apply(this, args);
        setTimeout(() => {
            enhanceMoreMenu();
            window.googleDriveUI.enhanceFileItems();
        }, 100);
        return result;
    };
}