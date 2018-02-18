'use strict';

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'css/materialdesignicons.min.css');

/* Slideshow */

var Slides = document.getElementsByClassName("fade");
var Buttons = document.getElementsByClassName("Button");
var playState = document.getElementsByClassName("PlayState")[0];
var q = 0;
var T;
var playing = 1;
var transitionPeriod = 10000;

function showSlide(n) {
    
    for(var i = 0; i < Slides.length; i++) {
	Slides[i].style.display = "none";
	Buttons[i].style.opacity = ".5";
    }
    q = (Slides.length + n) % Slides.length;
    Slides[q].style.display = "block";
    Buttons[q].style.opacity = "1";
    clearTimeout(T);
    T = playing ? setTimeout(showSlide,transitionPeriod,q+1) : T;
    
}

function togglePlayState() {
    
    if(playing) {
	clearTimeout(T);
	playState.innerHTML = '<i class="mdi mdi-play-circle mdi-24px"></i>';
    } else {
	T = setTimeout(showSlide,transitionPeriod,q+1);
	playState.innerHTML = '<i class="mdi mdi-pause-circle mdi-24px"></i>';
    }
    playing = !playing;
    
}

showSlide(q);
