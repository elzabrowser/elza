import React from 'react'
import '../../assets/css/w3.css'
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
        {Object.keys(this.state.downloads).length > 0 && (
          <div className='dropdown' onClick={this.handleClick}>
            <button title='Downloads'>
              <i
                className='fas fa-arrow-circle-down'
                style={this.downloadIconStyle}
              />
            </button>
            <div>
              {this.state.isVisible &&
                Object.keys(this.state.downloads).length > 0 && (
                  <div id='downloadPopUp' className='dropdown-downloads'>
                    {Object.keys(this.state.downloads).map(key => (
                      <div
                        key={key}
                        onClick={() => {
                          if (this.state.downloads[key].status === 'done')
                            this.openItem(this.state.downloads[key].path)
                        }}
                      >
                        <div className='row'>
                          <div className='col-3'>
                            <i className='fa fa-info-circle'></i>
                          </div>
                          <div className='col-9' style={{ minWidth: '500px' }}>
                            <b className='downloadname'>
                              {this.state.downloads[key].name.length < 15
                                ? this.state.downloads[key].name
                                : this.state.downloads[key].name
                                    .split('')
                                    .splice(0, 15)
                                    .join('') + '...'}
                            </b>

                            {this.state.downloads[key].status !== 'done' && (
                              <div className='mt-1 mb-1 w3-black w3-border'>
                                <div
                                  className='w3-container w3-gray '
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
                            <div className='progressinfo'>
                              {this.state.downloads[key].status === 'done'
                                ? 'Completed - ' +
                                  (
                                    this.state.downloads[key].totalBytes / 1024
                                  ).toFixed(2) +
                                  ' MB'
                                : (
                                    this.state.downloads[key].receivedBytes /
                                    1024
                                  ).toFixed(2) +
                                  ' of ' +
                                  (
                                    this.state.downloads[key].totalBytes / 1024
                                  ).toFixed(2) +
                                  ' MB'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        this.props.openDownloadsPage()
                      }}
                      className='alldownloads'
                    >
                      <p>Downloads</p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </>
    )
  }
}
export default DownloadPopup
