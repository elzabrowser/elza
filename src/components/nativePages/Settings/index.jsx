import React from 'react'
import Downloads from '../Downloads'
import './main.css'
import elzaLogo from '../../../assets/images/icon.png'
import bingImg from '../../../assets/images/dark/bing.png'
import googleImg from '../../../assets/images/dark/google.png'
import duckImg from '../../../assets/images/dark/ddg.png'
import ecosiaImg from '../../../assets/images/dark/ecosia.png'
import yandexImg from '../../../assets/images/dark/yandex.png'
import customImg from '../../../assets/images/dark/custom.png'
import torImg from '../../../assets/images/tor.png'
import About from '../../partials/About'

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pref: window.preloadAPI.send('getPreference', 'all', true),
      active: 'settings',
    }
  }

  searchEngineSelector = e => {
    let pref = this.state.pref
    pref.searchEngine = e
    this.setState({ pref }, this.savePreference)
  }

  onchangeHandler = e => {
    let pref = this.state.pref
    pref.customSearchEngine = e.target.value
    this.setState({ pref })
  }

  componentDidMount () {
    if (this.props.tab.compProps.calledBy === 'downloadpopup') {
      this.setState({ active: 'downloads' })
    }
  }

  savePreference = () => {
    window.preloadAPI.send('setPreference', this.state.pref, true)
    this.props.handleSearchEngineChange(this.state.pref.searchEngine)
  }

  openUrl = url => {
    window.preloadAPI.send('openNewTab', url, false)
  }

  selectDownloadLocation = async () => {
    var pref = { ...this.state.pref }
    pref.downloadLocation = window.preloadAPI.send(
      'selectDownloadPath',
      '',
      true
    )
    this.setState({ pref })
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
              <img className='logo' src={elzaLogo} alt='elzalogo' />
              <p className='h6 font-weight-light d-inline mb-0 ml-1'>
                Elza Browser
              </p>
            </div>
          </div>
          <div className='col-sm-7 col-xs-6 right-container'>
            <div
              className={this.state.active === 'settings' ? 'pl-4' : 'd-none'}
            >
              <br />
              <div className=''>
                <h5 className='mb-4 font-weight-light'>
                  Onion Router
                  <img
                    src={torImg}
                    alt='tor'
                    className={
                      this.state.pref.isTorEnabled
                        ? 'settings-tor-icon ml-3'
                        : 'settings-tor-icon settings-tor-icon-inactive ml-3'
                    }
                  />
                  <small className='ml-1 text-muted'>
                    {this.state.pref.isTorEnabled ? 'Active' : ''}
                  </small>
                </h5>
                <button
                  className={
                    this.state.pref.isTorEnabled
                      ? 'preference-button preference-button-active'
                      : 'preference-button'
                  }
                  onClick={() => {
                    var pref = { ...this.state.pref }
                    pref.isTorEnabled = !pref.isTorEnabled
                    this.setState({ pref }, this.savePreference)
                    window.preloadAPI.send('torWindow', '', false)
                  }}
                >
                  Activate
                </button>
                <button
                  className={
                    !this.state.pref.isTorEnabled
                      ? 'ml-4 preference-button preference-button-active'
                      : 'ml-4 preference-button'
                  }
                  onClick={() => {
                    var pref = { ...this.state.pref }
                    if (pref.isTorEnabled) {
                      pref.isTorEnabled = false
                      this.setState({ pref }, this.savePreference)
                      window.preloadAPI.send('torWindow', '', false)
                    }
                  }}
                >
                  Deactivate
                </button>

                <br />
                <p className={'small font-weight-light mt-1'}>
                  <i className='fa fa-info-circle mr-2'></i> Current session
                  will be lost.
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
                      title='Ecosia: Search engine that plants trees.'
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
                    <img
                      className={
                        this.state.pref.searchEngine === 'bing'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('bing')}
                      title='Bing: Search engine from Microsoft.'
                      src={bingImg}
                      alt='Bing'
                    />
                    <img
                      className={
                        this.state.pref.searchEngine === 'yandex'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('yandex')}
                      title="Russia's largest search engine."
                      src={yandexImg}
                      alt='Yandex'
                    />
                    <img
                      className={
                        this.state.pref.searchEngine === 'custom'
                          ? 'active'
                          : null
                      }
                      onClick={() => this.searchEngineSelector('custom')}
                      src={customImg}
                      title='Custom search engine'
                      alt='Custom'
                    />
                  </div>
                  <input
                    type='text'
                    value={this.state.pref.customSearchEngine}
                    onChange={this.onchangeHandler}
                  />
                </div>
              </div>
              <p
                className={
                  this.state.pref.isTorEnabled
                    ? 'small font-weight-light mt-1'
                    : 'd-none'
                }
              >
                <i className='fa fa-info-circle mr-2'></i> DuckDuckGo is forced
                when onion router is enabled.
              </p>
              <h5 className='font-weight-light mt-5'>Ad Block</h5>
              <br />
              <button
                className={
                  this.state.pref.isAdblockEnabled
                    ? 'preference-button preference-button-active'
                    : 'preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  if (!pref.isAdblockEnabled) {
                    pref.isAdblockEnabled = true
                    this.setState({ pref }, this.savePreference)
                    window.preloadAPI.send('toggleAdblocker', true, false)
                  }
                }}
              >
                Activate
              </button>
              <button
                className={
                  !this.state.pref.isAdblockEnabled
                    ? 'ml-4 preference-button preference-button-active'
                    : 'ml-4 preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  if (pref.isAdblockEnabled) {
                    pref.isAdblockEnabled = false
                    this.setState({ pref }, this.savePreference)
                    window.preloadAPI.send('toggleAdblocker', false, false)
                  }
                }}
              >
                Deactivate
              </button>
              <h5 className='font-weight-light mt-5'>Special Permissions</h5>
              <br />
              <button
                className={
                  !this.state.pref.blockSpecialPermissions
                    ? 'preference-button preference-button-active'
                    : 'preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.blockSpecialPermissions = false
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Allow
              </button>
              <button
                className={
                  this.state.pref.blockSpecialPermissions
                    ? 'ml-4 preference-button preference-button-active'
                    : 'ml-4 preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.blockSpecialPermissions = true
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Deny
              </button>
              <p className={'small font-weight-light mt-1'}>
                <i className='fa fa-info-circle mr-2'></i> Access to camera,
                mic, location and more.
              </p>
              <h5 className='font-weight-light mt-5'>Javascript</h5>
              <br />
              <button
                className={
                  this.state.pref.javascriptEnabled
                    ? 'preference-button preference-button-active'
                    : 'preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.javascriptEnabled = true
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Enable
              </button>
              <button
                className={
                  !this.state.pref.javascriptEnabled
                    ? 'ml-4 preference-button preference-button-active'
                    : 'ml-4 preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.javascriptEnabled = false
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Disable
              </button>
              <p className={'small font-weight-light mt-1'}>
                <i className='fa fa-info-circle mr-2'></i> Preference will be
                changed for new tabs.
              </p>

              <h5 className='font-weight-light mt-5'>Download Location</h5>
              <br />
              <button
                className={
                  this.state.pref.downloadLocation !== 'ask'
                    ? 'preference-button preference-button-active'
                    : 'preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.downloadLocation = window.preloadAPI.send(
                    'getDownloadsDirectory',
                    '',
                    true
                  )
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Custom
              </button>
              <button
                className={
                  this.state.pref.downloadLocation === 'ask'
                    ? 'ml-4 preference-button preference-button-active'
                    : 'ml-4 preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.downloadLocation = 'ask'
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Ask Everytime
              </button>
              <button
                className={
                  this.state.pref.downloadLocation !== 'ask'
                    ? 'mt-3 preference-button download-location'
                    : 'd-none'
                }
                onClick={() => this.selectDownloadLocation()}
              >
                {this.state.pref.downloadLocation}
              </button>
              <h5 className='font-weight-light mt-5'>Updates</h5>
              <button
                className={
                  this.state.pref.updateMethod === 'auto'
                    ? 'mt-4 mr-4 preference-button preference-button-active'
                    : 'mt-4 mr-4 preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.updateMethod = 'auto'
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Auto Update
              </button>
              <button
                className={
                  this.state.pref.updateMethod === 'notify'
                    ? 'mt-4 mr-4 preference-button preference-button-active'
                    : 'mt-4 mr-4 preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.updateMethod = 'notify'
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Notify
              </button>
              <button
                className={
                  this.state.pref.updateMethod === 'dont-update'
                    ? 'mt-4 preference-button preference-button-active'
                    : 'mt-4 preference-button'
                }
                onClick={() => {
                  var pref = { ...this.state.pref }
                  pref.updateMethod = 'dont-update'
                  this.setState({ pref }, this.savePreference)
                }}
              >
                Ignore
              </button>
              <p className={'small font-weight-light mt-1 mb-5'}>
                <i className='fa fa-info-circle mr-2'></i> Highly recommended to
                keep Elza uptodate.
              </p>
            </div>
            <div className={this.state.active === 'downloads' ? '' : 'd-none'}>
              <Downloads calledBy='settings' />
            </div>
            <div className={this.state.active === 'about' ? 'p-3' : 'd-none'}>
              <About />
            </div>
          </div>
          <div className='sidebar-right col-sm-2 col-xs-2'></div>
        </div>
      </div>
    )
  }
}
export default Settings
