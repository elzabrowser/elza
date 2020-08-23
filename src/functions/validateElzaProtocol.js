import About from '../components/nativePages/about'
import Settings from '../components/nativePages/Settings'
import Downloads from '../components/nativePages/Downloads'

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
  if (url.startsWith('elza://downloads'))
    open(tabGroup, tab, 'Downloads', url, Downloads, 'fa fa-arrow-circle-down')
  if (url.startsWith('elza://about'))
    open(tabGroup, tab, 'About', url, About, 'fa fa-info-circle')
  if (url.startsWith('elza://settings'))
    open(tabGroup, tab, 'About', url, Settings, 'fa fa-cog')
}
export default validateElzaProtocol
