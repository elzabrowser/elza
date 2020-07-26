import React from 'react'
import ReactDOM from 'react-dom'
import '../../assets/css/controls.css'
import getFavicon from '../../functions/getFavicon'
import parseUrlInput from '../../functions/parseUrlInput'
import NativePages from '../NativePages'
class Controls extends React.Component {
  constructor(props) {
    super(props)
    this.tabGroup = null
    this.state = {
      activeTab: 0,
      tab: null,
      canGoBack: false,
      canGoForward: false,
      tabs: []
    }
  }
  componentWillReceiveProps(newProps) {
    this.tabGroupEvents(newProps.tabGroup)
  }

  updateTab = (tab) => {
    let tabs = [...this.state.tabs];
    tabs.push({
      id: tab.id,
      url: tab.webview.src,
      inputURL: tab.webview.src,
      tab
    });
    this.setState({ tabs }, () => this.tabEvents(tab))
  }
  tabEvents = (tab) => {
    tab.webview.addEventListener('did-start-loading', () => {
      tab.setIcon('', 'loader')
    })
    tab.webview.addEventListener('will-navigate', () => {
      tab.setIcon('', 'loader-rev')
    })
    tab.webview.addEventListener('page-title-updated', () => {
      const newTitle = tab.webview.getTitle();
      tab.setTitle(newTitle);
    });
    tab.webview.addEventListener('did-stop-loading', () => {
      let tabs = [...this.state.tabs];
      tabs[tab.id].url = tab.webview.src;
      tabs[tab.id].inputURL = tab.webview.src
      tabs[tab.id].canGoBack = tab.webview.canGoBack()
      tabs[tab.id].canGoForward = tab.webview.canGoForward()
      tab.setIcon(getFavicon(tab.webview.src), '')
      this.setState({ tabs }, () => {
        if (tab.id === this.state.activeTab)
          document.getElementById('location').value = this.state.tabs[tab.id]?.url
      })
    });

  }
  tabGroupEvents = (tabGroup) => {
    tabGroup.on("tab-added", (tab, tabGroup) => {
      if (tab.isNative) {
        ReactDOM.render(<tab.comp submitURL={this.submitURL}/>, tab.webview);
        document.getElementById('location').value = tab.webviewAttributes.src
      }

      this.updateTab(tab)
    });

    tabGroup.on("tab-active", (tab, tabGroup) => {
      console.log(tab)
      if (tab.isNative) {
        document.getElementById('location').value = tab.webviewAttributes.src
        this.setState({ activeTab: tab.id })
      } else {
        this.setState({ activeTab: tab.id })
        document.getElementById('location').value = this.state.tabs[tab.id]?.url
      }

    });

    this.props.listenerReady()
  }
  handleChange = (event) => {
    let tabs = [...this.state.tabs];
    tabs[this.state.activeTab].inputURL = event.target.value
    this.setState({ tabs })
  }


  submitURL = (e) => {
    e.preventDefault()
    let id = this.state.activeTab
    let sTab = this.state.tabs[id]
    let url = parseUrlInput(sTab.inputURL)
    document.getElementById('location').value = url
    if (sTab.tab.isNative) {
      sTab.tab.removeNative(url)
      this.tabEvents(sTab.tab)
      console.log("native")
      sTab.tab.activate()
    } else {
      console.log(sTab.tab)
        ;
      sTab.tab.webview.loadURL(url);
    }
  }
  goForward = () => {
    this.state.tabs[this.state.activeTab].tab.webview.goForward();
  }
  goBack = () => {
    this.state.tabs[this.state.activeTab].tab.webview.goBack();
  }
  reloadWebv = () => {
    this.state.tabs[this.state.activeTab].tab.webview.reload();
  }

  render() {
    return (
      <>
        <div id="controls">

          <button id="back" title="Go Back" onClick={this.goBack} disabled={!this.state.tabs[this.state.activeTab]?.canGoBack}><i className="fas fa-chevron-left" /></button>
          <button id="forward" title="Go Forward" onClick={this.goForward} disabled={!this.state.tabs[this.state.activeTab]?.canGoForward}><i className="fas fa-chevron-right" /></button>
          {/* <button id="home" onClick={this.goHome} title="Go Home"><i className="fas fa-home" /></button> */}
          <button id="reload" title="Reload" onClick={this.reloadWebv}><i className="fas fa-redo" /></button>
          <form id="location-form" onSubmit={this.submitURL}>
            <div id="center-column">
              <input id="location" type="text" onChange={this.handleChange} defaultValue={"loading"} />
            </div>
            <button id="goButton" type="submit" >{this.state.webvIsLoading ? <div className="loader"></div> : <i className="fas fa-arrow-right" />}</button>
          </form>
        </div>
      </>
    );
  }
}
export default Controls