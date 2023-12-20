document.addEventListener('DOMContentLoaded',function(){
    

    const user=localStorage.getItem('g-chat_user');
    const activeGroup=localStorage.getItem('activeGroup');
    let previousChat=JSON.parse(localStorage.getItem('g-chat_messages'));
    const activeGroupIndex=previousChat.findIndex(group => group.groupId == activeGroup);

    if(user == previousChat[activeGroupIndex].admin)
    {
        displayGroupOptions('Add User', 'addUser');
        displayGroupOptions('Manage Users', 'manageUsers');
        displayGroupOptions('Delete Group','deleteGroup');
    }
    displayGroupOptions('Exit Group','exitGroup');
    
});

const groupOptions=document.getElementById('groupOptions');
function displayGroupOptions(text, id)
{
    const textCont=document.createTextNode(text);
        const option1=document.createElement('option');
        option1.setAttribute('value',id);
        option1.appendChild(textCont);

        groupOptions.appendChild(option1);
}

groupOptions.addEventListener('change',handleChangeOptions);
function handleChangeOptions()
{
   
    const selectedOption=document.getElementById('groupOptions').value;
    console.log(selectedOption);
    switch(selectedOption)
    {
        case 'addUser':
            openModal('addUserModal');
            break;
        case 'manageUsers':
            openModal('manageUsersModal');
            break;
        case 'deleteGroup':
            openModal('deleteGroupModal');
            break;
        case 'exitGroup':
            openModal('exitGroupModal');
            break;
    }
    groupOptions.selectedIndex = 0;
}
const chatBody = document.getElementById('chat');
const overlay = document.querySelector('.overlay');

function openModal(modalId) {
    
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
  
    overlay.style.display='block';
    chatBody.style.pointerEvents = 'none';
}


function closeModal(modalId) {
    console.log(modalId)
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
   
    overlay.style.display='none';
    chatBody.style.pointerEvents = 'auto';     
}

const deleteGroup=document.getElementById('delete');
deleteGroup.addEventListener('click',deleteGrp);

async function deleteGrp(e)
{
    try{
        e.preventDefault();
    const groupId=localStorage.getItem('activeGroup');
    const deleteGrp=await axios.delete(`http://localhost:4000/deleteGroup/${groupId}`,{headers});
    if(deleteGrp.status=== 200)
    {
        console.log('entered delete');
        localStorage.removeItem('activeGroup');
        closeModal('deleteGroupModal');
        location.reload();
    }
    }catch(err)
    {
        console.log(err);
    }
    
}

const searchUser=document.getElementById('searchUser');

searchUser.addEventListener('submit',addUser);

async function addUser(e)
{
    try
    {
        e.preventDefault();
        const mobile=document.getElementById('userMobile').value;
        const groupId=localStorage.getItem('activeGroup');
        const userListBox=document.getElementById('userListBox');
        userListBox.innerHTML='';
        const members=await axios.get(`http://localhost:4000/searchUser?mobile=${mobile}`,{headers})
        if(members.status === 200)
        {
            const newMember=members.data.newUser;
            const nameTxt=document.createTextNode(newMember.name);
            const addUser=document.createElement('button');
            addUser.textContent='Add User';
            userListBox.appendChild(nameTxt);
            userListBox.appendChild(addUser);

            addUser.addEventListener('click',async function(e)
            {
                try{
                    e.preventDefault();
                    
                const addUser=await axios.get(`http://localhost:4000/addUser?groupId=${groupId}&userId=${newMember.id}`,{headers});
                if(addUser.status ===200)
                {
                    localStorage.removeItem('activeGroup');
                    closeModal('addUserModal');
                    location.reload();
                }

                }catch(err) {console.log(err)}
            })
        }else if(members.status === 201)
        {
            console.log('201');
            const txtnode=document.createTextNode('Users does not match');
            userListBox.appendChild(txtnode);
        }
    }catch(err)
    {
        console.log(err);
    }
    
}