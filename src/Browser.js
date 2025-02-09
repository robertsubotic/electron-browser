const Tab = require('./components/Tab.js');
/*
 * The main browser interface, which manages a collection of tabs.
*/
class Browser {
    constructor() {
        this.tabs = [];
        this.activeTabId = null;
        this.initElements();
        this.initEventListeners();
        this.createTab();
    }

    initElements() {
        this.tabsContainer = document.getElementById('tabs');
        this.browserViews = document.getElementById('browserViews');
        this.urlBar = document.getElementById('urlBar');
        this.backBtn = document.getElementById('backBtn');
        this.forwardBtn = document.getElementById('forwardBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.homeBtn = document.getElementById('homeBtn');
        this.newTabBtn = document.getElementById('newTab');
        this.goButton = document.getElementById('goButton');
    }

    initEventListeners() {
        this.newTabBtn.addEventListener('click', () => this.createTab());
        this.urlBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.navigate();
        });
        this.goButton.addEventListener('click', () => this.navigate());
        this.backBtn.addEventListener('click', () => this.getActiveWebview().goBack());
        this.forwardBtn.addEventListener('click', () => this.getActiveWebview().goForward());
        this.refreshBtn.addEventListener('click', () => this.getActiveWebview().reload());
        this.homeBtn.addEventListener('click', () => this.navigateToHome());
    }

    createTab() {
        const id = Date.now();
        const tab = new Tab(id);
        this.tabs.push(tab);
        
        // Create tab element
        const tabElement = document.createElement('div');
        tabElement.className = 'tab';
        tabElement.setAttribute('data-tab-id', id);
        tabElement.innerHTML = `
            <span class="tab-title">${tab.title}</span>
            <span class="tab-close">X</span>
        `;
        
        // Create webview
        const webview = document.createElement('webview');
        webview.setAttribute('data-tab-id', id);
        webview.setAttribute('webpreferences', 'contextIsolation=false');
        webview.style.width = '100%';
        webview.style.height = '100%';
        webview.style.overflow = 'visible';
        webview.src = tab.url;

        // Add event listeners
        webview.addEventListener('dom-ready', () => {
            console.log('Webview is ready:', id);
            const iframe = webview.shadowRoot.querySelector('iframe');
            if (iframe) {
                iframe.style.height = '100%';
                iframe.style.width = '100%';
            }
            webview.setZoomFactor(1);
            webview.insertCSS(`
                html, body {
                    width: 100%;
                    height: 100%;
                }
            `);
            // Update URL bar only after dom-ready
            this.updateUrlBar(webview.getURL());
        });
        
        webview.addEventListener('page-title-updated', (e) => {
            this.updateTabTitle(id, e.title);
        });
        
        webview.addEventListener('did-start-loading', () => {
            console.log('Webview started loading:', id);
        });
        
        webview.addEventListener('did-stop-loading', () => {
            console.log('Webview stopped loading:', id);
            this.updateUrlBar(webview.getURL());
            this.updateNavigationButtons(webview);
        });
        
        tabElement.querySelector('.tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(id);
        });
        
        tabElement.addEventListener('click', () => this.activateTab(id));
        
        // Append the tab element and webview to the DOM
        this.tabsContainer.appendChild(tabElement);
        this.browserViews.appendChild(webview);
        tab.webview = webview;
    
        // Activate the tab after appending to the DOM
        this.activateTab(id);
    }

    activateTab(id) {
        // Deactivate current tab
        const currentTab = this.tabsContainer.querySelector('.tab.active');
        const currentWebview = this.browserViews.querySelector('webview.active');
        if (currentTab) currentTab.classList.remove('active');
        if (currentWebview) currentWebview.classList.remove('active');
        
        // Activate new tab
        const newTab = this.tabsContainer.querySelector(`[data-tab-id="${id}"]`);
        const newWebview = this.browserViews.querySelector(`webview[data-tab-id="${id}"]`);
        if (newTab) newTab.classList.add('active');
        if (newWebview) {
            newWebview.classList.add('active');
            this.updateUrlBar(newWebview.getURL());
            // Ensure the webview is ready before accessing its methods
            newWebview.addEventListener('dom-ready', () => {
                this.updateNavigationButtons(newWebview);
            });
        }
        
        this.activeTabId = id;
    }

    closeTab(id) {
        const tabIndex = this.tabs.findIndex(tab => tab.id === id);
        if (tabIndex === -1) return;
        
        // Remove tab and webview elements
        const tabElement = this.tabsContainer.querySelector(`[data-tab-id="${id}"]`);
        const webview = this.browserViews.querySelector(`webview[data-tab-id="${id}"]`);
        if (tabElement) tabElement.remove();
        if (webview) webview.remove();

        // Remove from tabs array
        this.tabs.splice(tabIndex, 1);

        // If closing active tab, activate another tab
        if (this.activeTabId === id) {
            if (this.tabs.length > 0) {
                this.activateTab(this.tabs[this.tabs.length - 1].id);
            } else {
                this.createTab();
            }
        }

        if (this.tabs.length === 0) {
            this.updateUrlBar('');
        }
    }

    navigate() {
        let url = this.urlBar.value;
        const hasDots = /\./.test(url);
        if (hasDots) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }   
        } else {
            url = 'https://www.google.com/search?q=' + url;
        }
        const webview = this.getActiveWebview();
        if (webview) webview.loadURL(url);
    }

    navigateToHome() {
        const webview = this.getActiveWebview();
        if (webview) webview.loadURL('https://www.google.com');
    }

    updateTabTitle(id, title) {
        const tab = this.tabsContainer.querySelector(`[data-tab-id="${id}"] .tab-title`);
        if (tab) tab.textContent = title;
    }

    updateUrlBar(url) {
        this.urlBar.value = url;
    }

    updateNavigationButtons(webview) {
        this.backBtn.disabled = !webview.canGoBack();
        this.forwardBtn.disabled = !webview.canGoForward();
    }

    getActiveWebview() {
        return this.browserViews.querySelector('webview.active');
    }
}

module.exports = Browser;