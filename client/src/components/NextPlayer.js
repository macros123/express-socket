import React, { Component } from 'react'



class NextPlayer extends Component {

    

    render() {
        
        let users = this.props.users.map((user, i) => {
            return <li className="list-of-users" key={i}>{user}</li>
        })
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    Current Users
                <ul>
                        {users}
                    </ul>


                </div>
            </div>
        )
    }
}


export default NextPlayer