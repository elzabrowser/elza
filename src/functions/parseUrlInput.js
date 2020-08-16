const remote = window.require('electron').remote
const app = remote.app;
const configFilePath = app.getPath('userData') + "/preferences.json"
const fs = window.require('fs')

var defaultSearchEngine = "www.google.com"
function isValidURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}
function addhttp(url) {
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url
  }
  return url
}
function updateConfig() {
  try {
    if (fs.existsSync(configFilePath)) {
      let cfile = window.require(configFilePath)
      console.log(cfile)
      defaultSearchEngine = cfile.searchEngine
    }
  } catch (err) {
    console.error(err)
  }
}
updateConfig()

function parseUrlInput(url, searchEngine = defaultSearchEngine) {
  searchEngine = searchEngine || defaultSearchEngine
  if (isValidURL(url)) {
    return addhttp(url)
  }
  return 'https://' + searchEngine + '/search?q=' + url
}
export default parseUrlInput
