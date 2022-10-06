const host = 'http://' + window.location.host + '/'

const backButton =  document.getElementById('backButton');

backButton.addEventListener('click', ()=>location.replace(`${host}chat/`));
