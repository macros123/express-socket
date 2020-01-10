import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class Landing extends Component {
    
    render() {
        const gameLink = (
            <ul>
                <li><Link to='/game' className="game-link">
                Play XO
            </Link></li>
            <li><Link to='/poker' className="game-link">
                Play Peker
            </Link></li>
            </ul>
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