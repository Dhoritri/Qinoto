/* Blog detail — loads a blog by ?slug= (template page).
   Port of app/blog/[slug]/page.tsx + BlogSidebar.tsx */
(function () {
  var data = window.QINOTO_DATA;
  if (!data) return;
  var blogs = data.blogs;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");
  var blog = blogs.filter(function (b) { return b.slug === slug; })[0];

  // Fall back to the first blog so the template renders standalone.
  if (!blog) blog = blogs[0];

  if (blog) {
    document.getElementById("bd-image").src = blog.image;
    document.getElementById("bd-image").alt = blog.title;
    document.getElementById("bd-date").textContent = blog.day + "th " + blog.month + " " + (blog.year || "2026");
    document.getElementById("bd-category").textContent = blog.category;
    document.getElementById("bd-title").textContent = blog.title;
    document.getElementById("bd-description").textContent = blog.description;
    document.title = "Qinoto";
  }

  /* Sidebar search */
  var searchForm = document.getElementById("blogSearchForm");
  var searchInput = document.getElementById("blogSearchInput");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = searchInput.value.trim();
      if (q) window.location.href = "blog.html?search=" + encodeURIComponent(q);
    });
  }

  /* Latest posts */
  var latest = document.getElementById("blogLatest");
  if (latest) {
    latest.innerHTML = blogs.slice(0, 3).map(function (post) {
      return '<a href="blog-detail.html?slug=' + esc(post.slug) + '" class="blog-latest__item">' +
        '<div class="blog-latest__thumb"><img src="' + esc(post.image) + '" alt="' + esc(post.title) + '" /></div>' +
        '<div class="blog-latest__meta">' +
          '<span class="blog-latest__date">' + esc(post.day) + 'th ' + esc(post.month) + ' ' + esc(post.year || '2026') + '</span>' +
          '<h4 class="blog-latest__title">' + esc(post.title) + '</h4>' +
        '</div></a>';
    }).join("");
  }
})();
