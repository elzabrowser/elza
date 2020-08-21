import React from 'react'
import '../assets/css/home.css'
import Controls from './partials/Controls'
import NewTab from './nativePages/NewTab'
import TabGroup from '../electron-tabs'
//const TabGroup = require("../electron-tabs");
import USER_AGENT from '../functions/getUserAgent'
import BlankTab from './nativePages/BlankTab'
const { remote } = window.require('electron')

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.tabGroup = null
    this.state = {
      tabGroup: null,
      theme: 'light-theme'
    }
  }
  componentDidMount () {
    this.tabGroup = new TabGroup()
    this.setState({ tabGroup: this.tabGroup })
  }
  loadStartingPage = () => {
    this.addNewNativeTab()
  }
  addTab = () => {
    let tab = this.tabGroup.addTab({
      title: 'New Tab',
      src: 'https://www.google.com',
      visible: false,
      icon: 'loader',
      isNative: false,
      webviewAttributes: {
        useragent:
          'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0 Elza Browser'
      }
    })
    tab.activate()
  }
  addNewNativeTab = (title, src, comp, icon) => {
    let tab = this.tabGroup.addTab({
      title: title || 'Home',
      src: src || '',
      icon: 'fa fa-grip-horizontal' || icon,
      isNative: true,
      comp: comp || BlankTab,
      webviewAttributes: {
        useragent: USER_AGENT
      }
    })
    tab.activate()
  }
  changeTheme = theme => {
    if (this.state.theme == 'dark-theme')
      this.setState({ theme: 'light-theme' })
    else this.setState({ theme: 'dark-theme' })
  }

  listenerReady = () => {
    this.loadStartingPage()
  }

  render () {
    return (
      <>
        <div className={this.state.theme}>
          <div
            //to drag the frameless window
            className='etabs-tabgroup'
          >
            <div className='etabs-tabs'></div>
            <div className='etabs-buttons'>
              <button onClick={() => this.addNewNativeTab()}>+</button>
            </div>
            <div className='windowactions etabs-buttons'>
              <button
                className='pr-2 pl-2'
                onClick={() =>
                  remote.BrowserWindow.getFocusedWindow().minimize()
                }
              >
                <i className='fas fa-window-minimize'></i>
              </button>
              <button
                className='pr-2 pl-2'
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
                className='closebutton pr-2 pl-2'
                onClick={() => remote.BrowserWindow.getFocusedWindow().close()}
              >
                X
              </button>
            </div>
          </div>
          <div className='etabs-views'>
            <Controls
              tabGroup={this.state.tabGroup}
              listenerReady={this.listenerReady}
              addNewNativeTab={this.addNewNativeTab}
              changeTheme={this.changeTheme}
            />
          </div>
        </div>
      </>
    )
  }
}
export default Home
