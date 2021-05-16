const { ipcRenderer, contextBridge, shell } = require('electron')
contextBridge.exposeInMainWorld('preloadAPI', {
  getDownloads: (channel, func) => {
    let validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on('downloadsChanged', (event, downloads) => {
        var sortedDownloads = {}
        Object.keys(downloads)
          .sort((a, b) => b - a)
          .forEach(function (key) {
            sortedDownloads[key] = downloads[key]
          })
        func(sortedDownloads)
      })
      ipcRenderer.send('getDownloads')
    }
  },
  getVersion: channel => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync('appVersion')
    }
  },
  openinNewTab: (channel, func) => {
    let validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on('openInNewtab', (event, url) => func(url))
    }
  },
  getPreference: (channel, arg) => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync('getPreference', arg)
    }
  },
  setPreference: (channel, arg, value) => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.sendSync('setPreference', arg, value)
    }
  },
  selectDownloadPath: channel => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync('setDownloadPath')
    }
  },
  torWindow: channel => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      return ipcRenderer.send('torwindow')
    }
  },
  showItemInFolder: (channel, path) => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      shell.showItemInFolder(path)
    }
  },
  getDownloadsDirectory: channel => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync('getDownloadsDirectory')
    }
  },
  getPlatform: () => channel => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      return ipcRenderer.sendSync('getPlatform')
    }
  },
  windowAction: (channel, arg) => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send('windowAction', arg)
    }
  }
})
