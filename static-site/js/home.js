/* Testimonial slider — port of TestimonialSection.tsx */
(function () {
  var testimonials = [
    {
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      title: "Lovely WordPress Theme",
      quote: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat elit posuere. Ut wisi enim ad minim veniam, volutpat quis nostrud diam nonummy exerci.",
      name: "Annie Johnson",
      role: "CREATIVE DIRECTOR"
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
      title: "Amazing Minimal Design",
      quote: "Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum.",
      name: "Sarah Parker",
      role: "DESIGNER"
    }
  ];

  var card = document.getElementById("testimonialCard");
  if (!card) return;

  var imgEl = document.getElementById("t-image");
  var titleEl = document.getElementById("t-title");
  var quoteEl = document.getElementById("t-quote");
  var nameEl = document.getElementById("t-name");
  var roleEl = document.getElementById("t-role");
  var dotsEl = document.getElementById("t-dots");

  var current = 0;
  var direction = 0;

  // build dots
  testimonials.forEach(function (_, i) {
    var b = document.createElement("button");
    b.className = "testimonials__dot";
    b.setAttribute("aria-label", "Go to slide " + (i + 1));
    b.addEventListener("click", function () {
      direction = i > current ? 1 : -1;
      current = i;
      render();
    });
    dotsEl.appendChild(b);
  });

  function render() {
    var t = testimonials[current];
    imgEl.src = t.image; imgEl.alt = t.name;
    titleEl.textContent = t.title;
    quoteEl.textContent = t.quote;
    nameEl.textContent = t.name;
    roleEl.textContent = t.role;

    var dots = dotsEl.querySelectorAll(".testimonials__dot");
    dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });

    // re-trigger slide-in animation (mirrors React key change)
    card.style.setProperty("--slide-dir", direction);
    card.classList.remove("animate-slide-in");
    void card.offsetWidth;
    card.classList.add("animate-slide-in");
  }

  document.getElementById("t-prev").addEventListener("click", function () {
    direction = -1;
    current = (current - 1 + testimonials.length) % testimonials.length;
    render();
  });
  document.getElementById("t-next").addEventListener("click", function () {
    direction = 1;
    current = (current + 1) % testimonials.length;
    render();
  });

  render();
})();
