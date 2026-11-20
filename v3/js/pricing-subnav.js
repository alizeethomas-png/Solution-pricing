/* ══════════════════════════════════════════════════════════════════
   Pricing sub-navigation — one shared injector for every v3 page
   (landing, product, industry, calculator, buying-models, estimator,
   solution, and the CEP prototype). Host:
     <nav id="sf-subnav-host" class="sf-subnav" aria-label="Pricing sections"
          data-base="." data-current="overview"></nav>
   data-base is the path from this page to v3/ ( "." or ".." ).
   data-current is overview | product | industry | calculator |
   estimator | buying-models. Empty = no aria-current.
   Plain script (no ES module) so it runs on file://.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var host = document.getElementById("sf-subnav-host");
  if (!host) return;

  var base = (host.getAttribute("data-base") || ".").replace(/\/$/, "");
  var current = host.getAttribute("data-current") || "";

  function href(rel) {
    return base + "/" + rel;
  }
  function cur(key) {
    return current === key ? ' aria-current="page"' : "";
  }

  host.innerHTML =
    '<div class="sf-subnav__inner">' +
      '<a class="sf-subnav__title" href="' + href("index.html") + '">Pricing</a>' +
      '<a class="sf-subnav__link" href="' + href("index.html") + '"' + cur("overview") + ">Overview</a>" +
      '<div class="sf-subnav__links">' +
        '<div class="sf-subnav__dropdown">' +
          '<button type="button" class="sf-subnav__link sf-subnav__dropdown-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="pricing-buy-menu">' +
            "Pricing By" +
            '<i class="icon icon--chevrondown sf-subnav__chevron" aria-hidden="true"></i>' +
          "</button>" +
          '<div class="sf-subnav__menu" id="pricing-buy-menu" role="menu">' +
            '<a class="sf-subnav__menu-item" role="menuitem" href="' + href("product/index.html") + '"' + cur("product") + ">Pricing by Product</a>" +
            '<a class="sf-subnav__menu-item" role="menuitem" href="' + href("industry/index.html") + '"' + cur("industry") + ">Pricing by Industries</a>" +
          "</div>" +
        "</div>" +
        '<div class="sf-subnav__dropdown">' +
          '<button type="button" class="sf-subnav__link sf-subnav__dropdown-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="pricing-tools-menu">' +
            "Pricing Tools" +
            '<i class="icon icon--chevrondown sf-subnav__chevron" aria-hidden="true"></i>' +
          "</button>" +
          '<div class="sf-subnav__menu sf-subnav__menu--rich" id="pricing-tools-menu" role="menu">' +
            '<a class="sf-subnav__menu-item sf-subnav__menu-item--rich" role="menuitem" href="' + href("calculator/index.html") + '"' + cur("calculator") + ">" +
              '<span class="sf-subnav__menu-item-title">Flex Credit Calculator</span>' +
              '<span class="sf-subnav__menu-item-desc">Estimate how many Flex Credits you\u2019ll need and understand their potential cost.</span>' +
            "</a>" +
            '<a class="sf-subnav__menu-item sf-subnav__menu-item--rich" role="menuitem" href="' + href("estimator/index.html") + '"' + cur("estimator") + ">" +
              '<span class="sf-subnav__menu-item-title">Solution Estimator</span>' +
              '<span class="sf-subnav__menu-item-desc">Get guidance on which products can support your solution and estimate their cost.</span>' +
            "</a>" +
          "</div>" +
        "</div>" +
        '<a class="sf-subnav__link" href="' + href("buying-models/index.html") + '"' + cur("buying-models") + ">Buying Models</a>" +
      "</div>" +
    "</div>";
})();
