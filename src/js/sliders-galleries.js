$(document).ready(function () {
    //personal slider
    var $personalSlider = $('.personal .owl-carousel').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        slideBy: 1,
        nav: false,
        dots: true,
        dotsContainer: '.personal .slider-controls .dots',
        mouseDrag: false,
        smartSpeed: 250,
        responsive: {
            1200: {
                margin: 60,
                items: 3,
                slideBy: 1
            },
            992: {
                margin: 25,
                items: 3,
                slideBy: 1
            },
            768: {
                margin: 15,
                items: 3,
                slideBy: 1
            },
            414: {
                margin: 15,
                items: 2,
                slideBy: 1
            }
        }
    });

    $('body').on('click', '.personal .pn-btn', function () {
        if ($(this).hasClass('prev')) {
            $(this).parents('.slider-wrapper').find($personalSlider).trigger('prev.owl.carousel');
        } else {
            $(this).parents('.slider-wrapper').find($personalSlider).trigger('next.owl.carousel');
        }
    });
    //
    // $personalSlider.on('changed.owl.carousel', function(event) {
    //     $(this).parents('.slider-gallery').find('.thumbnails .thumbnail.active').removeClass('active');
    //     $(this).parents('.slider-gallery').find('.thumbnails .thumbnail').eq($(this).parents('.slider-wrapper').find('.owl-dots .owl-dot.active').index()).addClass('active');
    // });
    //
    // $('body').on('click', '.portfolio .thumbnails .thumbnail:not(.active)', function () {
    //     $(this).addClass('active').siblings('.thumbnail.active').removeClass('active').parents('.slider-gallery').find($personalSlider).trigger('to.owl.carousel', $(this).index());
    // });

    //gallery images scrolling
    var scrollPosition = 0;
    $('body').on('click', '.gallery-images .gallery-nav', function () {
        var widthIn = $('.gallery-images .gallery-images-items').innerWidth();
        var widthOut = $('.gallery-images .gallery-images-items').get(0).scrollWidth;
        var currentScroll = $('.gallery-images .gallery-images-items').scrollLeft();
        var step = ((widthOut - widthIn) / $('.gallery-images .gallery-images-items .gallery-images-items-column').length) + 200;

        if ($(this).hasClass('next')) {
            if ((widthOut - widthIn) <= scrollPosition) {
                scrollPosition = 0;
            } else {
                scrollPosition = scrollPosition+step;
            }
        } else {
            if (currentScroll == 0) {
                scrollPosition = widthOut - widthIn;
            } else {
                scrollPosition = scrollPosition-step;
            }
        }

        $('.gallery-images .gallery-images-items').animate({scrollLeft: scrollPosition}, 300);
    });
});
