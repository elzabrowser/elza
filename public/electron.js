const { app, BrowserWindow, ipcMain, session, Menu } = require('electron')
const isDev = require('electron-is-dev')
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const fetch = require('cross-fetch')
const contextMenu = require('electron-context-menu')
const unusedFilename = require('unused-filename')
const path = require('path')
const preference = require('./functions/config')
require('./functions/notifier')
require('./functions/events')
require('./functions/tor')

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
      webviewTag: true,
    }
  })
  let menuTemplate = [
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Clear session and Reload',
          accelerator: 'CommandOrControl+D',
          click () {
            session.fromPartition('temp-in-memory').clearCache()
            session.fromPartition('temp-in-memory').clearStorageData()
            newWindow.reload()
          }
        },
        {
          label: 'Focus URLbar',
          accelerator: 'CommandOrControl+L',
          click () {
            mainWindow.webContents.send('focusURLbar', {})
          }
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
  if (isDev) {
    newWindow.loadURL('http://localhost:3000')
    newWindow.openDevTools({ mode: 'detach' })
  } else {
    newWindow.loadFile('./build/index.html')
    //newWindow.openDevTools()
  }
  newWindow.once('ready-to-show', () => {
    newWindow.show()
    newWindow.maximize()
  })
  
  newWindow.webContents.on('did-attach-webview', (event, contents) => {
    contents.on('new-window', (event, url) => {
      mainWindow.webContents.send('openInNewtab', url)
    })
    contents.setWindowOpenHandler(({ url }) => {
      console.log(url)
    })
  })
  return newWindow
}

updateDownloadList = () => {
  if (!downloads) return //downloads are destroyed when elza is restarting
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
  require('./functions/autoupdator')
  mainWindow = newwindow()
  session
    .fromPartition('temp-in-memory')
    .on('will-download', (event, item, webContents) => {
      if (preference.getPreference().downloadLocation != 'ask') {
        var filepath = unusedFilename.sync(
          path.join(
            preference.getPreference().downloadLocation,
            item.getFilename()
          )
        )
        var newFilename = path.basename(filepath)
        item.setSavePath(filepath)
      }
      var downloadItem = {
        name: newFilename || item.getFilename(),
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
    })
  ipcMain.on('downloadURL', (event, url) => {
    mainWindow.webContents.downloadURL(url)
  })
  ipcMain.on('openNewTab', (event, url) => {
    mainWindow.webContents.send('openInNewtab', url)
  })

  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
    if (preference.getPreference().isAdblockEnabled)
      blocker.enableBlockingInSession(session.fromPartition('temp-in-memory'))
    ipcMain.on('toggleAdblocker', (event, flag) => {
      if (flag)
        blocker.enableBlockingInSession(session.fromPartition('temp-in-memory'))
      else
        blocker.disableBlockingInSession(
          session.fromPartition('temp-in-memory')
        )
    })
  })

  session
    .fromPartition('temp-in-memory')
    .setPermissionRequestHandler((webContents, permission, callback) => {
      if (preference.getPreference().blockSpecialPermissions) {
        return callback(false)
      }
      return callback(true)
    })

  session
    .fromPartition('temp-in-memory')
    .setPermissionCheckHandler((webContents, permission) => {
      if (preference.getPreference().blockSpecialPermissions) {
        return false
      }
      return true
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
