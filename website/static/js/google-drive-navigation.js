// Google Drive Navigation System
class GoogleDriveNavigation {
    constructor() {
        this.currentPage = 'beranda';
        this.currentPath = '/';
        this.initializeNavigation();
        this.setupEventListeners();
        this.handleInitialRoute();
    }

    initializeNavigation() {
        console.log('🚀 Google Drive Navigation initialized');
    }

    setupEventListeners() {
        // Sidebar menu items
        document.querySelectorAll('.google-sidebar-menu .menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                this.handleNavigation(href, item);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handleInitialRoute();
        });

        // Breadcrumb navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.breadcrumb-item')) {
                e.preventDefault();
                const href = e.target.closest('.breadcrumb-item').getAttribute('href');
                this.handleNavigation(href);
            }
        });
    }

    handleNavigation(href, menuItem = null) {
        const url = new URL(href, window.location.origin);
        const params = new URLSearchParams(url.search);
        
        // Update browser URL without reload
        history.pushState(null, '', href);
        
        // Determine page type
        if (params.has('page')) {
            this.currentPage = params.get('page');
            this.currentPath = '/';
        } else if (params.has('path')) {
            this.currentPage = 'drive';
            this.currentPath = params.get('path') || '/';
        } else {
            this.currentPage = 'drive';
            this.currentPath = '/';
        }

        console.log(`📍 Navigating to: ${this.currentPage}, path: ${this.currentPath}`);
        
        // Update sidebar selection
        this.updateSidebarSelection(menuItem);
        
        // Switch content
        this.switchContent();
        
        // Update breadcrumb
        this.updateBreadcrumb();
    }

    handleInitialRoute() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('page')) {
            this.currentPage = params.get('page');
            this.currentPath = '/';
        } else if (params.has('path')) {
            this.currentPage = 'drive';
            this.currentPath = params.get('path') || '/';
        } else {
            this.currentPage = 'beranda';
            this.currentPath = '/';
        }

        console.log(`🏁 Initial route: ${this.currentPage}, path: ${this.currentPath}`);
        
        // Update sidebar for initial load
        this.updateSidebarSelectionForPage(this.currentPage);
        this.switchContent();
        this.updateBreadcrumb();
    }

    updateSidebarSelection(clickedItem) {
        // Remove all selections
        document.querySelectorAll('.google-sidebar-menu .menu-item').forEach(item => {
            item.classList.remove('selected-item');
            item.classList.add('unselected-item');
        });

        // Add selection to clicked item or find by page
        if (clickedItem) {
            clickedItem.classList.add('selected-item');
            clickedItem.classList.remove('unselected-item');
        } else {
            this.updateSidebarSelectionForPage(this.currentPage);
        }
    }

    updateSidebarSelectionForPage(page) {
        const menuMappings = {
            'beranda': '#beranda-btn',
            'drive': '#drive-saya-btn',
            'shared': '#drive-bersama-btn',
            'recent': '#terbaru-btn',
            'starred': '#berbintang-btn',
            'trash': '#sampah-btn'
        };

        const selector = menuMappings[page];
        if (selector) {
            const menuItem = document.querySelector(selector);
            if (menuItem) {
                // Remove all selections first
                document.querySelectorAll('.google-sidebar-menu .menu-item').forEach(item => {
                    item.classList.remove('selected-item');
                    item.classList.add('unselected-item');
                });
                
                // Add selection
                menuItem.classList.add('selected-item');
                menuItem.classList.remove('unselected-item');
            }
        }
    }

    switchContent() {
        // Hide all content sections
        document.querySelectorAll('.page-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show appropriate content
        switch (this.currentPage) {
            case 'beranda':
                this.showBerandaContent();
                break;
            case 'drive':
                this.showDriveContent();
                break;
            case 'shared':
                this.showSharedContent();
                break;
            case 'recent':
                this.showRecentContent();
                break;
            case 'starred':
                this.showStarredContent();
                break;
            case 'trash':
                this.showDriveContent(); // Trash uses drive content with different path
                break;
            default:
                this.showBerandaContent();
        }
    }

    showBerandaContent() {
        const berandaContent = document.getElementById('beranda-content');
        if (berandaContent) {
            berandaContent.classList.add('active');
            this.loadBerandaData();
        }
    }

    showDriveContent() {
        const driveContent = document.getElementById('drive-content');
        if (driveContent) {
            driveContent.classList.add('active');
            
            // Load directory data for current path
            if (typeof loadDirectory === 'function') {
                console.log(`📁 Loading directory: ${this.currentPath}`);
                loadDirectory(this.currentPath);
            }
        }
    }

    showSharedContent() {
        const sharedContent = document.getElementById('shared-content');
        if (sharedContent) {
            sharedContent.classList.add('active');
            this.loadSharedData();
        }
    }

    showRecentContent() {
        const recentContent = document.getElementById('recent-content');
        if (recentContent) {
            recentContent.classList.add('active');
            this.loadRecentData();
        }
    }

    showStarredContent() {
        const starredContent = document.getElementById('starred-content');
        if (starredContent) {
            starredContent.classList.add('active');
            this.loadStarredData();
        }
    }

    async loadBerandaData() {
        console.log('📊 Loading Beranda data...');
        
        try {
            // Load folder suggestions
            await this.loadFolderSuggestions();
            
            // Load file suggestions  
            await this.loadFileSuggestions();
            
            // Update storage info
            await this.updateStorageInfo();
            
        } catch (error) {
            console.error('❌ Error loading Beranda data:', error);
        }
    }

    async loadFolderSuggestions() {
        const container = document.getElementById('folder-suggestions');
        if (!container) return;

        try {
            const response = await fetch('/api/suggestions/folders');
            const data = await response.json();
            
            if (data.success && data.folders.length > 0) {
                container.innerHTML = data.folders.map(folder => `
                    <div class="suggestion-item" onclick="navigation.handleNavigation('/?path=${encodeURIComponent(folder.path)}')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368">
                            <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                        </svg>
                        <div class="item-info">
                            <h4>${folder.name}</h4>
                            <p>Di Drive Saya</p>
                        </div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = `
                    <div class="suggestion-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#dadce0">
                            <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                        </svg>
                        <div class="item-info">
                            <h4>Belum ada folder</h4>
                            <p>Buat folder pertama Anda</p>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Error loading folder suggestions:', error);
            container.innerHTML = '<div class="loading">Error loading folders</div>';
        }
    }

    async loadFileSuggestions() {
        const container = document.getElementById('file-suggestions');
        if (!container) return;

        try {
            const response = await fetch('/api/suggestions/files');
            const data = await response.json();
            
            if (data.success && data.files.length > 0) {
                container.innerHTML = `
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #5f6368; border-bottom: 1px solid #e8eaed;">Nama</th>
                                <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #5f6368; border-bottom: 1px solid #e8eaed;">Alasan file disarankan</th>
                                <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #5f6368; border-bottom: 1px solid #e8eaed;">Lokasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.files.map(file => `
                                <tr style="border-bottom: 1px solid #f1f3f4; cursor: pointer;" onclick="openFile('${file.id}')">
                                    <td style="padding: 8px 16px;">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <img src="${this.getFileIcon(file.extension)}" style="width: 20px; height: 20px;" />
                                            <span style="color: #3c4043; font-size: 14px;">${file.name}</span>
                                        </div>
                                    </td>
                                    <td style="padding: 8px 16px; color: #5f6368; font-size: 14px;">${file.reason}</td>
                                    <td style="padding: 8px 16px; color: #5f6368; font-size: 14px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368">
                                                <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                                            </svg>
                                            ${file.location}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="margin-top: 16px;">
                        <a href="/?page=recent" style="color: #1a73e8; text-decoration: none; font-size: 14px;">Tampilkan lainnya</a>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="#dadce0">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                        <h3>Belum ada file yang disarankan</h3>
                        <p>Upload file untuk mendapatkan saran</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Error loading file suggestions:', error);
            container.innerHTML = '<div class="loading">Error loading files</div>';
        }
    }

    async updateStorageInfo() {
        try {
            const response = await fetch('/api/storage/info');
            const data = await response.json();
            
            if (data.success) {
                const storageText = document.getElementById('storage-text');
                const storageBar = document.querySelector('.storage-used');
                
                if (storageText) {
                    const usedGB = (data.used / (1024 * 1024 * 1024)).toFixed(2);
                    storageText.textContent = `${usedGB} GB dari unlimited`;
                }
                
                if (storageBar) {
                    // Always show 0% for unlimited storage
                    storageBar.style.width = '0%';
                }
            }
        } catch (error) {
            console.error('❌ Error loading storage info:', error);
        }
    }

    async loadSharedData() {
        const container = document.getElementById('shared-files');
        if (!container) return;

        // For now, show placeholder
        container.innerHTML = `
            <div class="placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#dadce0">
                    <path d="M16,4C18.2,4 20,5.8 20,8C20,10.2 18.2,12 16,12C15.7,12 15.4,11.9 15.1,11.9C14.6,13.3 13.4,14.4 11.9,14.8C11.4,15.9 10.3,16.5 9.1,16.5C8.8,16.5 8.5,16.4 8.2,16.4C7.1,17.4 5.7,18 4.2,18C1.9,18 0,16.1 0,13.8C0,11.5 1.9,9.6 4.2,9.6C4.5,9.6 4.8,9.7 5.1,9.7C5.6,8.3 6.8,7.2 8.3,6.8C8.8,5.7 9.9,5.1 11.1,5.1C11.4,5.1 11.7,5.2 12,5.2C13.1,4.2 14.5,3.6 16,3.6V4Z"/>
                </svg>
                <h3>Drive Bersama (Coming Soon)</h3>
                <p>Fitur berbagi drive akan tersedia segera</p>
            </div>
        `;
    }

    async loadRecentData() {
        const container = document.getElementById('recent-files');
        if (!container) return;

        container.innerHTML = '<div class="loading">Loading recent files...</div>';

        try {
            const response = await fetch('/api/files/recent');
            const data = await response.json();
            
            if (data.success && data.files.length > 0) {
                // Similar table format as file suggestions
                container.innerHTML = `
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #5f6368;">Nama</th>
                                <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #5f6368;">Terakhir dimodifikasi</th>
                                <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #5f6368;">Ukuran file</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.files.map(file => `
                                <tr style="border-bottom: 1px solid #f1f3f4; cursor: pointer;" onclick="openFile('${file.id}')">
                                    <td style="padding: 8px 16px;">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <img src="${this.getFileIcon(file.extension)}" style="width: 20px; height: 20px;" />
                                            <span style="color: #3c4043; font-size: 14px;">${file.name}</span>
                                        </div>
                                    </td>
                                    <td style="padding: 8px 16px; color: #5f6368; font-size: 14px;">${file.modified_at}</td>
                                    <td style="padding: 8px 16px; color: #5f6368; font-size: 14px;">${file.size_formatted}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                container.innerHTML = `
                    <div class="placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="#dadce0">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                        </svg>
                        <h3>Belum ada file terbaru</h3>
                        <p>File yang baru diakses akan muncul di sini</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Error loading recent files:', error);
            container.innerHTML = '<div class="loading">Error loading recent files</div>';
        }
    }

    async loadStarredData() {
        const container = document.getElementById('starred-files');
        if (!container) return;

        container.innerHTML = `
            <div class="placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#dadce0">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                </svg>
                <h3>Belum ada file berbintang</h3>
                <p>Tambahkan bintang pada file untuk akses cepat</p>
            </div>
        `;
    }

    updateBreadcrumb() {
        const breadcrumb = document.getElementById('breadcrumb-nav');
        if (!breadcrumb) return;

        if (this.currentPage === 'drive' || this.currentPage === 'trash') {
            const pathParts = this.currentPath.split('/').filter(part => part);
            let pathHtml = `
                <a href="/?path=/" class="breadcrumb-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                    </svg>
                    ${this.currentPage === 'trash' ? 'Sampah' : 'My Drive'}
                </a>
            `;

            if (pathParts.length > 0) {
                let cumulativePath = '';
                pathParts.forEach((part, index) => {
                    cumulativePath += '/' + part;
                    pathHtml += `
                        <span class="breadcrumb-separator"> / </span>
                        <a href="/?path=${encodeURIComponent(cumulativePath)}" class="breadcrumb-item">${part}</a>
                    `;
                });
            }

            breadcrumb.innerHTML = pathHtml;
        } else {
            // For other pages, show simple breadcrumb
            const pageNames = {
                'beranda': 'Beranda',
                'shared': 'Drive Bersama', 
                'recent': 'Terbaru',
                'starred': 'Berbintang'
            };

            breadcrumb.innerHTML = `
                <a href="/?page=${this.currentPage}" class="breadcrumb-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                    </svg>
                    ${pageNames[this.currentPage] || 'TG Drive'}
                </a>
            `;
        }
    }

    getFileIcon(extension) {
        const iconMap = {
            'pdf': 'static/assets/pdf-icon.svg',
            'doc': 'static/assets/doc-icon.svg',
            'docx': 'static/assets/doc-icon.svg',
            'txt': 'static/assets/txt-icon.svg',
            'jpg': 'static/assets/image-icon.svg',
            'jpeg': 'static/assets/image-icon.svg',
            'png': 'static/assets/image-icon.svg',
            'gif': 'static/assets/image-icon.svg',
            'mp4': 'static/assets/video-icon.svg',
            'avi': 'static/assets/video-icon.svg',
            'mp3': 'static/assets/audio-icon.svg',
            'zip': 'static/assets/archive-icon.svg',
            'rar': 'static/assets/archive-icon.svg'
        };
        
        return iconMap[extension?.toLowerCase()] || 'static/assets/file-icon.svg';
    }

    // Public method to get current state
    getCurrentState() {
        return {
            page: this.currentPage,
            path: this.currentPath
        };
    }

    // Public method to navigate programmatically
    navigateTo(page, path = '/') {
        if (page === 'drive') {
            this.handleNavigation(`/?path=${encodeURIComponent(path)}`);
        } else {
            this.handleNavigation(`/?page=${page}`);
        }
    }
}

// Initialize navigation when DOM is ready
let navigation;
document.addEventListener('DOMContentLoaded', () => {
    navigation = new GoogleDriveNavigation();
    console.log('✅ Google Drive Navigation ready!');
});

// Make navigation available globally
window.navigation = navigation;