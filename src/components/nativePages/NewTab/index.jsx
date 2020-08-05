import React from 'react'
import './main.css'
import Sharing from '../Sharing'
import Osint from '../Osint'

class NewTab extends React.Component {
  constructor (props) {
    super(props)
  }

  openInNewTab = (title, src, comp, icon) => {
    let tab = this.props.tabGroup.addTab({
      title: title || 'File Sharing',
      src: src || 'elza://share',
      icon: 'fa fa-grip-horizontal' || icon,
      isNative: true,
      comp: comp || Sharing,
      webviewAttributes: {
        useragent:
          'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0 Elza Browser'
      }
    })
    this.props.tab.close()
    tab.activate()
  }
  render () {
    return (
      <div className='new-tab-container container-fluid'>
        <div className='row p-3'>
          {/* <div className='ml-auto text-white'>
            <i className='fa fa-cog' />
          </div> */}
        </div>

        <div className='row'>
          <div className='container p-4'>
            <form className='ml-auto mr-auto' onSubmit={this.props.submitURL}>
              <input
                className='new-tab-search-input shadow'
                type='text'
                onChange={this.props.handleChange}
                placeholder='Search or type in url'
              ></input>
            </form>
          </div>
        </div>
        <div className='row'>
          <div className='container p-4'>
            <p>
              <span className='new-tab-cat-header'>Tools</span>
            </p>
            <div className='new-tab-tools'>
              <div className='new-tab-tool p-2'>
                <button
                  className='new-tab-tool-button shadow rounded-circle'
                  onClick={() =>
                    this.openInNewTab(
                      'file Sharing',
                      'elza://share',
                      Sharing,
                      'fa fa-share-alt'
                    )
                  }
                >
                  FS
                </button>
                <br />
                <label>File sharing</label>
              </div>
              <div className='new-tab-tool p-2'>
                <button
                  className='new-tab-tool-button shadow rounded-circle'
                  onClick={() =>
                    this.openInNewTab(
                      'OSINT',
                      'elza://osint',
                      Osint,
                      'fa fa-share-alt'
                    )
                  }
                >
                  OS
                </button>
                <br />
                <label>OSINT</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default NewTab
