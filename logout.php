<?php

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true'); 


$past = time() - 3600;
$tmp = '';
if(isset($_COOKIE['prePage'])){
    $tmp = $_COOKIE['prePage'];
}
foreach ($_COOKIE as $key => $value) {
    setcookie($key, $value, $past, '/');
}
if (session_id()) {
    session_unset();
    session_destroy();
}
setcookie('prePage', $tmp, time() + 1800, '/');
// echo('
// <script src="https://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>
// <script>
// var config = {
//     apiKey: "AIzaSyAqXCluATPscHI8jmK_zaREVboAnnwaiig",
//     authDomain: "service-chat-call.firebaseapp.com",
//     databaseURL: "https://service-chat-call.firebaseio.com",
//     projectId: "service-chat-call",
//     storageBucket: "service-chat-call.appspot.com",
//     messagingSenderId: "418608382471"
// };
//     firebase.initializeApp(config);
//     firebase.auth().signOut();
//     window.location.href="./signin.php";
// </script>');
