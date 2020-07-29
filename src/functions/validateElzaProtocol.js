import Sharing from "../components/nativePages/Sharing";
import Osint from "../components/nativePages/Osint";

function open(tabGroup, tab, title, src, comp, icon) {
  let ntab = tabGroup.addTab({
    title: title,
    src: src,
    icon: icon,
    isNative: true,
    comp: comp,
  });
  tab.close()
  ntab.activate()
}
function validateElzaProtocol(tabGroup, tab, url) {
  if (url.startsWith("elza://share"))
    open(tabGroup, tab, "File Sharing", url, Sharing, 'fa fa-share-alt')
  if (url.startsWith("elza://osint"))
    open(tabGroup, tab, "File Sharing", url, Osint, 'fa fa-share-alt')
}
export default validateElzaProtocol