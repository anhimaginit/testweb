<?php

if (!session_id()) {
  session_start();
}
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');
if (!isset($_GET['data'])) {
  exit('');
}
$req_attr = $_GET['data'];
if (isset($_SESSION[$req_attr])) {
  if (isset($_GET['child'])) {
    $_attr = $_GET['child'];
    $result = $_SESSION[$req_attr];
    $_childs = explode('-', $_attr);
    for ($i = 0; $i < sizeof($_childs); $i++) {
      if ($_childs[$i] != '') {
        if (isset($result[$_childs[$i]]))
          $result = $result[$_childs[$i]];
        else
          exit('');
      }
    }
    echo json_encode($result);
  } else {
    echo json_encode($_SESSION[$req_attr]);
  }
} else {
  echo '';
}
