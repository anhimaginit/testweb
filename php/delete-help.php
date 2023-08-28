<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');

if (isset($_POST['id'])){
   $id = $_POST['id'];
   $path = '../data/help-extend.json';
   $myjson = json_decode(file_get_contents($path));
   for ($i=0; $i < sizeof($myjson); $i++) { 
      if($myjson[$i]->id==$id){
         $item = $myjson[$i];
         $file = '../ajax/help/'.$item->url;
         if(file_exists($file)){

            unlink($file) or die('{"error" : "Couldn\'t delete file", "success" : false}');
            array_splice($myjson, $i, 1);

            $myFile = fopen($path, "w");
            fwrite($myFile, json_encode($myjson));
            fclose($myFile);

            echo '{"error" : "", "success" : true}';
            exit();
         }
      }
   }
   echo '{"error" : "Couldn\'t find file", "success" : false}';
}
