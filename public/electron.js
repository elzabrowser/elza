const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const electronDl = require('electron-dl')
const { autoUpdater } = require('electron-updater')
const contextMenu = require('electron-context-menu')
let downloads = {}

app.on('window-all-closed', function () {
  app.quit()
})
Menu.setApplicationMenu(null)
let mainWindow
updateDownload = () => {
  mainWindow.webContents.send('downloads_changed', downloads)
}
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    title: 'Elza Browser',
    titleBarStyle: 'hidden',
    resizable: true,
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
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
      var downloadItem = new Object()
      downloadItem.name = item.getFilename()
      downloadItem.totalBytes = item.getTotalBytes()
      downloadItem.receivedBytes = 0
      var d = new Date()
      var downloadID = d.getTime()
      downloadItem.status = 'started'
      downloadItem.path = item.getSavePath()
      downloads[downloadID] = downloadItem
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
            downloads[downloadID].receivedBytes = item.getReceivedBytes()
            if (
              downloads[downloadID].totalBytes ==
                downloads[downloadID].receivedBytes &&
              downloads[downloadID].totalBytes != 0
            ) {
              downloads[downloadID].status = 'done'
              updateDownload()
            }
          }
        }
      })
    }
  })
})
app.on('web-contents-created', (e, contents) => {
  if (contents.getType() == 'webview') {
    contextMenu({
      prepend: (defaultActions, params, browserWindow) => [
        {
          label: 'Open in New Tab',
          visible: params.linkURL.trim().length > 0,
          click: () => {
            mainWindow.webContents.send('openin_newtab', params.linkURL)
          }
        },
        {
          label: 'Open Image in New Tab',
          visible: params.mediaType === 'image',
          click: () => {
            mainWindow.webContents.send('openin_newtab', params.srcURL)
          }
        }
      ],
      labels: {
        saveImage: 'Download Image',
        saveLinkAs: 'Download Link'
      },
      showSaveImage: true,
      showInspectElement: true,
      showCopyImageAddress: true,
      showCopyImage: true,
      showSaveLinkAs: true,
      window: contents
    })
  }
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
