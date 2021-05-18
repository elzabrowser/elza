const { app, ipcMain, shell, BrowserWindow } = require('electron')

ipcMain.on('torWindow', event => {
  //https://github.com/electron-userland/electron-builder/issues/1727
  if (process.env.APPIMAGE) {
    app.relaunch({
      execPath: process.env.APPIMAGE,
      args: ['--appimage-extract-and-run']
    })
  }
  app.relaunch()
  app.quit(0)
})

ipcMain.on('appVersion', event => {
  event.returnValue = app.getVersion()
})

ipcMain.on('showItemInFolder', (event, arg) => {
  shell.showItemInFolder(arg)
})

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

//get system downloads directory path
ipcMain.on('getDownloadsDirectory', (event, arg, value) => {
  event.returnValue = app.getPath('downloads')
})

ipcMain.on('getPlatform', event => {
  event.returnValue = process.platform
})
