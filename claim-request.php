<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');

if (!session_id()) {
    session_start();
}

$forward_from_email = 'get form email';

require_once '../inc/http-request.php';

$token = base64_encode('214a2036199e47ede48b7e468c796db5-us19');

if (hasParam('valid')) {
    $data = array(
        'token' => $token,
        'valid' => $_GET['valid'],
        'type' => $_GET['type'],
    );

    $url = 'https://api.salescontrolcenter.com';
    if($_SERVER['HTTP_HOST'] == 'localhost'){
        $url = 'http://api.warrantyproject.com';
    }else{
        $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://api.' . $_SERVER['HTTP_HOST'];
    }

    $validParam = httpPost($url + '/_claimGetValid.php', $data);

    if (null !== $validParam) {
        $roles = ["Sales", 'Affiliate', 'Customer', 'Vendor', 'Employee', 'PolicyHolder', 'SystemAdmin'];
        $data = array();
        setcookie('jwt', $validParam->contact->jwt, time() + 1800, '/');
        setcookie('jwt_refresh', $validParam->contact->jwt_refresh, time() + 1800, '/');
        foreach ($roles as $key) {
            if (isset($validParam->contact->acl_list->$key)) {
                setcookie('global_acl', json_encode($validParam->contact->acl_list->$key), time() + 1800, '/');
                $data->global_acl = $validParam->contact->acl_list->$key;

                setcookie('actor', $key, time() + 1800, '/');
                $data->actor = $key;
            }
        }
        // setcookie('int_acl', json_encode($validParam->contact->acl_list->int_acl), time() + 1800, '/');
        setcookie('userID', $validParam->contact->ID, time() + 1800, '/');
        setcookie('assign_to_email', $validParam->contact->primary_email, time() + 1800);

        $data->jwt = $validParam->contact->jwt;
        $data->jwt_refresh = $validParam->contact->jwt_refresh;
        $data->int_acl = $validParam->contact->acl_list->int_acl;
        $data->userID = $validParam->contact->ID;
        $data->IDs = $validParam->contact->IDs;

        $data->user_agent = $_SERVER['HTTP_USER_AGENT'];
        $data->assign_to_email = $validParam->contact->primary_email;

        unset($validParam->contact->jwt);
        unset($validParam->contact->jwt_refresh);
        unset($validParam->contact->acl_list);
        unset($validParam->contact->IDs);

        setcookie('user', json_encode($validParam->contact), time() + 1800, '/');
        $data->user = $validParam->contact;

        setcookie('token', $token, time() + 3600 * 365, '/');
        $data->token = $token;

        $_host = $_SERVER['HTTP_HOST'] == 'localhost' ? 'http://localhost/crm' : (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];

        httpPost($_host . '/php/request.setSession.php', $data);
    }
}
