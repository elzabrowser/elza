const remote = window.require('electron').remote
const app = remote.app
var userDataPath = app.getPath('userData')
var Datastore = window.require('nedb'),
  db = new Datastore({ filename: userDataPath + '/captures', autoload: true })

var saveCapture = function (data, callback) {
  db.insert(data, function (err, docs) {
    if (err) console.log('cant save data')
    else {
      // callback()
    }
  })
}

var listCaptures = function () {
  return new Promise(function (resolve, reject) {
    db.find({}, function (err, docs) {
      if (err) reject(err)
      else {
        let sorteddocs = Object.keys(docs)
          .sort((a, b) => {
            return docs[b].timeStamp - docs[a].timeStamp
          })
          .map(key => docs[key])
        resolve(sorteddocs)
      }
    })
  })
}

module.exports = { saveCapture, listCaptures }
