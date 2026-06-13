/* Shared behavior: navbar scroll states, overlay menu, scroll-to-top.
   Faithful port of Navbar.tsx + ScrollToTop.tsx. */
(function () {
  /* ---------------- Navbar ---------------- */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".nav__burger");
  var overlay = document.querySelector(".nav-overlay");
  var overlayClose = document.querySelector(".nav-overlay__close");
  var overlayLinks = document.querySelectorAll(".nav-overlay__link, .nav-overlay__logo");

  var lastScrollY = 0;

  function handleNavScroll() {
    var y = window.scrollY;
    var isVisible;

    if (y < 100) isVisible = true;
    else if (y > lastScrollY) isVisible = false; // scrolling down
    else isVisible = true; // scrolling up

    if (nav) {
      nav.classList.toggle("is-hidden", !isVisible);
      nav.classList.toggle("is-scrolled", y > 100);
    }
    lastScrollY = y;
  }

  if (nav) {
    window.addEventListener("scroll", handleNavScroll, { passive: true });
    handleNavScroll();
  }

  function openMenu() { if (overlay) overlay.classList.add("is-open"); }
  function closeMenu() { if (overlay) overlay.classList.remove("is-open"); }

  if (burger) burger.addEventListener("click", openMenu);
  if (overlayClose) overlayClose.addEventListener("click", closeMenu);
  overlayLinks.forEach(function (el) { el.addEventListener("click", closeMenu); });

  /* ---------------- Scroll to top ---------------- */
  var scrollTopBtn = document.querySelector(".scroll-top");
  if (scrollTopBtn) {
    function toggleScrollTop() {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 300);
    }
    window.addEventListener("scroll", toggleScrollTop, { passive: true });
    toggleScrollTop();
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
