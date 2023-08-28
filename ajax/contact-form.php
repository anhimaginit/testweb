<?php

$contact_form = 'ContactForm';

use \SmartUI\Components\SmartForm;

require_once 'inc/init.php';

$_authenticate->checkFormPermission($contact_form);


$contact_current_form = 'add';
$isSameUser = false;
if (hasIdParam() && basename($_SERVER['PHP_SELF']) == 'contact-form.php') {
    $contact_current_form = 'edit';
    $isSameUser = (hasIdParam() && getID() === $_SESSION['userID']) ? true : false;
} else {
    $contact_current_form = 'add';
}

$isEdit = $contact_current_form == 'edit';

?>
<section id="widget-grid" class="">
    <div class="jarviswidget">
        <header>
            <h2>Contact Form </h2>
            <?php
            $help_form = 'contact';
            include 'btn-help.php';
            unset($help_form);
            ?>
            <?php
            if ($isEdit) {
                echo 
                '<div class="jarviswidget-ctrls" id="contact-form-control" role="menu">
                    <a href="./#ajax/contact-form.php" class="btn-primary have-text"><i class="fa fa-plus"></i> Create new contact</a>
                    <a class="btn-info btnConvertToCompany no-border-radius have-text"><i class="fa fa-recycle"></i> Convert to company</a>
                </div>';
            }
            ?>

        </header>
        <div>
            <div class="widget-body no-padding">
                <div id="message_form" role="alert" style="display:none"></div>
                <form class="smart-form" id="contact_form" method="post">
                    <input type="hidden" name="ID" id="contact_form_conID" value="">
                    <input type="hidden" name="create_by" value="<?= (isset($_SESSION['userID']) ? $_SESSION['userID'] : '') ?>">
                    <input type="hidden" name="send_to" value="">
                    <input type="hidden" name="contact_update" value="">
                    <input type="hidden" name="submit_by" value="<?= (isset($_SESSION['userID']) ? $_SESSION['userID'] : '') ?>">
                    <input type="hidden" name="userID" readonly="true">
                    <div class="row padding-10" id="div_contact_info"></div>
                    <fieldset>
                        <div class="row">
                            <?= SmartForm::print_field('first_name', SmartForm::FORM_FIELD_INPUT, array(
                                'label' => 'First Name',
                                'class' => '"' . (!hasPermission($contact_form, 'first_name', $contact_current_form) ? ' readonly="true' : ''),
                            ), 6, true, hasPermission($contact_form, 'first_name', 'show')); ?>
                        </div>
                        <div class="row">
                            <?= SmartForm::print_field('middle_name', SmartForm::FORM_FIELD_INPUT, array(
                                'label' => 'Middle Name',
                                'class' => '"' . (!hasPermission($contact_form, 'middle_name', $contact_current_form) ? ' readonly="true' : ''),
                            ), 6, true, hasPermission($contact_form, 'middle_name', 'show')) ?>
                        </div>
                        <div class="row">
                            <?= SmartForm::print_field('last_name', SmartForm::FORM_FIELD_INPUT, array(
                                'label' => 'Last Name',
                                'class' => '' . (!hasPermission($contact_form, 'last_name', $contact_current_form) ? '" readonly="true' : ''),
                            ), 6, true, hasPermission($contact_form, 'last_name', 'show')) ?>
                        </div>
                        <div class="row">
                        <?php if (hasPermission($contact_form, 'company_name', 'show')) { ?>
                            <section class="col col-6">
                                <label class="input">Company Name <span class="link_to" data-view="link_to" data-form="#contact_form" data-control="company_name" data-name="company-form" data-param="id"></span></label>
                                <select name="company_name" class="form-control" style="width:100%" <?php (!hasPermission($contact_form, 'company_name', $contact_current_form) ? ' disabled="disabled' : '') ?>></select>
                            </section>
                            <?php if (basename($_SERVER['PHP_SELF']) == 'contact-form.php') { ?>
                            <div class="col-2 pull-left">
                                <div>
                                    <div>&nbsp;</div>
                                    <button type="button" id="btnAddCompanyContact" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#add_modal_company">Add Company</button>
                                </div>
                            </div>
                        <?php  }
                        }
                        ?>
                        </div>
                        <div class="row">
                        <?php if(hasPermission($contact_form, 'primary_email', 'show')){
                            SmartForm::print_field('primary_email', SmartForm::FORM_FIELD_INPUT, array(
                            'label' => 'Email',
                            'type' => 'email',
                            'class' => (hasPermission($contact_form, 'primary_email', $contact_current_form) ? '' : '" readonly="true'),
                        ), 6, false, true);
                            if(hasIdParam()){
                                echo '<section class="col col-6"><label class="input">&nbsp;</label><button type="button" class="btn btn-sm btn-danger btnDelPrimaryEmail fa fa-times"></button></section>';
                            }
                        }
                        ?>
                            
                        </div>
                        <?php if(hasPermission($contact_form, 'contact_salesman_id', 'show')){
                            echo '
                            <div class="row">
                                <section class="col col-6">
                                    <label class="input">Representative <span class="link_to" data-view="link_to" data-form="#contact_form" data-control="contact_salesman_id" data-name="contact-form" data-param="id"></span></label>
                                    <select name="contact_salesman_id" class="w100" '. (!hasPermission($contact_form, 'contact_salesman_id', $contact_current_form) ? ' disabled' : '') .'></select>
                                </section>
                            </div>';
                        }
                        ?>
                    </fieldset>
                    <?php include './contact-phone.php'; ?>
                    <?php
                    if ($isEdit && basename($_SERVER['PHP_SELF']) == 'contact-form.php') {
                        $documentPane = 'contact_document_pane';
                        $documentField = '<input type="hidden" name="contactdocID" value="">';
                        $documentTitle = 'Contact Document';
                        $documentVisible = false;
                        include './contact-tabs.php';
                    } ?>

                    <fieldset style="z-index: 1">
                        <div class="row">
                            <section class="col col-6">
                                <label class="input">Website</label>
                                <div class="input-group" style="display:flex">
                                    <select id="url_protocol" class="form-control" style="width:68px;" <?= (!hasPermission($contact_form, 'primary_website', $contact_current_form) ? ' disabled' : '') ?>>
                                        <option value="http://">http://</option>
                                        <option value="https://">https://</option>
                                    </select>
                                    <input type="text" id="url_host" class="form-control" <?= (!hasPermission($contact_form, 'primary_website', $contact_current_form) ? ' disabled' : '') ?>>
                                    <button type="button" id="btn_open_url" class="btn btn-sm btn-default" onclick="url_open()"><i class="fa fa-external-link text-success"></i></button>
                                </div>
                            </section>
                        </div>
                    </fieldset>
                    <?php
                    $addressField = array(
                        'form' => $contact_form,
                        'current_form' => $contact_current_form,
                        "address1" => "primary_street_address1",
                        "address2" => "primary_street_address2",
                        "postal_code" => "primary_postal_code",
                        "city" => "primary_city",
                        "state" => "primary_state",
                    );
                    $form = 'ContactForm';
                    include './address_field.php';
                    unset($addressField); ?>

                    <fieldset>
                        <div class="row">
                            <?php
                            // if (isSuperAdmin() && hasIdParam() && getID()==$_SESSION['userID']) {
                            //     echo '<input type="checkbox" name="contact_type" value="SystemAdmin" class="hidden" checked>';
                            // }
                            $types = array(
                                array('label' => 'Sales', 'value' => "Sales"),
                                array('label' => 'Policy Holder', 'value' => "Policy Holder"),
                                array('label' => 'Employee', 'value' => "Employee"),
                                array('label' => 'Vendor', 'value' => "Vendor"),
                                array('label' => 'Affiliate', 'value' => "Affiliate"),
                                array('label' => 'Lead', 'value' => "Lead"),
                            );

                            ?>

                            <div class="col col-xs-12">
                                <?= SmartForm::print_field('contact_type', SmartForm::FORM_FIELD_CHECKBOX, array(
                                    'label' => 'Contact Types',
                                    'inline' => "true",
                                    'items' => $types,
                                    'disabled' => !hasPermission($contact_form, 'contact_type', $contact_current_form),
                                ), 12, true, hasPermission($contact_form, 'contact_type', 'show')) ?>
                                <div id="sales_type_pane"></div>
                                <div id="employee_type_pane"></div>
                                <div id="vendor_type_pane"></div>
                                <div id="affiliate_type_pane"></div>
                            </div>
                            <section class="col col-6">
                                <?php if (hasPermission($contact_form, 'contact_tags', $contact_current_form)) { ?>
                                    <section class="">
                                        <label class="input">Tags</label>
                                        <input type="text" class="form-control" id="contact_tags" name="contact_tags" value="" <?= (hasPermission($contact_form, 'contact_tags', $contact_current_form) ? '' : 'readonly') ?>>
                                    </section><?php } ?>
                                <?php if (hasPermission($contact_form, 'contact_notes', 'show')) { ?>
                                    <label class="input">Notes</label>
                                    <label class="textarea">
                                        <textarea name="contact_notes" rows="5" <?= (hasPermission($contact_form, 'contact_notes', $contact_current_form) ? '' : 'readonly') ?>></textarea>
                                    </label>
                                <?php } ?>
                            </section>
                        </div>

                        <div class="row" id="SMS_credential">
                        </div>

                    </fieldset>
                    <?php
                    if ($isEdit && hasPermission($contact_form, 'track_mails', $contact_current_form) && basename($_SERVER['PHP_SELF']) == 'contact-form.php') {
                        include 'track-email.php';
                    }
                    if ($isEdit && hasPermission($contact_form, 'user_name', $contact_current_form) && basename($_SERVER['PHP_SELF']) == 'contact-form.php') {
                        include 'contact-username.php';
                    }

                    if (hasPermission($contact_form, 'contact_inactive', $contact_current_form)) { ?>
                        <fieldset>
                            <section class="col col-6">
                                <label class="checkbox"><input type="checkbox" name="contact_inactive" value="1" <?= (hasPermission($contact_form, 'contact_inactive', $contact_current_form) ? '' : 'disabled') ?>><i></i> Contact Inactive</label>
                            </section>
                        </fieldset>
                    <?php } ?>
                    <footer>
                        <?php
                        if (hasPermission($contact_form, 'btnSubmitContact', 'show')) {
                            echo '<button type="submit" id="btnSubmitContact" class="btn btn-primary">Submit</button>';
                        }
                        // button Back
                        if (hasPermission($contact_form, 'btnBackContact', 'show')) {
                            echo '<button type="button" id="btnBackContact" class="btn btn-default"">Back</button>';
                        }
                        ?>
                    </footer>
                </form>
            </div>
        </div>
    </div>

    <div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="add_modal_company">
        <div class="modal-dialog" style="min-width:60%;">
            <div class="modal-content">
                <?php unset($contact_form);
                include 'company-form.php'; ?>
            </div>
        </div>
    </div>
    <?php include 'contact-mail.php'; ?>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.googlemap/1.5/jquery.googlemap.js"></script>

<script>
    var marker, map, infowindow;
    var pagefunction = function() {
        var pos = { lat: 0, lng: 0};
        if (navigator.geolocation) { //check geolocation available
            navigator.geolocation.getCurrentPosition(function(position) {
                pos.lat = position.coords.latitude;
                pos.lng = position.coords.longitude;
            });
        }

        var mapOptions = {
            zoom: 10,
        };
        mapOptions.center = new google.maps.LatLng(pos.lat, pos.lng);
        map = new google.maps.Map(document.getElementById('gps'), mapOptions);

        $('input[name=gps]').val(JSON.stringify(pos));

        marker = new google.maps.Marker({
            position: mapOptions.center,
            map: map,
            draggable: true
        });
        infowindow = new google.maps.InfoWindow({
            content: '<p> MarkerLocation:' + marker.getPosition() + '</p>'
        });
        map.addListener('center_changed', function() {
            window.setTimeout(function() {
                $('input[name=gps]').val(JSON.stringify(marker.getPosition()));
                map.panTo(marker.getPosition());
            }, 1000);
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
        });
    }

    $(window).unbind('gMapsLoaded');
    $(window).bind('gMapsLoaded', pagefunction);
    window.loadGoogleMaps();
    var contactDocument;
</script>
<script src="<?= ASSETS_URL; ?>/js/script/state.js"></script>
<?php if (basename($_SERVER['PHP_SELF']) == 'contact-form.php') { ?>
<script src="<?= ASSETS_URL; ?>/js/script/note.js"></script>
<?php if ($isEdit) { ?>
<script src="<?= ASSETS_URL; ?>/js/script/contact/tabs.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/document.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-convert.js"></script>
<script>
    contactDocument = new DocumentTable({
        table: 'table_document',
        form: 'contact_form',
        varName: 'contactDocument',
        documentID: 'contactID',
        field: 'contactdocID',
        inputFormID: 'ID'
    });
    contactDocument.init();
    contactConvert = new ContactConvert();
    new ControlPage('#contact-form-control');
</script>
<?php } ?>
<script src="<?= ASSETS_URL; ?>/js/script/contact/track-email.js"></script>
<script src="<?= ASSETS_URL; ?>/js/util/select-link.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-notes.js"></script>
<?php } ?>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/validator.plus.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-append.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-form.js"></script>