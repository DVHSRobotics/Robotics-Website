'use strict';
var Slides = document.getElementsByClassName("fade")
var q = 0;
showSlides();
function showSlides() {
    for(var i=0;i<Slides.length;i++) {
	Slides[i].style.display = "none";
    }
    Slides[q % Slides.length].style.display = "block";
    q++;
    setTimeout(showSlides,3000);
}
