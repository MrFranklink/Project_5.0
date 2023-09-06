var typed = new Typed(".auto", {
    strings: ["Signup", "साइन अप करें", " サインアップ"],
    typeSpeed: 70,
    backSpeed: 40,
    loop: true,
});

var typed = new Typed(".a", {
    strings: ["Login", "लॉग इन करें", " ログイン"],
    typeSpeed: 70,
    backSpeed: 40,
    loop: true,
});

var modal = document.getElementById('myModal');
var closeBtn = document.getElementsByClassName('close')[0];



document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'gg' && password === 'gg') {
        console.log('Login successful');
        window.location.href = '../Main Page/Main.html';
    } else {
        modal.style.display = 'block';
    }
});

closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';   
});

window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

var typedError = new Typed(".au", {
    strings: ["Error", "गलती", " エラー"],
    typeSpeed: 70,
    backSpeed: 40,
    loop: true,
});

let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");

signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.style.transform = 'translateX(-50%)';
});

login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.style.transform = 'translateX(50%)';
});

var loginBox = document.querySelector('.box');
var signupBox = document.querySelector('.box1');
var loginSlider = document.querySelector('.login');
var signupSlider = document.querySelector('.signup');


signupBox.style.display = 'none';

loginSlider.addEventListener('click', function () {
    
    loginBox.style.display = 'block';
    
    signupBox.style.display = 'none';
});

signupSlider.addEventListener('click', function () {
   
    signupBox.style.display = 'block';

    loginBox.style.display = 'none';
});
