import Sharing from '../components/nativePages/Sharing'
import Osint from '../components/nativePages/Osint'
import ScreenRecorder from '../components/nativePages/ScreenRecorder'
import About from '../components/nativePages/about'
import Settings from '../components/nativePages/Settings'

function open(tabGroup, tab, title, src, comp, icon) {
  let ntab = tabGroup.addTab({
    title: title,
    src: src,
    icon: icon,
    isNative: true,
    comp: comp,
    webviewAttributes: {
      useragent:
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0 Elza Browser'
    }
  })
  tab.close()
  ntab.activate()
}
function validateElzaProtocol(tabGroup, tab, url) {
  if (url.startsWith('elza://share'))
    open(tabGroup, tab, 'File Sharing', url, Sharing, 'fa fa-share-alt')
  if (url.startsWith('elza://osint'))
    open(tabGroup, tab, 'File Sharing', url, Osint, 'fa fa-share-alt')
  if (url.startsWith('elza://recorder'))
    open(tabGroup, tab, 'ScreenRecorder', url, ScreenRecorder, 'fa fa-share-alt')
  if (url.startsWith('elza://about'))
    open(tabGroup, tab, 'About', url, About, 'fa fa-info-circle')
  if (url.startsWith('elza://settings'))
    open(tabGroup, tab, 'About', url, Settings, 'fa fa-cog')


}
export default validateElzaProtocol
