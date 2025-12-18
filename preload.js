const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('snowAPI', {
  // Receive settings updates
  onUpdateSettings: (callback) => {
    ipcRenderer.on('update-settings', (event, settings) => callback(settings));
  },
  
  // Load settings in settings window
  onLoadSettings: (callback) => {
    ipcRenderer.on('load-settings', (event, settings) => callback(settings));
  },
  
  // Send updated settings to main process
  updateSettings: (settings) => {
    ipcRenderer.send('update-settings', settings);
  },
  
  // Close settings window
  closeSettings: () => {
    ipcRenderer.send('close-settings');
  },
  
  // Quit the application
  quitApp: () => {
    ipcRenderer.send('quit-app');
  }
});
