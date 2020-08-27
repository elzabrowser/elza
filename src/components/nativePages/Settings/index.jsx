import React from 'react'
import './main.css'
import bingImg from '../../../assets/images/icons8-bing-96.png'
import googleImg from '../../../assets/images/icons8-google-96.png'
import duckImg from '../../../assets/images/icons8-duckduckgo-96.png'
import ecosiaImg from '../../../assets/images/icons8-ecosia-96.png'
import yahooImg from '../../../assets/images/yahoo-icon.png'
import yandexImg from '../../../assets/images/yandex-icon.png'
import qwantImg from '../../../assets/images/qwant-icon.png'

const remote = window.require('electron').remote
const app = remote.app
const configFilePath = app.getPath('userData') + '/preferences.json'
const fs = window.require('fs')

class BlankTab extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      pref: {
        searchEngine: 'google'
      }
    }
  }
  privateToggleChange = e => {
    let pref = this.state.pref
    pref.privateMode = !pref.privateMode
    this.setState({ pref })
  }
  searchEngineSelector = e => {
    let pref = this.state.pref
    pref.searchEngine = e
    this.setState({ pref }, this.savePreference)
  }
  componentWillMount() {
    try {
      if (fs.existsSync(configFilePath)) {
        let cfile = window.require(configFilePath)
        console.log(cfile)
        if (cfile.privateMode) this.toggleCheck = true
        this.setState({ pref: cfile })
      }
    } catch (err) {
      console.error(err)
    }
  }
  savePreference = () => {
    console.log(this.state.pref)
    fs.writeFile(configFilePath, JSON.stringify(this.state.pref), err => {
      if (err) throw err
      console.log('Saved!', this.state.pref)
    })
    this.props.handleSearchEngineChange(this.state.pref.searchEngine)
  }

  render() {
    return (
      <div className='settings-container'>
        <div className='border-left container p-5 '>
          <h4>Search engine</h4><br />
          <div className="settings-search-engine-list-ctr">
            <div className="p-1 mr-3">
              <span>Recomended</span>
              <div className="settings-search-engine-list pt-3">
                <img className={this.state.pref.searchEngine === "ddg" ? "active" : null} onClick={() => this.searchEngineSelector("ddg")} title="DuckDuckGo" src={duckImg} />
                <img className={this.state.pref.searchEngine === "ecosia" ? "active" : null} onClick={() => this.searchEngineSelector("ecosia")} title="Ecosia" src={ecosiaImg} />
                <img className={this.state.pref.searchEngine === "google" ? "active" : null} onClick={() => this.searchEngineSelector("google")} title="google" src={googleImg} />
              </div>
            </div>
            <div className="ml-3 p-1">
              <span>Popular</span>
              <div className="settings-search-engine-list pt-3">
                <img className={this.state.pref.searchEngine === "qwant" ? "active" : null} onClick={() => this.searchEngineSelector("qwant")} title="Qwant" src={qwantImg} />
                <img className={this.state.pref.searchEngine === "yandex" ? "active" : null} onClick={() => this.searchEngineSelector("yandex")} title="Yandex" src={yandexImg} />
                <img className={this.state.pref.searchEngine === "bing" ? "active" : null} onClick={() => this.searchEngineSelector("bing")} title="Bing" src={bingImg} />
                <img className={this.state.pref.searchEngine === "yahoo" ? "active" : null} onClick={() => this.searchEngineSelector("yahoo")} title="Yahoo" src={yahooImg} />

              </div>
            </div>
          </div>

          <div className='mt-5 col-lg-8' hidden>
            <button className='btn btn-primary' onClick={this.savePreference}>
              Save
              </button>
          </div>
        </div>
      </div>
    )
  }
}
export default BlankTab
