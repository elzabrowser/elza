const { app,ipcMain } = require('electron')

ipcMain.on('torwindow', event => {
    app.commandLine.appendSwitch('proxy-server', 'socks5://127.0.0.1:9050')
    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    app.exit(0)
  })