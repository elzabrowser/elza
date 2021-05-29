const { autoUpdater } = require('electron-updater')
const preference = require('./config')
const notifier = require('./notifier')
const log = require('electron-log')
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false
updatePreferene = preference.getPreference('updateMethod').updateMethod
if (updatePreferene == 'auto') autoUpdater.checkForUpdatesAndNotify()
else if (updatePreferene == 'notify') {
  autoUpdater.checkForUpdates()
  autoUpdater.on('update-available', info => {
    notifier.notify(
      'Update available',
      'New version of Elza Browser is available, click here to update in the background.',
      () => {
        notifier.notify(
          'Updating...',
          'We will notify you when update is ready, feel free to use Elza.',
          null
        )
        autoUpdater.autoDownload = true
        autoUpdater.checkForUpdatesAndNotify()
      }
    )
  })
}
autoUpdater.on('error', error => {
  console.log(error)
})
