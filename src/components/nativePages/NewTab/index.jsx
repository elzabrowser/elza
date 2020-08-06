import React from 'react'
import './main.css'
import binglogo from './bing.png'
import googlelogo from './google.png'
import ducklogo from './duck.png'
import Sharing from '../Sharing'
import Osint from '../Osint'
import { Dropdown } from 'react-bootstrap'
class NewTab extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      borderBottomRightRadius: '30px'
    }
    this.searchEngine = 'google.com'
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
  componentDidMount () {
    this.setState({ searchEngine: 'google.com' })
    this.searchEngine = 'google.com'
    this.props.handleSearchEngineChange('google.com')
  }
  render () {
    return (
      <div className='new-tab-container container-fluid'>
        <div className='row p-3'>
          {/* <div className='ml-auto text-white'>
            <i className='fa fa-cog' />
          </div> */}
        </div>
        <div
          className='row'
          style={{
            paddingLeft: '100px',
            paddingRight: '100px',
            marginTop: '50px'
          }}
        >
          <div className=' col-md-11' style={{ paddingRight: '0px' }}>
            <form className='ml-auto mr-auto' onSubmit={this.props.submitURL}>
              <input
                className='new-tab-search-input shadow'
                type='text'
                onChange={this.props.handleChange}
                placeholder='Search or type in url'
              ></input>
              <input
                type='hidden'
                id='searchengine'
                name='searchengine'
                value={this.searchEngine}
              ></input>
            </form>
          </div>
          <div
            style={{
              background:
                'linear-gradient(to right, white 50%, transparent 50%)',
              borderTopRightRadius: '30px',
              borderBottomRightRadius: this.state.borderBottomRightRadius
            }}
            className='col-md-1'
          >
            <Dropdown
              onToggle={isopen => {
                if (isopen == true)
                  this.setState({ borderBottomRightRadius: '0px' })
                else this.setState({ borderBottomRightRadius: '30px' })
              }}
            >
              <Dropdown.Toggle
                style={{
                  backgroundColor: 'white',
                  border: '0px',
                  borderTopRightRadius: '30px',
                  borderBottomRightRadius: this.state.borderBottomRightRadius
                }}
                id='dropdown-toggle'
              >
                {this.state.searchEngine == 'google.com' && (
                  <img src={googlelogo} />
                )}{' '}
                {this.state.searchEngine == 'bing.com' && (
                  <img src={binglogo} />
                )}{' '}
                {this.state.searchEngine == 'duckduckgo.com' && (
                  <img src={ducklogo} />
                )}{' '}
              </Dropdown.Toggle>

              <Dropdown.Menu
                onChange={this.props.handleSearchEngineChange}
                className='dropmenu'
              >
                {this.state.searchEngine != 'google.com' && (
                  <Dropdown.Item
                    onClick={() => {
                      this.setState({ searchEngine: 'google.com' })
                      this.props.handleSearchEngineChange('google.com')
                    }}
                    className='dropitem bg-transparent'
                  >
                    <img src={googlelogo} />{' '}
                  </Dropdown.Item>
                )}
                {this.state.searchEngine != 'bing.com' && (
                  <Dropdown.Item
                    onClick={() => {
                      this.setState({ searchEngine: 'bing.com' })
                      this.props.handleSearchEngineChange('bing.com')
                    }}
                    className='dropitem bg-transparent'
                  >
                    <img src={binglogo} />{' '}
                  </Dropdown.Item>
                )}
                {this.state.searchEngine != 'duckduckgo.com' && (
                  <Dropdown.Item
                    className='dropitem bg-transparent'
                    onClick={() => {
                      this.setState({ searchEngine: 'duckduckgo.com' })
                      this.props.handleSearchEngineChange('duckduckgo.com')
                    }}
                  >
                    <img src={ducklogo} />{' '}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className='row'>
          <div className='container p-4'>
            <p>
              <span className='new-tab-cat-header'>Tools</span>
            </p>
            <div className='new-tab-tools'>
              {false && (
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
              )}
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
