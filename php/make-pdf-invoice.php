<?php
if (!session_id()) {
  session_start();
}
require_once  '../vendor/autoload.php';
$html = '';

ob_start();
include '../invoice-print.php';
$html .= ob_get_contents();
ob_end_clean();

$mpdf = new \Mpdf\Mpdf(array(
  'autoPageBreak' => false
));
$mpdf->SetDisplayMode('fullpage');
$mpdf->list_indent_first_level = 0;

// $stylesheet = '<style>';
// $stylesheet .= file_get_contents(ASSETS_URL.'/css/bootstrap.min.css');
$stylesheet = file_get_contents(ASSETS_URL . '/css/bootstrap.min.css');
$stylesheet2 = file_get_contents(ASSETS_URL . '/css/your_style.css');
// $stylesheet .= '</style>';
$mpdf->WriteHTML($stylesheet, 1);
$mpdf->WriteHTML($stylesheet2, 1);
$mpdf->WriteHTML($html);
// echo $stylesheet2;

$filename = 'Invoice-' . $_GET['invoice'] . '-' . date('Ymd_hms') . '.pdf';

$mpdf->Output($filename, 'D');



echo $html;

// if (file_exists($filename)) {
//    header('Content-type: application/force-download');
//    header('Content-Disposition: attachment; filename='.$filename);
//    readfile($filename);
// }
// unlink($filename);
