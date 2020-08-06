import React from 'react'
import ReactDOM from 'react-dom'
import Capture from './Capture'
import DownloadPopup from './DownloadPopup'
import BlankTab from '../nativePages/BlankTab'
import Sharing from '../nativePages/Sharing'
import ScreenRecorder from '../nativePages/ScreenRecorder'
import '../../assets/css/controls.css'
import '../../assets/css/menu.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import getFavicon from '../../functions/getFavicon'
import parseUrlInput from '../../functions/parseUrlInput'
import validateElzaProtocol from '../../functions/validateElzaProtocol'
import { size } from 'custom-electron-titlebar/lib/common/dom'
const contextMenu = window.require('electron-context-menu')
const remote = window.require('electron').remote
const session = remote.session
session.defaultSession.on('will-download', (event, item, webContents) => {
  event.preventDefault()
  console.log(item)
  console.log(event)
  //alert('ghn')
})
class Controls extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
    this.state = {
      tabGroup: null,
      activeTab: 0,
      tab: null,
      canGoBack: false,
      canGoForward: false,
      tabs: [],
      currentWebView: null,
      popupVisible: false,
      searchEngine: 'google.com'
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({ tabGroup: newProps.tabGroup })
    this.tabGroupEvents(newProps.tabGroup)
  }
  handleOutsideClick (e) {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return
    }

    this.handleClick()
  }
  handleClick () {
    if (!this.state.popupVisible) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false)
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false)
    }

    this.setState(prevState => ({
      popupVisible: !prevState.popupVisible
    }))
  }
  updateTab = tab => {
    let tabs = [...this.state.tabs]
    tabs.push({
      id: tab.id,
      url: tab.webview.src,
      inputURL: tab.webview.src,
      tab
    })
    this.setState({ tabs }, () => {
      if (!tab.isNative) this.tabEvents(tab)
    })
  }
  tabEvents = tab => {
    tab.webview.addEventListener('did-start-loading', () => {
      this.setState({ currentWebView: null })
      contextMenu({
        window: tab.webview,
        showSaveImage: true,
        showSearchWithGoogle: false,
        showInspectElement: false
      })
      tab.setIcon('', 'loader')
    })
    tab.webview.addEventListener('will-navigate', () => {
      this.setState({ currentWebView: null })
      tab.setIcon('', 'loader-rev')
    })
    tab.webview.addEventListener('page-title-updated', () => {
      const newTitle = tab.webview.getTitle()
      tab.setTitle(newTitle)
    })
    tab.webview.addEventListener('did-stop-loading', () => {
      let tabs = [...this.state.tabs]
      tabs[tab.id].url = tab.webview.src
      tabs[tab.id].inputURL = tab.webview.src
      tabs[tab.id].canGoBack = tab.webview.canGoBack()
      tabs[tab.id].canGoForward = tab.webview.canGoForward()
      tab.setIcon(getFavicon(tab.webview.src), '')
      this.setState({ tabs }, () => {
        if (tab.id === this.state.activeTab)
          document.getElementById('location').value = this.state.tabs[
            tab.id
          ]?.url
      })
      console.log(tab.webview)
      this.setState({ currentWebView: tab.webview })
      /* tab.webview
        .getWebContents()
        .session.on('will-download', (event, item, webContents) => {
          event.preventDefault()
          //console.log(item.getFilename)
          //item.setSavePath('/tmp/downloaded.zip')
          //alert('Download!!')
        }) */
    })
    tab.webview.addEventListener('new-window', e => {
      const url = e.url
      let newtab = this.props.tabGroup.addTab({
        src: url,
        isNative: false,
        webviewAttributes: {
          partition: 'persist:elzawindow',
          useragent:
            'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0 Elza Browser'
        }
      })
      //this.props.tab.close()
      newtab.activate()
    })
  }
  tabGroupEvents = tabGroup => {
    tabGroup.on('tab-added', (tab, tabGroup) => {
      if (tab.isNative) {
        ReactDOM.render(
          <tab.comp
            submitURL={this.submitURL}
            handleChange={this.handleChange}
            handleSearchEngineChange={this.handleSearchEngineChange}
            tabGroup={tabGroup}
            tab={tab}
          />,
          tab.webview
        )
        document.getElementById('location').value = tab.webviewAttributes.src
      }
      this.updateTab(tab)
    })

    tabGroup.on('tab-active', (tab, tabGroup) => {
      document.getElementById('location').value = tab.webviewAttributes.src
      this.setState({ activeTab: tab.id })
      if (tab.isNative) {
        ReactDOM.render(
          <tab.comp
            submitURL={this.submitURL}
            handleChange={this.handleChange}
            handleSearchEngineChange={this.handleSearchEngineChange}
            tabGroup={tabGroup}
            tab={tab}
          />,
          tab.webview
        )
      }
    })
    tabGroup.on('tab-removed', (tab, tabGroup) => {
      /* document.getElementById('location').value = tab.webviewAttributes.src
      this.setState({ activeTab: tab.id })
      if (tab.isNative) {
        ReactDOM.render(
          <tab.comp
            submitURL={this.submitURL}
            handleChange={this.handleChange}
            handleSearchEngineChange={this.handleSearchEngineChange}
            tabGroup={tabGroup}
            tab={tab}
          />,
          tab.webview
        )
      } */
      let tabCount = tabGroup.getTabs()
      if (tabCount == 0) {
        let newtab = tabGroup.addTab({
          src: '',
          title: 'Home',
          isNative: true,
          comp: BlankTab,
          webviewAttributes: {
            partition: 'persist:elzawindow',
            useragent:
              'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0 Elza Browser'
          }
        })
        //this.props.tab.close()
        newtab.activate()
      }
    })
    this.props.listenerReady()
  }

  handleChange = event => {
    let tabs = [...this.state.tabs]
    tabs[this.state.activeTab].inputURL = event.target.value
    this.setState({ tabs })
  }
  handleSearchEngineChange = searchEngine => {
    this.setState({ searchEngine: searchEngine })
  }

  submitURL = e => {
    e.preventDefault()
    let id = this.state.activeTab
    let sTab = this.state.tabs[id]
    let url = sTab.inputURL
    if (url.startsWith('elza://')) {
      validateElzaProtocol(this.state.tabGroup, sTab.tab, url)
      return
    }

    url = parseUrlInput(sTab.inputURL, this.state.searchEngine)
    document.getElementById('location').value = url
    console.log(document.getElementById('location').value)

    if (sTab.tab.isNative) {
      sTab.tab.removeNative(url)
      this.tabEvents(sTab.tab)
      sTab.tab.activate()
    } else {
      sTab.tab.webview.loadURL(url)
    }
  }
  goForward = () => {
    this.state.tabs[this.state.activeTab].tab.webview.goForward()
  }
  goBack = () => {
    this.state.tabs[this.state.activeTab].tab.webview.goBack()
  }
  reloadWebv = () => {
    if (this.state.currentWebView == null) return
    this.state.tabs[this.state.activeTab].tab.webview.reload()
  }
  zoomInWebv = () => {
    if (this.state.tabs[this.state.activeTab].tab.isNative) return
    let zoomLevel = this.state.tabs[
      this.state.activeTab
    ].tab.webview.getZoomLevel()
    this.state.tabs[this.state.activeTab].tab.webview.setZoomLevel(
      zoomLevel + 1
    )
  }
  zoomOutWebv = () => {
    if (this.state.tabs[this.state.activeTab].tab.isNative) return
    let zoomLevel = this.state.tabs[
      this.state.activeTab
    ].tab.webview.getZoomLevel()
    this.state.tabs[this.state.activeTab].tab.webview.setZoomLevel(
      zoomLevel - 1
    )
  }
  activeWebView = () => {
    if (this.state.tabs[this.state.activeTab].tab.isNative) return
    this.state.tabs[this.state.activeTab].tab.webview.setZoomLevel(0)
  }
  toggleMainMenu = () => {
    //document.getElementById('menuDropdown').classList.toggle('show')
  }
  removeMenu = () => {
    document.getElementById('menuDropdown').classList.remove('show')
  }
  istabWebview = () => {
    if (this.state.tabs[this.state.activeTab].tab.isNative) return 0
    return 1
  }

  render () {
    return (
      <>
        <div id='controls'>
          <button
            id='back'
            title='Go Back'
            onClick={this.goBack}
            disabled={!this.state.tabs[this.state.activeTab]?.canGoBack}
          >
            <i className='fas fa-chevron-left' />
          </button>
          <button
            id='forward'
            title='Go Forward'
            onClick={this.goForward}
            disabled={!this.state.tabs[this.state.activeTab]?.canGoForward}
          >
            <i className='fas fa-chevron-right' />
          </button>
          {/* <button id="home" onClick={this.goHome} title="Go Home"><i className="fas fa-home" /></button> */}
          <button id='reload' title='Reload' onClick={this.reloadWebv}>
            <i className='fas fa-redo' />
          </button>
          <form id='location-form' onSubmit={this.submitURL}>
            <div id='center-column'>
              <input
                id='location'
                type='text'
                spellCheck='false'
                ref={input => (this.inputField = input)}
                onFocus={() => (this.inputField.value = '')}
                placeholder='Search or type in url'
                onChange={this.handleChange}
                defaultValue={'loading'}
              />
            </div>
            <button id='goButton' type='submit'>
              {this.state.webvIsLoading ? (
                <div className='loader'></div>
              ) : (
                <i className='fas fa-arrow-right' />
              )}
            </button>
          </form>
          <button
            id='sharefile'
            title='Share File'
            onClick={() => {
              this.state.currentWebView = null
              let newtab = this.state.tabGroup.addTab({
                title: 'File Sharing',
                src: 'elza://share',
                icon: 'fa fa-grip-horizontal',
                isNative: true,
                comp: Sharing,
                webviewAttributes: {
                  useragent:
                    'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0 Elza Browser'
                }
              })
              newtab.activate()
            }}
          >
            <i className='fas fa-share-alt' />
          </button>
          {true && (
            <Capture
              currentWebView={this.state.currentWebView}
              tabGroup={this.state.tabGroup}
            />
          )}
          <button
            id='sharefile'
            title='Share File'
            onClick={() => {
              let newtab = this.state.tabGroup.addTab({
                title: 'ScreenRecorder',
                src: 'elza://recorder',
                icon: 'fa fa-grip-horizontal',
                isNative: true,
                comp: ScreenRecorder,
                webviewAttributes: {
                  useragent:
                    'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0 Elza Browser'
                }
              })
              newtab.activate()
            }}
          >
            <i className='fas fa-video' />
          </button>
          {false && <DownloadPopup />}

          {false && (
            <div
              className='dropdown'
              ref={node => {
                this.node = node
              }}
            >
              <button id='menu' title='Menu' onClick={this.handleClick}>
                <i className='fas fa-bars ' />
              </button>
              {this.state.popupVisible && (
                <div id='menuDropdown' className='dropdown-content'>
                  <div>
                    <button
                      id='zoomin'
                      title='Zoom In'
                      onClick={this.zoomInWebv}
                    >
                      <i className='fas fa-search-plus' />
                    </button>
                    <div className='vl'></div>
                    <button
                      id='resetzoom'
                      title='Reset Zoom'
                      onClick={this.activeWebView}
                    >
                      <i className='fas fa-minus-square' />
                    </button>
                    <div className='vl'></div>
                    <button
                      id='zooout'
                      title='Zoom Out'
                      onClick={this.zoomOutWebv}
                    >
                      <i className='fas fa-search-minus' />
                    </button>
                  </div>
                  <hr />
                  <div>Downloads</div>
                  <hr />
                  <div>History</div>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    )
  }
}
export default Controls
