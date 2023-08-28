<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');

$field = ['title', 'index', 'file_name', 'my_file'];
$isValid = true;
if ($isValid == true) {
   $data = $_POST['my_file'];
   $name = $_POST['file_name'];
   $name = "ajax/help/" . $name;

   if (!empty($name)) {
      $upload = file_put_contents('../' . $name, $data);
      if ($upload > 0) {
         saveToFileHelp($_POST['file_name']);
      } else {
         echo '{"error" : "Error! An error occured. Please try again", "success" : false}';
      }
      return;
   } else {
      echo '{"error" : "Please choose file to upload", "success" : false}';
      return;
   }
} else {
   echo '{"error" : "' . $isValid . '", "success" : false}';
}

function saveToFileHelp($link)
{
   $path = "../data/help-extend.json";
   $myjson = json_decode(file_get_contents($path));
   $myFile = fopen($path, "r+");
   $attrID = isset($_POST['id']) ? $_POST['id'] : uniqid() . '_' . (str_replace(' ', '', strtolower($_POST['title'])));
   $newAttr = array(
      'id' => $attrID,
      'title' => $_POST['title'],
      'index' => $_POST['index'],
      'url' => $link
   );
   if (!isset($myjson) || $myjson == '' || $myjson == '""') {
      $myjson = array();
   }

   if (isset($_POST['id'])) {
      for ($i = 0; $i < sizeof($myjson); $i++) {
         if ($myjson[$i]->id == $_POST['id']) {
            $myjson[$i] = $newAttr;
         }
      }
   }else{
      array_push($myjson, $newAttr);
   }
   fwrite($myFile, json_encode($myjson));
   fclose($myFile);
   echo '{"error" : "", "success" : true' . (isset($_POST['id']) ? '' : ', "id" : "' . $attrID.'"')  . '}';
}


function checkValidate($fields)
{
   foreach ($fields as $attr) {
      if (!isset($_POST[$attr]) || $_POST[$attr] == '') {
         return 'The field ' . $attr . ' is required.';
      }
   }
   return true;
}
