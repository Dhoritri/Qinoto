/* Blog list — search (?search=), pagination (8/page), share, latest posts.
   Port of app/blog/page.tsx + BlogCard.tsx + BlogSidebar.tsx */
(function () {
  var data = window.QINOTO_DATA;
  if (!data) return;
  var blogs = data.blogs;

  var params = new URLSearchParams(window.location.search);
  var search = (params.get("search") || "").toLowerCase();
  var currentPage = 1;
  var blogsPerPage = 8;

  var zigzag = '<div class="zigzag"><svg viewBox="0 0 40 10" fill="none" stroke="currentColor" stroke-width="1"><path d="M0 5 L5 0 L15 10 L25 0 L35 10 L40 5" stroke-linecap="round" stroke-linejoin="round" /></svg></div>';

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var filtered = blogs.filter(function (b) {
    return b.title.toLowerCase().indexOf(search) !== -1 ||
           b.excerpt.toLowerCase().indexOf(search) !== -1 ||
           b.category.toLowerCase().indexOf(search) !== -1;
  });

  var wrap = document.getElementById("blogGridWrap");

  function cardHtml(blog) {
    return '' +
      '<div class="blog-card-wrap">' +
        '<div class="blog-card">' +
          '<div class="blog-card__img"><img src="' + esc(blog.image) + '" alt="' + esc(blog.title) + '" /></div>' +
          '<div class="blog-card__content">' +
            '<h2 class="blog-card__title">' + esc(blog.title) + '</h2>' +
            zigzag +
            '<p class="blog-card__excerpt">' + esc(blog.excerpt) + '</p>' +
          '</div>' +
          '<div class="blog-card__footer">' +
            '<div class="blog-card__date">' + esc(blog.day) + 'th ' + esc(blog.month) + ' ' + esc(blog.year || '2026') + '</div>' +
            '<div class="blog-card__sep"></div>' +
            '<button class="blog-card__share" data-slug="' + esc(blog.slug) + '">SHARE</button>' +
          '</div>' +
          '<a href="blog-detail.html?slug=' + esc(blog.slug) + '" class="blog-card__link"></a>' +
        '</div>' +
      '</div>';
  }

  function render() {
    var totalPages = Math.ceil(filtered.length / blogsPerPage);
    var start = (currentPage - 1) * blogsPerPage;
    var current = filtered.slice(start, start + blogsPerPage);

    if (current.length === 0) {
      wrap.innerHTML = '<div class="blog-empty"><h2>No results found for "' + esc(search) + '"</h2><p>Try searching with different keywords.</p></div>';
      return;
    }

    var html = '<div class="blog-grid">' + current.map(cardHtml).join("") + '</div>';

    if (totalPages > 1) {
      var nums = "";
      for (var p = 1; p <= totalPages; p++) {
        nums += '<button class="blog-pagination__num' + (p === currentPage ? ' is-active' : '') + '" data-page="' + p + '">' + p + '</button>';
      }
      html += '<div class="blog-pagination">' +
        '<button class="blog-pagination__nav" data-nav="prev"' + (currentPage === 1 ? ' disabled' : '') + '><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>' +
        '<div class="blog-pagination__nums">' + nums + '</div>' +
        '<button class="blog-pagination__nav" data-nav="next"' + (currentPage === totalPages ? ' disabled' : '') + '><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>' +
        '</div>';
    }

    wrap.innerHTML = html;
    bindEvents(totalPages);
  }

  function bindEvents(totalPages) {
    wrap.querySelectorAll(".blog-card__share").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var url = window.location.origin + "/blog-detail.html?slug=" + btn.getAttribute("data-slug");
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            btn.textContent = "COPIED!";
            setTimeout(function () { btn.textContent = "SHARE"; }, 2000);
          }).catch(function (err) { console.error("Failed to copy!", err); });
        }
      });
    });
    wrap.querySelectorAll(".blog-pagination__num").forEach(function (b) {
      b.addEventListener("click", function () { currentPage = parseInt(b.getAttribute("data-page"), 10); render(); });
    });
    wrap.querySelectorAll(".blog-pagination__nav").forEach(function (b) {
      b.addEventListener("click", function () {
        var nav = b.getAttribute("data-nav");
        if (nav === "prev") currentPage = Math.max(currentPage - 1, 1);
        else currentPage = Math.min(currentPage + 1, totalPages);
        render();
      });
    });
  }

  render();

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

  /* Latest posts (first 3) */
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
