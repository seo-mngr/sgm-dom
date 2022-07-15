$(document).ready(function () {
    scrolledHeader();

    $('.open-menu-icon').on('click', function () {
        $(this).toggleClass('active');
        $(this).parents('#header').toggleClass('opened-menu');
        $(this).parents().find('.mobile-menu-navbar').slideToggle(250);
        if ($(this).hasClass('active')) {
            $('.mobile-menu-bg-overlay').fadeIn(200);
        } else {
            $('.mobile-menu-bg-overlay').fadeOut(200);
        }
    });

    $('.mobile-menu-bg-overlay').on('click', function () {
        $('.open-menu-icon').click();
    });

    $('#header .menu > li.menu-item-has-children > a').on('click', function () {
        if (window.matchMedia('(max-width: 767px)').matches) {
            $(this).siblings('ul').slideToggle(250);
            $(this).parent().toggleClass('children-active');
            return false;
        }
    });

    //tabs
    $('body').on('click', '.tabs-wrapper > .tabs-controls > .item:not(.active)', function () {
        $this = $(this);
        $this.parent('.tabs-controls').find('.item').removeClass('active');
        $this.addClass('active');
        $this.parent('.tabs-controls').parent('.tabs-wrapper').children('.tabs-content').children('.item').removeClass('active');
        var index = $(this).index();
        $this.parent('.tabs-controls').parent('.tabs-wrapper').children('.tabs-content').children('.item:eq(' + index + ')').addClass('active');
    });

    $("a[rel=lightbox]").fancybox({
        loop: true,
        thumbs: {
            autoStart: true,
            axis: 'x'
        }
    });

    $("input[type='tel']:not(.calc-input)").inputmask("+7(999)-999-99-99");

    $('.animate-count i').each(function(i,elem) {
    	$(this).animateNumber({number: parseInt($(this).html())}, 2000);
    });

    $('.tooltip').each(function(i,elem) {
        var trigger = 'hover';
        if ($(this).parents('.calc').length || window.matchMedia('(max-width: 767px)').matches) {
            trigger = 'click';
        }
        $(this).tooltipster({
            delay: 0,
            trigger: trigger,
            animationDuration: 0,
            theme: 'tooltipster-shadow',
            interactive: true,
            contentAsHTML: true,
            functionBefore: function(instance, helper) {
                $(helper.origin).addClass('active');
            },
            functionAfter: function(instance, helper) {
                $(helper.origin).removeClass('active');
            }
        });
    });

    //calc change steps
    $('body').on('click', '.calc .steps-controls .b-title:not(.active)', function () {
        $(this).toggleClass('active').siblings('.b-title.active').removeClass('active');
        $('.calc .steps-wrapper .step:eq(' + $(this).index() + ')').addClass('active').siblings('.step.active').removeClass('active');
    });

    $('body').on('click', '.calc .next-step-btn, .calc .prev-step-btn', function () {
        $('.calc .steps-controls .b-title:not(.active)').click();
    });

    //portfolio thumbnails-gallery
    $('.portfolio-item .images-navs span:not(.active)').hover(
        function() {
            changePortfolioItemImages($(this), $(this).index());
        },
        function(){
            changePortfolioItemImages($(this), 0);
        }
    );

    $('.portfolio-item .images-navs span:not(.active)').on('touchstart', function (e) {
        changePortfolioItemImages($(this), $(this).index());
    });

    $('body').on('click', '.features .show-more .b-title', function () {
        $(this).parents('.features').find('.item.hidden').removeClass('hidden');
        $(this).parents('.show-more').remove();
    });

    //menu item scroll on click to anchor
    $('body').on('click', 'li.scrolled-item > a, a.scrolled-to-top-link-active', function () {
        var offsetHeight = 0;
        var scrollSelector = 0;

        if (!$(this).hasClass('scrolled-to-top-link-active')) {
            offsetHeight = 40;
            if (window.matchMedia('(max-width: 767px)').matches) {
                offsetHeight = 50;
            }
            scrollSelector = $($(this).attr("href")).offset().top - offsetHeight + "px";
        }

        if ($(this).hasClass('scrolled-to-top-link-active') || $($(this).attr("href")).length) {
            $("html, body").animate({
                scrollTop: scrollSelector
            }, {
                duration: 500
            });
            if (window.matchMedia('(max-width: 767px)').matches && $(this).parents('#header').length && $('.open-menu-icon').hasClass('active')) {
                $('.open-menu-icon').removeClass('active');
                $('.mobile-menu-navbar').slideToggle(250);
                $('.mobile-menu-bg-overlay').fadeOut(200);
            }
            return false;
        }
    });

    $('body').on('click', '.telTo', function() {
        if (window.matchMedia('(max-width: 767px)').matches) {
            var PhoneNumber = $(this).text();
            PhoneNumber = PhoneNumber.replace("Phone:", "");
            window.location.href = "tel://" + PhoneNumber;
        }
    });

    //swipe price-table
    // var dragging = false;
    // var timer;
    //
    // $('body').on('touchmove', '.prices .table', function() {
    //     dragging = true;
    //     clearTimeout(timer);
    // });

    // $('body').on('touchend', '.prices .table.mobile-touched', function() {
    //     if (dragging) {
    //         timer = setTimeout(function() {
    //             $('.prices .table.mobile-touched').removeClass('mobile-touched');
    //         }, 1000);
    //     }
    // });

    $('body').on('touchstart', '.prices .table:not(.mobile-touched)', function() {
        //dragging = false;
        //clearTimeout(timer);
        $(this).addClass('mobile-touched');
    });
});

$(window).scroll(function () {
	scrolledHeader();
});

function scrolledHeader() {
	if ($(document).scrollTop() >= $('#header').height() + 100) {
		if (!$('#header').hasClass('scrolled')) {
			$('#header').addClass('scrolled');
            $('#header .scrolled-to-top-link').addClass('scrolled-to-top-link-active');
		}
	} else {
		if ($('#header').hasClass('scrolled')) {
			$('#header').removeClass('scrolled');
            $('#header .scrolled-to-top-link').removeClass('scrolled-to-top-link-active');
		}
	}
}

function changePortfolioItemImages($this, index) {
    if ($this.parents('.portfolio-item').hasClass('not-hovered')) {
        $this.parents('.portfolio-item').find('.images picture:first-child').addClass('active').parents('.portfolio-item').removeClass('not-hovered');
    }
    $this.parents('.portfolio-item').find('.images img.active').removeClass('active').parent().find('img:eq(' + index + ')').addClass('active');
    $this.parents('.portfolio-item').find('.images picture.active').removeClass('active').parent().find('picture:eq(' + index + ')').addClass('active');
    $this.parents('.portfolio-item').find('.images-navs span.active').removeClass('active').parent().find('span:eq(' + index + ')').addClass('active');
}
