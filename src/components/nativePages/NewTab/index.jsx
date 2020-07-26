import React from 'react'
import './main.css'
class NewTab extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="new-tab-container container-fluid">
        <div className="row p-3">
          <div className="ml-auto text-white">
            <i className="fa fa-cog" />
          </div>
        </div>
        <div className="row">
          <form className="ml-auto mr-auto">
            <input className="new-tab-search-input shadow" type="text" placeholder="Search or type in url"></input>
          </form>
        </div>
      </div>
    )
  }
}
export default NewTab