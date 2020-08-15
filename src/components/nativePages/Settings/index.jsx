import React from 'react'
import './main.css'
const remote = window.require('electron').remote;
const app = remote.app;
const configFilePath = app.getPath('userData') + "/preferences.json"
const fs = window.require('fs')

class BlankTab extends React.Component {
  constructor(props) {
    super(props)
    console.log(configFilePath)
    this.state = {
      pref: {
        privateMode: false,
        searchEngine: "google"
      }
    }
  }
  privateToggleChange = (e) => {
    let pref = this.state.pref
    pref.privateMode = !pref.privateMode
    this.setState({ pref })
  }
  searchEngineSelector = (e) => {
    let pref = this.state.pref
    pref.searchEngine = e.target.value
    this.setState({ pref })

  }
  componentWillMount() {
    try {
      if (fs.existsSync(configFilePath)) {
        let cfile = window.require(configFilePath)
        console.log(cfile)
        if (cfile.privateMode)
          this.toggleCheck = true
        this.setState({ pref: cfile })
      }
    } catch (err) {
      console.error(err)
    }
  }
  savePreference = () => {
    console.log(this.state.pref)
    fs.writeFile(configFilePath, JSON.stringify(this.state.pref), (err) => {
      if (err) throw err;
      console.log('Saved!', this.state.pref);
    });
  }


  render() {
    return (
      <div className="settings-container">
        <div className="row">
          <div className="col-lg-2 p-4 border-right">

          </div>
          <div className="col-lg-10 p-4 ">
            <div className="p-3 col-lg-8 ">
              <span>Default search engine</span>
              <div className="dropdown">
                <select onChange={this.searchEngineSelector}>
                  <option value="google" selected={this.state.pref.searchEngine === "google"}>Google</option>
                  <option value="ddg" selected={this.state.pref.searchEngine === "ddg"}>DuckDuckGo</option>
                </select>
              </div>
            </div>
            <div className="p-3 col-lg-8">
              <button className="btn btn-primary" onClick={this.savePreference}>
                Save
            </button>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
export default BlankTab
