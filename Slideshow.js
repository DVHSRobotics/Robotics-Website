console.log("Hi!")
Slides = document.getElementsByClassName("fade");
console.log(Slides.length);
for(i=0;i<Slides.length;i++) {
    if(i>0) {
	Slides[i-1].style.display = "none";
    }
    Slides[i].style.display = "block";
}
console.log("Bye!")
