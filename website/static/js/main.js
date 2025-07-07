function showDirectory(data) {
    data = data['contents']
    document.getElementById('directory-data').innerHTML = ''
    const isTrash = getCurrentPath().startsWith('/trash')

    let html = ''

    // Step 2: Sort the array based on the 'date' values
    let entries = Object.entries(data);
    let folders = entries.filter(([key, value]) => value.type === 'folder');
    let files = entries.filter(([key, value]) => value.type === 'file');

    folders.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));
    files.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));

    for (const [key, item] of folders) {
        if (item.type === 'folder') {
            html += `<tr data-path="${item.path}" data-id="${item.id}" class="body-tr folder-tr"><td><div class="td-align"><img src="static/assets/folder-solid-icon.svg">${item.name}</div></td><td><div class="td-align"></div></td><td><div class="td-align"><a data-id="${item.id}" class="more-btn more-vert"><img src="static/assets/more-icon.svg" class="rotate-90"></a></div></td></tr>`

            if (isTrash) {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="restore-${item.id}" data-path="${item.path}"><img src="static/assets/load-icon.svg"> Restore</div><hr><div id="delete-${item.id}" data-path="${item.path}"><img src="static/assets/trash-icon.svg"> Delete</div></div>`
            }
            else {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="rename-${item.id}"><img src="static/assets/pencil-icon.svg"> Rename</div><hr><div id="trash-${item.id}"><img src="static/assets/trash-icon.svg"> Trash</div><hr><div id="folder-share-${item.id}"><img src="static/assets/share-icon.svg"> Share</div></div>`
            }
        }
    }

    for (const [key, item] of files) {
        if (item.type === 'file') {
            const size = convertBytes(item.size)
            html += `<tr data-path="${item.path}" data-id="${item.id}" data-name="${item.name}" class="body-tr file-tr"><td><div class="td-align"><img src="static/assets/file-icon.svg">${item.name}</div></td><td><div class="td-align">${size}</div></td><td><div class="td-align"><a data-id="${item.id}" class="more-btn more-vert"><img src="static/assets/more-icon.svg" class="rotate-90"></a></div></td></tr>`

            if (isTrash) {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="restore-${item.id}" data-path="${item.path}"><img src="static/assets/load-icon.svg"> Restore</div><hr><div id="delete-${item.id}" data-path="${item.path}"><img src="static/assets/trash-icon.svg"> Delete</div></div>`
            }
            else {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="rename-${item.id}"><img src="static/assets/pencil-icon.svg"> Rename</div><hr><div id="trash-${item.id}"><img src="static/assets/trash-icon.svg"> Trash</div><hr><div id="share-${item.id}"><img src="static/assets/share-icon.svg"> Share</div></div>`
            }
        }
    }
    document.getElementById('directory-data').innerHTML = html

    if (!isTrash) {
        document.querySelectorAll('.folder-tr').forEach(div => {
            div.ondblclick = openFolder;
        });
        document.querySelectorAll('.file-tr').forEach(div => {
            div.ondblclick = openFile;
        });
    }

    document.querySelectorAll('.more-btn').forEach(div => {
        div.addEventListener('click', function (event) {
            event.preventDefault();
            openMoreButton(div)
        });
    });
    
    // Trigger update for move files functionality if it exists
    if (typeof updateShowDirectoryForSelection === 'function') {
        updateShowDirectoryForSelection();
    }
    
    // Re-attach context menu and enhancements to new files
    setTimeout(() => {
        // Google Drive enhancements
        if (window.driveEnhancements) {
            window.driveEnhancements.enhanceFileItems();
            
            // Update view if in grid mode
            if (window.driveEnhancements.getCurrentView() === 'grid') {
                window.driveEnhancements.createGridView();
            }
        }
        
        // Legacy enhancements for compatibility
        if (window.googleDriveUI) {
            window.googleDriveUI.enhanceFileItems();
            window.googleDriveUI.reAttachEventListeners();
        }
        
        // Enhanced more menu functionality
        if (typeof enhanceMoreMenu === 'function') {
            enhanceMoreMenu();
        }
        
        // Important: Call moreMenuManager.onDirectoryRefresh last to ensure all DOM elements are ready
        if (window.moreMenuManager) {
            window.moreMenuManager.onDirectoryRefresh();
        }
    }, 150); // Increased timeout for better coordination
}

// Enhanced search with Google Drive navigation integration
document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('file-search').value;
    console.log('🔍 Search query:', query);
    
    if (query === '') {
        // Use Google Drive style notification if available
        if (window.driveEnhancements && window.driveEnhancements.showToast) {
            window.driveEnhancements.showToast('Search field is empty', 'warning');
        } else {
            alert('Search field is empty');
        }
        return;
    }
    
    // Navigate using the new navigation system
    if (window.navigation) {
        const searchPath = '/search_' + encodeURI(query);
        window.navigation.navigateTo('drive', searchPath);
    } else {
        // Fallback to old method
        const path = '/?path=/search_' + encodeURI(query);
        console.log('🔍 Search path:', path);
        window.location = path;
    }
});

// Enhanced loadDirectory function for Google Drive navigation
function loadDirectory(path) {
    console.log('📁 Loading directory:', path);
    
    // Check if we're in the new navigation system
    if (window.navigation) {
        const currentState = window.navigation.getCurrentState();
        console.log('📍 Current navigation state:', currentState);
        
        // Update URL if needed
        if (currentState.page === 'drive' && currentState.path !== path) {
            const newUrl = `/?path=${encodeURIComponent(path)}`;
            history.replaceState(null, '', newUrl);
        }
    }
    
    // Call the original getCurrentDirectory with the path
    if (typeof getCurrentDirectory === 'function') {
        getCurrentDirectory(path);
    }
}

// Make loadDirectory available globally for navigation system
window.loadDirectory = loadDirectory;

// Loading Main Page with Google Drive integration
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Main.js DOM loaded');
    
    const inputs = ['new-folder-name', 'rename-name', 'file-search']
    for (let i = 0; i < inputs.length; i++) {
        const input = document.getElementById(inputs[i]);
        if (input) {
            input.addEventListener('input', validateInput);
        }
    }

    // Initialize authentication and directory loading
    if (getCurrentPath().includes('/share_')) {
        getCurrentDirectory()
    } else {
        if (getPassword() === null) {
            document.getElementById('bg-blur').style.zIndex = '2';
            document.getElementById('bg-blur').style.opacity = '0.1';

            document.getElementById('get-password').style.zIndex = '3';
            document.getElementById('get-password').style.opacity = '1';
        } else {
            // Don't auto-load directory if we're using the new navigation system
            // Let the navigation system handle initial content loading
            if (!window.navigation) {
                getCurrentDirectory();
            }
        }
    }
    
    console.log('✅ Main.js initialization complete');
});

// Enhanced file opening with Google Drive navigation
function openFolder(event) {
    const path = event.currentTarget.dataset.path;
    console.log('📂 Opening folder:', path);
    
    if (window.navigation) {
        // Use the new navigation system
        window.navigation.navigateTo('drive', path);
    } else {
        // Fallback to original method
        if (typeof originalOpenFolder === 'function') {
            originalOpenFolder(event);
        } else {
            window.location.href = `/?path=${encodeURIComponent(path)}`;
        }
    }
}

function openFile(event) {
    const path = event.currentTarget.dataset.path;
    const name = event.currentTarget.dataset.name;
    console.log('📄 Opening file:', name, 'at', path);
    
    // Enhanced file preview with Google Drive style
    if (window.driveEnhancements && window.driveEnhancements.showFilePreview) {
        window.driveEnhancements.showFilePreview(path, name);
    } else {
        // Original file opening
        window.open(`/file?path=${encodeURIComponent(path)}`, '_blank');
    }
}

// Utility function to get current path (compatibility)
function getCurrentPath() {
    if (window.navigation) {
        const state = window.navigation.getCurrentState();
        return state.path || '/';
    }
    
    // Fallback to URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('path') || '/';
}

// Enhanced file operations for Google Drive
function enhanceFileOperations() {
    // Add Google Drive style animations and interactions
    const fileRows = document.querySelectorAll('.body-tr');
    
    fileRows.forEach(row => {
        // Add hover effects
        row.addEventListener('mouseenter', () => {
            if (!row.classList.contains('selected')) {
                row.style.backgroundColor = '#f8f9fa';
            }
        });
        
        row.addEventListener('mouseleave', () => {
            if (!row.classList.contains('selected')) {
                row.style.backgroundColor = '';
            }
        });
        
        // Enhanced selection handling
        row.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleFileSelection(row);
            }
        });
    });
}

function toggleFileSelection(row) {
    const isSelected = row.classList.contains('selected');
    
    if (isSelected) {
        row.classList.remove('selected');
        row.style.backgroundColor = '';
    } else {
        row.classList.add('selected');
        row.style.backgroundColor = '#e8f0fe';
    }
    
    // Update selection count if more menu manager exists
    if (window.moreMenuManager) {
        const path = row.dataset.path;
        if (isSelected) {
            window.moreMenuManager.selectedFiles.delete(path);
        } else {
            window.moreMenuManager.selectedFiles.add(path);
        }
        window.moreMenuManager.updateSelectionCount();
    }
}

// Call enhanced file operations after directory load
window.addEventListener('load', () => {
    setTimeout(() => {
        enhanceFileOperations();
    }, 200);
});

console.log('📜 Main.js loaded with Google Drive enhancements');
