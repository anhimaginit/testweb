<?php
require_once '../init.php';
use \SmartUI\Components\SmartForm;

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Credentials: true');
define('COL_DEFAULT', 3);
if (isset($_SESSION['jwt']) && isset($_POST['data'])) {
   $body = '';
   $data = $_POST['data'];
   $text = '';
   $field = [];
   for ($i = 0; $i < sizeof($data); $i++) {

      $text .= '<div class="row">';
      foreach ($data[$i] as $key => $value) {

         array_push($field, $key);

         if (!isset($value['col'])) $value['col'] = COL_DEFAULT;
         if (!isset($value['properties'])) $value['properties'] = array('type' => 'text');
         if (isset($value['append'])) {

            $text .= '<div class="col col-'.totalCol($value).'">
                        <div class="row">
                           <div class=" col col-sm-12">';
            $text .=  isset($value['properties']['label']) ? '<label class="input">' . $value['properties']['label'] . '</label>' : '';
            $text .= '<div class="input-group">';

            $value['properties']['name'] = $key;

            $text .= createField($value);
            $text .= '<div class="input-group-btn">';
            foreach ($value['append'] as $child) {
               $child['data']['properties']['name'] = $child['name'];

               array_push($field, $child['name']);

               $text .= createField($child['data']);
            }
            $text .= '</div>'; //input btn
            $text .= '</div>'; //input group
            $text .= '</div>'; //sm-12
            $text .= '</div>'; //row
            $text .= '</div>'; //md-12
         } else {
            $text .= SmartForm::print_field($key, $value['type'], $value['properties'], $value['col'], true);
         }
      }
      $text .= '</div>';
   }
   $text .= '<input type="hidden" id="form_field" value=\''.json_encode($field).'\'>';

   echo $text;
} else {
   echo '';
}
function totalCol($data)
{
   $result = $data['col'] ? $data['col'] : COL_DEFAULT;
   if ($data['append']) {
      foreach ($data['append'] as $child) {
         $result += isset($child['data']['col']) ? $child['data']['col'] : 0;
      }
   }
   return $result;
}
function createField($data)
{
   $tagName1 = (!isset($data['type']) || $data['type'] != 'select' ? 'input' : 'select');
   $tagName2 = (!isset($data['type']) || $data['type'] != 'select' ? '' : '</select>');
   $type = !isset($data['properties']->type) ? 'text' : $data['properties']->type;
   $name = isset($data['properties']['name']) ? $data['properties']['name'] : uniqid();
   $id = isset($data['properties']['id']) ? $data['properties']['id'] : '';
   $class = 'form-control ' . (isset($data['properties']['class']) ? $data['properties']['class'] : '');
   // if (isset($data['col'])) {
   //    $class .= ' col-' . $data['col'];
   // }
   $attr = isset($data['properties']['attr']) ? $data['properties']['attr'] : [];
   $attribute = '';
   foreach ($attr as $key => $value) {
      $attribute .= $key . '="' . $value . '" ';
   }
   $prop = isset($data['properties']['prop']) ? $data['properties']['prop'] : [];
   foreach ($prop as $key => $value) {
      $attribute .= $key . '="' . $value . '" ';
   }
   $content = '';
   if ($tagName1 == 'select') {
      if (isset($data['properties']['display']) && isset($data['properties']['value']))
         foreach ($data['properties']['data'] as $key) {
            $content .= '<option value="' . ($key[$data['properties']['value']]) . '">' . ($key[$data['properties']['display']]) . '</option>';
         } else {
         foreach ($data['properties']['data'] as $key) {
            $content .= '<option value="' . $key . '">' . $key . '</option>';
         }
      }
   }
   $result = '';
   $result .= '<' . $tagName1 . ' ';
   if ($tagName1 == 'input') $result .= 'type="' . $type . '" ';
   $result .= 'name="' . $name . '" ';
   $result .= $id != '' ? 'id="' . $id . '" ' : '';
   $result .= 'class="' . $class . '" ';
   $result .= $attribute;
   $result .= '>';
   $result .= $content;
   $result .= $tagName2;

   return $result;
}
