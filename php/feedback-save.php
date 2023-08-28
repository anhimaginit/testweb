<?php

require_once dirname(__DIR__) . '/init.php';
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, PUT');
header('Access-Control-Allow-Credentials: true');

require_once  '../vendor/autoload.php';
$data = (object) array();
$key = array('user', 'user_name', 'topic', 'subject', 'content', 'url', 'avt');
$feedback_folder = './ajax/feedback/';
$notValue = array();
foreach ($key as $item) {
   if (isset($_POST[$item])) {
      $data->$item = $_POST[$item];
   } else {
      $data->$item = '';
      array_push($notValue, $item);
   }
}
if (in_array('user', $notValue)) {
   die('{"error" : "Your ID is required", "success": false}');
}
if ($data->url == '') {
   $data->url = 'u' . $data->user . ' ' . $data->topic . '.' . date('Ymd') . '-' . random_int(100000, 900000000) . '.json';
}
$data->url = str_replace('/', '-',  $data->url);
$data->url = str_replace('&', '-',  $data->url);
$data->time = date('Y-m-d H:m:s');


/**upload file */
$update = file_put_contents('.' . $feedback_folder . $data->url, json_encode($data));

if ($update > 0) {
   /** create pdf file */
   $content = createPDF(str_replace('.json', '.pdf', '.' . $feedback_folder . 'pdf/' . $data->url), $data);
   unset($data->content);
   /** update storage file */
   $data_root = file_get_contents('../data/feedback-list.json');
   if ($data_root == '') $data_root = array();
   else $data_root = json_decode($data_root);
   array_push($data_root, $data);
   file_put_contents('../data/feedback-list.json', json_encode($data_root));
   $result = (object) array(
      "success" => true,
      "message" => "Thank you for your feedback",
      "file" => $data->url,
      "content" => $content
   );
   echo json_encode($result);
} else {
   echo '{"success" : false, "error" : "System error"}';
}

function createPDF($link, $data)
{
   $html = '';
   $html .= '<span style="float:right; text-align:right">' . $data->time . '</span>';
   $html .= '<h2 class="email-open-header uppercase-first bold ' . $data->topic . '">' . $data->topic . '</h2>';
   $html .= '<h3>' . $data->subject . '</h3>';
   $html .= '<div class="bold"> <img src="' . $data->avt . '" class="avatar" style="width:40px;"> ' . $data->user_name . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#'. $data->user.'</a></div>';
   $html .= '<div class="feedback-detail well" style="padding-top:20px; margin-top:10px">'
      . $data->content .
      '</div>';
   $stylesheet = file_get_contents('../css/bootstrap.min.css');
   $stylesheet2 = file_get_contents('../css/your_style.css');
   $mpdf = new \Mpdf\Mpdf(array(
      'autoPageBreak' => true
   ));
   $mpdf->SetDisplayMode('fullpage');
   $mpdf->list_indent_first_level = 0;

   $mpdf->WriteHTML($stylesheet, 1);
   $mpdf->WriteHTML($stylesheet2, 1);
   $mpdf->WriteHTML($html, 2);

   $mpdf->Output($link, 'F');

   return $html;

   // if (file_exists($link)) {
   //    header('Content-type: application/force-download');
   //    header('Content-Disposition: attachment; filename=' . $link);
   //    readfile($link);
   // }
}
