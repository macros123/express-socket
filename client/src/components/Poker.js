import React from 'react';
import jwt_decode from 'jwt-decode'
import UserList from './UserList';
import SockJS from 'sockjs-client'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Poker extends React.Component {

    constructor(props) {
        super(props);

        const sock = new SockJS('http://192.168.36.35:5000/echo')

        this.state = {
            first_name: '',
            action: sock,
            users: []
        };

        sock.onopen = () => {
            console.log('connection open')
            const payload = {
                user: this.state.first_name,
                login: true
            }
            this.state.action.send(JSON.stringify(payload))
        }

        sock.onmessage = e => {
            let message = JSON.parse(e.data)
            const users = message.users
            this.setState({ 
                users: users
            })
            
        };

        sock.onclose = () => {
            console.log('close')
        }
    }

    componentDidMount() {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        this.setState({
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            email: decoded.email
        })

    }

    componentWillUnmount() {
        this.state.action.close()
    }

    handleClick(i) {

        const payload = {
            user: this.state.first_name,
            clickOnDeck: i
        }
        this.state.action.send(JSON.stringify(payload))
    }
 
    jumpTo() {
        this.setState({
            xIsNext: true,
        });
        const payload = {
            user: this.state.first_name,
            reload: true
        }
        this.state.action.send(JSON.stringify(payload))
    }

    render() {

        const moves = (
                    <button onClick={() => this.jumpTo()}>Go to game start</button>
            );        

        let status = 'msg';

        return (
            <div className="game">
                <div className="game-board">
                    Hello {this.state.first_name}
                    
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    
                </div>
                <UserList {... this.state} />
            </div>
        );
    }
}



export default Poker

