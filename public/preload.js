const { ipcRenderer, contextBridge } = require('electron')
contextBridge.exposeInMainWorld('preloadAPI', {
  send: (channel, data, sendsync) => {
    // whitelist channels
    let validChannels = [
      'appVersion',
      'getPreference',
      'setPreference',
      'setDownloadPath',
      'getDownloadsDirectory',
      'getPlatform',
      'showItemInFolder',
      'torWindow',
      'selectDownloadPath',
      'getDownloads',
      'windowAction',
      'toggleAdblocker',
      'downloadURL',
      'openNewTab',
      'sendFeedback'
    ]
    if (validChannels.includes(channel)) {
      if (sendsync) return ipcRenderer.sendSync(channel, data)
      else ipcRenderer.send(channel, data)
    } else console.log('channel not whitelisted ', channel)
  },
  receive: (channel, func) => {
    let validChannels = [
      'downloadsChanged',
      'openInNewtab',
      'focusURLbar',
      'newTab'
    ]
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => {
        func(...args)
      })
    }
  }
})
