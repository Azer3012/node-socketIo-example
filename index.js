import http from 'http'
import fs from 'fs'
import {Server} from 'socket.io'

const httpServer=http.createServer()

const io=new Server(httpServer)

httpServer.on("request",(req,res)=>{

    if(req.url==='/s'){
        const fileContent=fs.readFileSync('index.html')
         res.end(fileContent.toString())

    }
    
    

})

const chatNamepaces=io.of("chat")

const socketMap={}

chatNamepaces.on("connection",(socket)=>{
    console.log("client connected id: "+socket.id);


    socket.on("join room",(data)=>{
        socket.join(data.room)
        socketMap[socket.id]=data
        socket.to(data.room).emit("new user",data.username)
    })


    

    

    socket.on("new message",(data)=>{
        const {username,message}=data

        const currentData=socketMap[socket.id]

        socket.to(currentData.room).emit("new message",{username,message})
    })

    socket.on("disconnect",()=>{
        console.log('client disconnected');

        const currentData=socketMap[socket.id]

        socket.to(currentData.room).emit("user left",currentData.username)
    })
})















httpServer.listen(3000,()=>console.log("Server listening"))