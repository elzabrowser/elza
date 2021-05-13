const { ipcMain } = require('electron')
const Store = require('electron-store')
const store = new Store()
if (!store.get('prefs.searchEngine')) {
  store.set('prefs.searchEngine', 'ddg')
}

if (!store.get('prefs.isTorEnabled')) {
  store.set('prefs.isTorEnabled', false)
}

ipcMain.on('getSearchEngine', (event, arg) => {
  event.returnValue = store.get('prefs.searchEngine')
})

ipcMain.on('setSearchEngine', (event, arg) => {
  store.set('prefs.searchEngine', arg)
})

ipcMain.on('getPreference', (event, arg) => {
  if (arg == 'all') event.returnValue = store.get('prefs')
  else event.returnValue = store.get('prefs.' + arg)
})

ipcMain.on('setPreference', (event, arg, value) => {
  console.log(value)
  if (arg == 'all') store.set('prefs', value)
  else store.set('prefs.' + arg, value)
})

module.exports = {
  preferences: store.get('prefs')
}
