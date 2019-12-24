var http = require('http');
var sockjs = require('sockjs');
var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });

const USER_LIST = []
const connection = []

let curSquares = new Array(9).fill(null)
let xIsNext = true
const players = new Array(2).fill(null)
echo.on('connection', function (conn) {
    let currentUser = {
        id: Math.random(),
        name: ''
    }
    
    setInterval(() => {
        const payload = {
            users: USER_LIST,
            squares: curSquares,
            turn: xIsNext ? 0 : 1,
            sign: xIsNext ? 'X' : 'O',
            players: players
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
            if(!players[0]) {
                players[0] = user
            } else {
                if(!players[1]) {
                    players[1] = user
                }
            }
            
        }


        const squares = curSquares
        if(mess.clickOnDeck >= 0) {
            squares[mess.clickOnDeck] = xIsNext ? 'X' : 'O'
            xIsNext = !xIsNext
            curSquares = squares
        }

        if(mess.reload) {
            curSquares = new Array(9).fill(null)
        }        
    });

    conn.on('close', () => {
        connection.splice(connection.indexOf(currentUser), 1) 
        if (connection.every(curr => curr.name !== currentUser.name)) {
            USER_LIST.splice(USER_LIST.indexOf(currentUser.name), 1)
        }
    })
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(9999, '0.0.0.0', () => {
    console.log("server is running on port: 9999")
  });