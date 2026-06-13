/* Product detail — loads product by ?slug= (template page).
   Port of app/product/[slug]/page.tsx. Variant + thumbnail + tab state. */
(function () {
  var data = window.QINOTO_DATA;
  if (!data) return;
  var products = data.products;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");
  var product = products.filter(function (p) { return p.slug === slug; })[0];

  // No slug at all → render the first product so the template stands alone.
  if (!product && !slug) product = products[0];

  var root = document.getElementById("productRoot");
  var hero = document.getElementById("productHero");

  if (!product) {
    // Not found view (no hero, matches notFound layout).
    if (hero) hero.style.display = "none";
    root.classList.remove("product-wrap");
    root.innerHTML = '<div class="product-notfound"><h2>Product Not Found</h2><a href="shop.html">Back to Shop</a></div>';
    return;
  }

  document.getElementById("pd-crumb").textContent = product.name;

  // State
  var selectedVariant = (product.variants && product.variants[0]) || null;
  var mainImage = selectedVariant ? selectedVariant.image : product.image;
  var activeTab = "description";

  var related = products.filter(function (p) { return p.category !== product.category; }).slice(0, 4);

  function activeGallery() { return selectedVariant ? selectedVariant.gallery : product.gallery; }

  function discountBadge() {
    if (product.oldPrice == null) return "";
    var pct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    return '<div class="product-discount"><span>' + pct + '%</span></div>';
  }

  function build() {
    var prices = "";
    if (product.oldPrice != null) prices += '<span class="product-old">৳' + product.oldPrice.toFixed(2) + '</span>';
    prices += '<span class="product-price">৳' + product.price.toFixed(2) + '</span>';

    var thumbs = activeGallery().map(function (img) {
      return '<div class="product-thumb' + (mainImage === img ? ' is-active' : '') + '" data-img="' + esc(img) + '"><img src="' + esc(img) + '" alt="Gallery" /></div>';
    }).join("");

    var variantsHtml = "";
    if (product.variants && product.variants.length > 0) {
      var btns = product.variants.map(function (v) {
        return '<button class="product-variant' + (selectedVariant && selectedVariant.name === v.name ? ' is-active' : '') + '" data-variant="' + esc(v.name) + '">' + esc(v.name) + '</button>';
      }).join("");
      variantsHtml = '<div class="product-variants"><span class="product-variants__label">' + esc(product.variantType || "Choose Option") + '</span><div class="product-variants__list">' + btns + '</div></div>';
    }

    var tabBody;
    if (activeTab === "description") {
      tabBody = '<div class="product-tabs__desc animate-fadeIn"><p>' + esc(product.description) + '</p></div>';
    } else {
      var vids = product.videos.map(function (vidId, idx) {
        return '<div class="product-video"><iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/' + esc(vidId) + '" title="Product Video ' + (idx + 1) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>';
      }).join("");
      tabBody = '<div class="product-tabs__videos animate-fadeIn">' + vids + '</div>';
    }

    var relatedHtml = "";
    if (related.length > 0) {
      relatedHtml = '<div class="product-related"><h2>Related Products</h2><div class="product-related__grid">' +
        related.map(window.renderProductCard).join("") + '</div></div>';
    }

    root.innerHTML = '' +
      '<div class="product-cols">' +
        '<div class="product-gallery">' +
          '<div class="product-main-img">' +
            discountBadge() +
            '<img id="pd-main" src="' + esc(mainImage) + '" alt="' + esc(product.name) + '" />' +
            (product.badge ? '<span class="product-badge">' + esc(product.badge) + '</span>' : '') +
          '</div>' +
          '<div class="product-thumbs" id="pd-thumbs">' + thumbs + '</div>' +
        '</div>' +
        '<div class="product-info">' +
          '<div class="product-titlerow">' +
            '<h1 class="product-title">' + esc(product.name) + '</h1>' +
            '<div class="product-title-divider"></div>' +
            '<div class="product-prices">' + prices + '</div>' +
          '</div>' +
          '<p class="product-short">' + esc(product.shortdescription || "") + '</p>' +
          '<div class="product-meta">' +
            '<p>Category: <span>' + esc(product.category) + '</span></p>' +
            '<p>Tag: <span>' + esc(product.tags.join(", ")) + '</span></p>' +
          '</div>' +
          variantsHtml +
          '<div class="product-purchase"><a href="' + esc(product.purchaseLink || "#") + '" target="_blank" rel="noopener noreferrer">Purchase Now</a></div>' +
          '<div class="product-tabs">' +
            '<div class="product-tabs__head">' +
              '<button class="product-tab product-tab--desc' + (activeTab === "description" ? " is-active" : "") + '" data-tab="description">Description</button>' +
              '<button class="product-tab' + (activeTab === "videos" ? " is-active" : "") + '" data-tab="videos">Videos</button>' +
            '</div>' +
            '<div class="product-tabs__body">' + tabBody + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      relatedHtml;

    bind();
  }

  function bind() {
    root.querySelectorAll(".product-thumb").forEach(function (t) {
      t.addEventListener("click", function () { mainImage = t.getAttribute("data-img"); build(); });
    });
    root.querySelectorAll(".product-variant").forEach(function (b) {
      b.addEventListener("click", function () {
        var name = b.getAttribute("data-variant");
        selectedVariant = product.variants.filter(function (v) { return v.name === name; })[0];
        mainImage = selectedVariant.image;
        build();
      });
    });
    root.querySelectorAll(".product-tab").forEach(function (b) {
      b.addEventListener("click", function () { activeTab = b.getAttribute("data-tab"); build(); });
    });
  }

  build();
})();
