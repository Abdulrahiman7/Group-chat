const form=document.getElementById('form');
form.addEventListener('submit',createUser);

async function createUser(e)
{
    try{
        e.preventDefault();
    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const number=document.getElementById('number').value;
    if(!name && !email && !password && !number)
    {
        alert('all the fields must be filled');
        return;
    }
    const newUser={
        name:name,
        email:email,
        password:password,
        number:number
    };
    const x=await axios.post('http://localhost:4000/signup',newUser);
    if(x.status==200){
        alert('Successfully signed up');
        window.location.href='../../login';
    }else if(x.status==400){
        alert('User already exists');
    }
    
    else throw new Error();
    }catch(err)
    {
        console.error({msg:err});
    }
}