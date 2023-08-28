<?php

require_once 'inc/init.php';

?>
<section id="widget-grid" class="">
   <div id="map" class="google_maps" style="width: 100%; height:500px;"></div>
</section>


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.googlemap/1.5/jquery.googlemap.js"></script>
<script>
var pagefunction = function(){
   var currentLocation = {};
   var pos = {
      lat: (getUrlParameter('lat') ? getUrlParameter('lat') : (currentLocation.lat ? currentLocation.lat : 40.898690)), 
      lng : (getUrlParameter('lng') ? getUrlParameter('lng'): (currentLocation.lng ? currentLocation.lng : -77.456184))
   };
   setTimeout(() => {
         var mapOptions = {
            zoom: 10,
         };
         mapOptions.center = new google.maps.LatLng(pos.lat, pos.lng);
         map = new google.maps.Map(document.getElementById('map'), mapOptions);

         var marker = new google.maps.Marker({
            position: mapOptions.center,
            map: map,
         });
         var infowindow = new google.maps.InfoWindow({
            content: '<p>Marker Location:' + marker.getPosition() + '</p>'
         });
         google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
         });
   }, 0);
}

$(window).unbind('gMapsLoaded');
$(window).bind('gMapsLoaded', pagefunction);
window.loadGoogleMaps();
</script>
