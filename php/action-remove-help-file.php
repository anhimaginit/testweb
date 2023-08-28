<?php
header('Access-Control-Allow-Methods: POST');

$path = "../data/help/help-file.json";
$myjson = (array) json_decode(file_get_contents($path));
if (isset($_GET['id'])) {
    $object = $myjson[$_GET['id']];
    if (isset($object)) {
        try{
            unlink('../' . $object->content);
            unset($myjson[$_GET['id']]);
            $upload = file_put_contents($path, json_encode((object) $myjson));

            if($upload>0){
                echo '{"success" : true}';
            }else{
                echo '{"success" : false, "error": "The file cannot update"}';
            }
        }catch(Exception $e){
            echo '{"success" : true}';
        }
    } else {
        echo '{"error": "Cannot find help file ' . $_GET['id'] . '", "success" : false}';
    }
}
