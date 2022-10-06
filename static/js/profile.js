const host = 'http://' + window.location.host + '/';
let username = window.location.pathname.replace('/accounts/account_details/', '').replace('/', '');

const backButton =  document.getElementById('backButton');
const userID = document.getElementById('userID');
const userRooms = document.getElementById('userRooms');
const sendPrivateMessage = document.getElementById('sendPrivateMessage');
const userProfileTitle = document.getElementById('userProfileTitle');
const pageContentContainer = document.getElementById('pageContentContainer');
const userAvatar = document.getElementById('userAvatar');

let responseFlag
let userExistFlag

backButton.addEventListener('click', ()=>location.replace(`${host}chat/`));

fetch(`${host}chat/api/v1/accounts/detail/${username}/`).then(response => {
    responseFlag = response.ok;
    return response.json();
}).then(userData =>{
    if (responseFlag) {
        userExistFlag = true;
        userAvatar.src = userData['avatar'];
        userID.textContent = userData['username'];
        userProfileTitle.textContent = userData['username'];
        fetch(`${host}chat/api/v1/get_rooms_of_user/${username}/`).then(response => response.json()).then(rooms=>{
            let roomsArray = [];
            rooms.forEach(obj => {roomsArray.push(obj['name'])});
            userRooms.insertAdjacentHTML('beforeend', roomsArray.join(', '))
        }).catch(ev=>console.log(`Error: ${ev}`))
    } else {
        userExistFlag = false;
        pageContentContainer.innerHTML = ''
        let messagesArray = [];
        Object.values(userData).map(value => messagesArray.push(value));
        messagesArray.forEach(value => {
            pageContentContainer.insertAdjacentHTML('beforeend', `<h1 class="name" id="userID" style="color: black">${value}</h1>`)
        })
    }
}).catch(ev=>console.log(`Error: ${ev}`));

setTimeout(()=>{
    if (userExistFlag){
        fetch(`${host}chat/api/v1/accounts/get_user/`).then(response => response.json()).then(user => {
            sendPrivateMessage.addEventListener('click', ()=>{
                location.replace(`${host}chat/direct/${user.username}.${username}/`)
            })
        }).catch(ev=>console.log(`Error: ${ev}`))
    }
}, 500)

if (document.querySelector('.messagelist')){
    setTimeout(()=>document.querySelector('.messagelist').remove(), 3000);
}