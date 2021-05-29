const { Notification } = require('electron')
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
module.exports = { notify: showNotification }
