<?php
require_once dirname(__DIR__) . '/init.php';
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');

$data = (object) array();
$setting_url = './data/setting.json';
if (is_file('.'.$setting_url)) {
  $data = (object) json_decode(file_get_contents('.'.$setting_url));
}
$key = array('page_title', 'footer_info',
 'color_site', 'color_site_hover', 'top_menu_color', 'background', 'navigation', 
 'company_name', 'company_email', 'company_fax', 'company_address', 'company_address2', 'company_city', 'company_state', 'company_postal_code', 
 'gps', 'phone',
 'claim_start_fee', 'claim_status');

foreach ($key as $item) {
  if (isset($_POST[$item])) $data->$item = $_POST[$item];
}

if(isset($data->phone)) $data->phone = json_decode($data->phone);
if (!isset($_FILES['logo_ico']) || 0 < $_FILES['logo_ico']['error']) { } else {
  move_uploaded_file($_FILES['logo_ico']['tmp_name'], '../img/setting/ico/logo.ico');
  $data->logo_ico = ASSETS_URL . '/img/setting/ico/logo.ico';
}

if (!isset($_FILES['logo']) || 0 < $_FILES['logo']['error']) { } else {
  move_uploaded_file($_FILES['logo']['tmp_name'], '../img/setting/logo/logo.png');
  $data->logo = ASSETS_URL . '/img/setting/logo/logo.png';
}

if(isset($_POST['contact_vendor_type'])){
  file_put_contents('../data/contact-vendor-type.json', $_POST['contact_vendor_type']);
}

if(isset($_POST['contact_employee_type'])){
    file_put_contents('../data/contact-employee-type.json', $_POST['contact_employee_type']);
}



// $myFile = fopen($setting_url, "r");
$update = file_put_contents('.'.$setting_url, json_encode($data));
// fwrite($myFile, json_encode($data));
// fclose($myFile);

if($update>0){
  echo '{"success" : true}';
}else{
  echo '{"success" : false}';
}