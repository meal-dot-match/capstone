import React from 'react'
import {Link} from 'react-router-dom'
import Text from './text'
import {Row, Col, Container, Button, Image} from 'react-bootstrap'

class SingleRecipe extends React.Component {
  constructor() {
    super()
    this.state = {
      isShowing: false
    }
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit() {
    this.setState({
      isShowing: !this.state.isShowing
    })
  }
  render() {
    console.log('WHAT ARE MY PROPS?????', this.props.location.state)
    const recipe = this.props.location.state
    return (
      <Container className="single-recipe-container">
        <Row>
          <Col xs={6} md={6} lg={6}>
            <img src={recipe.image} />
          </Col>
          <Col xs={6} md={6} lg={6}>
            <Row className="single-recipe-row">
              <h3>{recipe.label}</h3>
            </Row>
            <Row className="single-recipe-row">Recipe Url: {recipe.url}</Row>
            <Row className="single-recipe-row">
              Want to purchase missing ingredients?
            </Row>
            <Row>
              <Button onClick={this.onSubmit}>Send via Text</Button>
            </Row>
            {this.state.isShowing ? <Text /> : null}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default SingleRecipe
