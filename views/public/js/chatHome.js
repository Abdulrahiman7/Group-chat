const chat=document.getElementById('form');
chat.addEventListener('submit',messageInput);
const headers={
    'Authorization':localStorage.getItem('g-chat_token')
}
async function messageInput(e)
{
    try{
        e.preventDefault();
    const message=document.getElementById('message').value;
    if(!message)
    {
        alert('enter message');
        return;
    }
    
    console.log(headers);
    const newMessage=await axios.post('http://localhost:4000/chatHome',{message},{headers});
    if(newMessage.status===200)
    {
        console.log(newMessage);
       displayMessages(newMessage.data.newChat.message);
       document.getElementById('message').value='';
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

async function displayMessages(newMessage)
{
   
    const text=document.createTextNode(newMessage);
    const li=document.createElement('li');
    li.appendChild(text);
    ul.appendChild(li);
    
    return;
}

setInterval(showMessages,1000);

document.addEventListener('DOMContentLoaded',showMessagesfromLocal);

async function showMessagesfromLocal()
{
    try{
        let previousChat=localStorage.getItem('g-chat_messages');
        if(!previousChat)
        {
            showMessages();

            return;
        }else{
            previousChat=JSON.parse(previousChat);
           
            if(previousChat.length>0)
        {
            for(let i=previousChat.length-1;i>=0;i--)
            {
                displayMessages(previousChat[i].message);
            }
            
        }else return;
        }
        
    }catch(err)
    {
        console.log(err)
    }
}

async function showMessages()
{
    try{
        let previousChat=localStorage.getItem('g-chat_messages');
        let id=0;
        let storedMessages=[];
        if(previousChat)
        {
            storedMessages=JSON.parse(previousChat);
            id=storedMessages[0].id;
        }
        const chat=await axios.get(`http://localhost:4000/chatHome?prevId=${id}`,{headers});
        if(chat.status === 200)
        {
            const parsedMessages=JSON.stringify(chat.data.chats);
           localStorage.setItem('g-chat_messages', parsedMessages);
            // for(let i=chat.data.chats;i>0;i--)
            // {
                
            //     displayMessages(chat.data.chats[i].message);
            // }
            window.location.reload();
        }else if(chat.status === 201) return;
        else throw new Error();
    }catch(err)
    {
        console.log(err);
    }
}

box.appendChild(ul);