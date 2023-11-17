const chat=document.getElementById('form');
chat.addEventListener('submit',messageInput);

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
    const headers={
        'Authorization':localStorage.getItem('g-chat_token')
    }
    console.log(headers);
    const newMessage=await axios.post('http://localhost:4000/chatHome',{message},{headers});
    if(newMessage.status===200)
    {
        alert('message stored');
    }
    }catch(err)
    {
        if(err.response.status===400)
        {
            console.log(err);
        }else alert('user not authorized');
    }
    
}
