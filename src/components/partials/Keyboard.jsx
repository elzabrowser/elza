import React from 'react'
import '../../assets/css/keyboard.css'
class Keyboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <div>
          <button className='key'>Ctrl + D</button> Clear current session
        </div>
        <br />
        <div>
          <button className='key'>Ctrl + T</button> Add new tab
        </div>
        <br />
        <div>
          <button className='key'>Ctrl + L</button> Focus URL bar
        </div>
        <br />
        <div>
          <button className='key'>Ctrl + C</button> Copy
        </div>
        <br />
        <div>
          <button className='key'>Ctrl + X</button> Cut
        </div>
        <br />
        <div>
          <button className='key'>Ctrl + V</button> Paste
        </div>
        <br />
        <div>
          <button className='key'>Ctrl + A</button> Select All
        </div>
      </div>
    )
  }
}
export default Keyboard
