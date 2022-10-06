const host = 'http://' + window.location.host + '/';
const CSRFtoken = document.cookie.replace('csrftoken=', '');
let username = window.location.pathname.replace('/accounts/account_details/', '').replace('/', '');

const backButton =  document.getElementById('backButton');
const passwordChangeButton = document.getElementById('passwordChangeButton');
const profileName = document.getElementById('profileName');
const profileAvatar = document.getElementById('profileAvatar');
const profileInputUsername = document.getElementById('profileInputUsername');
const profileInputEmail = document.getElementById('profileInputEmail');
const profileInputAvatar = document.getElementById('profileInputAvatar');
const submitButton = document.getElementById('submitButton');
const mainForm = document.querySelector('.main-form')

let responseFlag

const patchRequest = async function () {
    let data = new FormData();
    if (profileInputUsername.value) {
        data.append('username', profileInputUsername.value);
    }
    if (profileInputEmail.value) {
        data.append('email', profileInputEmail.value);
    }
    if (profileInputAvatar.value) {
        data.append('avatar', profileInputAvatar.files[0]);
    }
    if (data.has('username') || data.has('email') || data.has('avatar')) {
        return await fetch(`${host}chat/api/v1/accounts/detail/${username}/`, {
            method: 'PATCH',
            body: data,
            headers: {
                "X-CSRFToken": CSRFtoken
            }
        }).then(response => {
            responseFlag = response.ok
            return response.json()
        }).then(data => {
            if (responseFlag){
                let messageTable = document.createElement('ul');
                messageTable.className = 'messagelist';
                let message = document.createElement('li');
                message.textContent = 'Изменения успешно сохранены';
                messageTable.appendChild(message);
                mainForm.insertBefore(messageTable, mainForm.firstChild);
                setTimeout(()=>location.replace(`${host}accounts/account_details/${data['username']}/`), 1000)
            } else {
                let messageTable = document.createElement('ul');
                messageTable.className = 'messagelist-error';
                let message = document.createElement('li');
                let messagesArray = [];
                Object.values(data).map(value => messagesArray.push(value));
                messagesArray.forEach(value => {message.textContent = value; messageTable.appendChild(message);})
                mainForm.insertBefore(messageTable, mainForm.firstChild);
                setTimeout(()=>document.querySelector('.messagelist-error').remove(), 3000);
            }
        })
            .catch(ev=>console.log(`Error: ${ev}`))
    } else {
        alert('Вы ничего не изменили');
    }
}
profileName.textContent = username;
profileInputUsername.placeholder = username;


backButton.addEventListener('click', ()=>location.replace(`${host}chat/`));
passwordChangeButton.addEventListener('click', ()=> location.replace(`${host}accounts/password/change/`));
submitButton.addEventListener('click', ()=> patchRequest());

fetch(`${host}chat/api/v1/accounts/detail/${username}/`).then(response => response.json()).then(userData =>{
    profileAvatar.src = `${userData['avatar']}`;
    profileInputEmail.placeholder = userData['email'];
})

if (document.querySelector('.messagelist')){
    setTimeout(()=>document.querySelector('.messagelist').remove(), 3000);
}
