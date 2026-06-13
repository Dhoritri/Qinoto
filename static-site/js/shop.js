/* Shop page — filter (category/search), sort, pagination, sidebar drawer.
   Port of app/shop/page.tsx */
(function () {
  var data = window.QINOTO_DATA;
  if (!data) return;
  var products = data.products;

  var params = new URLSearchParams(window.location.search);
  var selectedCategory = params.get("category");
  var searchQuery = params.get("search") || "";
  var sortOrder = "latest";
  var currentPage = 1;
  var productsPerPage = 9;

  var gridEl = document.getElementById("shopGrid");
  var pagEl = document.getElementById("shopPagination");
  var resultsEl = document.getElementById("shopResults");
  var catsEl = document.getElementById("shopCats");
  var sortEl = document.getElementById("shopSort");
  var searchInput = document.getElementById("shopSearchInput");

  searchInput.value = searchQuery;

  function getFiltered() {
    return products.filter(function (p) {
      var matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      var q = searchQuery.toLowerCase();
      var matchesSearch = searchQuery
        ? (p.name.toLowerCase().indexOf(q) !== -1 ||
           p.category.toLowerCase().indexOf(q) !== -1 ||
           (p.tags && p.tags.some(function (t) { return t.toLowerCase().indexOf(q) !== -1; })))
        : true;
      return matchesCategory && matchesSearch;
    });
  }

  function getSorted(list) {
    return list.slice().sort(function (a, b) {
      switch (sortOrder) {
        case "latest": return b.id - a.id;
        case "a-z": return a.name.localeCompare(b.name);
        case "z-a": return b.name.localeCompare(a.name);
        case "low-high": return a.price - b.price;
        case "high-low": return b.price - a.price;
        default: return 0;
      }
    });
  }

  function render() {
    var filtered = getFiltered();
    var sorted = getSorted(filtered);
    var totalPages = Math.ceil(sorted.length / productsPerPage);
    var indexOfLast = currentPage * productsPerPage;
    var indexOfFirst = indexOfLast - productsPerPage;
    var current = sorted.slice(indexOfFirst, indexOfLast);

    resultsEl.textContent = "Showing " + (indexOfFirst + 1) + "–" +
      Math.min(indexOfLast, sorted.length) + " of " + sorted.length + " results";

    gridEl.innerHTML = current.map(window.renderProductCard).join("");

    // pagination
    if (totalPages > 1) {
      var html = '<div class="shop-pagination">';
      for (var i = 1; i <= totalPages; i++) {
        html += '<button class="shop-pagination__num' + (currentPage === i ? ' is-active' : '') + '" data-page="' + i + '">' + i + '</button>';
      }
      if (currentPage < totalPages) {
        html += '<button class="shop-pagination__next" data-next="1"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>';
      }
      html += '</div>';
      pagEl.innerHTML = html;
      pagEl.querySelectorAll(".shop-pagination__num").forEach(function (b) {
        b.addEventListener("click", function () {
          currentPage = parseInt(b.getAttribute("data-page"), 10);
          window.scrollTo({ top: 400, behavior: "smooth" });
          render();
        });
      });
      var nextBtn = pagEl.querySelector(".shop-pagination__next");
      if (nextBtn) nextBtn.addEventListener("click", function () {
        currentPage = currentPage + 1;
        window.scrollTo({ top: 400, behavior: "smooth" });
        render();
      });
    } else {
      pagEl.innerHTML = "";
    }
  }

  function renderCategories() {
    var cats = [];
    var seen = {};
    products.forEach(function (p) {
      if (!seen[p.category]) {
        seen[p.category] = true;
        cats.push({ name: p.category, count: products.filter(function (x) { return x.category === p.category; }).length });
      }
    });

    var html = '<li class="shop-cat' + (selectedCategory === null ? ' is-active' : '') + '" data-cat="">' +
      '<span class="shop-cat__name">All Products</span><span class="shop-cat__count">(' + products.length + ')</span></li>';
    cats.forEach(function (c) {
      html += '<li class="shop-cat' + (selectedCategory === c.name ? ' is-active' : '') + '" data-cat="' + c.name + '">' +
        '<span class="shop-cat__name">' + c.name + '</span><span class="shop-cat__count">(' + c.count + ')</span></li>';
    });
    catsEl.innerHTML = html;

    catsEl.querySelectorAll(".shop-cat").forEach(function (li) {
      li.addEventListener("click", function () {
        var cat = li.getAttribute("data-cat");
        selectedCategory = cat === "" ? null : cat;
        currentPage = 1;
        closeSidebar();
        window.scrollTo({ top: 400, behavior: "smooth" });
        renderCategories();
        render();
      });
    });
  }

  // search via Enter (mirrors handleSearch + pushState)
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var val = e.currentTarget.value;
      var p = new URLSearchParams(window.location.search);
      if (val) p.set("search", val); else p.delete("search");
      window.history.pushState(null, "", "?" + p.toString());
      searchQuery = val;
      currentPage = 1;
      render();
    }
  });

  sortEl.addEventListener("change", function () {
    sortOrder = sortEl.value;
    currentPage = 1;
    render();
  });

  // mobile drawer
  var sidebar = document.getElementById("shopSidebar");
  var backdrop = null;
  function openSidebar() {
    sidebar.classList.add("is-open");
    backdrop = document.createElement("div");
    backdrop.className = "shop-backdrop";
    backdrop.addEventListener("click", closeSidebar);
    document.body.appendChild(backdrop);
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    if (backdrop) { backdrop.remove(); backdrop = null; }
  }
  document.getElementById("shopFilterOpen").addEventListener("click", openSidebar);
  document.getElementById("shopFilterClose").addEventListener("click", closeSidebar);

  renderCategories();
  render();
})();
