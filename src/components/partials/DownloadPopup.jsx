import React from 'react'
import Downloads from '../nativePages/Downloads'
import '../../assets/css/downloadpopup.css'
const { shell, ipcRenderer } = window.require('electron')
class DownloadPopup extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
    this.state = {
      downloadIconStyle: { color: 'green' },
      downloads: {
        1599141222568: {
          name: 'download.png',
          path: '/home/basil/Downloads/download (4).png',
          receivedBytes: 1340,
          status: 'done',
          totalBytes: 0
        },
        1599141937799: {
          name: 'download.jpeg',
          path: '/home/basil/Downloads/download (32).jpeg',
          receivedBytes: 2000,
          status: 'started',
          totalBytes: 3500
        }
      },
      isVisible: false
    }
  }

  componentDidMount () {
    ipcRenderer.on('downloads_changed', (event, downloads) => {
      console.log(downloads)
      this.setState({
        downloads: {
          1599141222568: {
            name: 'download.png',
            path: '/home/basil/Downloads/download (4).png',
            receivedBytes: 1340,
            status: 'done',
            totalBytes: 0
          },
          1599141937799: {
            name: 'download.jpeg',
            path: '/home/basil/Downloads/download (32).jpeg',
            receivedBytes: 0,
            status: 'started',
            totalBytes: 0
          }
        }
      })
    })
  }
  getProgress = (receivedBytes, totalBytes) => {
    if (totalBytes === 0) return 0
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
        <div
          className={
            Object.keys(this.state.downloads).length > 0 ? 'dropdown' : 'd-none'
          }
          onClick={this.handleClick}
        >
          <button title='Downloads'>
            <i
              className='fas fa-arrow-circle-down'
              style={this.downloadIconStyle}
            />
          </button>
          <div>
            <div
              id='downloadPopUp'
              className={
                this.state.isVisible &&
                Object.keys(this.state.downloads).length > 0
                  ? 'pt-3 dropdown-downloads'
                  : 'd-none'
              }
            >
              <Downloads />
              <div
                onClick={() => {
                  this.props.openDownloadsPage()
                }}
                className='alldownloads'
              >
                <p role='button' style={{ fontSize: '15px' }}>
                  Downloads
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default DownloadPopup
