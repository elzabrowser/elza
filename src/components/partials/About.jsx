import React from 'react'
import '../../assets/css/about.css'
class About extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sentFeedback: 'no',
      feedbackData: {},
      version: window.preloadAPI.send('appVersion', '', true)
    }
  }

  componentDidMount () {}
  handleKeyDown (e) {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
  }
  onchangeHandler = e => {
    let feedback = this.state.feedbackData
    feedback[e.target.name] = e.target.value
    this.setState({
      feedbackData: feedback
    })
  }
  openUrl = url => {
    window.preloadAPI.send('openNewTab', url, false)
  }
  submitFeedback = e => {
    this.setState({ sentFeedback: 'sending' })
    e.preventDefault()
    let feedback = this.state.feedbackData
    window.preloadAPI.send('sendFeedback', feedback, false)
    setTimeout(() => {
      this.setState({ sentFeedback: 'yes' })
      setTimeout(() => {
        this.setState({ sentFeedback: 'no' })
      }, 2000)
    }, 3000)
  }

  render () {
    return (
      <>
        <div>
          <h5 className='mb-1'>Elza Browser</h5>
          <p className='text-color-secondary'>
            Version: {this.state.version} (Prerelease)
          </p>
          <br />
          <div>
            <h5 className='font-weight-light'>
              How can we improve Elza Browser?
            </h5>
            <br />
            <div className='feedback rounded'>
              <form onSubmit={this.submitFeedback}>
                <textarea
                  className='rounded textarea p-3'
                  rows='2'
                  name='feedback'
                  ref='description'
                  form='usrform'
                  onChange={this.onchangeHandler}
                  placeholder='Congratulations and thanks for being our pre-release tester. Please tell us your thoughts...'
                  onKeyDown={this.handleKeyDown}
                  required
                ></textarea>
                <hr className='mb-0' />
                <input
                  type='text'
                  name='email'
                  ref='email'
                  className='rounded textarea pl-3 feedback-email'
                  onChange={this.onchangeHandler}
                  placeholder='email or name'
                ></input>

                <button className='mt-1 mr-2' title='Send' type='submit'>
                  <i
                    className={
                      this.state.sentFeedback === 'no'
                        ? 'fa fa-chevron-right'
                        : this.state.sentFeedback === 'yes'
                        ? 'fa fa-check'
                        : 'fas fa-circle-notch fa-spin'
                    }
                  ></i>
                </button>
              </form>
            </div>
          </div>
          <br />
          <br />
          <button
            className='preference-button'
            onClick={() => {
              this.openUrl('https://rzp.io/l/elzabrowser')
            }}
          >
            <i className='fa fa-heart mr-3'></i>Donate to keep this project
            alive
          </button>
          <br />
          <br />
          <div
            className='about-contribute'
            onClick={() => {
              this.openUrl(
                'https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAANAAQUy0k5UMDAwTVgxUFo3WDBRWlgxR1VaSldVRzNRUi4u'
              )
            }}
          >
            <i className='fa fa-laptop-code mr-2' /> Do you speak our language?
            Join us on devloping Elza!
          </div>
          <br />
          <br />
          <br />
          <br />
        </div>
      </>
    )
  }
}
export default About
