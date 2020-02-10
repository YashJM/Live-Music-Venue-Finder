

var pushpin, infobox, coordinates, map, userLocation, removeInfobox, userLat, userLong, lmvName, myInput;
function loadMapScenario() {
    
    $('#description').hide();
    //Loading of the map
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {center: new Microsoft.Maps.Location(43.260, -79.8711), zoom: 12});
    displayPushpin('All Cities');
    askLocation();
    lmvName = new Array(lmvlist.length);
        for (var i = 0; i < lmvName.length; i++) {
            lmvName[i] = lmvlist[i]['name'];
        }
 myInput = document.getElementById('myInput');
    
   
}
function askLocation() {
    navigator.geolocation.getCurrentPosition(
            //function will be invoked if user allow the access
                    function (position) {
                        //adding pushpin to user current location
                        coordinates = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
                        userLat = position.coords.latitude;
                        userLong = position.coords.longitude;
                        userLocation = new Microsoft.Maps.Pushpin(coordinates, {color: '#FE6663'});
                        infobox = new Microsoft.Maps.Infobox(coordinates, {title: 'You are Here!'});
                        infobox.setMap(map);
                        map.entities.push(userLocation);
                    },
                    //Adding second paramater to for the failure. If the user denied the access to location
                            function (error) {
                                var msg = "<h4>GPS Co-ordinates Unavailable!!<br><br> Values for Mohawk College is used. <br><br>" + error.message + "</h4>";
                                //jQuery.noConflict();
                                $('#msg').html(msg);
                                $(".modal").modal("show");
                                userLat = 43.238306;
                                userLong = -79.88539209999999;

                            }
                    );
                }
        //Display Pushpins on map
        function displayPushpin(city) {
            $('#description').hide();
            $('#pictures').show();
            var names = "";
            for (var i = 0; i < lmvlist.length; i++) {
                names += '<li class="panel panel-default"><a href="#" class="panel-body" onclick="showSinglePin(' + i + ');">' + lmvlist[i]['name'] + ' - ' + lmvlist[i]['city']+'</a></li>';
                if (lmvlist[i]['city'] === city || city === 'All Cities') {
                    
                    var location = new Microsoft.Maps.Location(lmvlist[i]['latitude'], lmvlist[i]['longtitude']);
                    pushpin = new Microsoft.Maps.Pushpin(location, null);
                    pushpinMetadata(i);
                    pushpinEvents();
                    map.entities.push(pushpin);
                }
            }
            $('#panelHeading').html('<h4>Live Music Venue - All cities</h4>');
            $('#list').html(names);
        }
        function showSinglePin(j) {
            removePins();
            for (var i = 0; i < lmvlist.length; i++) {
                if (i === j) {
                    var location = new Microsoft.Maps.Location(lmvlist[i]['latitude'], lmvlist[i]['longtitude']);
                    pushpin = new Microsoft.Maps.Pushpin(location, null);
                    pushpinMetadata(i);
                    pushpinEvents();
                    map.entities.push(pushpin);
                    showDescription(i);
                }
            }

        }
        //pushpinEvents() has all the events that is appiled on a pushpin
        function pushpinEvents() {
            Microsoft.Maps.Events.addHandler(pushpin, 'click', showDetails);
            Microsoft.Maps.Events.addHandler(pushpin, 'mouseover', function (e) {
                e.target.setOptions({color: 'blue'});
            });
            Microsoft.Maps.Events.addHandler(pushpin, 'mouseout', function (e) {
                e.target.setOptions({color: '#aa298f'});
            });
        }
        //Store the position of the live music place from the array
        function pushpinMetadata(arrayRefrence) {
            pushpin.metadata = {
                id: arrayRefrence
            };
        }
        //Display data for the clicked pushpin
        function showDetails(e) {
            var i = e.target.metadata.id;
            showDescription(i);

        }
        //Display pushpin of the city on which user has clicked
        function sortCity(city) {
            removePins();
            displayPushpin(city);
        }
        //Remove all the pins from the map
        function removePins() {
            for (var i = map.entities.getLength() - 1; i >= 0; i--) {
                var pushpin = map.entities.get(i);
                if (pushpin instanceof Microsoft.Maps.Pushpin && pushpin !== userLocation) {
                    map.entities.removeAt(i);
                }
            }
        }
        //Add description about the clicked pushpin
        function showDescription(i) {
            var description = "<h3>" + lmvlist[i]['name'] + "</h3>";
            description += "<p>Address: " + lmvlist[i]['address'] + ", " + lmvlist[i]['city'] + "</p>";
            description += "<p>Phone: " + lmvlist[i]['phone'] + "</p>";
            if (lmvlist[i]['website'] !== "") {
                description += "<p>Website: <a href='" + lmvlist[i]['website'] + "'>" + lmvlist[i]['name'] + "</a></p>";
            }
            description += '<a class="btn btn-primary btn-lg" target="_blank" href="http://bing.com/maps/default.aspx?where1=' + lmvlist[i]['address'] + ', ' + lmvlist[i]['city'] + ', ON" target="_blank">Bing Maps</a> ';
            var startpoint = "pos." + userLat + "_" + userLong;
            var endPoint = "pos." + lmvlist[i]['latitude'] + "_" + lmvlist[i]['longtitude'];
            description += '&nbsp; &nbsp; <a class="btn btn-default btn-lg" target="_blank" href="http://bing.com/maps/default.aspx?rtp=' + startpoint + '~' + endPoint + '">Get Direction</a>';
            $('#pictures').hide();
            $('#description').html(description).show();

        }


        
//----------------------------------------------------------------
//The following technique is the taken from w3School        


function search() {
    $('#panelHeading').html('<h4>Search Results</h4>');
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("list");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}