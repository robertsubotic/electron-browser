/**
 * A single tab in the browser, which contains a webview and related
 * metadata such as the tab title and URL.
 *
 * @param {number} id
 * @param {string} [title='New Tab']
 * @param {string} [url='file://c:/Users/robis/Documents/PROJEKTI/nodejs_browser/src/default_page.html']
 */
class Tab {
    constructor(id, title = 'New Tab', url = 'file://c:/Users/robis/Documents/PROJEKTI/nodejs_browser/src/default_page.html') {
        this.id = id;
        this.title = title;
        this.url = url;
    }
}

module.exports = Tab;