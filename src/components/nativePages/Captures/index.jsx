import React from 'react'
import { Container } from 'react-bootstrap'
import { listCaptures } from '../../../functions/capturedb.js'
import zipicn from './file-zip.png'

const { shell } = window.require('electron')
class Captures extends React.Component {
  constructor () {
    super()
    this.state = {
      capturelist: []
    }
  }
  componentDidMount () {
    this.getCaptureList()
  }
  getCaptureList = async () => {
    this.setState({ capturelist: await listCaptures() })
  }
  openInFolder = path => {
    shell.showItemInFolder(path)
  }
  openItem = path => {
    shell.openItem(path)
  }
  updateList = async () => {
    this.setState({ capturelist: await listCaptures() })
  }

  render () {
    return (
      <Container>
        <h5 className='m-4'>{this.state.capturelist.length} Captures</h5>
        {this.state.capturelist.length
          ? this.state.capturelist.map((item, index) => (
              <div
                key={index}
                className='capListItem border rounded m-2 shadow-sm'
              >
                <div className='icnCtr p-4 border-right'>
                  <img src={zipicn} alt='zip icon' />
                </div>
                <div className='pt-4 pb-4 pl-4'>
                  <b>{item.filename}.zip</b>
                  <p className='small text-muted'>
                    {item.timeStamp.toString()}
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
      </Container>
    )
  }
}

export default Captures
