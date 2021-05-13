const { ipcMain, app } = require('electron')
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
module.exports = store.get('prefs')
