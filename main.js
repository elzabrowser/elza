const { app, BrowserWindow, Menu, session } = require('electron')
const isDev = require('electron-is-dev')
//const electronDl = require('electron-dl')

let mainWindow

app.on('window-all-closed', function () {
  app.quit()
})

Menu.setApplicationMenu(null)

app.on('ready', function () {
  const { screen } = require('electron')
  const electronScreen = screen
  var mainScreen = electronScreen.getPrimaryDisplay()
  var dimensions = mainScreen.size
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    resizable: true,
    minWidth: dimensions.width,
    minHeight: dimensions.height,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      partition: 'persist:elzawindow',
      webSecurity: false
    }
  })
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile('./build/index.html')
    //mainWindow.openDevTools()
  }
  /*  session.defaultSession.on('will-download', (event, item, webContents) => {
    event.preventDefault()
    console.log('ghn')
  }) */
  /* electronDl({
    saveAs: true,
    onStarted: function (item) {
      mainWindow.webContents.send('started', item)
      console.log(item)
    },
    onProgress: function (progress) {
      mainWindow.webContents.send('downloadprogress', progress)
    }
  }) */
})
