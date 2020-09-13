import React from 'react'
class BlankTab extends React.Component {
  state = {
    time: ''
  }
  componentDidMount () {
    setInterval(() => {
      this.setState({
        time: this.getTime()
      })
    }, 1000)
  }
  getTime () {
    var dt = new Date()
    var h = dt.getHours(),
      m = dt.getMinutes()
    var time =
      h > 12
        ? ('0' + (h - 12)).slice(-2) + ':' + ('0' + m).slice(-2) + ''
        : +('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ''
    return time
  }
  render () {
    return (
      <div
        style={{
          backgroundColor: 'var(--background-color-secondary)',
          display: 'flex',
          height: '99vh',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none'
        }}
      >
        <h1
          style={{
            color: 'var(--font-color-secondary)',
            fontSize: '100px',
            fontWeight: '100',
            marginBottom: '100px'
          }}
        >
          {this.getTime()}
        </h1>
      </div>
    )
  }
}
export default BlankTab
