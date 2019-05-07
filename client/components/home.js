import React from 'react'
import {Link} from 'react-router-dom'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {}

  render() {
    return (
      <div>
        <Link to="/login">
          <button type="button">Sign In</button>
        </Link>

        <label>Been here before?</label>
        <br />
        <button>Match me!</button>
        <label>New Users</label>
      </div>
    )
  }
}

// const mapStateToProps

// const mapDispatchToProps

// export default connect(mapStateToProps, mapDispatchToProps)(Home)
