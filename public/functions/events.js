const { app, ipcMain, shell, BrowserWindow } = require('electron')
const request = require('request')
const preference = require('./config')

/*User activated/deactivated tor*/
ipcMain.on('torWindow', event => {
  if (preference.getPreference().isTorEnabled) {
    preference.setPreference('isTorEnabled', false)
  } else preference.setPreference('isTorEnabled', true)

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

/*Return app version*/
ipcMain.on('appVersion', event => {
  event.returnValue = app.getVersion()
})

/* Open the downloaded file in native file manager*/
ipcMain.on('showItemInFolder', (event, arg) => {
  shell.showItemInFolder(arg)
})

/*catch maximize,minimize and close events*/
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

/*get system downloads directory path*/
ipcMain.on('getDownloadsDirectory', (event, arg, value) => {
  event.returnValue = app.getPath('downloads')
})

/*Return the platform on which elza is running*/
ipcMain.on('getPlatform', event => {
  event.returnValue = process.platform
})

/*Send user feedback to sheets*/
ipcMain.on('sendFeedback', (event, data) => {
  var options = {
    method: 'POST',
    url:
      'https://script.google.com/macros/s/AKfycbyS0EIojx1x0iBIlvia6Jr3gKdPg4bVVIretnHywu-NAm2gWGR2_onqwUVwcZmImW_7Yg/exec',
    headers: {
      'content-type':
        'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: data
  }
  request(options, function (error, response, body) {
    if (error) console.log(error)
  })
})
