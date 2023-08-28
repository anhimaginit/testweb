<?php

$company_form = 'CompanyForm';

use \SmartUI\Components\SmartForm;
use \SmartUI\Util as SmartUtil;

require_once 'inc/init.php';
require_once '../php/link.php'
// $_authenticate->checkFormPermission($company_form);

?>
<section id="widget-grid" class="">
<?php
$current_form = '';
$documentEdit = array();
$vendor = [];
$vendordoc = [];
if (hasIdParam() && strrpos($_SERVER['REQUEST_URI'], 'company-form') > 0) {
    $current_form = 'edit';
    $data = HTTPMethod::httpPost($link['_company_ID'], array('ID' => getID(), 'jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID']));
    echo (json_encode($data));
    if ($data->ERROR == '') {
        $documentEdit = $data->comp;
        $vendor = $data->vendor;
        $vendordoc = $data->v_doc;
        $notes = $data->notes;

    }
} else if(hasIdParam() && strrpos($_SERVER['REQUEST_URI'], 'contact-form') > 0){

}else{
   $current_form = 'add';
}
$_ui->start_track();

$body_company = '
<div id="message_form" role="alert" style="display:none"></div>
<form class="smart-form" id="company_form" method="post">
   <input type="hidden" name="ID" value="' . (isset($documentEdit->ID) ? $documentEdit->ID : '') . '">
   <fieldset>
   <div class="row">' . SmartForm::print_field('name', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Company Name',
        'class' => 'text-input',
        'value' => (isset($documentEdit->name) ? $documentEdit->name : ''),
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('address1', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Address 1',
        'class' => 'text-input',
        'value' => (isset($documentEdit->address1) ? $documentEdit->address1 : ''),
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('address2', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Address 2',
        'class' => 'text-input',
        'value' => (isset($documentEdit->address2) ? $documentEdit->address2 : ''),
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('state', SmartForm::FORM_FIELD_SELECT,
    array(
        'label' => 'State',
        'class' => 'text-input state',
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('city', SmartForm::FORM_FIELD_SELECT,
    array(
        'label' => 'City',
        'class' => 'text-input city',
        'data' => [''],
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('county', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'County',
        'class' => 'text-input',
        'value' => (isset($documentEdit->county) ? $documentEdit->county : ''),
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('phone', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Phone',
        'value' => (isset($documentEdit->phone) ? $documentEdit->phone : ''),
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('fax', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Fax',
        'type' => 'number',
        'class' => 'text-input',
        'value' => (isset($documentEdit->fax) ? $documentEdit->fax : ''),
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('email', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Email',
        'type' => 'email',
        'value' => (isset($documentEdit->email) ? $documentEdit->email : ''),
        'disabled' => false,
    ), 6, true);

$body_company .= SmartForm::print_field('www', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Websites',
        'type' => 'url',
        'class' => 'text-input',
        'value' => (isset($documentEdit->www) ? $documentEdit->www : ''),
        'disabled' => false,
        'placeholder' => 'ex: http://yoursite.com',
    ), 6, true);

$body_company .= SmartForm::print_field('type', SmartForm::FORM_FIELD_CHECKBOX,
    array(
        'label' => 'Type',
        'inline' => "true",
        'items' => [
            ['label' => 'Real Estate Broker', 'value' => 'Real Estate Broker', 'checked' => (isset($documentEdit->type) && in_array('Real Estate Broker', $documentEdit->type))],
            ['label' => 'Mortgage', 'value' => 'Mortgage', 'checked' => (isset($documentEdit->type) && in_array('Mortgage', $documentEdit->type))],
            ['label' => 'Bacle', 'value' => 'Bacle', 'checked' => (isset($documentEdit->type) && in_array('Bacle', $documentEdit->type))],
            ['label' => 'Title', 'value' => 'Title', 'checked' => (isset($documentEdit->type) && in_array('Title', $documentEdit->type))],
            ['label' => 'Vendor<sup class="text-danger">*</sup>', 'value' => 'Vendor', 'checked' => (isset($documentEdit->type) && in_array('Vendor', $documentEdit->type))],
        ],
    ), 6, true);
$body_company .= '
<div id="vendor_expand">
	<section class="col col-6">
	<label class="input padding-5">Vendor Type</label>
	<input class="form-control tagsinput" id="vendor_type" name="vendor_type" value="" data-role="tagsinput">
	<label class="input padding-5">Vendor Note</label>
	<label class="textarea"><textarea name="vendor_note" row="4" value="' . (isset($vendor) && isset($vendor->notes) ? $vendor->notes : '') . '"></textarea></label>
	<label class="checkbox"><input type="checkbox" name="active" checked="true"><i></i> Active</label>
	</section>
	';
{
    ob_start();
    include './vendor-doc.php';
    $body_company .= ob_get_contents();
    ob_end_clean();
}
$body_company .= '</div>';
$body_company .= '</div></fieldset>';
$body_company .= '<fieldset><div>';

$body_company .= SmartForm::print_field('gps', SmartForm::FORM_FIELD_HIDDEN,
    array('value' => ''));

$body_company .= '<div id="gps" class="google_maps" style="width: 100%; height: 300px;"></div>';
$body_company .= '</div></fieldset>';

$pos = strrpos($_SERVER['REQUEST_URI'], "company-form");
if ($pos > 0) {
    ob_start();
    $type_note = 'company';
    $can_add_note = true;

    include './contact-note.php';
    $body_company .= ob_get_contents();
    ob_end_clean();
}

$body_company .= '<footer>';
// button Submit
$body_company .= '<button type="submit" id="btnSubmitCompany" class="btn btn-primary">Submit</button>';
// button Back
$body_company .= '<button type="button" id="btnBackCompany" class="btn btn-default"">Back</button>';
$body_company .= '</footer>
</form>';

$_ui->create_widget()->body('content', $body_company)
    ->options('editbutton', false)
    ->body('class', 'no-padding')
    ->header('title', '<h2>Company form ' . ($current_form == 'edit' ? "edit ID: " . getID() . '</h2> <a href="./#ajax/company-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Company</a>' : "") . '</h2>')->print_html();
?>

</section>
<div>

</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.googlemap/1.5/jquery.googlemap.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/bootstrap-tags/bootstrap-tagsinput.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/jquery-validate/jquery.validate.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/bootstrapvalidator/bootstrapValidator.min.js"></script>
<script>
var pagefunction = function(){
    var pos = {};
    if ("geolocation" in navigator){ //check geolocation available 
        navigator.geolocation.getCurrentPosition(function(position){ 
           pos.lat = position.coords.latitude;
           pos.lng = position.coords.longitude;
        });
    }
	var mapOptions = {
		zoom: 5,
    };
    mapOptions.center = <?php if (isset($documentEdit->gps)) {echo (json_encode($documentEdit->gps));} else {echo ('pos.lat ? pos : new google.maps.LatLng(41.38155, 2.13752)');}?>;
    map = new google.maps.Map(document.getElementById('gps'), mapOptions);

    var marker = new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        draggable: true
    });
    var infowindow = new google.maps.InfoWindow({
        content: '<p>Marker Location:' + marker.getPosition() + '</p>'
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
    map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
        $('input[name=gps]').val(JSON.stringify(marker.getPosition()));
        map.panTo(marker.getPosition());
    }, 3000);
  });
}

$(window).unbind('gMapsLoaded');
$(window).bind('gMapsLoaded', pagefunction);
window.loadGoogleMaps();
</script>

<script src="<?php echo ASSETS_URL; ?>/js/script/state.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/validator.plus.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/note-contact.js"></script>