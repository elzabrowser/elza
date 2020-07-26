const { app, BrowserWindow, Menu } = require('electron')
const isDev = require('electron-is-dev')

let mainWindow

app.on('window-all-closed', function () {
  app.quit()
})

Menu.setApplicationMenu(null)

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1366,
    minHeight: 720,
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