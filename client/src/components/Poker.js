import React from 'react';
import jwt_decode from 'jwt-decode'
import UserList from './UserList';
import SockJS from 'sockjs-client'
import TableCards from './poker/TableCards';




class Poker extends React.Component {

    constructor(props) {
        super(props);

        const sock = new SockJS('http://192.168.36.35:5000/echo')

        this.state = {
            first_name: '',
            money: 0,
            action: sock,
            users: [],
            players: [],
            table: []
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
           
            this.setState({ 
                users: message.users,
                players: message.players,
                table: message.table
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
            email: decoded.email,
            money: decoded.money
        })

    }

    componentWillUnmount() {
        this.state.action.close()
    }

    handleClick(i) {

        const payload = {
            user: this.state.first_name,
            sitting: true,
            clickOnPlace: i,
            money: this.state.money
        }
        this.state.action.send(JSON.stringify(payload))
    }
    handleStand() {

        const payload = {
            user: this.state.first_name,
            standing: true
        }
        this.state.action.send(JSON.stringify(payload))
    }
 
    restart() {
        const payload = {
            user: this.state.first_name,
            reload: true
        }
        this.state.action.send(JSON.stringify(payload))
    }

    nextStep() {
        const payload = {
            user: this.state.first_name,
            next: true
        }
        this.state.action.send(JSON.stringify(payload))
    }

    render() {

        const reload = (
                    <button onClick={() => this.restart()}>Restart</button>
            );        

            const getCard = (
                <button onClick={() => this.nextStep()}>Next step</button>
        );  
        let status = 'msg';

        const addButton = i => {
            return (
                <button className="one-place" key={i} onClick={() => this.handleClick(i)}>Присесть {i}</button>
            )
        }
        const addButtons = () => {
            let temp = []
            if(this.state.players.find(el => el.name === this.state.first_name)) {
                return (
                    <button className="stand-up" onClick={() => this.handleStand()}>Встать</button>
                )
            }
            else {
                
                this.state.players.forEach((el, i) => {
                    if(el.isEmpty) {
                        temp.push(addButton(i))
                    }
                })
                return <div>{temp}</div> 
            }
            
        }
        return (
            <div className="game">
                <div className="game-board">
                    Hello {this.state.first_name}
                    {addButtons()}
                    <TableCards {... this.state} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    {reload}
                    {getCard}
                    
                </div>
                <UserList {... this.state} />
            </div>
        );
    }
}



export default Poker

