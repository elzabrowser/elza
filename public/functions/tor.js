const { app } = require('electron')
const path = require('path')

/*spawn the tor process by executing the tor binary bundled with elza*/
async function connect_tor () {
  const root = process.cwd()
  const { isPackaged } = app
  var execPath
  if (process.platform === 'darwin') {
    if (isPackaged)
      execPath = path.join(process.resourcesPath, 'mac', 'tor', 'tor')
    else execPath = path.join(root, './resources', 'mac', 'tor', 'tor')
  }
  if (process.platform === 'win32') {
    if (isPackaged)
      execPath = path.join(process.resourcesPath, 'win', 'Tor', 'tor.exe')
    else execPath = path.join(root, './resources', 'win', 'Tor', 'tor.exe')
  }
  if (process.platform === 'linux') {
    if (isPackaged)
      execPath = path.join(process.resourcesPath, 'lin', 'tor', 'tor')
    else execPath = path.join(root, './resources', 'lin', 'tor', 'tor')
  }
  console.log(execPath)
  spawn = require('child_process').spawn
  var child = spawn(execPath, {}, {})
  var scriptOutput = ''

  child.stdout.setEncoding('utf8')
  child.stdout.on('data', function (data) {
    data.search('100%')
    console.log('stdout: ' + data)
    data = data.toString()
    scriptOutput += data
  })

  child.stderr.setEncoding('utf8')
  child.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
    data = data.toString()
    scriptOutput += data
  })

  child.on('close', function (code) {
    console.log('closing code: ' + code)
    console.log('Full output of script: ', scriptOutput)
  })
}
connect_tor()
