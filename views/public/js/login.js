

const form=document.getElementById('form');

form.addEventListener('submit',login);

async function login(e)
{
    try{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        if(!email || !password)
        {
            alert('Please fill all the fields');
            return;
        }
        const credentials={
            email:email,
            password:password
        }
        const login=await axios.post('http://localhost:4000/login',credentials);
        if(login.status==200)
        {
            localStorage.setItem('g-chat_token',login.data.token);
            localStorage.setItem('g-chat_userName',login.data.userName);
            window.location.href='http://127.0.0.1:5500/views/chatHome.html';
        }

    }catch(err)
    {
        if(err.response==401)
        {
            alert('User not authorized');
        }else if(err.response==404)
        {
            alert('User not found');
        }else{
            console.log(err);
        }
    }
    
    
}