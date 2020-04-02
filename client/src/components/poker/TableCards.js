import React, { Component } from 'react'


function SingleCard1(props) {
    const card = props.card ? props.card : {
        suit: null,
        rank: null
    }
    return (
        <li className="element-card">
            {card.rank} {card.suit}
        </li>
    )
}
class TableCards extends Component {

    render() {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                   Table
                  <ul> 
                      {this.props.table.map((el, i) => {
                         return <SingleCard1 key={i} index={i} card={el} /> 
                      })}
                  
                  </ul>

                </div>
            </div>
        )
    }
}

export default TableCards