slider1 = new Swiper('.slider1', {
    freeMode: true,
    direction: 'horizontal',
    mousewheel: true,
    slidesPerView: 2.75,
    slidesOffsetBefore: 24,
    scrollbar: {
        el: '.swiper-scrollbar',
    },
    autoplay: {
        delay: 2000,
    },
    navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
    },
    hashNavigation: true,
})