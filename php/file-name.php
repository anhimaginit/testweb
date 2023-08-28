<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');
$result = '';

$dir = '../ajax';

$files1 = scandir($dir, 1);

array_push($files1,
   'signin.php', 'logout.php', 'claim-request.php',
   'index.php', 'upload.php', 'register.php', 'forgotpassword.php'
);

$file_names = [];

foreach ($files1 as $file_name) {
   if (strrpos($file_name, '.') > 0 && $file_name != '..') {
      array_push($file_names, $file_name);
   }
}
if (isset($_POST['page'])) {
   $indexs = array_search($_POST['page'], $file_names);
   $result = '{"status" : ' . json_encode($indexs) . '}';
} else {
   $result = '{"status" : false}';
}

echo ($result);
