window.onload = function () {
    document.getElementById('zip-code-input').value = '';
}

var map;
var markers = [];
var infoWindow;

// Display map
function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };

    // Style for maps
    var styledMapType = new google.maps.StyledMapType(
        [{
                "featureType": "landscape",
                "stylers": [{
                        "hue": "#FFA800"
                    },
                    {
                        "saturation": 0
                    },
                    {
                        "lightness": 0
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "stylers": [{
                        "hue": "#53FF00"
                    },
                    {
                        "saturation": -73
                    },
                    {
                        "lightness": 40
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "stylers": [{
                        "hue": "#FBFF00"
                    },
                    {
                        "saturation": 0
                    },
                    {
                        "lightness": 0
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [{
                        "hue": "#00FFFD"
                    },
                    {
                        "saturation": 0
                    },
                    {
                        "lightness": 30
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "water",
                "stylers": [{
                        "hue": "#00BFFF"
                    },
                    {
                        "saturation": 6
                    },
                    {
                        "lightness": 8
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [{
                        "hue": "#679714"
                    },
                    {
                        "saturation": 33.4
                    },
                    {
                        "lightness": -25.4
                    },
                    {
                        "gamma": 1
                    }
                ]
            }
        ], {
            name: 'Styled Map'
        });


    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map'
            ]
        }
    });

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    infoWindow = new google.maps.InfoWindow();
    searchStores();

}

// Display result of input zipcode
function result() {
    var result = document.getElementById('zip');
    var searchedZip = document.getElementById('zip-code-input').value;

    result.textContent = searchedZip;
}

// Function for searching the zipcode
function searchStores() {
    var zipCode = document.getElementById('zip-code-input').value;
    var foundStores = [];

    if (zipCode) {

        for (var store of stores) {
            var postal = store['address']['postalCode'].substring(0, 5);

            if (postal == zipCode) {
                foundStores.push(store);
            }
        }

        if (foundStores.length != 0) {
            clearLoaction();
            displayStores(foundStores);
            showStoresMarkers(foundStores);
            result();
            setOnClickListner();
        } else if (foundStores.length == 0) {
            alert('Invalid zipcode');
            foundStores = stores;
        }

    } else {
        foundStores = stores;
    }


    clearLoaction();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    result();
    setOnClickListner();
}

//If the zipcode is found all the marker are removed except the input zipcode marker
function clearLoaction() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;

}

function setOnClickListner() {
    var storeElements = document.querySelectorAll('.single-store');
    storeElements.forEach(function (elem, index) {
        elem.addEventListener('mouseenter', function () {
            google.maps.event.trigger(markers[index], 'mouseover', function () {
                marker[index].setAnimation(google.maps.Animation.BOUNCE);
            });

            google.maps.event.trigger(markers[index], 'mouseout');
        });

        elem.addEventListener('click', function () {
            new google.maps.event.trigger(markers[index], 'mouseover');
        })
    })
}


function displayStores(stores) {
    var storesHtml = '';

    for (var [index, store] of Object.entries(stores)) {
        var address = store['addressLines'];
        var phone = store['phoneNumber'];
        storesHtml += `
        <div class="single-store">
                <div class="all-detail">
                    <div class="store-details">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="phone-number">
                        ${phone}
                    </div>
                </div>
                <div class="index-display">
                    <div class="index">${++index}</div>
                </div>
            </div>
            <hr>`;
        document.querySelector('.stores').innerHTML = storesHtml;
    }

}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();

    for (var [index, store] of Object.entries(stores)) {
        var latlng = new google.maps.LatLng(
            store['coordinates']['latitude'],
            store['coordinates']['longitude']);
        var phone = store['phoneNumber'];
        var name = store['name'];
        var address = store['addressLines'][0];
        var openStatus = store['openStatusText'];

        bounds.extend(latlng);
        createMarker(latlng, name, openStatus, ++index, address, phone);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, openStatus, index, address, phone) {
    var html = `<div class="popUp ${index}" id="pop-up">
    <div class="blaa">
        <div class="details">
            <span><b>${name}</b></span>
            <span>${openStatus}</span>
        </div>
        <div class="contacts">
            <div class="icons">
            <div class="icon"><a
            href="https://www.google.com/maps/dir/?api=1&origin=Mumbai,+Maharashtra&destination=${address}" target="blank"><i
                class="fas fa-location-arrow"></i></a>
            </div>
                <div class="icon"><i class="fas fa-phone-alt"></i></div>
            </div>
            <div class="labels">
                <span>${address}</span>
                <span>${phone}</span>
            </div>
        </div>
    </div>
</div>`;

    var icon = {
        url: "marker4.png", // url
        scaledSize: new google.maps.Size(80, 80), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: icon,
        animation: google.maps.Animation.DROP
    });
    marker.addListener('mouseover', toggleBounce);
    marker.addListener('mouseout', function () {
        marker.setAnimation(null);
    });

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    google.maps.event.addListener(marker, 'mouseover', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
        document.getElementById('pop-up').addEventListener('mouseover', function () {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        });
        document.getElementById('pop-up').addEventListener('mouseout', function () {
            marker.setAnimation(null);
        });
    });

    markers.push(marker);
}