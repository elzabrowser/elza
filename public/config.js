const { ipcMain, app, dialog, BrowserWindow } = require('electron')
const Store = require('electron-store')
const store = new Store()
setPrefs()
ipcMain.on('getPreference', (event, arg) => {
  if (arg == 'all') event.returnValue = store.get('prefs')
  else event.returnValue = store.get('prefs.' + arg)
})

ipcMain.on('setPreference', (event, arg, value) => {
  console.log(value)
  if (arg == 'all') store.set('prefs', value)
  else store.set('prefs.' + arg, value)
  event.returnValue = true
})
ipcMain.on('setDownloadPath', async (event, arg, value) => {
  let path = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (!path.filePaths[0]) return
  store.set('prefs.downloadLocation', path.filePaths[0])
  console.log(path.filePaths[0])
  event.returnValue = path.filePaths[0]
})

ipcMain.on('getDownloadsDirectory', (event, arg, value) => {
  event.returnValue = app.getPath('downloads')
})

function setPrefs () {
  prefs = {
    searchEngine: 'ddg',
    isTorEnabled: false,
    downloadLocation: 'ask'
  }
  Object.keys(prefs).forEach(function (pref) {
    if (!store.get('prefs.' + pref)) store.set('prefs.' + pref, prefs[pref])
  })
}
ipcMain.on('windowAction', (event, arg) => {
  if (arg == 'maxmin') {
    var window = BrowserWindow.getFocusedWindow()
    BrowserWindow.getFocusedWindow().isMaximized()
      ? window.unmaximize()
      : window.maximize()
  }
  if (arg == 'minimize') {
    BrowserWindow.getFocusedWindow().minimize()
  }
  if (arg == 'close') {
    BrowserWindow.getFocusedWindow().close()
  }
})
module.exports = {
  getPreference: () => {
    return store.get('prefs')
  }
}
