const { ipcRenderer, contextBridge, remote } = require('electron')
contextBridge.exposeInMainWorld('preloadAPI', {
  getversion: () => {
    console.log('received')
    ipcRenderer.send('app_version')
  },
  receiveversion: (channel, func) => {
    ipcRenderer.on('app_version', (event, ...args) => func(...args))
  },
  openinNewTab: (channel, func) => {
    ipcRenderer.on('openin_newtab', (event, url) => func(url))
  },
  maxmin: () => {
    var window = remote.BrowserWindow.getFocusedWindow()
    remote.BrowserWindow.getFocusedWindow().isMaximized()
      ? window.unmaximize()
      : window.maximize()
  },
  minimize: () => {
    remote.BrowserWindow.getFocusedWindow().minimize()
  },
  close: () => {
    remote.BrowserWindow.getFocusedWindow().close()
  },
  getPlatform: () => {
    return remote.getGlobal('platform')
  }
})
