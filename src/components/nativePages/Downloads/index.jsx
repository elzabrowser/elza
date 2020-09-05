import React from 'react'
import './main.css'
const { shell, ipcRenderer } = window.require('electron')
class Downloads extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      downloads: {}
    }
  }
  componentDidMount () {
    ipcRenderer.on('senddownloads', (event, arg) => {
      console.log(arg)
      this.setState({
        downloads: arg
      })
    })
    ipcRenderer.send('getdownloads')
    ipcRenderer.on('downloads_changed', (event, downloads) => {
      console.log(downloads)
      this.setState({
        downloads: downloads
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

  render () {
    return (
      <>
        <div className='container p-1'>
          {Object.keys(this.state.downloads).map(key => (
            <div
              key={key}
              onClick={() => {
                if (this.state.downloads[key].status === 'done')
                  this.openItem(this.state.downloads[key].path)
              }}
              style={{ height: '50px' }}
              className='row m-2'
            >
              <div className='col-sm-2 text-center align-self-center'>
                <i
                  style={{ fontSize: '30px', color: '#C4C4C4' }}
                  className='fa fa-file-download'
                ></i>
              </div>
              <div className='col-sm-10'>
                <b className='downloadname'>
                  {this.state.downloads[key].name.length < 15
                    ? this.state.downloads[key].name
                    : this.state.downloads[key].name
                        .split('')
                        .splice(0, 15)
                        .join('') + '...'}
                </b>

                {this.state.downloads[key].status !== 'done' && (
                  <div className='mt-1 mb-1 border'>
                    <div
                      className='progress-bar bg-light'
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
                      (this.state.downloads[key].totalBytes / 1048576).toFixed(
                        2
                      ) +
                      ' MB'
                    : (
                        this.state.downloads[key].receivedBytes / 1048576
                      ).toFixed(2) +
                      ' of ' +
                      (this.state.downloads[key].totalBytes / 1048576).toFixed(
                        2
                      ) +
                      ' MB'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }
}
export default Downloads
