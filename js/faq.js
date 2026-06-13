/* FAQ accordion — one item open at a time (openIndex toggle). */
(function () {
  var list = document.getElementById("faqList");
  if (!list) return;
  var items = Array.prototype.slice.call(list.querySelectorAll(".faq-item"));

  items.forEach(function (item, index) {
    var btn = item.querySelector(".faq-q__btn");
    btn.addEventListener("click", function () {
      var alreadyOpen = item.classList.contains("is-open");
      items.forEach(function (it) { it.classList.remove("is-open"); });
      if (!alreadyOpen) item.classList.add("is-open");
    });
  });
})();
