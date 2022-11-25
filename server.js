const path = require("path");
const http = require('http');
const express = require('express');
const connection = require('./config/connection.j');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const data = require('./config/connection.j');


// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Box';

console.log("Git Test")
//run when a client connects

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        // welcome current user
        socket.emit('message', formatMessage(botName, "welcome to ChatCode"));
        //broadcast when a user conects

        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, ` ${user.username} has joined the chat`));//all of clients
        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room, users: getRoomUsers(user.room)
        });
    });



    //listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        // console.log(msg);
        io.to(user.room).emit('message', formatMessage(user.username, msg));//emit everybody
    });

    //when client disconnect
    socket.on('disconnect', () => {
        // console.log("My socket id", socket.id)
        const user = userLeave(socket.id);
        
        if (user) {
            io.to(user.room)
                .emit('message',
                    formatMessage(botName, ` ${user.username} has left the chat`));

            // send users and rooom info
            io.to(user.room).emit(
                "roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });
});

const PORT = 8000 || process.env.PORT;

server.listen(PORT, async () => {
    console.log(`Server is listening on the port no is  ${PORT}`);
    await connection.conn();
});