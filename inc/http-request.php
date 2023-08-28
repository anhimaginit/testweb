<?php
class HTTPMethod{
public static function httpPost($url, $data)
{
    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);

    curl_close($curl);
    // echo($response);
    // echo '<br>';

    return json_decode($response);
}
}

function hasIdParam()
{
    if (isset($_GET['id']) && $_GET['id'] != '' && $_GET['id'] != '0' && $_GET['id'] != 'undefined') {
        return true;
    } else {
        return false;
    }
}

function hasParam($param)
{
    if (isset($_GET[$param]) && $_GET[$param] != '' && $_GET[$param] != 'undefined') {
        return true;
    } else {
        return false;
    }
}

function getID()
{
    if (isset($_GET['id']) && $_GET['id'] != '' && $_GET['id'] != '0' && $_GET['id'] != 'undefined') {
        $tmp = $_GET['id'];
        if (is_numeric($tmp)) {
            return $tmp;
        } else {
            return base64_decode($tmp);
        }
    } else {
        return false;
    }
}
