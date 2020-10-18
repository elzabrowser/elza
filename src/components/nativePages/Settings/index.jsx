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

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pref: {
        searchEngine: 'google',
        downloadLocation: app.getPath('downloads')
      },
      sentFeedback: 'no',
      downloadPreferenceChanged: false,
      torPreferenceChanged: false,
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
  openUrl = url => {
    let newtab = this.props.tabGroup.addTab({
      src: url,
      title: 'Loading...',
      isNative: false
    })
    newtab.activate()
  }
  componentWillReceiveProps (props) {
    console.log(props)
    if (props.tab.compProps.calledBy === 'downloadpopup')
      this.setState({ active: 'downloads' })
  }
  componentWillMount () {
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
    this.setState({ downloadPreferenceChanged: true })
    let pref = this.state.pref
    let path = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if (!path.filePaths[0]) return
    pref.downloadLocation = path.filePaths[0]
    ipcRenderer.send('change_download_setting', pref)
    this.setState({ pref }, this.savePreference)
  }
  handleKeyDown (e) {
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
    this.setState({ sentFeedback: 'sending' })
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
          this.setState({ sentFeedback: 'yes' })
          this.refs.email.value = ''
          this.refs.description.value = ''
          setTimeout(() => {
            this.setState({ sentFeedback: 'no' })
          }, 3000)
        })
    }
  }
  render () {
    return (
      <div className='container-fluid settings-container h-100'>
        <div className='row pt-4'>
          <div className='sidebar col-sm-3 col-xs-3 vh-100 pt-2 ml-5 pl-4 mr-3 border-right border-white'>
            <p
              className={
                this.state.active === 'settings'
                  ? 'h5 mt-1 scalefont'
                  : 'font-weight-light h5 mt-1 scalefont'
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
                  ? 'h5 pt-4 scalefont'
                  : 'font-weight-light h5 pt-4 scalefont'
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
                  ? 'h5 pt-4 scalefont'
                  : 'font-weight-light h5 pt-4 scalefont'
              }
              onClick={() => {
                this.setState({ active: 'about' })
              }}
              role='button'
            >
              About
            </p>
            <div
              id='logo'
              role='button'
              className='text-center'
              onClick={() => {
                this.openUrl('https://elzabrowser.com/')
              }}
            >
              <img className='logo' src={elzaLogo} />
              <p className='h6 font-weight-light d-inline mb-0 ml-1'>
                Elza Browser
              </p>
            </div>
          </div>
          <div className='col-sm-7 col-xs-6 right-container'>
            <div
              className={this.state.active === 'settings' ? 'pl-4' : 'd-none'}
            >
              <div>
                <h5 className='font-weight-light'>
                  How can we improve Elza Browser?
                </h5>
                <br />
                <div className='feedback rounded'>
                  <form onSubmit={this.submitFeedback}>
                    <textarea
                      className='rounded textarea p-3'
                      rows='2'
                      name='description'
                      ref='description'
                      form='usrform'
                      onChange={this.onchangeHandler}
                      placeholder='Congratulations and thanks for being our pre-release tester. Please tell us your thoughts...'
                      onKeyDown={this.handleKeyDown}
                      required
                    ></textarea>
                    <hr />
                    <input
                      type='text'
                      name='email'
                      ref='email'
                      className='rounded textarea pl-3 feedback-email'
                      onChange={this.onchangeHandler}
                      placeholder='email or name'
                    ></input>

                    <button
                      className='mt-1 mr-2'
                      role='button'
                      title='Send'
                      type='submit'
                    >
                      <i
                        className={
                          this.state.sentFeedback == 'no'
                            ? 'fa fa-chevron-right'
                            : this.state.sentFeedback == 'yes'
                            ? 'fa fa-check'
                            : 'fas fa-circle-notch fa-spin'
                        }
                      ></i>
                    </button>
                  </form>
                </div>
              </div>
              <br />
              <br />
              <div className=''>
                <h5 className='font-weight-light'>Onion Router</h5>
                <button
                  className='settings-tor-button mt-3'
                  onClick={() => {
                    var pref = { ...this.state.pref }
                    this.setState({ torPreferenceChanged: true })
                    pref.isTorEnabled = !pref.isTorEnabled
                    this.setState({ pref }, this.savePreference)
                    ipcRenderer.send('torwindow')
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
                <p
                  className={
                    true || this.state.torPreferenceChanged
                      ? 'small font-weight-light mt-1'
                      : 'd-none'
                  }
                >
                  <i className='fa fa-info-circle mr-2'></i> This will close
                  your current window.
                </p>
              </div>
              <h5 className='font-weight-light mt-5'>Search Engine</h5>
              <div className='settings-search-engine-list-ctr mt-2'>
                <div className='mr-3'>
                  <div className='settings-search-engine-list pt-3'>
                    <img
                      className={
                        this.state.pref.searchEngine === 'ddg' ? 'active' : null
                      }
                      onClick={() => this.searchEngineSelector('ddg')}
                      title='DuckDuckGo: Search engine that emphasizes protecting searchers privacy.'
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
                      title='Ecosia: Search engine that donates 80% of its profits to nonprofit organizations that focus on reforestation.'
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
                      title='Google: Most used search engine on the World Wide Web.'
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
              <h5 className='font-weight-light mt-5'>Download Location</h5>
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
                  this.setState({ downloadPreferenceChanged: true })
                  var pref = { ...this.state.pref }
                  pref.downloadLocation = 'ask'
                  ipcRenderer.send('change_download_setting', pref)
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Ask Everytime
              </button>
              <button
                className={
                  this.state.pref.downloadLocation !== 'ask'
                    ? 'mt-3 download download-location'
                    : 'd-none'
                }
                onClick={() => this.selectDownloadLocation()}
              >
                {this.state.pref.downloadLocation}
              </button>
              <br />
              <p
                className={
                  this.state.downloadPreferenceChanged
                    ? 'small font-weight-light pt-1'
                    : 'd-none'
                }
              >
                <i className='fa fa-info-circle mr-2'></i> Restart Elza for
                changes to take effect.
              </p>
              <br />
              <br />
            </div>
            <div className={this.state.active === 'downloads' ? '' : 'd-none'}>
              <Downloads calledBy='settings' />
              <br />
              <br />
            </div>
            <div className={this.state.active === 'about' ? 'p-3' : 'd-none'}>
              <h5 className='mb-1'>Elza Browser</h5>
              <p className='text-color-secondary'>
                Version: {this.state.version} (Prerelease)
              </p>
              <br />

              <button
                className='download'
                onClick={() => {
                  this.openUrl('https://rzp.io/l/elzabrowser')
                }}
              >
                <i className='fa fa-heart mr-3'></i>Donate to keep this project
                alive
              </button>
              <br />
              <br />
              <div
                className='about-contribute'
                onClick={() => {
                  this.openUrl(
                    'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAANAAQUy0k5UMDAwTVgxUFo3WDBRWlgxR1VaSldVRzNRUi4u'
                  )
                }}
              >
                <i className='fa fa-laptop-code mr-2' /> Do you speak our
                language? Join us on devloping Elza!
              </div>
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
          <div className='sidebar-right col-sm-2 col-xs-2'></div>
        </div>
      </div>
    )
  }
}
export default Settings
