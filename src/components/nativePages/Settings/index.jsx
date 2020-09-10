import React from 'react'
import Downloads from '../Downloads'
import './main.css'
import elzaLogo from '../../../assets/images/icon.png'
import bingImg from '../../../assets/images/icons8-bing-96.png'
import googleImg from '../../../assets/images/dark/google.png'
import duckImg from '../../../assets/images/dark/ddg.png'
import ecosiaImg from '../../../assets/images/dark/ecosia.png'
import yahooImg from '../../../assets/images/yahoo-icon.png'
import yandexImg from '../../../assets/images/yandex-icon.png'
import qwantImg from '../../../assets/images/qwant-icon.png'
import torImg from '../../../assets/images/tor.png'

const { dialog } = window.require('electron').remote
const { ipcRenderer } = window.require('electron')
const remote = window.require('electron').remote
const app = remote.app
const configFilePath = app.getPath('userData') + '/preferences.json'
const fs = window.require('fs')

class BlankTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pref: {
        searchEngine: 'google',
        downloadLocation: app.getPath('downloads')
      },
      sentFeedback: false,
      active: 'settings',
      feedbackData: {},
      version: ''
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
  componentWillReceiveProps(props) {
    if (props.tab.compProps.calledBy === 'downloadpopup')
      this.setState({ active: 'downloads' })
  }
  componentWillMount() {
    try {
      if (fs.existsSync(configFilePath)) {
        let cfile = window.require(configFilePath)
        if (cfile.privateMode) this.toggleCheck = true
        this.setState({ pref: cfile })
      }
    } catch (err) {
      console.error(err)
    }
    ipcRenderer.send('app_version')
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version')
      this.setState({ version: arg.version })
    })
  }
  savePreference = () => {
    fs.writeFile(configFilePath, JSON.stringify(this.state.pref), err => {
      if (err) throw err
    })
    this.props.handleSearchEngineChange(this.state.pref.searchEngine)
  }
  selectDownloadLocation = async () => {
    let pref = this.state.pref
    let path = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if (!path.filePaths[0]) return
    pref.downloadLocation = path.filePaths[0]
    ipcRenderer.send('change_download_setting', pref)
    this.setState({ pref }, this.savePreference)
  }
  handleKeyDown(e) {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
  }
  onchangeHandler = e => {
    let feedback = this.state.feedbackData
    feedback[e.target.name] = e.target.value
    this.setState({
      feedbackData: feedback
    })
  }
  submitFeedback = e => {
    e.preventDefault()
    let feedback = this.state.feedbackData
    console.log(feedback)
    if (feedback) {
      fetch('https://feedback.api.elzabrowser.com/feedback', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
      })
        .then(res => res.json())
        .then(res => {
          console.log(res)
          this.setState({ sentFeedback: true })
        })
    }
  }
  render() {
    return (
      <div className='container-fluid settings-container h-100'>
        <div className='row pt-4'>
          <div className='col-sm-3 vh-100 pl-5 pr-5 border-right border-white'>
            <div className='text-center'>
              <p
                className={
                  this.state.active === 'settings'
                    ? 'h4 mt-1'
                    : 'font-weight-light h4 mt-1'
                }
                onClick={() => {
                  this.setState({ active: 'settings' })
                }}
                role='button'
              >
                Settings
              </p>
              <p
                className={
                  this.state.active === 'downloads'
                    ? 'h4 mt-4'
                    : 'font-weight-light h4 mt-4'
                }
                onClick={() => {
                  this.setState({ active: 'downloads' })
                }}
                role='button'
              >
                Downloads
              </p>
              <p
                className={
                  this.state.active === 'about'
                    ? 'h4 mt-4'
                    : 'font-weight-light h4 mt-4'
                }
                onClick={() => {
                  this.setState({ active: 'about' })
                }}
                role='button'
              >
                About
              </p>
              <div id='logo'>
                <img className='logo' src={elzaLogo} />
                <p className='h6 font-weight-light d-inline'> Elza Browser</p>
              </div>
            </div>
          </div>
          <div
            className='col-sm-9 pl-5'
            style={{ height: '90vh', overflow: 'scroll' }}
          >
            <div className={this.state.active === 'settings' ? '' : 'd-none'}>
              <h4
                className={
                  this.state.sentFeedback ? 'font-weight-light' : 'd-none'
                }
              >
                Thanks!
              </h4>
              <div className={this.state.sentFeedback ? 'd-none' : ''}>
                <h4 className='font-weight-light'>
                  How can we improve Elza Browser?
                </h4>
                <br />
                <div className='feedback rounded'>
                  <form onSubmit={this.submitFeedback}
                  >
                    <textarea
                      className='rounded textarea p-2'
                      rows='2'
                      cols='50'
                      name='description'
                      form='usrform'
                      onChange={this.onchangeHandler}
                      placeholder='Description'
                      onKeyDown={this.handleKeyDown}
                    ></textarea>
                    <hr style={{ borderColor: '#f3f3f3', margin: '0px' }} />
                    <input
                      style={{ width: '470px' }}
                      type='text'
                      name='email'
                      className='rounded textarea pl-2'
                      onChange={this.onchangeHandler}
                      placeholder='Email or Name'
                    ></input>

                    <button
                      role='button'
                      title='Send'
                      type="submit"
                    >
                      <i className='fa fa-chevron-right'></i>
                    </button>
                  </form>
                </div>
              </div>
              <br />
              <hr style={{ borderColor: '#f3f3f3', margin: '0px' }} />
              <br />
              <h4 className='font-weight-light'>Search Engine</h4>
              <div className='settings-search-engine-list-ctr'>
                <div className='p-1 mr-3'>
                  <div className='settings-search-engine-list pt-3'>
                    <img
                      className={
                        this.state.pref.searchEngine === 'ddg' ? 'active' : null
                      }
                      onClick={() => this.searchEngineSelector('ddg')}
                      title='DuckDuckGo'
                      src={duckImg}
                      alt='DuckDuckGo'
                    />
                    <img
                      className={
                        this.state.pref.searchEngine === 'ecosia'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('ecosia')}
                      title='Ecosia'
                      src={ecosiaImg}
                      alt='Ecosia'
                    />
                    <img
                      className={
                        this.state.pref.searchEngine === 'google'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('google')}
                      title='google'
                      src={googleImg}
                      alt='Google'
                    />
                  </div>
                </div>
                <div className='ml-3 p-1 d-none'>
                  <div className='settings-search-engine-list pt-3'>
                    <img
                      className={
                        this.state.pref.searchEngine === 'qwant'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('qwant')}
                      title='Qwant'
                      src={qwantImg}
                      alt='Qwant'
                    />
                    <img
                      className={
                        this.state.pref.searchEngine === 'yandex'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('yandex')}
                      title='Yandex'
                      src={yandexImg}
                      alt='Yandex'
                    />
                    <img
                      className={
                        this.state.pref.searchEngine === 'bing'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('bing')}
                      title='Bing'
                      src={bingImg}
                      alt='Bing'
                    />
                    <img
                      className={
                        this.state.pref.searchEngine === 'yahoo'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('yahoo')}
                      title='Yahoo'
                      src={yahooImg}
                      alt='Yahoo'
                    />
                  </div>
                </div>
              </div>
              <br />
              <br />
              <h4 className='font-weight-light'>Download Location</h4>
              <br />
              <button
                className={
                  this.state.pref.downloadLocation !== 'ask'
                    ? 'download download-active'
                    : 'download'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.downloadLocation = app.getPath('downloads')
                  ipcRenderer.send('change_download_setting', pref)
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Custom
              </button>
              <button
                className={
                  this.state.pref.downloadLocation === 'ask'
                    ? 'ml-4 download download-active'
                    : 'ml-4 download'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.downloadLocation = 'ask'
                  ipcRenderer.send('change_download_setting', pref)
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Ask Everytime
              </button>
              <br />
              <button
                className={
                  this.state.pref.downloadLocation !== 'ask'
                    ? 'mt-3 download'
                    : 'd-none'
                }
                onClick={() => this.selectDownloadLocation()}
                style={{ width: '80%', textAlign: 'left' }}
              >
                {this.state.pref.downloadLocation}
              </button>
              <br />
              <br />
              <p className='small font-weight-light'>
                <i className='fa fa-info-circle mr-2'></i> Download preference
                changes will be reflected on next start.
              </p>
              <br />
              <div className='d-none'>
                <h4 className='font-weight-light'>Tor Proxy</h4>
                <br />
                <button
                  className='settings-tor-button'
                  onClick={() => {
                    var pref = { ...this.state.pref }
                    pref.isTorEnabled = !pref.isTorEnabled
                    this.setState({ pref }, this.savePreference)
                  }}
                >
                  {this.state.pref.isTorEnabled ? 'Disable' : 'Enable'}
                </button>
                <img
                  src={torImg}
                  className={
                    this.state.pref.isTorEnabled
                      ? 'settings-tor-icon'
                      : 'settings-tor-icon settings-tor-icon-inactive'
                  }
                />

                <small className='ml-3 text-muted'>
                  status:{' '}
                  {this.state.pref.isTorEnabled
                    ? 'Channeling traffic to Tor port 9050'
                    : 'Disabled'}
                </small>
                <br />
                <br />
                <p className='small font-weight-light'>
                  <i className='fa fa-info-circle mr-2'></i> Tor preference
                  changes will be reflected on next start.
                </p>
                <p className='small font-weight-light'>
                  <i className='fa fa-info-circle mr-2'></i>
                  Tor service must be running on 127.0.0.1:9050
                </p>
              </div>
            </div>
            <div className={this.state.active === 'downloads' ? '' : 'd-none'}>
              <Downloads calledBy='settings' />
            </div>
            <div className={this.state.active === 'about' ? '' : 'd-none'}>
              <h5>Elza Browser</h5>
              <br />
              <p className='small'>Version {this.state.version}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default BlankTab
