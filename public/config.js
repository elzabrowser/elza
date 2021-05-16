const { ipcMain, dialog } = require('electron')
const Store = require('electron-store')
const store = new Store()
setPrefs()

ipcMain.on('getPreference', (event, arg) => {
  if (arg == 'all') event.returnValue = store.get('prefs')
  else event.returnValue = store.get('prefs.' + arg)
})

ipcMain.on('setPreference', (event, prefs, value) => {
  Object.keys(prefs).forEach(function (pref) {
    store.set('prefs.' + pref, prefs[pref])
  })
  event.returnValue = true
})

ipcMain.on('selectDownloadPath', async (event, arg, value) => {
  let path = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (!path.filePaths[0]) return
  store.set('prefs.downloadLocation', path.filePaths[0])
  event.returnValue = path.filePaths[0]
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

module.exports = {
  getPreference: () => {
    return store.get('prefs')
  }
}
