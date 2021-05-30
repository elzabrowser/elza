const { ipcMain, dialog } = require('electron')
const Store = require('electron-store')
const store = new Store()
setPrefs()

ipcMain.on('getPreference', (event, arg) => {
  if (arg == 'all') event.returnValue = store.get('prefs')
  else if (arg == 'searchEngine' && store.get('prefs.isTorEnabled'))
    //force Duckduckgo when tor is enabled
    event.returnValue = 'ddg'
  else event.returnValue = store.get('prefs.' + arg)
})

ipcMain.on('setPreference', (event, prefs) => {
  setAllPreference(prefs)
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
    downloadLocation: 'ask',
    isAdblockEnabled: true,
    blockSpecialPermissions: true,
    javascriptEnabled: true,
    updateMethod: 'auto',
    notifications: []
  }
  Object.keys(prefs).forEach(function (pref) {
    if (typeof store.get('prefs.' + pref) === 'undefined')
      store.set('prefs.' + pref, prefs[pref])
  })
}

function getPreference () {
  return store.get('prefs')
}

function setAllPreference (prefs) {
  Object.keys(prefs).forEach(function (pref) {
    store.set('prefs.' + pref, prefs[pref])
  })
}

function setPreference (key, value) {
  store.set('prefs.' + key, value)
}
module.exports = {
  getPreference: getPreference,
  setPreference: setPreference
}
