import Settings from '../components/nativePages/Settings'
import Downloads from '../components/nativePages/Downloads'

function open (tabGroup, tab, title, src, comp, icon) {
  let ntab = tabGroup.addTab({
    title: title,
    src: src,
    icon: icon,
    isNative: true,
    comp: comp
  })
  tab.close()
  ntab.activate()
}
function validateElzaProtocol (tabGroup, tab, url) {
  if (url.startsWith('elza://downloads'))
    open(tabGroup, tab, 'Downloads', url, Downloads, 'fa fa-arrow-circle-down')
  if (url.startsWith('elza://settings'))
    open(tabGroup, tab, 'Settings', url, Settings, 'fa fa-cog')
}
export default validateElzaProtocol
