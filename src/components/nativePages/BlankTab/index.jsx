import React from 'react'
class BlankTab extends React.Component {
  constructor (props) {
    super(props)
  }
  getTime () {
    var dt = new Date()
    var h = dt.getHours(),
      m = dt.getMinutes()
    var _time =
      h > 12
        ? ('0' + (h - 12)).slice(-2) + ':' + ('0' + m).slice(-2) + ''
        : +('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ''
    return _time
  }
  render () {
    return (
      <div
        style={{
          backgroundColor: 'black',
          height: '100%',
          textAlign: 'center',
          padding: '250px 0'
        }}
      >
        <h1 style={{ color: 'white', fontSize: '100px' }}>{this.getTime()}</h1>
      </div>
    )
  }
}
export default BlankTab
