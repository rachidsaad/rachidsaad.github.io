// Interactive background blob that follows mouse movement subtly
const blob = document.getElementById('blob');
window.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  blob.style.transform = `translate(${x/10}px, ${y/10}px)`;
});

  // Simple Fade-in effect on scroll
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease-out";
    observer.observe(card);
  });


// Set the date we're counting down to
var countDownDate = new Date("Mar 26, 2026 09:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

// Get today's date and time
var now = new Date().getTime();

// Find the distance between now and the count down date
var distance = countDownDate - now;

// Time calculations for days, hours, minutes and seconds
var days = Math.floor(distance / (1000 * 60 * 60 * 24));
var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
var seconds = Math.floor((distance % (1000 * 60)) / 1000);

// Output the result in an element with id="demo"
document.getElementById("countdown").innerHTML = 
"<span id='timerdays' class='timeritem'>" + days + "</span>" +
"<span id='timerhours' class='timeritem'>" + hours + "</span>" + 
"<span id='timerminutes' class='timeritem'>" + minutes + "</span>" +
"<span id='timerseconds' class='timeritem'>" + seconds + "</span>";

// If the count down is over, write some text 
if (distance < 0) {
  clearInterval(x);
  document.getElementById("countdown").innerHTML = "EXPIRED";
}
}, 1000);