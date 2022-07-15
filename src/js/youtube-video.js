$(document).ready(function () {
    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    $('body').on('click', '.youtube-thumbnail, .youtube-play-btn', function () {
        $(this).parents('.youtube-video').append('<div class="youtube-video-iframe"></div>');
        new YT.Player($(this).parents('.youtube-video').find('.youtube-video-iframe')[0], {
            videoId: $(this).parents('.youtube-video').data('video-id'),
            playerVars: {
                'autoplay': 1,
                'iv_load_policy': 3,
                'modestbranding': 1,
                'rel': 0
            },
            events: {
                'onReady': function(event) {
                    event.target.playVideo();
                }
            }
        });
	});
});
