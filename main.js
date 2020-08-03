const { app, BrowserWindow, Menu } = require('electron')
const isDev = require('electron-is-dev')

let mainWindow

app.on('window-all-closed', function () {
  app.quit()
})

Menu.setApplicationMenu(null)

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1200,
    height: 600,
    resizable: true,
    minWidth: 1000,
    minHeight: 1000,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      partition: 'persist:elzawindow',
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
})
