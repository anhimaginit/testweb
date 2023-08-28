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
sort($files1);

$file_names = array();
$file_widget = array();
foreach ($files1 as $file_name) {
    if (strrpos($file_name, '.') > 0 && $file_name != '..') {
        array_push($file_names, $file_name);
        array_push($file_widget, array('id' => $file_name));
    }
}


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
$mywidget->id = 'dd_widget_items';
$mywidget->body = array(
    'content' => '  ',
);

/**---------------- LIST FILE IN PROJECT---------------- */

$content_files = '' . SmartForm::print_field('search_widget', SmartForm::FORM_FIELD_INPUT,
    array(
        'placeholder' => 'Search Widget',
        'type' => 'search',
        'id' => 'search_widget',
        'class' => 'form-control',
    ), 3, true);

$widgetlistFile = $_ui->create_widget($options);

$widgetlistFile->header = array(
    "icon" => 'fa-file-o',
    "title" => "<h2 style=\"width: auto;\">File List</h2>",
);

$widgetlistFile->class = "no-height jarviswidget-color-teal";
$widgetlistFile->id = 'widget_list_file';
$widgetlistFile->body = array(
    'content' => $content_files.'
    <div class="row">
        <div class="col-sm-3 col-xs-6">
            <div class="dd" id="dd_1"></div>
        </div>
        <div class="col-sm-3 col-xs-6">
            <div class="dd" id="dd_2"></div>
        </div>
        <div class="col-sm-3 col-xs-6">
            <div class="dd" id="dd_3"></div>
        </div>
        <div class="col-sm-3 col-xs-6">
            <div class="dd" id="dd_4"></div>
        </div>
    </div>',
);

/** -----------FORM ADD WIDGET---------------- */
$add_widget_form = '' . SmartForm::print_field('widget_name', SmartForm::FORM_FIELD_INPUT,
    array(
        'placeholder' => 'Widget Name',
        'id' => 'widget_name',
        'type' => 'text',
    ), 3, true).'<div class="note error" id="widget_name_error"></div>';
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

<script src="<?=ASSETS_URL?>/js/smartwidgets/nestable2.js"></script>
<script src="<?=ASSETS_URL?>/js/smartwidgets/nestable2.js"></script>
<script type="text/javascript">

    pageSetUp();
    var widget_json = <?=$widget_json?>;
    var file_widget = <?=json_encode($file_widget)?>;
</script>
<script src="<?=ASSETS_URL?>/js/script/widget-control.js"></script>