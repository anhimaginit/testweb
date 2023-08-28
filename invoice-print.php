<?php

require_once 'inc/http-request.php';

if (!session_id()) {
   session_start();
}

$API_server = '';
if ($_SERVER['HTTP_HOST'] == 'localhost') {
   $API_server = 'https://api.warrantyproject.com';
   // $API_server = 'https://api.salescontrolcenter.com';
} else {
   $API_server = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://api.' . $_SERVER['HTTP_HOST'];
}
if(isset($_GET['invoice'])){
   $invoiceID = $_GET['invoice'];
   
   $invoiceInfo = HTTPMethod::httpPost($API_server . '/_invoice_pdf.php', array(
      'token' => $_SESSION['token'],
      'invoice_num' => $invoiceID,
      'jwt' => $_SESSION['jwt'],
      'private_key' => $_SESSION['userID']
   ));
   
   echo $invoiceInfo->html;
}
?>
