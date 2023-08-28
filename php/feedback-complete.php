<?php

require_once dirname(__DIR__) . '/init.php';
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, PUT');
header('Access-Control-Allow-Credentials: true');

if(isset($_POST['index']) && isset($_POST['file'])){
    $data_root = json_decode(file_get_contents('../data/feedback-list.json'));
    $data_file = json_decode(file_get_contents('../ajax/feedback/'.$_POST['file']));
    $index = (intval($_POST['index']));
    if(sizeof($data_root) >$index){
        $data_root[$index]->isComplete = true;
        $data_file->isComplete = true;
        file_put_contents('../data/feedback-list.json', json_encode($data_root));
        file_put_contents('../ajax/feedback/'.$_POST['file'], json_encode($data_file));
        
        echo '{"error" : false, "success" : true, "message" : "Feedback is checked complete"}';
    }else{
        die('{"error" : true, "message" : "Your index is out of range"}');
    }
}else{
    die('{"error" : true, "message" : "Cannot find value"}');
}