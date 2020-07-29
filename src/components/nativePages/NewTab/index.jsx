import React from 'react'
import './main.css'
import Sharing from '../Sharing';


class NewTab extends React.Component {
  constructor(props) {
    super(props)

  }

  openInNewTab = (title, src, comp, icon) => {
    let tab = this.props.tabGroup.addTab({
      title: title || "File Sharing",
      src: src || "elza://share",
      icon: 'fa fa-grip-horizontal' || icon,
      isNative: true,
      comp: comp || Sharing,
    });
    this.props.tab.close()
    tab.activate()
  }
  render() {
    return (
      <div className="new-tab-container container-fluid">
        <div className="row p-3">
          <div className="ml-auto text-white">
            <i className="fa fa-cog" />
          </div>
        </div>

        <div className="row">
          <form className="ml-auto mr-auto" onSubmit={this.props.submitURL}>
            <input className="new-tab-search-input shadow" type="text" onChange={this.props.handleChange} placeholder="Search or type in url"></input>
          </form>
        </div>
        <div className="row">
          <button onClick={() => this.openInNewTab()}>File sharing</button>
        </div>
      </div>
    )
  }
}
export default NewTab