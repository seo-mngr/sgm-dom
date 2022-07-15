function initYmap($mapContainer, mapData) {
    var map;
    var offsetCenterLat = 0;
    var offsetCenterLng = 0;

    ymaps.ready(mapInit);

    switch ($mapContainer.data('map-type')) {
        case 'all-contacts':
            offsetCenterLat = 0;
            offsetCenterLng = 0.0035;
            if (window.matchMedia('(max-width: 767px)').matches) {
                offsetCenterLat = 0;
                offsetCenterLng = 0;
            }
        break;
        case 'objects-map':
            offsetCenterLat = 0;
            offsetCenterLng = -0.12;
            if (window.matchMedia('(max-width: 767px)').matches) {
                offsetCenterLat = 0;
                offsetCenterLng = 0;
            }
        break;
    }

    function mapInit() {
        var mapCenterLat = [];
        var zoom = 16;

        if (!mapData) {
            mapCenterLat = [
                $mapContainer.data('lat')+offsetCenterLat,
                $mapContainer.data('lng')+offsetCenterLng
            ]
        } else {
            mapCenterLat = [
                mapData.items[0].lat+offsetCenterLat,
                mapData.items[0].lng+offsetCenterLng
            ];
            zoom = $mapContainer.data('map-zoom');
        }

        map = new ymaps.Map($mapContainer[0], {
            center: mapCenterLat,
            zoom: zoom,
            controls: ['smallMapDefaultSet']
        });
        map.behaviors.disable('scrollZoom');

        if (!mapData) {
            var markerIconOptions = {};
            if ($mapContainer.data('icon')) {
                markerIconOptions = {
                    iconLayout: 'default#image',
                    iconImageHref: $mapContainer.data('icon'),
                    iconImageSize: [$mapContainer.data('icon-width'), $mapContainer.data('icon-height')]
                };
            }
            createMapMarker({
                map: map,
                icon: markerIconOptions,
                position: [$mapContainer.data('lat'), $mapContainer.data('lng')],
                markerContent: {}
            });
        } else {
            for (var i = 0; i < mapData.items.length; i++) {
                var markerIconOptions = {};
                if (mapData.items[i].icon) {
                    markerIconOptions = {
                        iconLayout: 'default#image',
                        iconImageHref: mapData.items[i].icon,
                        iconImageSize: [mapData.iconWidth, mapData.iconHeight],
                        iconImageOffset: [-mapData.iconWidth/2, -mapData.iconHeight],
                        balloonOffset: [-20, -5]
                    };
                }

                var balloonContent = '<div class="objects-map-item-content">';
                if (mapData.items[i].image) {
                    balloonContent = balloonContent + '<div class="image"><img src="'+mapData.items[i].image+'" alt=""/></div>';
                }
                balloonContent = balloonContent + '<div class="desc">';
                if (mapData.items[i].title) {
                    balloonContent = balloonContent + '<div class="b-title bt18 semibold no-margin">'+mapData.items[i].title+'</div>';
                }
                if (mapData.items[i].desc) {
                    balloonContent = balloonContent + '<div class="b-title bt16 color4 no-margin">'+mapData.items[i].desc+'</div>';
                }
                if (mapData.items[i].price) {
                    balloonContent = balloonContent + '<div class="b-title bt16 bold no-margin">'+mapData.items[i].price+'</div>';
                }
                if (mapData.items[i].url) {
                    balloonContent = balloonContent + '<a class="styled-btn styled-btn-2" href="'+mapData.items[i].url+'" target="_blank"><div class="b-title-texture b-title-texture-size-10 b-title-texture-absolute"></div>Страница объекта<svg class="arrow-right"><use xlink:href="#icon-arrow-right"/></svg></a>';
                }
                balloonContent = balloonContent + '</div>';
                balloonContent = balloonContent + '</div>';

                createMapMarker({
                    map: map,
                    icon: markerIconOptions,
                    position: [mapData.items[i].lat, mapData.items[i].lng],
                    markerContent: {
                        hintContent: mapData.items[i].title,
                        balloonContent: balloonContent
                    }
                });
            }
        }
    }
}

function createMapMarker(data) {
    var marker = new ymaps.Placemark(data.position, data.markerContent, data.icon);
    data.map.geoObjects.add(marker);
    if (data.markerContent) {
        data.map.events.add('click', function() {
            data.map.balloon.close();
        });
    }
}

$(document).ready(function () {
    if (typeof initYmap !== "undefined") {
        $('.ymap-container').each(function(i, elem) {
            var $this = $(this);
            if (!$(this).data('map-data-url')) {
                initYmap($this, '');
            } else {
                $.getJSON($(this).data('map-data-url'), function(response) {
                    if (response) {
                        initYmap($this, response);
                    }
                });
            }
        });
    }
});
