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

  // Header scroll class
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
      // $('#header .navbar').removeClass('navbar-default');
      // $('#header .navbar').addClass('navbar-dark');
      $('.back-to-top').fadeIn('slow');
    } else {
      $('#header').removeClass('header-scrolled');
      // $('#header .navbar').removeClass('navbar-dark');
      // $('#header .navbar').addClass('navbar-default');
      $('.back-to-top').fadeOut('slow');
    }
  });

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 56)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  if ($('.gallery').length) {
    $('.gallery a').simpleLightbox();
  }

});