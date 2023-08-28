<?php

$Register_form = 'RegisterForm';

use \SmartUI\Components\SmartForm;
use \SmartUI\Util as SmartUtil;

require_once 'init.php';

?>
<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/bootstrap-select.css">
<!-- SmartAdmin Styles : Caution! DO NOT change the order -->
<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/smartadmin-production-plugins.min.css">
<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/smartadmin-production.min.css">
<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/smartadmin-skins.min.css">

<!-- SmartAdmin RTL Support is under construction-->
<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/smartadmin-rtl.min.css">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/css/intlTelInput.css">
<!-- auto complete tagsinput -->
<link rel="stylesheet" href="<?= ASSETS_URL ?>/js/plugin/tags-input-autocomplete/src/jquery.tagsinput-revisited.css">

<link rel="stylesheet" type="text/css" media="screen" href="<?php echo ASSETS_URL; ?>/css/your_style.css">
<title>Register</title>
<section id="widget-grid" class="">
<?php
$email='';
if(isset($_REQUEST['YW5oQGF0MXRzLmNvbQ'])) $email= $_REQUEST['YW5oQGF0MXRzLmNvbQ'];
$_ui->start_track();

$head = '<h2>Company Form </h2>';
ob_start();
$help_form = 'company';
include 'ajax/btn-help.php';
$head .= ob_get_contents();
ob_end_clean();
function hasIdParam(){ return false;}

$body_register = '
<form class="smart-form" id="register_form" method="post">
<div id="message_form" role="alert" style="display:none"></div>
<input type="hidden" name=primary_email value="'.$email.'">
<fieldset>
   <div class="row">' . SmartForm::print_field('first_name', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'First Name',
        'class' => 'text-input',
    ), 6, true ).'</div>';

$body_register .= '<div class="row">' . SmartForm::print_field('middle_name', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Middle Name',
        'class' => 'text-input',
    ), 6, true) . '
   </div>';

$body_register .= '<div class="row">' . SmartForm::print_field('last_name', SmartForm::FORM_FIELD_INPUT,
    array(
        'label' => 'Last Name',
        'class' => 'text-input',
    ), 6, true) . '</div>';

$body_register .= '<div class="row"><section class="col col-6"><label class="input">Company Name</label><select class="form-control p-0" name="company_name"></select></section>';

$body_register .= '
    <div class="col-2 pull-left">
        <div>
            <div>&nbsp;</div>
            <button type="button" id="btnAddCompanyContact" class="btn btn-sm btn-default" data-toggle="modal" data-target="#add_modal_company">Add Company</button>
        </div>
    </div>'. '</div>';
   /** Phone */
    {
        ob_start();
        include './ajax/contact-phone.php';
        $body_register .= ob_get_contents();
        ob_end_clean();
    }

$body_register .= '</fieldset>';

{/** Address */
    ob_start();
    $addressField = array(
        'form' => $Register_form,
        'current_form' => 'add',
        "address1" => "primary_street_address1",
        "address2" => "primary_street_address2",
        "postal_code" => "primary_postal_code",
        "city" => "primary_city",
        "state" => "primary_state",
    );

    $form = 'RegisterForm';
    include './ajax/address_field_register.php';
    $body_register .= ob_get_contents();
    ob_end_clean();
    unset($addressField);

}

$body_register .= '<fieldset><div class="row">' . SmartForm::print_field('RegisterType', SmartForm::FORM_FIELD_SELECT,
        array(
            'label' => 'Register Type',
            'data' => array(array('ID'=>'Affiliate','Name'=>'Affiliate'),array('ID'=>'Vendor','Name'=>'Vendor')),
            'value' => 'ID',
            'display' => 'Name'
        ), 3, true);
$body_register .= '</fieldset>';

$body_register .= '<fieldset>
            <div class="row">
                <section class="col col-6">
                    <div id="vendor_type_pane"></div>
                    <div id="affiliate_type_pane"></div>
                </section>
            </div>
        </fieldset>';



/**
 * footer
 */
$body_register .= '<footer>';
// button Submit
$body_register .= '<button type="submit" id="btnSubmitContact" class="btn btn-primary">Submit</button>';
$body_register .= '</footer>
</form>';

$contact_title_form =
'<h2>Register Form </h2>';
$_ui->create_widget()->body('content', $body_register)
    ->options('editbutton', false)
    ->body('class', 'no-padding')
    ->header('title', $contact_title_form)->print_html();
?>
    <div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="add_modal_company">
        <div class="modal-dialog" style="min-width:60%;">
            <div class="modal-content">
                <?php include 'company.php' ?>
            </div>
        </div>
    </div>
</section>

<!-- Basic Styles -->

<?php
include "inc/scripts_register.php";
?>

<script src="<?php echo ASSETS_URL; ?>/js/plugin/bloodhound/bloodhound.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/typeahead/typeahead.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/bootstrap-tags/bootstrap-tagsinput.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/jquery-validate/jquery.validate.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/plugin/bootstrapvalidator/bootstrapValidator.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/3.1.62/jquery.inputmask.bundle.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/your_script.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/state.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/document.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/register/register-company.js"></script>
<script>
    var companyDocument = new DocumentTable({
        table: 'table_document',
        form: 'company_form',
        varName: 'companyDocument',
        documentID: 'vendorID',
        field: 'vendordocID',
        inputFormID: 'ID'
    });
    companyDocument.init();

    _contactPhone = new ContactPhone('#register_form #table_phone');
    _contactPhone.init();
</script>

<script src="<?php echo ASSETS_URL; ?>/js/script/validator.plus.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/register/register-form.js"></script>

