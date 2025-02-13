/**
 * A single tab in the browser, which contains a webview and related
 * metadata such as the tab title and URL.
 *
 * @param {number} id
 * @param {string} [title='New Tab']
 * @param {string} [url='']
 */
class Tab {
    constructor(id, title = 'New Tab', url = 'file://PROJECT_PATH/default_page.html') {
        this.id = id;
        this.title = title;
        this.url = url;
    }
}

module.exports = Tab;
