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
        window.location.reload();
    }
    }catch(err)
    {
        if(err.response.status===400)
        {
            console.log(err);
        }else alert('user not authorized');
    }
    
}
const box= document.getElementById('chatBox');
const ul=document.createElement('ul');
async function displayMessages(message)
{
    
    const text=document.createTextNode(message);
    const li=document.createElement('li');
    li.appendChild(text);
    ul.appendChild(li);
    
    return;
}



document.addEventListener('DOMContentLoaded',showMessages);

async function showMessages()
{
    try{
        console.log('entere show');
        const chat=await axios.get('http://localhost:4000/chatHome',{headers});
        if(chat.status === 200)
        {
           
            for(let i=0;i<chat.data.chats.length;i++)
            {
                displayMessages(chat.data.chats[i].message);
            }
        }
    }catch(err)
    {
        
        console.log(err);
    }
}

box.appendChild(ul);