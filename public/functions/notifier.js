const { app } = require('electron')
const { Notification } = require('electron')
const fs = require('fs')
const semver = require('semver')
const preference = require('./config')
function showNotification (title, message, callback) {
  var notification = new Notification({
    title: title,
    body: message
  })
  notification.show()
  notification.on('click', () => {
    if (callback) callback()
  })
}

function checkMessages () {
  let version = app.getVersion()
  console.log(version)
  let notifications = JSON.parse(fs.readFileSync('notification.json', 'utf8'))
  visitedNotifications = preference.getPreference().notifications
  for (let notification in notifications) {
    if (
      !visitedNotifications.includes(notification) &&
      (notifications[notification].versions.includes('all') ||
        notifications[notification].versions.includes(version) ||
        (notifications[notification].olderthan &&
          semver.lte(version, notifications[notification].olderthan)))
    ) {
      console.log(notification)
      showNotification(
        notifications[notification].title,
        notifications[notification].message,
        () => {
          preference.setPreference(
            'notifications',
            visitedNotifications.concat(notification)
          )
        }
      )
    }
  }
}
app.on('ready', function () {
  setTimeout(() => {
    checkMessages()
  }, 0)
})

module.exports = { notify: showNotification, checkMessages: checkMessages }
