(function () {
  var menus = document.querySelectorAll(".language-menu");

  document.addEventListener("click", function (event) {
    menus.forEach(function (menu) {
      if (!menu.open) return;

      if (menu.contains(event.target)) {
        if (
          event.target instanceof Element &&
          event.target.closest("[data-language-option]")
        ) {
          menu.open = false;
        }
      } else {
        menu.open = false;
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    menus.forEach(function (menu) {
      if (!menu.open) return;
      menu.open = false;
      menu.querySelector("summary").focus();
    });
  });
})();
