'use strict';

/* Slideshow */

var Slides = document.getElementsByClassName("fade");
var Buttons = document.getElementsByClassName("Button");
var q = 0;
var T;

function showSlide(n) {
    
    for(var i = 0;i < Slides.length;i++) {
	Slides[i].style.display = "none";
	Buttons[i].style.opacity = ".5";
    }
    q = (Slides.length + n) % Slides.length;
    Slides[q].style.display = "block";
    Buttons[q].style.opacity = "1";
    clearTimeout(T);
    T = setTimeout(showSlide,10000,q+1);
    
}

showSlide(q);
