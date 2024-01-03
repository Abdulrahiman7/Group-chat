const {Server}=require("socket.io");

module.exports= (server) =>{
    const io=new Server(server, {
        cors: {
          origin: "http://127.0.0.1:5500", 
          methods: ["GET", "POST"]
        }
    });
    
    io.on('connection', socket =>{
        console.log(socket.id);

        socket.on('joinRoom', (groupId)=>{
            socket.join(groupId);
        });

        socket.on('newMessage', (groupId) =>{
            io.to(groupId).emit('broadcastMessage', groupId);
        });

        socket.on('leaveRoom',(groupId)=>{
            console.log('left group');
            
        });
    })

    
}