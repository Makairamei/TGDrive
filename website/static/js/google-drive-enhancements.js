// Google Drive Enhancements
class GoogleDriveEnhancements {
    constructor() {
        this.currentView = 'list'; // list or grid
        this.currentFilters = {
            type: 'all',
            person: 'all',
            modified: 'all',
            source: 'all'
        };
        
        this.initializeEnhancements();
        this.setupEventListeners();
    }

    initializeEnhancements() {
        console.log('🎨 Google Drive Enhancements initialized');
        
        // Initialize view toggles
        this.setupViewToggles();
        
        // Initialize filters (if on Drive Saya page)
        this.setupFilters();
    }

    setupEventListeners() {
        // View toggle buttons
        document.getElementById('list-view-btn')?.addEventListener('click', () => {
            this.switchView('list');
        });

        document.getElementById('grid-view-btn')?.addEventListener('click', () => {
            this.switchView('grid');
        });

        // Handle dynamic content loading when page changes
        document.addEventListener('pageChanged', (e) => {
            this.handlePageChange(e.detail.page);
        });
    }

    setupViewToggles() {
        const listBtn = document.getElementById('list-view-btn');
        const gridBtn = document.getElementById('grid-view-btn');
        
        if (listBtn && gridBtn) {
            // Set initial state
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        }
    }

    switchView(view) {
        this.currentView = view;
        
        const listBtn = document.getElementById('list-view-btn');
        const gridBtn = document.getElementById('grid-view-btn');
        const directoryTable = document.querySelector('#directory-container table');
        
        if (view === 'list') {
            listBtn?.classList.add('active');
            gridBtn?.classList.remove('active');
            
            // Show table view
            if (directoryTable) {
                directoryTable.style.display = 'table';
                directoryTable.parentElement.classList.remove('grid-view');
                directoryTable.parentElement.classList.add('list-view');
            }
        } else {
            listBtn?.classList.remove('active');
            gridBtn?.classList.add('active');
            
            // Show grid view
            if (directoryTable) {
                directoryTable.style.display = 'none';
                directoryTable.parentElement.classList.remove('list-view');
                directoryTable.parentElement.classList.add('grid-view');
                this.createGridView();
            }
        }
        
        console.log(`📋 View switched to: ${view}`);
    }

    createGridView() {
        const container = document.getElementById('directory-container');
        if (!container) return;

        // Check if grid container already exists
        let gridContainer = container.querySelector('.grid-container');
        if (!gridContainer) {
            gridContainer = document.createElement('div');
            gridContainer.className = 'grid-container';
            container.appendChild(gridContainer);
        }

        // Get current table data
        const tbody = container.querySelector('tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        gridContainer.innerHTML = '';

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) return;

            const nameCell = cells[0];
            const sizeCell = cells[1];
            const moreCell = cells[2];

            const nameContent = nameCell.querySelector('.td-align');
            if (!nameContent) return;

            const icon = nameContent.querySelector('img');
            const name = nameContent.textContent.trim();
            const size = sizeCell.textContent.trim();

            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.setAttribute('data-path', row.getAttribute('data-path'));
            gridItem.setAttribute('data-id', row.getAttribute('data-id'));
            gridItem.innerHTML = `
                <div class="grid-item-icon">
                    <img src="${icon?.src || 'static/assets/file-icon.svg'}" alt="File icon" />
                </div>
                <div class="grid-item-name">${name}</div>
                <div class="grid-item-size">${size}</div>
                <div class="grid-item-more">
                    ${moreCell.innerHTML}
                </div>
            `;

            // Copy event listeners
            const originalMoreBtn = moreCell.querySelector('.more-vert');
            const newMoreBtn = gridItem.querySelector('.more-vert');
            if (originalMoreBtn && newMoreBtn) {
                newMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    originalMoreBtn.click();
                });
            }

            // Add click handler for item
            gridItem.addEventListener('click', () => {
                row.click();
            });

            gridContainer.appendChild(gridItem);
        });
    }

    setupFilters() {
        // This will be called when Drive Saya page is loaded
        // For now, we'll show placeholder filters
    }

    addDriveSayaFilters() {
        const headerActions = document.querySelector('.google-header-actions');
        if (!headerActions || document.querySelector('.drive-filters')) return;

        const filtersHTML = `
            <div class="drive-filters">
                <button class="filter-btn" id="type-filter">
                    <span>Jenis</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,10L12,15L17,10H7Z"/>
                    </svg>
                </button>
                <button class="filter-btn" id="person-filter">
                    <span>Orang</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,10L12,15L17,10H7Z"/>
                    </svg>
                </button>
                <button class="filter-btn" id="modified-filter">
                    <span>Dimodifikasi</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,10L12,15L17,10H7Z"/>
                    </svg>
                </button>
                <button class="filter-btn" id="source-filter">
                    <span>Sumber</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,10L12,15L17,10H7Z"/>
                    </svg>
                </button>
            </div>
        `;

        // Insert before view toggle
        const viewToggle = headerActions.querySelector('.google-view-toggle');
        if (viewToggle) {
            viewToggle.insertAdjacentHTML('beforebegin', filtersHTML);
        }
    }

    removeDriveSayaFilters() {
        const filters = document.querySelector('.drive-filters');
        if (filters) {
            filters.remove();
        }
    }

    handlePageChange(page) {
        // Add/remove filters based on page
        if (page === 'drive') {
            setTimeout(() => {
                this.addDriveSayaFilters();
                this.updateDriveSayaHeader();
            }, 100);
        } else {
            this.removeDriveSayaFilters();
            this.resetHeader();
        }

        // Update breadcrumb and content based on page
        this.updatePageContent(page);
    }

    updateDriveSayaHeader() {
        const breadcrumb = document.getElementById('breadcrumb-nav');
        if (breadcrumb && navigation?.getCurrentState().page === 'drive') {
            // Add "Drive Saya" title with dropdown
            const existingTitle = document.querySelector('.drive-saya-title');
            if (!existingTitle) {
                const titleHTML = `
                    <div class="drive-saya-title">
                        <h1>Drive Saya</h1>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7,10L12,15L17,10H7Z"/>
                        </svg>
                    </div>
                `;
                breadcrumb.insertAdjacentHTML('afterend', titleHTML);
            }
        }
    }

    resetHeader() {
        const driveTitle = document.querySelector('.drive-saya-title');
        if (driveTitle) {
            driveTitle.remove();
        }
    }

    updatePageContent(page) {
        // Update table headers based on page
        const table = document.querySelector('#directory-container table');
        if (!table) return;

        const thead = table.querySelector('thead tr');
        if (!thead) return;

        // Reset to default headers
        if (page === 'drive') {
            thead.innerHTML = `
                <th class="checkbox-column hidden">
                    <input type="checkbox" id="select-all-checkbox" title="Select all files">
                </th>
                <th>Nama ↑</th>
                <th>Pemilik</th>
                <th>Terakhir diubah</th>
                <th>Ukuran file</th>
                <th></th>
            `;
        } else if (page === 'recent') {
            thead.innerHTML = `
                <th class="checkbox-column hidden">
                    <input type="checkbox" id="select-all-checkbox" title="Select all files">
                </th>
                <th>Nama</th>
                <th>Terakhir dimodifikasi</th>
                <th>Ukuran file</th>
                <th></th>
            `;
        } else {
            thead.innerHTML = `
                <th class="checkbox-column hidden">
                    <input type="checkbox" id="select-all-checkbox" title="Select all files">
                </th>
                <th>Nama</th>
                <th>File Size</th>
                <th>More</th>
            `;
        }
    }

    // Public methods for integration
    getCurrentView() {
        return this.currentView;
    }

    getCurrentFilters() {
        return this.currentFilters;
    }

    // Enhanced file operations for Google Drive style
    enhanceFileItems() {
        const fileItems = document.querySelectorAll('.body-tr');
        
        fileItems.forEach(item => {
            // Add Google Drive style hover effects
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f8f9fa';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
            });

            // Enhanced right-click context
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showEnhancedContextMenu(e, item);
            });
        });
    }

    showEnhancedContextMenu(e, item) {
        // Create Google Drive style context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'google-context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
                Bagikan
            </div>
            <div class="context-menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                </svg>
                Tambahkan ke Berbintang
            </div>
            <div class="context-menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
                Hapus
            </div>
            <hr style="margin: 4px 0; border: none; border-top: 1px solid #e8eaed;">
            <div class="context-menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
                </svg>
                Lihat detail
            </div>
        `;

        // Position and show context menu
        contextMenu.style.position = 'fixed';
        contextMenu.style.left = e.clientX + 'px';
        contextMenu.style.top = e.clientY + 'px';
        contextMenu.style.zIndex = '1000';

        document.body.appendChild(contextMenu);

        // Remove on click outside
        const removeMenu = () => {
            contextMenu.remove();
            document.removeEventListener('click', removeMenu);
        };
        
        setTimeout(() => {
            document.addEventListener('click', removeMenu);
        }, 10);
    }

    // File selection enhancements
    enhanceFileSelection() {
        // Add Google Drive style selection
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const fileCheckboxes = document.querySelectorAll('.file-checkbox');
                fileCheckboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
                this.updateSelectionUI();
            });
        }
    }

    updateSelectionUI() {
        const selectedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
        const count = selectedCheckboxes.length;
        
        // Update header actions
        const selectModeBtn = document.getElementById('select-mode-btn');
        const moveBtn = document.getElementById('move-files-btn');
        const cancelBtn = document.getElementById('cancel-select-btn');
        const countSpan = document.getElementById('selected-count-header');

        if (count > 0) {
            selectModeBtn?.classList.add('hidden');
            moveBtn?.classList.remove('hidden');
            cancelBtn?.classList.remove('hidden');
            moveBtn?.classList.remove('disabled');
            moveBtn?.removeAttribute('disabled');
            
            if (countSpan) {
                countSpan.textContent = count;
            }
        } else {
            selectModeBtn?.classList.remove('hidden');
            moveBtn?.classList.add('hidden');
            cancelBtn?.classList.add('hidden');
        }
    }
}

// Enhanced Grid View CSS (injected dynamically)
const gridViewCSS = `
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    padding: 16px 0;
}

.grid-item {
    border: 1px solid #e8eaed;
    border-radius: 8px;
    padding: 16px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 140px;
}

.grid-item:hover {
    background: #f8f9fa;
    box-shadow: 0 1px 3px rgba(60,64,67,.30);
}

.grid-item-icon {
    margin-bottom: 12px;
}

.grid-item-icon img {
    width: 32px;
    height: 32px;
}

.grid-item-name {
    font-size: 14px;
    color: #3c4043;
    margin-bottom: 4px;
    word-break: break-word;
    line-height: 1.3;
    flex: 1;
    display: flex;
    align-items: center;
}

.grid-item-size {
    font-size: 12px;
    color: #5f6368;
    margin-bottom: 8px;
}

.grid-item-more {
    opacity: 0;
    transition: opacity 0.2s ease;
}

.grid-item:hover .grid-item-more {
    opacity: 1;
}

/* Filter Buttons */
.drive-filters {
    display: flex;
    gap: 8px;
    margin-right: 16px;
}

.filter-btn {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid #dadce0;
    border-radius: 18px;
    color: #3c4043;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
}

.filter-btn:hover {
    background: #f8f9fa;
    box-shadow: 0 1px 2px rgba(60,64,67,.30);
}

/* Drive Saya Title */
.drive-saya-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px 0;
    margin-bottom: -12px;
}

.drive-saya-title h1 {
    font-size: 32px;
    font-weight: 400;
    color: #3c4043;
    margin: 0;
}

.drive-saya-title svg {
    color: #5f6368;
    cursor: pointer;
}

/* Google Context Menu */
.google-context-menu {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(60,64,67,.30);
    padding: 8px 0;
    min-width: 200px;
}

.context-menu-item {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-size: 14px;
    color: #3c4043;
    transition: background-color 0.2s ease;
}

.context-menu-item:hover {
    background: #f8f9fa;
}

.context-menu-item svg {
    opacity: 0.7;
}

@media (max-width: 768px) {
    .drive-filters {
        display: none;
    }
    
    .grid-container {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
    }
    
    .grid-item {
        padding: 12px 8px;
        min-height: 120px;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = gridViewCSS;
document.head.appendChild(style);

// Initialize enhancements when DOM is ready
let driveEnhancements;
document.addEventListener('DOMContentLoaded', () => {
    driveEnhancements = new GoogleDriveEnhancements();
    console.log('✨ Google Drive Enhancements ready!');
});

// Make available globally
window.driveEnhancements = driveEnhancements;