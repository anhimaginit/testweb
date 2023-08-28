<?php
if (!session_id()) {
   session_start();
}
require_once  '../vendor/autoload.php';
/*
params: url/content, [css], title;
 */

if ((!isset($_POST['url']) && !isset($_POST['content'])) || !isset($_POST['title'])) {
   die('false');
}

$html = '';
if (isset($_POST['content'])) {
   $html .= $_POST['content'];
} else if (isset($_POST['url'])) {
   ob_start();
   include $_POST['url'];
   $html .= ob_get_contents();
   ob_end_clean();
}


$mpdf = new \Mpdf\Mpdf(array(
   'autoPageBreak' => true
));
$mpdf->SetDisplayMode('fullpage');
$mpdf->list_indent_first_level = 0;

$stylesheet = file_get_contents($_SESSION['server_host'] . '/css/bootstrap.min.css');
if (isset($_POST['css'])) {
   foreach ($_POST['css'] as $css) {
      $mpdf->WriteHTML(file_get_contents($css), 1);
   }
}
$stylesheet2 = file_get_contents($_SESSION['server_host'] . '/css/your_style.css');
$mpdf->WriteHTML($stylesheet, 1);
$mpdf->WriteHTML($stylesheet2, 1);
$mpdf->WriteHTML($html);

$filename = $_POST['title'] . '.pdf';

$mpdf->Output($filename, 'D');

echo $html;
