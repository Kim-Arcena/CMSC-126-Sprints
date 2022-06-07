// responsive nav bar
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let slides = document.querySelectorAll('.slider-container');
let index = 0;
let header = document.querySelector('header');

menu.onclick = () =>{
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
}

window.onscroll = () =>{
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');
}




//slider animation js


function next(){
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}


function prev(){
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}