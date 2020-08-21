import React from 'react'
import './main.css'
import Peer from 'peerjs'
import { v4 as uuidv4 } from 'uuid'
import cover from './doc_sharing.png'
import formatBytes from '../../../functions/formatBytes'

var remote = window.require('electron').remote
var fs = remote.require('fs')
const app = remote.app
var downloadPath = app.getPath('downloads')
const { shell } = remote.require('electron')

class Sharing extends React.Component {
  constructor (props) {
    super(props)
    this.url = new URL(this.props.tab.src)
    let params = this.url.searchParams
    this.targetPeer = params.get('peer')
    this.token = params.get('tk')
    this.conn = null
    this.state = {
      id: null,
      status: 'connecting',
      file: null,
      recvdFile: null,
      metadata: {}
    }
    this.getICE()
  }

  getICE = () => {
    let o = {
      format: 'urls'
    }
    let ice = {}

    let bodyString = JSON.stringify(o)
    let https = require('https')
    let options = {
      host: 'global.xirsys.net',
      path: '/_turn/MyFirstApp',
      method: 'PUT',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from('elza:228be9ce-d1a9-11ea-a532-0242ac150003').toString(
            'base64'
          ),
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length
      }
    }
    let httpreq = https.request(options, httpres => {
      let str = ''
      httpres.on('data', function (data) {
        str += data
      })
      httpres.on('error', function (e) {
        console.log('error: ', e)
      })
      httpres.on('end', () => {
        this.setState({ ice: JSON.parse(str) }, () => {
          console.log(this.state.ice)
          if (this.targetPeer) {
            this.peerRec()
          } else {
            this.peerSend()
          }
        })
      })
    })
    httpreq.on('error', function (e) {
      console.log('request error: ', e)
    })
    httpreq.end()
  }

  peerInit = peer => {
    peer.on('open', id => {
      console.log(id)
      this.setState({ status: 'connected, waiting for peer', id })
    })
    peer.on('error', err => {
      console.log(err)
    })
  }
  peerRec = () => {
    var peer = new Peer(uuidv4(), {
      host: 'elza-peer.herokuapp.com',
      port: 443,
      path: 'myapp',
      key: 'peerjs',
      debug: true,
      secure: true,
      config: this.state.ice?.v
    })
    this.peerInit(peer)
    peer.on('open', id => {
      console.log(id)
      this.setState({ status: 'connected, waiting for peer', id })
      var conn = peer.connect(this.targetPeer)
      conn.on('error', err => {
        console.log(err)
      })
      conn.on('open', () => {
        this.setState({ status: 'receiving file' })
      })
      conn.on('data', data => {
        console.log(data)
        if (data.type === 'metadata') {
          this.setState({ status: 'receiving file', isRecv: true })
          this.setState({ metadata: data.value })
        }
        if (data.type === 'buffer') {
          this.setState({ recvdFile: data.value }, this.writeToFile)
        }
      })
    })
  }

  peerSend = () => {
    var peer = new Peer(uuidv4(), {
      host: 'elza-peer.herokuapp.com',
      port: 443,
      path: 'myapp',
      key: 'peerjs',
      debug: true,
      secure: true,
      config: this.state.ice?.v
    })
    this.peerInit(peer)
    peer.on('connection', conn => {
      console.log('incoming connection')
      conn.on('open', () => {
        this.setState({ status: 'Sending file' })
        conn.send({
          type: 'metadata',
          value: {
            name: this.state.file.name,
            size: this.state.file.size,
            type: this.state.file.type
          }
        })
        conn.send({ type: 'buffer', value: this.state.file })
      })
    })
  }
  writeToFile = () => {
    if (!this.state.recvdFile) return
    fs.writeFile(
      downloadPath + '/' + this.state.metadata.name,
      Buffer.from(this.state.recvdFile),
      () => {
        this.setState({ isDownloaded: true, status: 'Done!' })
      }
    )
  }
  componentDidMount () {}

  handleChange = e => {
    this.setState({ targetPeer: e.target.value })
  }
  selectFile = e => {
    console.log(e.target.files[0])
    this.setState({ file: e.target.files[0] })
  }
  openFile = path => {
    shell.openPath(downloadPath + '/' + path)
  }
  chooseMode = () => {
    if (this.targetPeer) {
      return (
        <>
          {this.state.isRecv ? (
            <div className='sharing-download-ctr d-flex border rounded shadow-sm p-3 m-auto'>
              {this.state.isDownloaded ? (
                <i className='icn fa fa-file' />
              ) : (
                <div className='icn'>
                  <div className='spinner-border' role='status'></div>
                </div>
              )}
              <div className='ml-2 sharing-txt w-100 text-left'>
                <span className='text-left'>
                  {this.state.metadata?.name || 'filename'}
                </span>
                <div className='d-flex w-100 text-muted small mb-3'>
                  <span>
                    {this.state.metadata.size
                      ? formatBytes(this.state.metadata.size)
                      : null}
                  </span>
                  <br />
                  <span className='ml-auto mr-0'>
                    {this.state.metadata?.type || 'no'}
                  </span>
                </div>
                {this.state.isDownloaded ? (
                  <button
                    className='btn btn-outline-primary'
                    onClick={() => this.openFile(this.state.metadata.name)}
                  >
                    Open
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </>
      )
    } else {
      return (
        <>
          <div>
            <input onChange={this.selectFile} type='file' />
          </div>
          {this.state.file ? (
            <div className='sharing-link ml-auto mr-auto p-3 rounded m-5'>
              elza://share/?peer={this.state.id}
            </div>
          ) : null}
        </>
      )
    }
  }

  render () {
    return (
      <div className='container p-5 sharing-container'>
        <h2>Share files over peer-to-peer connection</h2>
        <img className='sharing-cover' src={cover} />
        <p className='text-muted'>
          <b>Connection status: </b>
          {this.state.status}{' '}
        </p>
        {this.chooseMode()}
      </div>
    )
  }
}
export default Sharing
