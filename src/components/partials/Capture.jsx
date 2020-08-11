import React from 'react'
import url from 'url'
import createSec65 from '../../functions/filegenerators/createSec65.js'
import initDir from '../../functions/filegenerators/initDirectories'
import '../../assets/css/controls.css'
import '../../assets/css/menu.css'
import 'bootstrap/dist/css/bootstrap.min.css'
const remote = window.require('electron').remote
const app = remote.app
const PDFDocument = window.require('pdfkit')
const blobStream = window.require('blob-stream')
const { shell } = window.require('electron')
const { desktopCapturer } = window.require('electron')
const { Resolver } = window.require('dns').promises
const resolver = new Resolver()
resolver.setServers(['1.1.1.1'])
const publicIp = window.require('public-ip')
const JSZip = window.require('jszip')

initDir()
class Capture extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      webv: null,
      isNative: true,
      inputURL: 'https://www.google.com',
      webHistory: [],
      canGoBack: true,
      canGoForward: true,
      webvIsLoading: true,
      capStatus: null,
      isCapturing: false,
      captureButtonText: 'Capture',
      st: '00:00:00',
      isRecording: false,
      isPaused: false,
      recStatus: 'Not started',
      captureID: null,
      filePath: null,
      isSaved: false,
      infoText: 'Capture complete page information',
      popupVisible: false
    }
    this.recordedChunks = []
    this.mediaRecorder = null
    this.seconds = 0
    this.minutes = 0
    this.hours = 0
    this.t = null

    this.imports = {
      remote: window.require('electron').remote,
      fs: window.require('electron').remote.require('fs')
    }
    this.defaltDirs = {
      tmp: app.getPath('temp'),
      out: app.getPath('documents') + '/Expert-Evidence'
    }
  }
  componentWillReceiveProps (newProps) {
    this.setState({
      webv: newProps.currentWebView,
      isNative: newProps.isNative
    })
    console.log(newProps)
  }

  createImage = (id, write) => {
    return new Promise((resolve, reject) => {
      var wv = this.state.webv
      wv.capturePage(
        { x: 0, y: 0, width: wv.clientWidth, height: wv.clientHeight },
        img => {
          if (!write) {
            var a = document.createElement('a')
            a.href = img.toDataURL()
            a.setAttribute('download', id + '.png')
            a.click()
            resolve(img.toDataURL())
          } else {
            let filepath = app.getPath('documents') + '/' + id + '.jpg'
            this.imports.fs.writeFile(filepath, img.toJPEG(100), err => {
              if (err) {
                reject()
              } else {
                resolve(filepath)
              }
            })
          }
        }
      )
    })
  }
  randID = () => {
    var result = ''
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  randID = () => {
    var d = new Date()
    var result = ''
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return d.toISOString().replace(/:/g, '-') + '-' + result
  }

  capture = async () => {
    /*  this.state.webv.openDevTools()
     */
    if (this.state.webv == null) return
    this.setState({
      captureButtonText: 'Page Loading...',
      capStatus: 'Waiting for page to load...'
    })

    this.setState({ captureButtonText: 'Capturing...' })
    const win = remote.getCurrentWindow()
    const electronScreen = this.imports.remote.screen
    var mainScreen = electronScreen.getPrimaryDisplay()
    var dimensions = mainScreen.size
    let contentHeight = await this.state.webv.executeJavaScript(
      'Promise.resolve(document.body.scrollHeight)'
    )
    if (contentHeight > 30000) contentHeight = 30000
    win.setSize(dimensions.width, contentHeight, false)
    //window.resizeTo(800, 600)
    this.setState({ capStatus: 'Starting capture', isCapturing: true })
    this.state.webv.stop()
    var targetURL = this.state.inputURL
    var d = new Date()
    var offset = (new Date().getTimezoneOffset() / 60) * -1
    var timeStamp = new Date(d.getTime() + offset)
    const targetDomain = url.parse(targetURL).hostname
    const targetIP = await resolver.resolve4(targetDomain)
    const captureID = this.randID()
    var userIP = await publicIp.v4()
    var filename = targetDomain + '-' + captureID
    this.setState({ capStatus: 'Generating Image' })
    var [imageUrl] = await Promise.all([this.createImage(this.randID(), false)])
    win.setSize(dimensions.width, dimensions.height, false)
    //window.resizeTo(800, 800)
    this.setState({
      capStatus: 'Capture Complete',
      isCapturing: false,
      captureButtonText: 'Capture'
    })

    return
  }
  setHttp (link) {
    if (link.search(/^http[s]?:\/\//) === -1) {
      link = 'http://' + link
    }
    return link
  }
  goHome = () => {
    let newurl = this.setHttp('https://www.google.com')
    let webv = this.state.webv
    webv.loadURL(newurl)
    this.setState({ isCapturing: false })
  }
  submitURL = event => {
    event.preventDefault()
    let newurl = this.setHttp(this.state.inputURL)
    let webv = this.state.webv
    webv.loadURL(newurl)
  }
  handleChange = event => {
    this.setState({ inputURL: event.target.value })
  }
  goForward = () => {
    let webv = this.state.webv
    webv.goForward()
    this.setState({ isCapturing: false })
  }
  goBack = () => {
    let webv = this.state.webv
    webv.goBack()
    this.setState({ isCapturing: false })
  }
  reloadWebv = () => {
    let webv = this.state.webv
    webv.reload()
    this.setState({ isCapturing: false })
  }
  closeNotif = () => {
    this.setState({ capStatus: null })
  }
  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  render () {
    return (
      <>
        <div
          className='dropdown'
          ref={node => {
            this.node = node
          }}
        >
          <button id='capture' title='Screenshot' onClick={this.capture}>
            {this.state.isCapturing ? (
              <div className='capturing'></div>
            ) : (
              <i className='fas fa-camera' />
            )}
          </button>
        </div>
        {this.state.capStatus ? (
          <div id='notificationArea' className='notificationAlert'>
            <div className='notifItem shadow-lg'>
              {(this.state.isCapturing || this.state.webvIsLoading) &&
              this.state.capStatus != 'Capture Complete' ? (
                <div
                  className='spinner-grow spinner-grow-sm text-info mr-3'
                  role='status'
                ></div>
              ) : (
                <span className='fa fa-check-circle mr-3'></span>
              )}
              {this.state.capStatus}{' '}
              <span
                onClick={() => this.closeNotif()}
                className='fa fa-times ml-4'
              ></span>
            </div>
          </div>
        ) : null}
      </>
    )
  }
}
export default Capture
