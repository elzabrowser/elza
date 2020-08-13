import React from 'react'
import '../assets/css/home.css'
import Controls from './partials/Controls'
import NewTab from './nativePages/NewTab'

import TabGroup from '../electron-tabs'
//const TabGroup = require("../electron-tabs");
import USER_AGENT from '../functions/getUserAgent'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.tabGroup = null
    this.state = {
      tabGroup: null
    }
  }
  componentDidMount() {
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
        partition: 'persist:elzawindow',
        useragent:
          'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0 Elza Browser'
      }
    })
    tab.activate()
  }
  addNewNativeTab = (title, src, comp, icon) => {
    let tab = this.tabGroup.addTab({
      title: title || 'New Tab',
      src: src || '',
      icon: 'fa fa-grip-horizontal' || icon,
      isNative: true,
      comp: comp || NewTab,
      webviewAttributes: {
        useragent:
          USER_AGENT
      }
    })
    tab.activate()
  }

  listenerReady = () => {
    this.loadStartingPage()
  }

  render() {
    return (
      <>
        <div className='etabs-tabgroup'>
          <div className='etabs-tabs'></div>
          <div className='etabs-buttons'>
            <button onClick={() => this.addNewNativeTab()}>+</button>
          </div>
        </div>
        <div className='etabs-views'>
          <Controls
            tabGroup={this.state.tabGroup}
            listenerReady={this.listenerReady}
            addNewNativeTab={this.addNewNativeTab}
          />
        </div>
      </>
    )
  }
}
export default Home
