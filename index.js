'use strict';

// Slideshow
var Slides = document.getElementsByClassName("fade");
var Buttons = document.getElementsByClassName("Button");
var q = -1;
var T;

function showSlide(n) {
    for(var i = 0;i < Slides.length;i++) {
	Slides[i].style.display = "none";
	Buttons[i].style.opacity = ".5";
    }
    q = (Slides.length + n) % Slides.length;
    Slides[q].style.display = "block";
    Buttons[q].style.opacity = "1";
}

function showSlides() {
    showSlide(q+1);
    T = setTimeout(showSlides,10000);
}

function buttonPress(n) {
    showSlide(n);
    clearTimeout(T);
    T = setTimeout(showSlides,10000);
}

showSlides();
