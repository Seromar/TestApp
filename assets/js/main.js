let menuBtn = document.querySelector('.menu_btn');
let Bur = document.querySelector('.header_menu-burger');
let Body = document.querySelector('body');

menuBtn.addEventListener('click', function(){
    menuBtn.classList.toggle('active');
    Bur.classList.toggle('active');
    Body.classList.toggle('lock');
})

document.getElementById("defaultOpen").click();


