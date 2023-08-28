<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');

if (isset($_POST['data'])) {
    $file = '../data/widget.json';
    if (file_put_contents($file, $_POST['data'])) {
        echo 'Data successfully saved';
    } else {
        echo "error";
    }

}
