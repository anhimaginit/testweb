<?php
$auth = base64_encode( 'user:anhho' );
$data = array(
    'email_address' => 'anh@at1ts.com',
    'status'        => 'subscribed',
    'apikey' => '214a2036199e47ede48b7e468c796db5-us19'

);

$json_data = json_encode($data);


$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://us19.api.mailchimp.com/3.0/');
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
    'Authorization: Basic '.$auth));
curl_setopt($curl, CURLOPT_USERAGENT, 'PHP-MCAPI/2.0');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_TIMEOUT, 10);
curl_setopt($curl, CURLOPT_POST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_POSTFIELDS, $json_data);

// You can also bunch the above commands into an array if you choose using: curl_setopt_array

// Send the request
$result = curl_exec($curl);

// Get some cURL session information back
$info = curl_getinfo($curl);

print_r("test===".$info);
echo 'content type: ' . $info['content_type'] . '<br />';
echo 'http code: ' . $info['http_code'] . '<br />';

// Free up the resources $curl is using
curl_close($curl);

echo $result;





