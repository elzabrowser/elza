import React from 'react'
import ReactDOM from 'react-dom'
import '../../assets/css/controls.css'
import '../../assets/css/menu.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import getFavicon from '../../functions/getFavicon'
import parseUrlInput from '../../functions/parseUrlInput'
import validateElzaProtocol from '../../functions/validateElzaProtocol'
import { size } from 'custom-electron-titlebar/lib/common/dom'
const contextMenu = window.require('electron-context-menu')
class Controls extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tabGroup: null,
      activeTab: 0,
      tab: null,
      canGoBack: false,
      canGoForward: false,
      tabs: []
    }
  }
  componentWillReceiveProps (newProps) {
    this.setState({ tabGroup: newProps.tabGroup })
    this.tabGroupEvents(newProps.tabGroup)
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
      contextMenu({
        window: tab.webview,
        showSearchWithGoogle: false,
        showInspectElement: false
      })
      tab.setIcon('', 'loader')
    })
    tab.webview.addEventListener('will-navigate', () => {
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
    })
  }
  tabGroupEvents = tabGroup => {
    tabGroup.on('tab-added', (tab, tabGroup) => {
      if (tab.isNative) {
        ReactDOM.render(
          <tab.comp
            submitURL={this.submitURL}
            handleChange={this.handleChange}
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
      if (tab.isNative) {
        document.getElementById('location').value = tab.webviewAttributes.src
        this.setState({ activeTab: tab.id })
        if (tab.isNative) {
          ReactDOM.render(
            <tab.comp
              submitURL={this.submitURL}
              handleChange={this.handleChange}
              tabGroup={tabGroup}
              tab={tab}
            />,
            tab.webview
          )
          document.getElementById('location').value = tab.webviewAttributes.src
        }
      } else {
        this.setState({ activeTab: tab.id })
      }
    })
    this.props.listenerReady()
  }

  handleChange = event => {
    let tabs = [...this.state.tabs]
    tabs[this.state.activeTab].inputURL = event.target.value
    this.setState({ tabs })
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

    url = parseUrlInput(sTab.inputURL)
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
  resetZoom = () => {
    if (this.state.tabs[this.state.activeTab].tab.isNative) return
    this.state.tabs[this.state.activeTab].tab.webview.setZoomLevel(0)
  }
  toggleMainMenu = () => {
    document.getElementById('menuDropdown').classList.toggle('show')
  }
  removeMenu = () => {
    document.getElementById('menuDropdown').classList.remove('show')
  }
  removeCapturePopup = () => {
    document.getElementById('capturePopUp').classList.remove('show')
  }
  toggleCapturePopup = () => {
    document.getElementById('capturePopUp').classList.toggle('show')
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
          <div className='dropdown' onBlur={this.removeCapturePopup}>
            <button
              id='capture'
              title='Capture'
              onClick={this.toggleCapturePopup}
            >
              <i className='fas fa-camera' />
            </button>
            <div id='capturePopUp' className='dropdown-capture'>
              <div className='row col-md-12 '>
                <div className='col-md-4 text-center item'>
                  <i
                    className='fas fa-camera fa-3x'
                    style={{ color: '#556B2F' }}
                  />
                  <p style={{ textAlign: 'center' }}>Capture</p>
                </div>
                <div className='col-md-4 text-center item'>
                  <i
                    className='fas fa-camera fa-3x'
                    style={{ color: '#8B0000' }}
                  />
                  <p style={{ textAlign: 'center' }}>Record</p>
                </div>
                <div className='col-md-4 text-center item'>
                  <i
                    className='fas fa-th-list fa-3x'
                    style={{ color: '#008080' }}
                  />
                  <p style={{ textAlign: 'center' }}>List</p>{' '}
                </div>
              </div>
              <span style={{ fontSize: '12px' }}>
                <i className='fas fa-info-circle '></i> Capture complete page
                information
              </span>
            </div>
          </div>
          <div className='dropdown' onBlur={this.removeMenu}>
            <button id='menu' title='Menu' onClick={this.toggleMainMenu}>
              <i className='fas fa-bars ' />
            </button>
            <div id='menuDropdown' className='dropdown-content'>
              <div>
                <button id='zoomin' title='Zoom In' onClick={this.zoomInWebv}>
                  <i className='fas fa-search-plus' />
                </button>
                <div class='vl'></div>
                <button
                  id='resetzoom'
                  title='Reset Zoom'
                  onClick={this.resetZoom}
                >
                  <i className='fas fa-minus-square' />
                </button>
                <div class='vl'></div>
                <button id='zooout' title='Zoom Out' onClick={this.zoomOutWebv}>
                  <i className='fas fa-search-minus' />
                </button>
              </div>
              <hr />
              <div>Menu Item2</div>
              <hr />
              <div>Menu Item3</div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Controls
