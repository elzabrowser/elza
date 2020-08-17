const { app, BrowserWindow, Menu, session, DownloadItem } = require('electron')
const fs = require('fs')
const isDev = require('electron-is-dev')
const electronDl = require('electron-dl')
const downloadInfoFile = app.getPath('userData') + '/downloads.json'
console.log(downloadInfoFile)
let downloads
fs.writeFile(downloadInfoFile, '{}', { flag: 'wx' }, function (err) {
  if (err) throw err
})
try {
  downloads = JSON.parse(fs.readFileSync(downloadInfoFile, 'utf8'))
} catch {
  downloads = {}
}
app.on('window-all-closed', function () {
  app.quit()
})

Menu.setApplicationMenu(null)
updateDownload = () => {
  fs.writeFile(downloadInfoFile, JSON.stringify(downloads), err => {
    if (err) throw err
  })
}
let mainWindow
app.on('ready', function () {
  const { screen } = require('electron')
  const electronScreen = screen
  var mainScreen = electronScreen.getPrimaryDisplay()
  var dimensions = mainScreen.size
  mainWindow = new BrowserWindow({
    title: 'Elza Browser',
    titleBarStyle: 'hidden',
    resizable: true,
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
    // icon: __dirname + '/src/logo.png',
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      webSecurity: false
    }
  })
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.openDevTools()
  } else {
    mainWindow.loadFile('./build/index.html')
    //mainWindow.openDevTools()
  }
  /* session.defaultSession.on('will-download', (event, item, webContents) => {
    event.preventDefault()
    console.log('ghn')
  }) */

  electronDl({
    saveAs: false,
    showBadge: true,
    onStarted: function (item) {
      //mainWindow.webContents.send('started', item)
      var downloadItem = new Object()
      downloadItem.name = item.getFilename()
      downloadItem.totalBytes = item.getTotalBytes()
      downloadItem.receivedBytes = 0
      var d = new Date()
      var downloadID = d.getTime()
      downloadItem.status = 'started'
      downloadItem.path = item.getSavePath()
      downloads[downloadID] = downloadItem
      console.log(downloads)
      updateDownload()
      item.once('done', (event, state) => {
        if (state === 'completed') {
          downloads[downloadID].status = 'done'
          console.log(downloads)
          updateDownload()
        } else {
          console.log(`Download failed: ${state}`)
        }
      })
      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed')
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused')
          } else {
            updateDownload()
            downloads[downloadID].receivedBytes = item.getReceivedBytes()
          }
        }
      })
    }
  })
})
