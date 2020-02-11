import React, { Component } from 'react'

class TableCards extends Component {

    

    render() {
        let card =  this.props.table ? this.props.table.map((user, i) => {
            return <li className="element-card" key={i}>{user.rank} {user.suit}</li>
        }) : <li></li>
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                   Table
                  <ul> {card}
                  </ul>

                </div>
            </div>
        )
    }
}

export default TableCards