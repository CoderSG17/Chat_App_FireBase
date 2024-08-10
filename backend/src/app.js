require("dotenv").config();
const express = require('express');
const {Server} = require( 'socket.io');
var http = require('http');
const app = express();
const cors = require("cors");
const server = http.createServer(app);


const io  = new Server(server,{
    cors:{
        origin: "http://localhost:5150",
        methods: ["GET, POST, PUT, DELETE, PATCH, HEAD"],
        credentials: true,
    }
})

app.use(cors());

io.on('connection',(socket)=>{
    // console.log(`User connected`)
    // console.log("Id" , socket.id)

    // particular user ko bhejna ho
    // socket.emit('welcome',`Hello welcome to chat app`)

    // // jo socket hai usse nhi jaayega message uske alawa sbko jaayega 
    // socket.broadcast.emit('welcome',`${ socket.id} joined the server`)
    
    socket.on('message',(data)=>{
        console.log(data)
        // io.emit('recieve-message',data) //sabko milega 
        // socket.emit('recieve-message',data) //apne aap ko  milega 
        socket.broadcast.emit('recieve-message',data) //apne aap ko chhodke sbko milega 


    })

    // yahan receive kr liye emit se jo bheja tha 
    socket.on('joined',({user})=>{
        console.log(`${user} joined the server`)
    })
        
            //for disconnecting
            // socket.on('disconnect',()=>{
            //     console.log(`User disconnected`,socket.id)
            // })
})


app.get('/', (req, res) => {
    res.send('Hello, world')
})


require('./db/conn') //for connecting to mongodb

const PORT = 5000;
server.listen(PORT,(req,res)=>{
    console.log(`Server running on port ${PORT}`);
})