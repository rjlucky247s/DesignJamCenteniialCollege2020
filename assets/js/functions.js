//Curve animation

var scroll = document.querySelector('.curve');
window.addEventListener('scroll', function() {
    var value = 1 + window.scrollY / -500;
    scroll.style.transform = `scaleY(${value})`;
});