//const remote = window.require('electron').remote
//const app = remote.app
//const configFilePath = app.getPath('userData') + '/preferences.json'
//const fs = window.require('fs')

var defaultSearchEngine = 'google'
var SEurl = {
  google: 'https://www.google.com/search?q=SEARCH_KW',
  ddg: 'https://duckduckgo.com/?q=SEARCH_KW',
  ecosia: 'https://www.ecosia.org/search?q=SEARCH_KW',
  qwant: 'https://www.qwant.com/?q=SEARCH_KW&t=web',
  yandex: 'https://yandex.com/search/?text=SEARCH_KW',
  bing: 'https://www.bing.com/search?q=SEARCH_KW',
  yahoo: 'https://search.yahoo.com/search?p=SEARCH_KW'
}
function isValidURL (str) {
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
function addhttp (url) {
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url
  }
  return url
}
function updateConfig () {/*
  try {
    if (fs.existsSync(configFilePath)) {
      let cfile = window.require(configFilePath)
      if (cfile.isTorEnabled) defaultSearchEngine = 'ddg'
      else defaultSearchEngine = cfile.searchEngine
    }
  } catch (err) {
    console.error(err)
  }*/
}
updateConfig()

function parseUrlInput (url, searchEngine = defaultSearchEngine) {
  if (isValidURL(url)) {
    return addhttp(url)
  }
  searchEngine = searchEngine || defaultSearchEngine
  return SEurl[searchEngine].replace('SEARCH_KW', url)
}
export default parseUrlInput
