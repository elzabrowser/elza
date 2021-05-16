const { app, ipcMain, shell } = require('electron')

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
