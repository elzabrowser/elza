import React from 'react'
import '../../../assets/css/w3.css'
import './main.css'
const { shell } = window.require('electron')
const remote = window.require('electron').remote
const fs = window.require('fs')
const downloadInfoFile = remote.app.getPath('userData') + '/downloads.json'
class Downloads extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
    this.state = {
      downloadIconStyle: { color: 'green' },
      downloads: {},
      isVisible: false
    }
  }

  componentDidMount () {
    try {
      this.setState({
        downloads: JSON.parse(fs.readFileSync(downloadInfoFile, 'utf8'))
      })
    } catch {}
    console.log(this.state.downloads)
    fs.watch(downloadInfoFile, (curr, prev) => {
      try {
        this.setState({
          downloads: JSON.parse(fs.readFileSync(downloadInfoFile, 'utf8'))
        })
        //console.log(this.state.downloads)
      } catch {}
    })
  }
  getProgress = (receivedBytes, totalBytes) => {
    if (totalBytes == 0) return 0
    else {
      return ((receivedBytes / totalBytes) * 100).toFixed(2) + '%'
    }
  }
  openItem = path => {
    shell.openPath(path)
  }
  toggleDownloadPopup = () => {
    document.getElementById('downloadPopUp').classList.toggle('show')
  }
  handleOutsideClick (e) {}
  handleClick () {
    if (!this.state.popupVisible) {
      document.addEventListener('click', this.handleOutsideClick, false)
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false)
    }
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }))
  }

  render () {
    return (
      <>
        <div className='download-container'>
          <div className=' native-header p-3'>Downloads</div>
          <div className='downloadBox'>
            {Object.keys(this.state.downloads).map(key => (
              <div key={key} className=' '>
                <div className='p-3 download-item rounded shadow-sm m-2'>
                  <b>
                    {this.state.downloads[key].name.length < 12
                      ? this.state.downloads[key].name
                      : this.state.downloads[key].name}
                  </b>
                  {this.state.downloads[key].status == 'done' && (
                    <button
                      className='openDownloadItem'
                      onClick={() =>
                        this.openItem(this.state.downloads[key].path)
                      }
                    >
                      Open
                    </button>
                  )}

                  {this.state.downloads[key].status != 'done' && (
                    <div
                      className='w3-grey w3-round-xlarge'
                      style={{ marginTop: '5px' }}
                    >
                      <div
                        className='w3-container w3-blue w3-round-xlarge'
                        style={{
                          width: this.getProgress(
                            this.state.downloads[key].receivedBytes,
                            this.state.downloads[key].totalBytes
                          ),
                          height: '5px'
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
}
export default Downloads
