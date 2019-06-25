

/**
 *
 */
$(document).ready(function () {

  /** Initialize tooltips */
  $('[data-toggle="tooltip"]').tooltip();

  /** Initialize popovers */
  $('[data-toggle="popover"]').popover({
    html: true
  });

  $.gdprcookie.init();


  // Go to Top
  var go2TopShowHide = (function () {
    var $this = $('.js-go-to');

    $this.on("click", function (event) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 600);
    });

    var go2TopOperation = function () {
      var CurrentWindowPosition = $(window).scrollTop();

      if (CurrentWindowPosition > 400) {
        $this.addClass("show");
      } else {
        $this.removeClass("show");
      }
    };

    go2TopOperation();

    $(window).scroll(function () {
      go2TopOperation();
    });
  }());



});

