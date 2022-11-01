import http from 'http'
import fs from 'fs'
import {Server} from 'socket.io'

const httpServer=http.createServer()

const io=new Server(httpServer)

httpServer.on("request",(req,res)=>{
    if(req.url==='/'){
        const fileContent=fs.readFileSync('index.html')
        res.end(fileContent.toString())
    }
   
})

io.on("connection",(socket)=>{
    console.log("client connected");
    socket.on("new user",(username)=>{
        //tutalim chatda bir nece adam var bu broadcast ile menden basqa hamiya bu event gedir
        socket.broadcast.emit("new user",username)
    })

    

    socket.on("new message",(data)=>{
        socket.broadcast.emit(data)
    })
})











httpServer.listen(3000,()=>console.log("Server listening"))