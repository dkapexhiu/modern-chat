var wwwhisper = require('connect-wwwhisper');
const express = require('express');
const app = express();

// app holds a reference to express or connect framework, it
// may be named differently in your source file.
app.use(wwwhisper());

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(process.env.PORT || 3000);

//socket.io instantiation
const io = require("socket.io")(server)

//listen on every connection
io.on('connection', (socket) => {

	//default username
	socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	io.sockets.emit('typing', {username : socket.username})
    })

    socket.on('disconnect', (data) => {
        io.sockets.emit('userLeft', {username: socket.username});
    });
})
