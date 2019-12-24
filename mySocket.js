var http = require('http');
var sockjs = require('sockjs');
var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });

const USER_LIST = []
const connection = []

echo.on('connection', function(conn) {
   
    let currentUser = {
        id: Math.random(),
        name: ''
    }

    setInterval( () => {
        conn.write(JSON.stringify(USER_LIST))
    }, 100)

    conn.on('data', function(message) {
        currentUser.name = message
        if(USER_LIST.indexOf(message) < 0) {
            USER_LIST.push(message)
        }
        connection.push(currentUser)
        console.log(connection)
      });

      conn.on('close', () => {
        connection.splice(connection.indexOf(currentUser), 1)
        if(connection.every(curr => curr.name !== currentUser.name)) {
            USER_LIST.splice(USER_LIST.indexOf(currentUser.name), 1)
        }
      })
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(9999, '0.0.0.0', () => {
    console.log("server is running on port: 9999")
  });