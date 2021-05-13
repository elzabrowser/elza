import React from 'react'
import './main.css'
//const { shell, ipcRenderer } = window.require('electron')
class Downloads extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      downloads: {},
      renderLocation: 'popup'
    }
  }
  componentWillReceiveProps (props) {
    if (props.calledBy === 'settings')
      this.setState({ renderLocation: 'settings' })
  }
  componentDidMount () {/*
    ipcRenderer.on('senddownloads', (event, arg) => {
      this.setState({
        downloads: arg
      })
    })
    ipcRenderer.send('getdownloads')
    ipcRenderer.on('downloads_changed', (event, downloads) => {
      console.log(downloads)
      const sortedDownloads = {}
      Object.keys(downloads)
        .sort((a, b) => b - a)
        .forEach(function (key) {
          sortedDownloads[key] = downloads[key]
        })
      this.setState({
        downloads: sortedDownloads
      })
    })*/
  }

  getProgress = (receivedBytes, totalBytes) => {
    if (totalBytes === 0) return 0
    else {
      return ((receivedBytes / totalBytes) * 100).toFixed(2) + '%'
    }
  }
  getProgressText = key => {
    if (this.state.downloads[key].status === 'done')
      return (
        'Completed - ' +
        (this.state.downloads[key].totalBytes / 1048576).toFixed(2) +
        ' MB'
      )
    else
      return (
        (this.state.downloads[key].receivedBytes / 1048576).toFixed(2) +
        ' of ' +
        (this.state.downloads[key].totalBytes / 1048576).toFixed(2) +
        ' MB'
      )
  }
  getDownloadName = key => {
    if (this.state.downloads[key].name.length < 15)
      return this.state.downloads[key].name
    else
      return (
        this.state.downloads[key].name
          .split('')
          .splice(0, 15)
          .join('') + '...'
      )
  }
  openItem = path => {
   // shell.openPath(path)
  }

  render () {
    return (
      <>
        <div className='container p-1 width'>
          <div
            className={
              Object.keys(this.state.downloads).length > 0
                ? 'd-none'
                : 'w-100 h-100 text-center'
            }
          >
            <br />
            <br />
            <br />
            <h5 className='font-weight-light'>
              No downloads in the current session.
            </h5>
          </div>
          {Object.keys(this.state.downloads).map(key => (
            <div
              key={key}
              className={
                this.state.renderLocation === 'popup'
                  ? 'row m-2 border border-secondary rounded'
                  : 'row m-2 mt-3 border border-secondary rounded'
              }
              role={this.state.downloads[key].status === 'done' ? 'button' : ''}
            >
              <div
                className={
                  this.state.renderLocation === 'popup'
                    ? 'col-sm-2 p-2 border-right border-secondary text-center align-self-center'
                    : 'col-sm-2 p-3 border-right border-secondary text-center align-self-center'
                }
              >
                <i className='fa fa-file-download file-icon'></i>
              </div>
              <div
                className='col-sm-8 p-2'
                onClick={() => {
                  if (this.state.downloads[key].status === 'done')
                    this.openItem(this.state.downloads[key].path)
                }}
              >
                <b className='downloadname'>{this.getDownloadName(key)}</b>
                <div
                  className={
                    this.state.downloads[key].status !== 'done'
                      ? ' mb-1 border'
                      : 'd-none'
                  }
                >
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
                <div className='progressinfo'>{this.getProgressText(key)}</div>
              </div>
              <div
                className={
                  this.state.renderLocation === 'popup'
                    ? 'col-sm-2 p-2 border-right border-secondary text-center align-self-center'
                    : 'col-sm-2 p-3 border-right border-secondary text-center align-self-center'
                }
                onClick={() => {
                  //if (this.state.downloads[key].status === 'done')
                   // shell.showItemInFolder(this.state.downloads[key].path)
                }}
              >
                <i
                  style={{
                    fontSize: '23px',
                    color: '#C4C4C4'
                  }}
                  className='fa fa-folder rounded-circle'
                ></i>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }
}
export default Downloads
