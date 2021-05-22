const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const fetch = require('cross-fetch')
const contextMenu = require('electron-context-menu')
const unusedFilename = require('unused-filename')
const log = require('electron-log')
const path = require('path')
const preference = require('./config')
require('./events')
require('./tor')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
let downloads = {}
let mainWindow, newWindow

if (preference.getPreference().isTorEnabled) {
  app.commandLine.appendSwitch('proxy-server', 'socks5://127.0.0.1:9050')
}

app.on('window-all-closed', function () {
  app.quit()
})

newwindow = type => {
  newWindow = new BrowserWindow({
    title: 'Elza Browser',
    titleBarStyle: 'hiddenInset',
    show: false,
    icon: path.join(__dirname, '/icon.png'),
    resizable: true,
    width: 1000,
    height: 600,
    minWidth: 700,
    minHeight: 350,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
  })
  if (isDev) {
    newWindow.loadURL('http://localhost:3000')
    newWindow.openDevTools({ mode: 'detach' })
  } else {
    newWindow.loadFile('./build/index.html')
    autoUpdater.checkForUpdatesAndNotify()
    autoUpdater.on('error', error => {
      console.log(error)
    })
    //newWindow.openDevTools()
  }
  newWindow.once('ready-to-show', () => {
    newWindow.show()
    newWindow.maximize()
  })
  return newWindow
}

updateDownloadList = () => {
  let sortedDownloads = {}
  Object.keys(downloads)
    .sort((a, b) => b - a)
    .forEach(function (key) {
      sortedDownloads[key] = downloads[key]
    })
  mainWindow.webContents.send('downloadsChanged', sortedDownloads)
}
ipcMain.on('getDownloads', event => {
  updateDownloadList()
})

app.on('ready', function () {
  mainWindow = newwindow()
  mainWindow.webContents.session.on(
    'will-download',
    (event, item, webContents) => {
      if (preference.getPreference().downloadLocation != 'ask') {
        var filepath = unusedFilename.sync(
          path.join(
            preference.getPreference().downloadLocation,
            item.getFilename()
          )
        )
        item.setSavePath(filepath)
      }
      var downloadItem = {
        name: item.getFilename(),
        totalBytes: item.getTotalBytes(),
        receivedBytes: 0,
        status: 'started'
      }
      var downloadID = new Date().getTime()
      downloads[downloadID] = downloadItem
      item.once('done', (event, state) => {
        if (state === 'completed') {
          downloadItem.path = item.getSavePath()
          downloads[downloadID].status = 'done'
        } else {
          if (state == 'cancelled') {
            delete downloads[downloadID]
          }
        }
        updateDownloadList()
      })
      item.on('updated', (event, state) => {
        if (state === 'progressing') {
          downloads[downloadID].receivedBytes = item.getReceivedBytes()
        }
        updateDownloadList()
      })
    }
  )
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
    if (preference.getPreference().isAdblockEnabled)
      blocker.enableBlockingInSession(mainWindow.webContents.session)
    ipcMain.on('disableAdblocker', event => {
      blocker.disableBlockingInSession(mainWindow.webContents.session)
    })
    ipcMain.on('enableAdblocker', event => {
      blocker.enableBlockingInSession(mainWindow.webContents.session)
    })
  })
})

//electron-context-menu options
app.on('web-contents-created', (e, contents) => {
  if (contents.getType() == 'webview') {
    contextMenu({
      window: {
        webContents: contents,
        inspectElement: contents.inspectElement.bind(contents)
      },
      prepend: (defaultActions, params, browserWindow) => [
        {
          label: 'Open in New Tab',
          visible: params.linkURL.trim().length > 0,
          click: () => {
            mainWindow.webContents.send('openInNewtab', params.linkURL)
          }
        },
        {
          label: 'Open Image in New Tab',
          visible: params.mediaType === 'image',
          click: () => {
            mainWindow.webContents.send('openInNewtab', params.srcURL)
          }
        },
        {
          label: 'Open New Window',
          visible: true,
          click: () => {
            newwindow()
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
      showSearchWithGoogle: false
    })
  }
})
