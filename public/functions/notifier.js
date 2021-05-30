const { app } = require('electron')
const { Notification } = require('electron')
const semver = require('semver')
const preference = require('./config')
const getJSON = require('get-json')
const notificationURL = 'https://elzabrowser.com/notifications.json'
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
  try {
    let version = app.getVersion()
    getJSON(notificationURL, function (error, notifications) {
      if (error) return
      console.log(notifications)
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
    })
  } catch (e) {
    console.log(e)
  }
}

app.on('ready', function () {
  setTimeout(() => {
    checkMessages()
  }, 0)
})

module.exports = { notify: showNotification, checkMessages: checkMessages }
