const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      zoomFactor: 1.0
    },
    autoHideMenuBar: true
  });

  // Open the DevTools
  //win.webContents.openDevTools();

  // Enable webview zoom settings
  win.webContents.setZoomFactor(1.0);
  win.webContents.setVisualZoomLevelLimits(1, 3);

  win.loadFile('index.html');
  // Uncomment to open DevTools by default
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});