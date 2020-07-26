import React from 'react'
import "../assets/css/home.css"
import loadTitle from '../functions/loadTitle';
import Controls from './partials/Controls';
import NativePages from './NativePages';
import NewTab from './nativePages/NewTab';


const TabGroup = require("../electron-tabs");

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.tabGroup = null
    this.state = {
      tabGroup: null
    }
  }
  componentDidMount() {
    this.tabGroup = new TabGroup();
    this.setState({ tabGroup: this.tabGroup })

  }
  loadStartingPage = () => {
    this.addNewNativeTab()
  }
  addTab = () => {
    let tab = this.tabGroup.addTab({
      title: "New Tab",
      src: "https://www.google.com",
      visible: false,
      icon: 'loader',
      isNative: false,
    });
    tab.activate()
  }
  addNewNativeTab = (title, src, comp, icon) => {
    let tab = this.tabGroup.addTab({
      title: title || "New Tab",
      src: src || "elza://newtab",
      icon: 'fa fa-grip-horizontal' || icon,
      isNative: true,
      comp: comp || NewTab,
    });
    tab.activate()
  }


  listenerReady = () => {
    this.loadStartingPage()
  }

  render() {
    return (
      <>
        <div className="etabs-tabgroup">
          <div className="etabs-tabs"></div>
          <div className="etabs-buttons">
            <button onClick={() => this.addNewNativeTab()}>+</button>
          </div>
        </div>
        <div className="etabs-views">
        
          <Controls tabGroup={this.state.tabGroup} listenerReady={this.listenerReady} />
          
        </div>
      </>
    );
  }
}
export default Home