import React from 'react'
import ReactDOM from 'react-dom'
import '../../assets/css/controls.css'
import '../../assets/css/menu.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import sha256 from 'sha256'
import createMetadata from '../../functions/filegenerators/createMetadata.js'
import url from 'url'
import createSec65 from '../../functions/filegenerators/createSec65.js'
import initDir from '../../functions/filegenerators/initDirectories'
import { saveCapture } from '../../functions/capturedb.js'
import ScreenRecorder from '../nativePages/ScreenRecorder'
import Captures from '../nativePages/Captures'
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
      infoText: 'Capture complete page information'
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
    this.setState({ webv: newProps.currentWebView })
    console.log(newProps)
  }
  componentDidMount () {
    this.startVideoStream()
  }
  removeCapturePopup = () => {
    document.getElementById('capturePopUp').classList.remove('show')
  }
  toggleCapturePopup = () => {
    document.getElementById('capturePopUp').classList.toggle('show')
  }
  startLoading = () => {
    this.setState({ webvIsLoading: true })
  }
  failLoadHandler = e => {
    console.log(e)
  }
  updateURL = () => {
    var webv = this.state.webv
    document.getElementById('location').value = webv.src
    this.setState({ inputURL: webv.src })
    //this.state.webHistory.push(webv.src)
    this.setState({
      canGoBack: !webv.canGoBack(),
      canGoForward: !webv.canGoForward(),
      webvIsLoading: false
    })
  }

  getUserData = () => {
    fetch('https://app.expertevidence.org/api/getuserdata')
      .then(response => response.json())
      .then(data => {
        if (data) {
          this.setState({ userName: data.name, userID: data.id })
        } else {
          console.log('error fetching data')
        }
      })
  }
  createPDF = (id, write) => {
    return new Promise((resolve, reject) => {
      this.state.webv
        .printToPDF({
          marginsType: 1,
          printBackground: true,
          pageSize: 'A4'
        })
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  }
  createMHTML = (id, write) => {
    return new Promise((resolve, reject) => {
      var filePath = `${this.defaltDirs.tmp}/${id}.mhtml`
      var webcontent = remote.webContents.fromId(
        this.state.webv.getWebContentsId()
      )
      webcontent
        .savePage(filePath, 'MHTML')
        .then(() => {
          if (!write) {
            var filecontents = this.imports.fs.readFileSync(filePath)
            resolve(filecontents)
          }
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  createHTML = () => {
    return new Promise((resolve, reject) => {
      var webcontent = remote.webContents.fromId(
        this.state.webv.getWebContentsId()
      )
      webcontent
        .savePage('test.html', 'HTMLOnly')
        .then(() => {
          console.log('HTML generated')
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  createImage = (id, write) => {
    return new Promise((resolve, reject) => {
      var wv = this.state.webv
      wv.capturePage(
        { x: 0, y: 0, width: wv.clientWidth, height: wv.clientHeight },
        img => {
          if (!write) {
            resolve(img.toDataURL())
          } else {
            let filepath = '/tmp/' + id + '.jpg'
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
  imageToPDF = (filepath, contentHeight, contentWidth, filename, timestamp) => {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [595, 842],
        layout: 'landscape',
        autoFirstPage: false,
        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      })
      const stream = doc.pipe(blobStream())
      doc.fontSize(10)
      for (var k = 0; k < filepath.length; k++) {
        doc.addPage()
        doc.image(filepath[k], {
          width: 848,
          align: 'center',
          valign: 'center'
        })
        doc.moveDown(0.4)
        let footerText =
          ' ' + filename + ' ' + timestamp + ' Captured by ExpertEvidence.Org'
        doc.font('Times-Roman').text(footerText, {
          align: 'left'
        })
      }
      doc.end()
      stream.on('finish', function () {
        const blob = stream.toBlob('application/pdf')
        const fs = window.require('fs')
        var reader = new FileReader()
        reader.onload = function () {
          var buffer = new Buffer(reader.result)
          var filepath = '/tmp/file.pdf'
          resolve(buffer)
          /* fs.writeFile(filepath, buffer, {}, (err, res) => {
            if (err) {
              console.error(err)
              reject()
            }
          }) */
        }
        reader.readAsArrayBuffer(blob)
      })
    })
  }
  splitImage = (imageURL, contentWidth, contentHeight) => {
    return new Promise((resolve, reject) => {
      var image = new Image()
      image.onload = () => {
        let heightOfOnePiece = (210 / 297) * contentWidth - 60
        var imagePieces = []
        for (var x = 0; x < contentHeight / heightOfOnePiece; x++) {
          var canvas = document.createElement('canvas')
          canvas.width = contentWidth
          canvas.height = heightOfOnePiece
          var context = canvas.getContext('2d')
          context.drawImage(
            image,
            0,
            x * heightOfOnePiece,
            contentWidth,
            heightOfOnePiece,
            0,
            0,
            contentWidth,
            heightOfOnePiece
          )
          imagePieces.push(canvas.toDataURL('image/png'))
        }
        resolve(imagePieces)
      }
      image.src = imageURL
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
  openInFolder = path => {
    shell.showItemInFolder(path)
  }
  openItem = path => {
    shell.openItem(path)
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

  openInNewTab = (title, src, comp, icon) => {
    let tab = this.props.tabGroup.addTab({
      title: title || 'File Sharing',
      src: src || 'elza://share',
      icon: 'fa fa-grip-horizontal' || icon,
      isNative: true,
      comp: comp
    })
    //this.props.tab.close()
    tab.activate()
  }
  startVideo = () => {
    if (this.state.isRecording) {
      this.stopVideo()
      return
    }
    this.setState({
      isRecording: true,
      recStatus: 'Recording...',
      captureID: this.randID(),
      isSaved: false,
      isPaused: false
    })
    this.timer()
    this.recordedChunks = []
    this.mediaRecorder.ondataavailable = this.handleDataAvailable
    this.mediaRecorder.start()
  }
  stopVideo = () => {
    clearTimeout(this.t)
    this.setState({ st: '00:00:00' })
    this.seconds = 0
    this.minutes = 0
    this.hours = 0
    this.mediaRecorder.stop()
    this.setState({ isRecording: false, recStatus: 'Saving...' })
  }
  pauseVideo = () => {
    clearTimeout(this.t)
    this.mediaRecorder.pause()
    this.setState({ isPaused: true, recStatus: 'Paused' })
  }
  resumeVideo = () => {
    this.timer()
    this.mediaRecorder.resume()
    this.setState({ isPaused: false, recStatus: 'Recording...' })
  }

  handleDataAvailable = async event => {
    if (event.data.size > 0) {
      this.recordedChunks.push(event.data)
      console.log(this.recordedChunks)
      var data = new Buffer(await this.recordedChunks[0].arrayBuffer())
      var filePath = this.defaltDirs.out + '/' + this.state.captureID + '.webm'
      this.imports.fs.writeFile(filePath, data, err => {
        if (err) console.log(err)
        else {
          this.setState({ recStatus: 'Saved', filePath, isSaved: true })
        }
      })
    } else {
      // ...
    }
  }

  handleError = e => {
    console.log(e)
  }

  add = () => {
    this.seconds++
    if (this.seconds >= 60) {
      this.seconds = 0
      this.minutes++
      if (this.minutes >= 60) {
        this.minutes = 0
        this.hours++
      }
    }

    let st =
      (this.hours ? (this.hours > 9 ? this.hours : '0' + this.hours) : '00') +
      ':' +
      (this.minutes
        ? this.minutes > 9
          ? this.minutes
          : '0' + this.minutes
        : '00') +
      ':' +
      (this.seconds > 9 ? this.seconds : '0' + this.seconds)
    this.setState({ st })
    this.timer()
  }
  timer = () => {
    this.t = setTimeout(this.add, 1000)
  }
  startVideoStream = () => {
    desktopCapturer
      .getSources({ types: ['window', 'screen'] })
      .then(async sources => {
        for (const source of sources) {
          if (source.name === 'Entire Screen') {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    minWidth: 1920,
                    maxWidth: 1920,
                    minHeight: 1080,
                    maxHeight: 1080
                  }
                }
              })
              var options = { mimeType: 'video/webm; codecs=vp9' }

              this.mediaRecorder = new MediaRecorder(stream, options)
            } catch (e) {
              this.handleError(e)
            }
            return
          }
        }
      })
  }
  capture = async () => {
    /*  this.state.webv.openDevTools()
     */
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
    this.setState({ capStatus: 'Generating MHTML,PDF' })
    var [mhtmlData, imageUrl, sec65file] = await Promise.all([
      this.createMHTML(this.randID(), false),
      this.createImage(this.randID(), false),
      createSec65()
    ])
    win.setSize(dimensions.width, dimensions.height, false)
    //window.resizeTo(800, 800)
    this.setState({ capStatus: 'Splitting Image' })
    let imageSplits = await this.splitImage(
      imageUrl,
      dimensions.width,
      contentHeight
    )
    console.log(imageSplits)
    this.setState({ capStatus: 'Generating Metadata' })

    let pdfFile = await this.imageToPDF(
      imageSplits,
      contentHeight,
      dimensions.width,
      targetDomain + ' ' + captureID,
      timeStamp
    )
    var metadataObj = {
      Url: targetURL,
      Timestamp: timeStamp,
      Host: targetDomain,
      HostIP: targetIP,
      CaptureID: captureID,
      Username: this.state.userName,
      userID: this.state.userID,
      userIP: userIP,
      Browser: 'Chrome',
      Capturemode: 'private',
      ContentType: 'Web archive',
      CapturedBy: 'expertevidence.org',
      ShasumMHTML: sha256(mhtmlData),
      ShasumPDF: sha256(pdfFile)
    }
    var [metadataFile, metadataJson] = await Promise.all([
      createMetadata(metadataObj),
      JSON.stringify(metadataObj)
    ])
    this.setState({ capStatus: 'Compressing Files' })
    var zip = new JSZip()
    zip.file(filename + '-archive.mhtml', mhtmlData)
    zip.file(filename + '-metadata.json', metadataJson)
    zip.file(filename + '-metadata.pdf', metadataFile)
    zip.file(filename + '-sec65.pdf', sec65file)
    zip.file(filename + '-screenshot.pdf', pdfFile)
    //   zip.file(filename + '-image.png', imageData)
    var zipBuffer = await zip.generateAsync({
      type: 'nodebuffer'
    })
    var savePath = this.defaltDirs.out + '/' + filename + '.zip'
    this.imports.fs.writeFile(savePath, zipBuffer, err => {
      this.setState({
        capStatus: 'Capture Complete',
        isCapturing: false,
        captureButtonText: 'Capture'
      })
      saveCapture({ filePath: savePath, timeStamp, filename: filename })
      // 	var formData = new FormData();
      // 	formData.append('zipfile', this.imports.fs.createReadStream(savePath));
      // 	console.log(formData)
      // 	axios.post('http://localhost:3001/api/zipupload/', formData, {
      // 	headers: {
      // 		 'Content-Type': 'multipart/form-data'
      // 		}
      //  });
    })
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
        <div className='dropdown'>
          <button
            id='capture'
            title='Capture'
            onClick={this.toggleCapturePopup}
          >
            {this.state.isCapturing ? (
              <div className='capturing'></div>
            ) : (
              <i className='fas fa-camera' />
            )}
          </button>
          <div id='capturePopUp' className='dropdown-capture'>
            <div className='row col-md-12 '>
              <div onClick={this.capture} className='col-md-4 text-center item'>
                <i
                  className='fas fa-camera fa-3x'
                  style={{ color: '#556B2F' }}
                />
                <p style={{ textAlign: 'center' }}>Capture</p>
              </div>
              <div
                onClick={() =>
                  this.openInNewTab(
                    'file Sharing',
                    'https://google.com',
                    ScreenRecorder,
                    'fa fa-share-alt'
                  )
                }
                className='col-md-4 text-center item'
              >
                <i
                  className='fas fa-camera fa-3x'
                  style={{ color: '#8B0000' }}
                />
                <p style={{ textAlign: 'center' }}>Record</p>
              </div>
              <div
                onClick={() =>
                  this.openInNewTab(
                    'file Sharing',
                    'https://google.com',
                    Captures,
                    'fa fa-share-alt'
                  )
                }
                className='col-md-4 text-center item'
              >
                <i
                  className='fas fa-th-list fa-3x'
                  style={{ color: '#008080' }}
                />
                <p style={{ textAlign: 'center' }}>Records</p>
              </div>
            </div>
            <span style={{ fontSize: '12px' }}>
              <i className='fas fa-info-circle '></i> {this.state.infoText}
            </span>
          </div>
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
