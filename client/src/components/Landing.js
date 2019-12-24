import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class Landing extends Component {
    
    render() {
        const gameLink = (
            <Link to='/game' className="game-link">
                Play
            </Link>
        )
        
        const welcomeMessage = (
            <p>Добрый</p>
        )

        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">WELCOME</h1>
                    </div>
                    {localStorage.usertoken ? gameLink : welcomeMessage}
                </div>
            </div>
        )
    }
}

export default Landing