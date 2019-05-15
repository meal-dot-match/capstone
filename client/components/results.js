/* eslint-disable max-statements */
/* eslint-disable complexity */
import React from 'react'
import {Row, Col, Container, Button, Jumbotron, Image} from 'react-bootstrap'
import {graphql, Query} from 'react-apollo'
import {gql} from 'apollo-boost'
import {Link} from 'react-router-dom'

const getMealsQuery = gql`
  query($food: String) {
    searchRecipes(food: $food) {
      uri
      url
      label
      image
      calories
      totalTime
      ingredientLines
    }
  }
`

class Results extends React.Component {
  sendStringToQuery() {
    let timeString = '&time=1%2B'

    if (this.props.location.state.time === '< 30 mins') {
      timeString = '&time=1-30'
    } else if (this.props.location.state.time === '< 60 mins') {
      timeString = '&time=1-60'
    } else if (this.props.location.state.time === '< 90 mins') {
      timeString = '&time=1-90'
    } else {
      timeString = '&time=1-240'
    }

    let stringQuery =
      this.props.location.state.theMeats
        .concat(this.props.location.state.theSeafood)
        .join('+')
        .replace(/\s/g, '') + timeString

    if (
      this.props.location.state.theMeats.length === 0 &&
      this.props.location.state.theMeats.length === 0
    ) {
      stringQuery = 'vegetarian' + timeString
    }

    return stringQuery
  }
  render() {
    const {theIngredients} = this.props.location.state
    const food = this.sendStringToQuery()

    return (
      <Query query={getMealsQuery} variables={{food}}>
        {({loading, error, data}) => {
          if (loading) return 'Loading...'
          if (error) return `Error! ${error.message}`
          const tracker = []
          const ourIngredientsArr = theIngredients
          const totalRecipesArr = data.searchRecipes

          for (let i = 0; i < totalRecipesArr.length; i++) {
            let recipeIngredientsStr = totalRecipesArr[i].ingredientLines
              .join('')
              .toLowerCase()
            let lowerCasedIngredientsArr = ourIngredientsArr.map(x =>
              x.toLowerCase()
            )

            let filteredIngredients = lowerCasedIngredientsArr.filter(
              ingredient => recipeIngredientsStr.includes(ingredient)
            )

            let percentage =
              filteredIngredients.length /
              totalRecipesArr[i].ingredientLines.length

            let filteredObj = {}
            filteredObj.name = totalRecipesArr[i].label
            filteredObj.percent = Number(percentage)

            tracker.push(filteredObj)
            tracker.sort(function(a, b) {
              return b.percent - a.percent
            })
          }

          const renderArr = []

          const top5 = tracker.slice(0, 5)
          let addedName = []

          if (totalRecipesArr.length !== 0) {
            for (let i = 0; i < 5; i++) {
              let name = top5[i].name
              for (let j = 0; j < totalRecipesArr.length; j++) {
                if (totalRecipesArr[j].label === name) {
                  let obj = {}
                  let lowerCasedIngredientsArr = ourIngredientsArr.map(x =>
                    x.toLowerCase()
                  )
                  const replaceCommas = str => {
                    return str.replace(/,/gi, '')
                  }
                  let lowerCasedTotalRecipesArr = totalRecipesArr[
                    j
                  ].ingredientLines.map(x => x.toLowerCase())

                  lowerCasedTotalRecipesArr = lowerCasedTotalRecipesArr.map(x =>
                    replaceCommas(x)
                  )
                  obj.calories = totalRecipesArr[j].calories
                  obj.image = totalRecipesArr[j].image
                  obj.url = totalRecipesArr[j].url
                  obj.totalTime = totalRecipesArr[j].totalTime
                  obj.label = totalRecipesArr[j].label
                  obj.ingredients = totalRecipesArr[j].ingredientLines
                  obj.percentage = tracker[i].percent
                  obj.missingIngredients = lowerCasedTotalRecipesArr.filter(
                    function(x) {
                      let split = x.split(' ')
                      return !split.some(
                        y => lowerCasedIngredientsArr.indexOf(y) >= 0
                      )
                    }
                  )
                  if (!addedName.includes(obj.label)) {
                    renderArr.push(obj)
                    addedName.push(obj.label)
                  }
                }
              }
            }
          }

          return (
            <div className="matches-background">
              <Jumbotron className="matches-banner">
                <Container xs={6} md={6} lg={6}>
                  <Row>
                    <Col className="matches-text">
                      <h1>Here Are Your Top 5 Recipe Matches!</h1>
                      <h4>
                        <strong>
                          <i>How </i>
                        </strong>
                        is the percentage match calculated?
                      </h4>
                      <p>
                        We use: the ingredients you input / the number of total
                        ingredients for the recipe
                      </p>
                    </Col>
                  </Row>
                </Container>
              </Jumbotron>
              <Container>
                {totalRecipesArr.length !== 0 ? (
                  <div>
                    <Container style={{padding: 35}}>
                      <Col xs={4} md={4} lg={4}>
                        <Row className="matches-group">
                          {renderArr.map((x, idx) => (
                            <Col key={Math.random()}>
                              {console.log('what is my x?', x)}
                              <Row className="matches-background">
                                <Image
                                  src={x.image}
                                  className="matches-image"
                                />
                                <Container>
                                  <h2 className="matches-title">{x.label}</h2>
                                  <h3 className="matches-title">
                                    {(Number(x.percentage) * 100).toFixed(2)} %
                                    match
                                  </h3>
                                  <Link
                                    className="matches-img-overlay"
                                    to={{
                                      pathname: `/recipes/${x.label}`,
                                      state: {
                                        index: idx,
                                        matchingRecipes: renderArr,
                                        label: x.label,
                                        url: x.url,
                                        ingredients: x.ingredients,
                                        image: x.image,
                                        time: x.totalTime,
                                        percent: (
                                          Number(x.percentage) * 100
                                        ).toFixed(2)
                                      }
                                    }}
                                  >
                                    <Button
                                      variant="outline-info"
                                      className="results-button-outline"
                                      size="sm"
                                    >
                                      Recipe Details
                                    </Button>
                                  </Link>
                                </Container>
                              </Row>
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Container>
                  </div>
                ) : (
                  <div>
                    <h3>
                      No recipes found :( Please go back and fill out your
                      choices again!
                    </h3>
                    <Link to="/quiz">
                      <Button className="btn-responsive" size="lg">
                        Re-take Quiz
                      </Button>
                    </Link>
                  </div>
                )}
              </Container>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default graphql(getMealsQuery)(Results)
