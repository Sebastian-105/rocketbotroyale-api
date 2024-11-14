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

