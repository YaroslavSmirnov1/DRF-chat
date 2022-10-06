const host = 'http://' + window.location.host + '/'
const chatRoomName = JSON.parse(document.getElementById('direct-name').textContent);
const username = JSON.parse(document.getElementById('username').textContent);
const timeNow = new Date().toLocaleTimeString().slice(0,-3);
const messages = document.getElementById('msger-chatarea');
const userUserUsernameTags = document.querySelectorAll('.msg-info-name');
const userUserAvatars = document.querySelectorAll('.msg-img');

messages.scrollTop = messages.scrollHeight;
let counter = updateCounter();

function updateCounter(){
    if (document.querySelector('#msger-chatarea').lastElementChild){
        let splitResult = document.querySelector('#msger-chatarea').lastElementChild.id.split('_')
        return Number(splitResult[1]) + 1;
    } else {
        return 1;
    }
}
function inputMessage(){
    const messageInputDom = document.querySelector('#input');
    if (messageInputDom.value){
    chatSocket.send(JSON.stringify({
        'author': username,
        'message': messageInputDom.value,
        'time': timeNow,
        'room': chatRoomName,
        'count': `${chatRoomName}_${counter}`
    }))}else {
        alert('Вы не можете отправить пустое сообщение :(')
    }
    messageInputDom.value = '';
}
function insertHTMLright(data){
    document.querySelector('#msger-chatarea').insertAdjacentHTML('beforeend', `
    <div class="msg right-msg" id = "${data.count}">
        <div
        class="msg-img"
        style="background-image: url(${data.avatar})"
        ></div>

        <div class="msg-bubble">
            <div class="msg-info">
              <div class="msg-info-name">${data.author + ':'}</div>
              <div class="msg-info-time">${data.time}</div>
            </div>
            <div class="msg-text">${data.message}</div>
        </div>
    </div>
    `);
}
function insertHTMLleft(data){
    document.querySelector('#msger-chatarea').insertAdjacentHTML('beforeend', `
    <div class="msg left-msg" id = "${data.count}">
        <div
        class="msg-img left-msg"
        style="background-image: url(${data.avatar})"
        ></div>

        <div class="msg-bubble left-msg">
            <div class="msg-info">
              <div class="msg-info-name">${data.author + ':'}</div>
              <div class="msg-info-time">${data.time}</div>
            </div>
            <div class="msg-text">${data.message}</div>
        </div>
    </div>
    `);
}

const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/direct/' + chatRoomName + '/');

chatSocket.onmessage = function (e){
    const data = JSON.parse(e.data);
    console.log(data);
    if (data.author === username){
        insertHTMLright(data)
        counter ++
    } else {
        insertHTMLleft(data)
        counter ++
    }

    messages.scrollTop = messages.scrollHeight;
    };

document.querySelector('#submit').onclick = inputMessage;
document.querySelector('#input').addEventListener('keypress', function (e){
    if (e.key === 'Enter'){
        e.preventDefault()
        inputMessage()
    }
});
document.getElementById('titleMessenger').addEventListener('click', ()=>
    location.replace(`${host}chat/`));

userUserUsernameTags.forEach(element => element.addEventListener('click', ()=>
    location.replace(`${host}accounts/account_details/${element.textContent.slice(0, -1)}/`)));
userUserAvatars.forEach(element => element.addEventListener('click', ()=>
    location.replace(`${host}accounts/account_details/${element.nextElementSibling.firstElementChild.firstElementChild.textContent.slice(0, -1)}/`)));

if (document.querySelector('.messagelist')){
    setTimeout(()=>document.querySelector('.messagelist').remove(), 3000);
}
