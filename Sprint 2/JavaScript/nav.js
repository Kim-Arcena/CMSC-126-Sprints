//sticky navbar
window.addEventListener('scroll', () => {
    if(window.scrollY > 270){
        header.classList.add('bg');
    }else{
        header.classList.remove('bg');
    }
});

const createNavbar = () => {
    let navbar = document.createElement('navbar');

    navbar.innerHTML += `
    <a href="#home">home</a>
    <a href="#products">products</a>
    <a href="#about">about</a>
    
    <div class="user-interactions">
        <div class="cart">
            <a href="#" class="fas fa-shopping-cart"></a>
            <span class="cart-item-count">00</span>
        </div>
        <div class="user">
            <a class="fas fa-user"></a>
            <div class="user-icon-popup active">
                <p>Login to your account</p>
                <a>Login</a>
            </div>
        </div>
    </div>
    `
    
}

createNavbar();

//user icon pop uo
let userIcon = document.querySelector('.user');
let userPopupIcon = document.querySelector('.user-icon-popup');

userIcon.addEventListener('click', ()=> userPopupIcon.classList.toggle('active'));

let text = userPopupIcon.querySelector('p');
let actionBtn = userPopupIcon.querySelector('a');
let user = JSON.parse(sessionStorage.user || null);

if(user != null){
    text.innerHTML = `Welcome ${user.name}`;
    actionBtn.innerHTML = 'Logout';
    actionBtn.addEventListener('click', () => logout());
}
else{ 
    actionBtn.innerHTML = 'Login to your account';
    actionBtn.innerHTML = 'login';
    actionBtn.addEventListener('click', () => location.href = '/login');
    
}

const logout = () => {
    sessionStorage.clear();
    location.reload();
}