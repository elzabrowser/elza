const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const fs = require('fs')
const isDev = require('electron-is-dev')
const electronDl = require('electron-dl')
const { autoUpdater } = require('electron-differential-updater')
const downloadInfoFile = app.getPath('userData') + '/downloads.json'
let downloads
fs.writeFile(downloadInfoFile, '{}', function (err) {
  if (err) throw err
})
downloads = {}

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
    frame: false,
    titleBarStyle: 'customButtonsOnHover',
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
            if (
              downloads[downloadID].totalBytes ==
                downloads[downloadID].receivedBytes &&
              downloads[downloadID].totalBytes != 0
            ) {
              downloads[downloadID].status = 'done'
            }
          }
        }
      })
    }
  })
})
app.once('ready-to-show', () => {
  autoUpdater.checkForUpdatesAndNotify()
})
ipcMain.on('app_version', event => {
  event.sender.send('app_version', { version: app.getVersion() })
})
autoUpdater.on('update-available', () => {
  console.log('update available')
  mainWindow.webContents.send('update_available')
})
autoUpdater.on('update-downloaded', () => {
  console.log('update downloaded')
  mainWindow.webContents.send('update_downloaded')
  autoUpdater.quitAndInstall()
})
