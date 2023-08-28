<?php
$__host = dirname(dirname(dirname(__DIR__)));

require_once $__host . '/inc/http-request.php';
require_once $__host . '/init.php';
require_once $__host . '/inc/authenticate.php';

function startsWith ($string, $startString) 
{ 
    $len = strlen($startString); 
    return (substr($string, 0, $len) === $startString); 
} 