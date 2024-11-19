let titleContent = document.querySelector('#title');
let loader = document.querySelector('.loader');
let loaderBackground = document.querySelector('.loaderBackground');
let returnedContent = document.querySelector('#root');
let body = document.body;
let menu = document.querySelector('.content1');
let exitBtn = document.querySelector('.exit');
exitBtn.addEventListener('click', (e) => {
    loaderBackground.style.display = 'none';
    menu.style.animation =
        'hideElement 0.2s linear 1 forwards, moveBackground1 15s linear infinite';
    menu.style.animationFillMode = 'forwards';
    setTimeout(() => {
        menu.style.display = 'none';
    }, 200);
});

function showLoader() {
    loaderBackground.style.display = 'flex';
}

function showContent(title, message) {
    titleContent.innerHTML = title;
    returnedContent.innerHTML = message;
    menu.style.animation =
        'showElement 0.2s linear 1 reverse, moveBackground1 15s linear infinite';
    menu.style.animationFillMode = 'forwards';
    setTimeout(() => {
        menu.style.display = 'block';
    }, 200);
}

// Fetch
async function fetchMain(url, type, info) {
    let fetchURL = `${url}?${type}=${info}`;
    console.log(fetchURL);
    try {
        let response = await fetch(fetchURL, {
            method: 'GET',
        });

        // Await the response to get the text data
        let newData = await response.text();
        let newNew = newData.replace(/\n/g, '<br />');

        return newNew;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return `Error: ${error.message}`; // Optional: return the error to display in UI
    }
}

async function openSimpleLeaderboards() {
    showLoader()

    let ssn = document.getElementById('userID').value;
    let data = await fetchMain('./v2/p/getLeaderboards', 'ssn', ssn);
    showContent('Leaderboards:', data);
}
async function openSimpleProfile() {
    showLoader()

    let user_id = document.getElementById('userID').value;
    let data = await fetchMain('./v2/account/p/getProfile', 'id', user_id);
    let newData = data.replace('_', ' ')
    showContent('Profile:', newData);

}
async function checkSkill() {
    showLoader()

    let user_id = document.getElementById('userID').value;
    let data = await fetchMain('./v2/account/p/checkSkill', 'id', user_id);
    showContent('Data:', data);

}

async function convert() {
    showLoader()

    let user_id = document.getElementById('userID').value;
    let data = await fetchMain('./v2/account/json/fcToID', 'fc', user_id);
    showContent('Data:', data);

}

async function getUser() {
    showLoader()
    let data;
    const userIdRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

    let res = document.getElementById('userID').value;
    if (userIdRegex.test(res)) {
        data = await fetchMain('./v2/getAllTop50', 'userID', res);
    } else {
        data = await fetchMain('./v2/getAllTop50', 'name', res);
    }
    showContent('Data:', data);

}
