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

class Game extends React.Component {

    constructor(props) {
        super(props);

        const sock = new SockJS('http://192.168.36.35:9999/echo')

        this.state = {
            xIsNext: true,
            first_name: '',
            last_name: '',
            email: '',
            action: sock,
            users: [],
            squares: [],
            turn: '',
            anotherPlayer: ''
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
            const squares = message.squares
            const turn = message.players[message.turn] === this.state.first_name
            if(message.players[0] === this.state.first_name) {
                this.setState({ 
                    users: users,
                    squares: squares,
                    turn: turn,
                    anotherPlayer: message.players[1]
                })
            } else {
                this.setState({ 
                    users: users,
                    squares: squares,
                    turn: turn,
                    anotherPlayer: message.players[0]
                })
            }
            
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
        const squares = this.state.squares
        if (calculateWinner(squares) || squares[i] || !this.state.turn) { 
            return;
        }

        this.setState({            
            xIsNext: !this.state.xIsNext
        })
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
        console.log(payload)
        this.state.action.send(JSON.stringify(payload))
    }

    render() {
        const current =this.state.squares;
        const winner = calculateWinner(current);

        const moves = (
                    <button onClick={() => this.jumpTo()}>Go to game start</button>
            );        

        let status;
        if (winner) {
            status = 'Winner: ' + (this.state.turn ? (this.state.anotherPlayer) : (this.state.first_name));
        } else {
            status = 'Next player: ' + (this.state.turn ? (this.state.first_name) : (this.state.anotherPlayer));
        }
        console.log(this.state.turn)

        return (
            <div className="game">
                <div className="game-board">
                    Hello {this.state.first_name}
                    <Board
                        squares={this.state.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    {moves}
                    
                </div>
                <UserList {... this.state} />
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export default Game

