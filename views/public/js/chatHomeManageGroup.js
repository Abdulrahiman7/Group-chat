document.addEventListener('DOMContentLoaded',function(){
    

    const user=localStorage.getItem('g-chat_user');
    const activeGroup=localStorage.getItem('activeGroup');
    let previousChat=JSON.parse(localStorage.getItem('g-chat_messages'));
    const activeGroupIndex=previousChat.findIndex(group => group.groupId == activeGroup);
    const isAdmin=previousChat[activeGroupIndex].admin.includes(+user);
    if(isAdmin)
    {
        displayGroupOptions('Add User', 'addUser');
        displayGroupOptions('Manage Users', 'manageUsers');
        displayGroupOptions('Delete Group','deleteGroup');
    }
    displayGroupOptions('Exit Group','exitGroup');
    const groupHeader=document.getElementById('groupHeader');
    const headerText=document.createTextNode(previousChat[activeGroupIndex].groupName);
    groupHeader.appendChild(headerText);
});

const groupOptions=document.getElementById('groupOptions');
function displayGroupOptions(text, id)                              //function displaying group options in dropdown list
{
    const textCont=document.createTextNode(text);
        const option1=document.createElement('option');
        option1.setAttribute('value',id);
        option1.appendChild(textCont);

        groupOptions.appendChild(option1);
}

groupOptions.addEventListener('change',handleChangeOptions);
function handleChangeOptions()                                      //function handling options in dropdown list
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
    if(modalId === 'manageUsersModal')
    {
        manageGroupUsers();
    }
}

function closeModal(modalId) {
    console.log(modalId)
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
   
    overlay.style.display='none';
    chatBody.style.pointerEvents = 'auto';     
}

const userList=document.getElementById('usersList');
async function manageGroupUsers()                           //function to manage user option from dropdown list
{
    try{
        const groupId=localStorage.getItem('activeGroup');
        
        userList.innerHTML='';
        const currentUser=localStorage.getItem('g-chat_user');
        const allMembers=await axios.get(`http://localhost:4000/manageGroup?groupId=${groupId}`,{headers});
        if(allMembers.status ===200)
        {
            const members=allMembers.data.members;
            for(let i=0;i<members.length;i++)
            {
                
                const li=document.createElement('li');
                li.setAttribute('id',members[i].userId);
                const nameText=document.createTextNode(members[i].user.name+'-  '+members[i].user.number);
                li.appendChild(nameText);

                const prevChat=JSON.parse(localStorage.getItem('g-chat_messages'));
                const activeGroupIndex=prevChat.findIndex(group => group.groupId == groupId);
                const isAdmin=prevChat[activeGroupIndex].admin.includes(members[i].userId);
                if(!isAdmin)
                {
                const addAdminButton=document.createElement('button');
                addAdminButton.textContent='Make Admin';
                addAdminButton.classList='addAdmin';
                const removeUserButton=document.createElement('button');
                removeUserButton.textContent='remove User';
                removeUserButton.classList='removeUser';
                
                li.appendChild(addAdminButton);
                li.appendChild(removeUserButton);
                 }else{
                    const adminText=document.createTextNode('---Admin');
                    li.appendChild(adminText);
                 }
                userList.appendChild(li);
            }
        }
    }catch(err)
    {
        console.log(err);
    }
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
        const members=await axios.get(`http://localhost:4000/searchUser?mobile=${mobile}&groupId=${groupId}`,{headers})
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
                    closeModal('addUserModal');
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

userList.addEventListener('click',function(e){
    e.preventDefault();
    if (e.target.classList.contains('removeUser') || e.target.classList.contains('addAdmin')) {
        const userId = e.target.parentElement.id;
        
        if (e.target.classList.contains('removeUser')) {
            exitGrp(userId, false);
        } else if (e.target.classList.contains('addAdmin')) {
            addAdmin(userId);
        }
    }
});

async function addAdmin(userId)
{
    try{
    
        const groupId=localStorage.getItem('activeGroup');
        const addNewAdmin=await axios.get(`http://localhost:4000/addAdmin?groupId=${groupId}&userId=${userId}`,{headers});
        if(addNewAdmin.status=== 200)
        {
            closeModal('manageUsersModal');
            localStorage.removeItem('activeGroup');
            location.reload();
            openModal('manageUsersModal');
        }
        }catch(err)
        {
            console.log(err);
        }
}
const exitAdmin=document.getElementById('exit');
exitAdmin.addEventListener('click',function(e)
{
    e.preventDefault();
    const userId=localStorage.getItem('g-chat_user');
    exitGrp(userId, true);
});

async function exitGrp(userId, isAdmin)
{
    try{
    
    const groupId=localStorage.getItem('activeGroup');
    const deleteGrp=await axios.delete(`http://localhost:4000/exitGroup?groupId=${groupId}&userId=${userId}&isAdmin=${isAdmin}`,{headers});
    if(deleteGrp.status=== 200)
    {
        localStorage.removeItem('activeGroup');
        location.reload();
        if(isAdmin)
        {
            
            closeModal('exitGroupModal');
        }else{
            closeModal('manageUsersModal');
            openModal('manageUsersModal');
        }
    }
    }catch(err)
    {
        console.log(err);
    }
    
}

