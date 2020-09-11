import React from 'react'
import '../assets/css/home.css'
import Controls from './partials/Controls'
import TabGroup from '../electron-tabs'
//const TabGroup = require("../electron-tabs");
import USER_AGENT from '../functions/getUserAgent'
import BlankTab from './nativePages/BlankTab'
const { ipcRenderer, remote } = window.require('electron')

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.tabGroup = null
    this.state = {
      tabGroup: null,
      theme: 'dark-theme',
      isFullScreen: false
    }
  }
  componentDidMount() {
    this.tabGroup = new TabGroup()
    this.setState({ tabGroup: this.tabGroup })
    ipcRenderer.on('update_available', () => {
      ipcRenderer.removeAllListeners('update_available')
      alert('update available')
    })
    ipcRenderer.on('openin_newtab', (event, url) => {
      let tab = this.tabGroup.addTab({
        title: 'Loading...',
        src: url,
        isNative: false,
        webviewAttributes: {
          useragent: USER_AGENT,
          plugins: null
        }
      })
      tab.activate()
    })
  }
  loadStartingPage = () => {
    this.addNewNativeTab()
  }

  addNewNativeTab = (title, src, comp, icon) => {
    let tab = this.tabGroup.addTab({
      title: title || 'Home',
      src: src || '',
      icon: 'fa fa-grip-horizontal' || icon,
      iconURL: 'icon.png',
      isNative: true,
      comp: comp || BlankTab,
      webviewAttributes: {
        plugins: null,
        useragent: USER_AGENT
      }
    })
    tab.activate()
  }
  changeTheme = () => {
    if (this.state.theme === 'dark-theme')
      this.setState({ theme: 'light-theme' })
    else this.setState({ theme: 'dark-theme' })
  }
  changeFullscreen = () => {
    //this.setState({ isFullScreen: true })
  }

  listenerReady = () => {
    this.loadStartingPage()
  }

  render() {
    return (
      <>
        <div className='dark-theme'>
          <div
            className={
              this.state.isFullScreen
                ? 'etabs-tabgroup d-none'
                : 'etabs-tabgroup'
            }
          >
            <div className='etabs-tabs'></div>
            <div className='etabs-buttons'>
              <button onClick={() => this.addNewNativeTab()}>+</button>
            </div>
            <div className='windowactions'>
              <button
                className='min'
                onClick={() =>
                  remote.BrowserWindow.getFocusedWindow().minimize()
                }
              >
                <i className='fas fa-window-minimize'></i>
              </button>
              <button
                className='max'
                onClick={() => {
                  var window = remote.BrowserWindow.getFocusedWindow()
                  remote.BrowserWindow.getFocusedWindow().isMaximized()
                    ? window.unmaximize()
                    : window.maximize()
                }}
              >
                <i className='far fa-window-maximize'></i>
              </button>
              <button
                className='cls'
                onClick={() => remote.BrowserWindow.getFocusedWindow().close()}
              >
                <i className='fas fa-times'></i>
              </button>
            </div>
          </div>
          <div className='etabs-views'>
            <Controls
              tabGroup={this.state.tabGroup}
              listenerReady={this.listenerReady}
              addNewNativeTab={this.addNewNativeTab}
              changeTheme={this.changeTheme}
              changeFullscreen={this.changeFullscreen}
            />
          </div>
        </div>
      </>
    )
  }
}
export default Home
