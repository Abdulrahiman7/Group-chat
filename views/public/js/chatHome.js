

const socket=io("http://15.206.79.217:5000");

socket.on("connect", () => {
    console.log("Connected to the WebSocket server");
});
socket.on("error", (error) => {
	    console.error("WebSocket Error:", error);
});


const headers={
    'Authorization':localStorage.getItem('g-chat_token')
}
const chat=document.getElementById('form');
chat.addEventListener('submit',messageInput);
async function messageInput(e)                              // controlling of new message sent
{
    try{
        e.preventDefault();
    const message=document.getElementById('message').value;
    const file=document.getElementById('file');
    if(!message && file.files.length==0)
    {
        return;
    }
    
    console.log(headers);
    const groupId=localStorage.getItem('activeGroup');
    
    const attachFile=file.files.length>0? file.files[0]: null;
    console.log(attachFile);

    const formData = new FormData();
      formData.append('file', attachFile);
      formData.append('message', message);
      formData.append('groupId', groupId);
    const newMessage=await axios.post('http://15.206.79.217/chatHome',formData,{headers});
    if(newMessage.status===200)
    {
        console.log(newMessage);
       getActiveGroupMessages();
       document.getElementById('message').value='';
       socket.emit('newMessage', groupId);
       return;
    }
    }catch(err)
    {
        if(err.status===400)
        {
            alert('user not authorized');
        }else console.log(err);
    }
    
}
const box= document.getElementById('chatBox');
const ul=document.createElement('ul');

async function displayMessages(newMessage,user)                         // displaying of  messages
{
    const text=document.createTextNode(newMessage.message);
    const li=document.createElement('li');
    if(newMessage.fileUrl)
    {
        const div=document.createElement('div');
        div.classList='attachedFile';
        const a=document.createElement('a');
        a.href=newMessage.fileUrl;
        a.download='download';
        const i=document.createElement('i');
        i.classList='fa-solid fa-download';
        a.appendChild(i);

        div.appendChild(a);
        li.appendChild(div);
    }
    
    
   if(user == newMessage.user.id)
   {
    li.setAttribute('class', 'userChatList');
   }else{
    const div=document.createElement('div');
    div.setAttribute('class','userName');
    
    const userName=document.createTextNode(newMessage.user.name+'  :');
    div.appendChild(userName);
    li.appendChild(div);
   }

   
    li.appendChild(text);
    ul.appendChild(li);
    
    return;
}


const groupUL=document.createElement('ul');
const groupListTable=document.getElementById('groupList');

async function displayGroups(groupId, groupName)                    //displaying of all groups in groupList
{
    const li=document.createElement('li');
    
    const button=document.createElement('button');
    button.setAttribute('id',groupId);
    button.setAttribute('class','groupListButton');
    button.textContent=groupName;

    li.appendChild(button);
    groupUL.appendChild(li);

    button.addEventListener('click', displayNewGroup); 
}

function getGroupList()                                         // function to display list of groups
{
    let previousChat=JSON.parse(localStorage.getItem('g-chat_messages'));
    if(previousChat.length>0)
    {
        for(let i=0;i<previousChat.length;i++)
    {
         displayGroups(previousChat[i].groupId, previousChat[i].groupName);
    }
    groupListTable.appendChild(groupUL);
    } 
}

function displayNewGroup(e)                             //function when clicked new group from group List
    {
        e.preventDefault;
        const activeGroup=e.target.id;
        socket.emit('leaveRoom',localStorage.getItem('activeGroup'));
        let previousChat=JSON.parse(localStorage.getItem('g-chat_messages'));
            const activeGroupIndex=previousChat.findIndex(group => group.groupId == activeGroup);
         if(activeGroupIndex !== -1)
            {
                localStorage.setItem('activeGroup',activeGroup);
               localStorage.setItem('lastChat-id',previousChat[activeGroupIndex].lastChat_id) ;
               const groupHeader=document.getElementById('groupHeader');
               groupHeader.innerHTML='';
                 const headerText=document.createTextNode(previousChat[activeGroupIndex].groupName);
                 groupHeader.appendChild(headerText);
               getActiveGroupMessages(); 
                socket.emit('joinRoom', activeGroup);
            }
    }

function getActiveGroupMessages()                       //function to display messages of the active group
{
    const activeGroup=localStorage.getItem('activeGroup');
    let previousChat=JSON.parse(localStorage.getItem('g-chat_messages'));
    const user=localStorage.getItem('g-chat_user');
    box.innerHTML='';
    if(previousChat.length>0)
    {
        const activeGroupIndex=previousChat.findIndex(group => group.groupId == activeGroup);
         if(activeGroup !== -1)
            {
                ul.innerHTML='';
                for(let j=previousChat[activeGroupIndex].message.length-1;j>=0;j--)
                    {
                        displayMessages(previousChat[activeGroupIndex].message[j], user);
                    }
                    box.appendChild(ul);
            }
    }
    
}


document.addEventListener('DOMContentLoaded',showMessagesfromLocal);        // controlling the first time and all time loading of application

async function showMessagesfromLocal()                                      // function when DOM is loaded
{
    try{
        const activeGroup=localStorage.getItem('activeGroup');
            if(!activeGroup)
            {
                const groupList= await axios.get('http://15.206.79.217/groupList',{headers});
                if(groupList.status===200)
                    {
                      const allMessages=groupList.data.allMessages;
                        const parsedAllMessages=JSON.stringify(allMessages);
                        localStorage.setItem('g-chat_messages',parsedAllMessages);
                        if(allMessages.length>0)
                        {
                            
                        localStorage.setItem('activeGroup',allMessages[0].groupId);
                        localStorage.setItem('g-chat_user',groupList.data.user);
                        localStorage.setItem('lastChat-id',allMessages[0].lastChat_id);
                        }
                        
                    }
            }
            getGroupList();
           getActiveGroupMessages();
            socket.emit('joinRoom',localStorage.getItem('activeGroup'));
    }catch(err)
    {
        console.log(err)
    }
}


// setInterval(showMessages,1000);             //Real time pulling of new messages after each second

socket.on('broadcastMessage', (groupId)=>{                      // Displaying new messages using websocket
    if(localStorage.getItem('activeGroup')==groupId)
    {
        showMessages();
    }
});

async function showMessages()               // funtion for time interval
{
    try{
        
        let id=localStorage.getItem('lastChat-id');
        const activeGroup=localStorage.getItem('activeGroup');

        const chat=await axios.get(`http://15.206.79.217/chatHome?prevId=${id}&groupId=${activeGroup}`,{headers});
        if(chat.status === 200)
        {
            let previousChat=JSON.parse(localStorage.getItem('g-chat_messages'));
            const activeGroupIndex=previousChat.findIndex(group => group.groupId == activeGroup);
         if(activeGroupIndex !== -1)
            {
                previousChat=JSON.parse(localStorage.getItem('g-chat_messages'));
                
                let updatedMessages = [...chat.data.messages, ...previousChat[activeGroupIndex].message].slice(0,10);
                
                
                previousChat[activeGroupIndex].message=updatedMessages;
                
                
                previousChat[activeGroupIndex].lastChat_id = updatedMessages[0].id;
                localStorage.setItem('lastChat-id',updatedMessages[0].id);
                localStorage.setItem('g-chat_messages',JSON.stringify(previousChat));

                getActiveGroupMessages();

                
            }

        }else if(chat.status === 201) return;
        else throw new Error();
    }catch(err)
    {
        console.log(err);
    }
}



