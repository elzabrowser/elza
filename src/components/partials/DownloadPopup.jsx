import React from 'react'
import Downloads from '../nativePages/Downloads'
import '../../assets/css/downloadpopup.css'
class DownloadPopup extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
    this.state = {
      downloads: {},
      isVisible: false
    }
  }

  componentDidMount () {
    window.preloadAPI.receive('downloadsChanged', arg => {
      this.setState({
        downloads: arg
      })
    })
  }
  getProgress = (receivedBytes, totalBytes) => {
    if (totalBytes === 0) return 0
    else {
      return ((receivedBytes / totalBytes) * 100).toFixed(2) + '%'
    }
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
              <div style={{ height: '200px' }}>
                <Downloads calledBy='popup' />
              </div>

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
