<?php

require_once dirname(__DIR__) . '/init.php';
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, PUT');
header('Access-Control-Allow-Credentials: true');

if (isset($_POST['index'])) {
    $data_root = json_decode(file_get_contents('../data/feedback-list.json'));
    $index = (intval($_POST['index']));
    if (sizeof($data_root) > $index) {
        \array_splice($data_root, $index, 1);
        file_put_contents('../data/feedback-list.json', json_encode($data_root));
        if (isset($_POST['file'])) {
            $pdf_link = str_replace('.json', '.pdf', '../ajax/feedback/pdf/' . $_POST['file']);
            $json_link = '../ajax/feedback/' . $_POST['file'];
            unlink($pdf_link);
            unlink($json_link);
        }
        echo '{"error" : false, "success" : true, "message" : "Feedback is deleted"}';
    } else {
        die('{"error" : true, "message" : "Your index is out of range"}');
    }
} else {
    die('{"error" : true, "message" : "Cannot find value"}');
}
