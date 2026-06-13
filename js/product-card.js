/* Renders a ProductCard's HTML — shared by shop.js and product.js. */
window.renderProductCard = function (product) {
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  var href = "product-detail.html?slug=" + esc(product.slug);
  var prices = "";
  if (product.oldPrice != null) {
    prices += '<span class="product-card__old">৳' + product.oldPrice.toFixed(2) + '</span>';
  }
  prices += '<span class="product-card__price">৳' + product.price.toFixed(2) + '</span>';

  var bag = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>';

  return '' +
    '<div class="product-card">' +
      '<a href="' + href + '" class="product-card__link">' +
        '<div class="product-card__media"><div class="product-card__media-inner"><img src="' + esc(product.image) + '" alt="' + esc(product.name) + '" /></div></div>' +
        '<div class="product-card__content">' +
          '<h3 class="product-card__name">' + esc(product.name) + '</h3>' +
          '<div class="product-card__prices">' + prices + '</div>' +
        '</div>' +
      '</a>' +
      '<div class="product-card__hover">' +
        '<a href="' + href + '" class="product-card__btn">' +
          '<span>View Details</span>' +
          '<div class="product-card__btn-icon"><div class="product-card__btn-divider"></div>' + bag + '</div>' +
        '</a>' +
      '</div>' +
    '</div>';
};
