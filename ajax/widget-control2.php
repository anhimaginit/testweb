<?php
use \SmartUI\Util as SmartUtil;
use SmartUI\Components\SmartForm;

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
$file_widget = array();
$file_names = array();

foreach ($files1 as $file_name) {
    if (strrpos($file_name, '.') > 0 && $file_name != '..') {
        array_push($file_names, $file_name);
        array_push($file_widget, array('id' => $file_name));
    }
}

sort($file_names);

$options = array(
    'editbutton' => false,
    'colorbutton' => false,
    'collapsed' => true,
    'togglebutton' => true,
    'fullscreenbutton' => false,
    'deletebutton' => true,
);

$optionsub = array(
    'editbutton' => false,
    'colorbutton' => false,
    'collapsed' => false,
    'togglebutton' => false,
    'fullscreenbutton' => false,
    'deletebutton' => true,
);

$widget_result = '';
$widget_unused_result = '';
foreach ($listWidget as $_widget) {
    $subwidget = '';

    foreach ($_widget->children as $key => $value) {
        foreach ($value as $subkey => $_link) {

            $_sub = $_ui->create_widget($optionsub);
            $_sub->id = $_widget->id . '_' . $subkey;

            $_sub->header = array(
                "title" => "<h2 style=\"width: auto; font-size:12px;\">" . $_link . "</h2>",
            );
            $_sub->class = "sub-widget";
            $_sub->body = array(
                'content' => 'Nothing',
                'class' => 'hidden'
            );
            $subwidget .= $_sub->print_html(true);
        }
    }

    $widget = $_ui->create_widget($options);

    $widget->attr = function ($widget) {
        return 'data-custom-attr="test" data-some-id="2365"';
    };

    $widget->header = array(
        "icon" => 'fa-check',
        "title" => "<h2 style=\"width: auto;\">" . ucfirst($_widget->id) . "</h2>",
    );

    $widget->class = "no-height jarviswidget-color-green";
    $widget->id = $_widget->id;
    $widget->body = array(
        'content' => $subwidget,
    );

    $widget_result .= '<article class="col-md-3 col-xs-4">' . $widget->print_html(true) . '</article>';
}

$run_time = $_ui->run_time(false);

$_ui->start_track();

$fields = array(
    'widget_name' => array(
        'type' => 'input',
        'col' => 3,
        'properties' => array(
            'placeholder' => 'Widget Name',
            'icon' => 'fa-pencil',
            'icon_append' => false,
        ),
    ),
    'widget_body' => array(
        'type' => SmartForm::FORM_FIELD_SELECT2_MULTI,
        'col' => 5,
        'properties' => array(
            'data' => $file_names
        )
        
    )
);
$form = $_ui->create_smartform($fields);

$form_widget = $form->print_html(true);

?>

<section id="widget-grid" class="">
    <?php  echo ($form_widget); ?>
			<!-- row -->
   <div class="row" id="widget_content">

      <!-- NEW WIDGET START -->
    <?php
       
        echo ($widget_result); ?>
   </div>
</section>

<script type="text/javascript">

pageSetUp();
var widget_json = <?=$widget_json?>;
var file_widget = <?=json_encode($file_widget)?>;
</script>

<script src="<?=ASSETS_URL?>/js/smartwidgets/nestable2.js"></script>
<script src="<?=ASSETS_URL?>/js/script/widget-control.js"></script>