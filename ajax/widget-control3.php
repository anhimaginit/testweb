<?php
use \SmartUI\Components\SmartForm;
use \SmartUI\Util as SmartUtil;
//initilize the page
require_once 'inc/init.php';

$widget_json = file_get_contents('../data/widget.json');
$listWidget = json_decode($widget_json);

$dir = '../ajax';
$files1 = scandir($dir, 1);
array_push($files1,
    'signin.php', 'logout.php', 'claim-request.php',
    'index.php', 'upload.php', 'register.php', 'forgotpassword.php'
);

$file_names = array();
$file_widget = array();
foreach ($files1 as $file_name) {
    if (strrpos($file_name, '.') > 0 && $file_name != '..') {
        array_push($file_names, $file_name);
        array_push($file_widget, array('id' => $file_name));
    }
}

sort($file_names);

$widget_result = '';
/** create list item widget */
foreach ($listWidget as $_widget) {
    $subwidget = '';

    foreach ($_widget->children as $key => $value) {
        foreach ($value as $subkey => $_link) {
            $item = '';
            $item .= '<li class="dd-item" data-id="' . $_link . '">';
            $item .= '<div class="dd-handle">';
            $item .= $_link;
            $item .= '<div class="popover center hidden">
                            <div class="arrow"></div>
                            <div class="popover-content">
                                <ul class="list-group">
                                    <li class="list-group-item"><a href="javascript:void(0);" onclick="removeItem(this)">Remove Item</a></li>
                                </ul>
                            </div>
                        </div>';
            $item .= '<i class="fa fa-times pull-right text-danger" onclick="removeItem(this)"></i>';
            $item .= '</div>';
            $item .= '</li>';
            $subwidget .= $item;
        }
    }
    $widget = '';
    $widget .= '
   <ol class="dd-list">
      <li class="dd-item" data-id="' . $_widget->id . '">
        <div class="dd-handle">';
    //widget name
    $widget .= ucfirst($_widget->id);
    //insert icon x
    $widget .= '<i class="fa fa-times-circle pull-right text-danger" onclick="removeWidget(this)"></i>';
    $widget .= '<div class="popover center hidden">
                    <div class="arrow"></div>
                    <div class="popover-content">
                        <ul class="list-group">
                            <li class="list-group-item"><a href="javascript:void(0);" onclick="removeWidget(this)">Remove Item</a></li>
                        </ul>
                    </div>
                </div>';
    $widget .= '</div>';
    $widget .= '<ol class="dd-list">';
    $widget .= $subwidget;
    $widget .= '</ol>';
    $widget .= '
      </li>
   </ol>';

    $widget_result .= '

    <div class="col-sm-6 col-lg-4">

       <div class="dd" id="' . $_widget->id . '">' . $widget . '</div></div>';
}
/**----------END LIST WIDGET------------------------------ */
//create widget
$options = array(
    'editbutton' => false,
    'colorbutton' => false,
    'collapsed' => false,
    'togglebutton' => false,
    'fullscreenbutton' => false,
    'deletebutton' => true,
);

$mywidget = $_ui->create_widget($options);

$mywidget->header = array(
    "icon" => 'fa-check',
    "title" => "<h2 style=\"width: auto;\">Widget Control</h2>",
);

$mywidget->class = "no-height jarviswidget-color-teal";
$mywidget->id = 'widget_item_widget';
$mywidget->body = array(
    'content' => $widget_result,
);

/**---------------- LIST FILE IN PROJECT---------------- */

$content_files = '' . SmartForm::print_field('search_widget', SmartForm::FORM_FIELD_INPUT,
    array(
        'placeholder' => 'Search Widget',
        'type' => 'search',
        'id' => 'search_widget',
        'class' => 'form-control',
    ), 3, true);
$content_files .= '<div class="row">';

for ($i = 0; $i < 4; $i++) {
    $content_files .= '
    
    <div class="col-sm-3 col-xs-6">
        <div class="dd">
            <ol class="dd-list">';
    for ($t = 0; $t <= sizeof($file_names) / 4; $t++) {
        $size = $i * sizeof($file_names) / 4 + $t;
        if ($size < sizeof($file_names)) {
            $item = '';
            $item .= '<li class="dd-item"  data-id="' . $file_names[$size] . '">';
            $item .= '<div class="dd-handle">';
            $item .= $file_names[$size];
            $item .= '</div>';
            $item .= '</li>';
            $content_files .= $item;
        }
    }
    $content_files .= '</ol></div>
    </div>';
}
$content_files .= '</div>';//row

$widgetlistFile = $_ui->create_widget($options);

$widgetlistFile->header = array(
    "icon" => 'fa-file-o',
    "title" => "<h2 style=\"width: auto;\">File List</h2>",
);

$widgetlistFile->class = "no-height jarviswidget-color-teal";
$widgetlistFile->id = 'widget_list_file';
$widgetlistFile->body = array(
    'content' => $content_files,
);

/** -----------FORM ADD WIDGET---------------- */
$add_widget_form = '' . SmartForm::print_field('widget_name', SmartForm::FORM_FIELD_INPUT,
    array(
        'placeholder' => 'Widget Name',
        'id' => 'widget_name',
        'type' => 'text',
    ), 3, true);
$add_widget_form .= '<button type="button" id="btnAddNewWidget" class="btn btn-sm btn-success">Add New</button>';
?>



<section id="widget-grid" class="">
   <div class="row" id="widget_content">
      <article class="col-sm-12">
         <?php
echo ($mywidget->print_html(true));
echo ('<div class="clearfix"></div>');
echo ('<div class="smart-form"><fieldset><legend>Add Widget</legend>' . $add_widget_form . '</fieldset></div>');
echo ('<div class="clearfix"></div>');
echo ($widgetlistFile->print_html(true));
?>
      </article>
   </div>
</section>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nestable2/1.6.0/jquery.nestable.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/nestable2/1.6.0/jquery.nestable.min.js"></script>
<script type="text/javascript">

    pageSetUp();
    var widget_json = <?=$widget_json?>;
    var file_widget = <?=json_encode($file_widget)?>;
</script>

<script src="<?=ASSETS_URL?>/js/script/widget-control.js"></script>

