var USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64; rv:VERSION) Gecko/20100101 Firefox/VERSION'
var currentVersion = '90.0'
if (process.platform === 'win32')
  USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:VERSION) Gecko/20100101 Firefox/VERSION'
else if (process.platform === 'darwin')
  USER_AGENT =
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.10; rv:VERSION) Gecko/20100101 Firefox/VERSION'
export default USER_AGENT.replaceAll('VERSION', currentVersion)
