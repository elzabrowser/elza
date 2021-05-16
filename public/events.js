const { app, ipcMain, shell, BrowserWindow } = require('electron')

ipcMain.on('torWindow', event => {
  app.commandLine.appendSwitch('proxy-server', 'socks5://127.0.0.1:9050')
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
  app.exit(0)
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
