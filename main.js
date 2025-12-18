const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let settingsWindow = null;

// Default snow settings
let snowSettings = {
  density: 150,      // Number of snowflakes
  speed: 2,          // Fall speed (1-5)
  size: 3,           // Snowflake size (1-5)
  wind: 0,           // Wind strength (-5 to 5)
  opacity: 0.8,      // Snowflake opacity
  paused: false      // Snow animation paused state
};

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().bounds;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    focusable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Make window click-through so you can interact with apps behind it
  mainWindow.setIgnoreMouseEvents(true);

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Send initial settings after window loads
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('update-settings', snowSettings);
  });
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  settingsWindow.loadFile(path.join(__dirname, 'renderer', 'settings.html'));

  settingsWindow.webContents.on('did-finish-load', () => {
    settingsWindow.webContents.send('load-settings', snowSettings);
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function toggleSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.close();
    settingsWindow = null;
  } else {
    createSettingsWindow();
  }
}

app.whenReady().then(() => {
  createMainWindow();

  // Register global shortcut Ctrl+Shift+S for settings
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    toggleSettingsWindow();
  });

  // Register Ctrl+Shift+Q to quit the app
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    app.quit();
  });
});

// Handle settings updates from settings window
ipcMain.on('update-settings', (event, newSettings) => {
  snowSettings = { ...snowSettings, ...newSettings };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-settings', snowSettings);
  }
});

// Handle close settings window request
ipcMain.on('close-settings', () => {
  if (settingsWindow) {
    settingsWindow.close();
  }
});

// Handle app quit request
ipcMain.on('quit-app', () => {
  app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
