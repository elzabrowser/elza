import React from 'react'
import { Container } from 'react-bootstrap'
import './sr.css'
const { desktopCapturer } = window.require('electron')
const remote = window.require('electron').remote
const app = remote.app
const { shell } = window.require('electron')
/*
function handleStream (stream) {
  const video = document.querySelector('video')
  video.srcObject = stream
  video.onloadedmetadata = e => video.play()
}
*/

class ScreenCapture extends React.Component {
  constructor () {
    super()

    this.imports = {
      remote: window.require('electron').remote,
      fs: window.require('electron').remote.require('fs')
    }
    this.recordedChunks = []
    this.mediaRecorder = null
    this.seconds = 0
    this.minutes = 0
    this.hours = 0
    this.t = null
    this.state = {
      st: '00:00:00',
      isRecording: false,
      isPaused: false,
      recStatus: 'Not started',
      captureID: null,
      filePath: null,
      isSaved: false
    }
    this.defaltDirs = {
      tmp: app.getPath('temp'),
      out: app.getPath('documents') + '/Expert-Evidence'
    }
  }

  componentDidMount () {
    this.startVideoStream()
  }
  openInFolder = path => {
    shell.showItemInFolder(path)
  }
  openItem = path => {
    shell.openPath(path)
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
              this.handleStream(stream)
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
  startVideo = () => {
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
  handleStream = stream => {
    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = e => video.play()
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

  render () {
    return (
      <div>
        <div className='videoCapControls shadow-sm'>
          <button
            onClick={() => this.startVideo()}
            disabled={this.state.isRecording}
          >
            <i className='fas fa-circle' />
            <br />
            Start
          </button>
          <button
            onClick={() => this.pauseVideo()}
            disabled={this.state.isPaused || !this.state.isRecording}
          >
            <i className='fas fa-pause' />
            <br />
            Pause
          </button>
          <button
            onClick={() => this.resumeVideo()}
            disabled={!this.state.isPaused || !this.state.isRecording}
          >
            <i className='fas fa-play' />
            <br />
            Resume
          </button>
          <button
            onClick={() => this.stopVideo()}
            disabled={!this.state.isRecording}
          >
            <i className='fas fa-square' />
            <br />
            Stop
          </button>
          <div className='vidInfo'>
            <h2>{this.state.st}</h2>
          </div>
          <div className='vidFileInfo'>
            <h5>{this.state.captureID}.webm</h5>
            <span className='mr-4 '>
              <i>{this.state.recStatus}</i>
            </span>
            <span>
              <b>HD </b>1080p
            </span>
            <span> - webm</span>
            <br />
            {this.state.isSaved ? (
              <>
                <button
                  className='openItem'
                  onClick={() => this.openItem(this.state.filePath)}
                >
                  Open
                </button>
                <button
                  className='openItem'
                  onClick={() => this.openInFolder(this.state.filePath)}
                >
                  Show in folder
                </button>
              </>
            ) : null}
          </div>
        </div>
        <Container>
          <video
            id='video'
            className='videoPreview nu-out'
            data-setup='{}'
          ></video>
        </Container>
      </div>
    )
  }
}
export default ScreenCapture
