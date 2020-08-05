import React from 'react'
const { ipcRenderer } = window.require('electron')
class DownloadPopup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      downloadIconStyle: { color: 'green' },
      downloads: [{ title: 'ghjn' }, { title: 'vf' }],
      downloadProgress: null
    }
  }

  componentDidMount () {
    ipcRenderer.on('downloadprogress', function (event, args) {
      console.log(args)
    })
    ipcRenderer.on('started', function (event, args) {
      console.log(args)
    })
  }
  updateProgress = progress => {
    this.state.downloadProgress = progress
  }
  downloadStarted = item => {
    this.state.downloads.push(item)
    console.log(item)
  }
  toggleDownloadPopup = () => {
    document.getElementById('downloadPopUp').classList.toggle('show')
  }
  render () {
    return (
      <>
        <div className='dropdown'>
          <button id='capture' title='Downloads'>
            <i
              className='fas fa-arrow-circle-down'
              style={this.downloadIconStyle}
            />
          </button>
          {false && (
            <div id='downloadPopUp' className='dropdown-capture'>
              <div className='row col-md-12 '></div>
              {this.state.downloads.length
                ? this.state.downloads.map((item, index) => (
                    <div
                      key={index}
                      className='capListItem border rounded m-2 shadow-sm'
                    >
                      <div className='pt-4 pb-4 pl-4'>
                        <b>{item.filename}.zip</b>
                        <p className='small text-muted'>
                          {item.title.toString()}
                        </p>
                        <button
                          className='openItem'
                          onClick={() => this.openItem(item.filePath)}
                        >
                          Open
                        </button>
                        <button
                          className='openItem'
                          onClick={() => this.openInFolder(item.filePath)}
                        >
                          Show in folder
                        </button>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          )}
        </div>
      </>
    )
  }
}
export default DownloadPopup
