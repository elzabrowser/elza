const { app } = require('electron')
const path = require('path')

module.exports = {
  connect_tor: function () {
    const IS_PROD = process.env.NODE_ENV === 'production'
    const root = process.cwd()
    const { isPackaged, getAppPath } = app
    const binariesPath =
      IS_PROD && isPackaged
        ? path.join(
            path.dirname(getAppPath()),
            '..',
            './Resources',
            'win',
            'tor'
          )
        : path.join(root, './resources', 'win', 'Tor')
    const execPath = path.resolve(path.join(binariesPath, './tor.exe'))
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
}
