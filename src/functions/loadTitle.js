function loadTitle(tab) {
  let webview = tab.webview
  webview.addEventListener('page-title-updated', () => {
    const newTitle = webview.getTitle();
    tab.setTitle(newTitle);
  });
}
export default loadTitle