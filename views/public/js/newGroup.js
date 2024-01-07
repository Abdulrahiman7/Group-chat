const newGroup=document.getElementById('newGroup');
const headers={
    'Authorization':localStorage.getItem('g-chat_token')
}
newGroup.addEventListener('submit', createGroup);

async function createGroup(e)
{
    try{
        e.preventDefault();
        const groupName=document.getElementById('group').value;
        const groupAbout=document.getElementById('about').value;
        const newGroup={
            group: groupName,
            about: groupAbout
        }
        
        const group=await axios.post('http://15.206.79.217/createGroup',{newGroup},{headers});
        if(group.status===200)
        {
            localStorage.removeItem('activeGroup');
            window.location.href='chatHome.html';
        }
    }catch(err)
    {
        console.log(err);
    }
}