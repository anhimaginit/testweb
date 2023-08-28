<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');

function get_client_ip() {
   $ipaddress = getenv('HTTP_CLIENT_IP')?:
   getenv('HTTP_X_FORWARDED_FOR')?:
   getenv('HTTP_X_FORWARDED')?:
   getenv('HTTP_FORWARDED_FOR')?:
   getenv('HTTP_FORWARDED')?:
   getenv('REMOTE_ADDR');
   return $ipaddress;
}
echo(get_client_ip());
?>