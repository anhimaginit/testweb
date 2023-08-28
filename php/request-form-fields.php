<?php

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');

if (!session_id()) {
    session_start();
}

function startsWith($string, $startString)
{
    $len = strlen($startString);
    return (substr($string, 0, $len) === $startString);
}

$form = $_POST['form'];

if (isset($form) && isset($_SESSION['jwt']) && isset($_SESSION['int_acl']) && isset($_SESSION['actor'])) {
    $intAcl = array();
    foreach($_SESSION['int_acl'] as $item){
        if($_SESSION['actor']== $item['department']){
            $intAcl = (array) $item;
            $intAcl = $intAcl['acl_rules'];
            $intAcl = (array) $intAcl[0];
            if (isset($intAcl[$form])) {
                $intAcl = (array) $intAcl[$form];
                $result = [];
                foreach ($intAcl as $key => $value) {
                    if (!(startsWith($key, 'btn'))) {
                        $result[] = $key;
                    }
                }
                echo json_encode($result);
            } else {
                echo '[]';
            }
        }
    }
}else{
    echo '[]';
}
