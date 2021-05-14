const { ipcRenderer, contextBridge, remote, shell } = require('electron')
contextBridge.exposeInMainWorld('preloadAPI', {
  getDownloads: callback => {
    ipcRenderer.on('downloads_changed', (event, downloads) => {
      console.log('download changed')
      console.log(downloads)
      var sortedDownloads = {}
      Object.keys(downloads)
        .sort((a, b) => b - a)
        .forEach(function (key) {
          sortedDownloads[key] = downloads[key]
        })
      callback(sortedDownloads)
    })
  },
  getversion: () => {
    ipcRenderer.send('app_version')
  },
  receiveversion: (channel, func) => {
    ipcRenderer.on('app_version', (event, ...args) => func(...args))
  },
  openinNewTab: (channel, func) => {
    ipcRenderer.on('openin_newtab', (event, url) => func(url))
  },
  getSearchEngine: (channel, func) => {
    return ipcRenderer.sendSync('getSearchEngine')
  },
  getPreference: arg => {
    return ipcRenderer.sendSync('getPreference', arg)
  },
  setPreference: (arg, value) => {
    console.log(value)
    ipcRenderer.sendSync('setPreference', arg, value)
  },
  selectDownloadPath: () => {
    return ipcRenderer.sendSync('setDownloadPath')
  },
  torWindow: () => {
    return ipcRenderer.send('torwindow')
  },
  showItemInFolder: path => {
    shell.showItemInFolder(path)
  },
  getDownloadsDirectory: path => {
    return ipcRenderer.sendSync('getDownloadsDirectory')
  },
  getPlatform: () => {
    return ipcRenderer.sendSync('getPlatform')
  },
  windowAction: arg => {
    ipcRenderer.send('windowAction', arg)
  }
})
