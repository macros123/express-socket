const express = require("express")
const http = require('http')
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")
const port = process.env.PORT || 5000

const sockjs = require('sockjs');
const echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });



app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)
//base
const mongoURL = 'mongodb://localhost:27017/mernloginreg'

mongoose
    .connect(mongoURL, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))


//routes
const Users = require('./routes/Users')
app.use('/users', Users)


app.get('/profile', (req, res) => {
    const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    User.findOne({
        _id: decoded._id
    })
    .then(user => {
        if(user) {
           res.json(user) 
        } else {
            res.send("User does not exist")
        }
    })
    .catch(err => {
        res.send('error'+ err)
    })
})



// userList
const USER_LIST = []
const connection = []

const players = new Array(6).fill({
    isEmpty: true,
    name: '',
    money: '',
    cards: []    
})

let table = new Array(5).fill({
    suit: null,
    rank: null
})

echo.on('connection', function (conn) {
    let currentUser = {
        id: Math.random(),
        name: ''
    }
    setInterval(() => {
        const payload = {
            users: USER_LIST,
            players: players,
            table: table
        }
        conn.write(JSON.stringify(payload))
    }, 100)

    conn.on('data', function (message) {
        const mess = JSON.parse(message)
        const user = mess.user
        currentUser.name = user
        if(mess.login) {
            connection.push(currentUser)
        }
        if (USER_LIST.indexOf(user) < 0) {
            USER_LIST.push(user)
            
        }
        if(mess.clickOnPlace >= 0) {
            const place = mess.clickOnPlace
            const name = mess.user
            const money = mess.money
            players[place] = {
                isEmpty: false,
                name: name,
                money: money,
                cards: []    
            }
            console.log(players)
        }


        if(mess.next) {
            for(let i = 0; i < table.length; i++) {
                if(!table[i].rank) {
                    table[i] = getOneCard(curDeck)
                    break
                }
            }
        }

        if(mess.reload) {
            curDeck = createDeck(suit, rank)
            table = new Array(5).fill({
                suit: null,
                rank: null
            })
        }
        
        if(mess.standing) {
           const name = mess.user
           const index = players.findIndex(el => el.name == name)
           players[index] = {
            isEmpty: true,
            name: '',
            money: '',
            cards: []    
        }
        }
    });

    conn.on('close', () => {
        connection.splice(connection.indexOf(currentUser), 1) 
        if (connection.every(curr => curr.name !== currentUser.name)) {
            USER_LIST.splice(USER_LIST.indexOf(currentUser.name), 1)
            players[players.findIndex(el => el.name == currentUser.name)] = {
                isEmpty: true,
                name: '',
                money: '',
                cards: []    
            }
        }
    })
});
const server = http.createServer(app);
echo.installHandlers(server, { prefix: '/echo' });

const suit = ["0", "1", "2", "3"]
const rank = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
const shuffle = arr => {
	var j, temp;
	for(var i = arr.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}
const createDeck = (suit, rank) =>{
    const temp = []
    for(const el of suit) {
        for(const el1 of rank) {
            temp.push({
                suit: el,
                rank: el1
            })
        }
    }
    return shuffle(temp)
}
let curDeck = createDeck(suit, rank)

const getOneCard = deck => deck.shift()


//

server.listen(port, '0.0.0.0', () => {
    console.log("server is running on port: " + port)
});