<?php

$company_form = 'CompanyForm';

use \SmartUI\Components\SmartForm;

require_once 'inc/init.php';
require_once '../php/link.php';

$_authenticate->checkFormPermission($company_form);

$company_current_form = 'add';
$companyEdit = array();
$vendor = [];
$vendordoc = [];
$data_send = array('jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID']);
if (hasIdParam() && strrpos($_SERVER['REQUEST_URI'], 'company-form') > 0) {
  $data = HTTPMethod::httpPost($link['_company_ID'], array('jwt' => $_SESSION['jwt'], 'token' => $_SESSION['token'], 'private_key' => $_SESSION['userID'], 'ID' => getID()));

  if (isset($data) && isset($data->ERROR) && $data->ERROR == '') {
    $companyEdit = $data->comp;
    $vendor = $data->vendor;
    $vendordoc = $data->v_doc;
    $notes = $data->notes;
    $company_current_form = 'edit';
  }
}
?>
<style>
.input-phone-tel input:read-only:hover{cursor: pointer !important;}
.input-phone-tel input{margin-bottom:2px;}
.input-phone-tel a{margin: 5px;}
.input-phone-tel{
   min-width: 170px;
}
</style>
<section id="widget-grid" class="">
  <div class="jarviswidget">
    <header>
      <h2>Company Form </h2>
      <?php
      $help_form = 'company';
      include 'btn-help.php';
      unset($help_form);
      ?>
      <?php
      if (isset($companyEdit->ID)) {
        echo '<div class="jarviswidget-ctrls" id="company-form-control" role="menu">
                  <a href="./#ajax/company-form.php" class="have-text btn-primary"><i class="fa fa-plus"></i> Create new Company</a>
              </div>';
      } ?>
    </header>
    <div>
      <div class="widget-body no-padding">
        <div id="message_form" role="alert" style="display:none"></div>
        <form class="smart-form" id="company_form" method="post">
          <input type="hidden" name="ID" value="<?= (isset($companyEdit->ID) ? $companyEdit->ID : '') ?>">
          <fieldset>
            <div class="row">
              <?= SmartForm::print_field('name', SmartForm::FORM_FIELD_INPUT, array(
                'label' => 'Company Name',
                'value' => (isset($companyEdit->name) ? $companyEdit->name : ''),
                'disabled' => !hasPermission($company_form, 'name', $company_current_form),
              ), 6, true, hasPermission($company_form, 'name', 'show')) ?>

              <?php if(hasPermission($company_form, 'company_salesman_id', 'show')){
                echo '
                <section class="col col-6">
                  <label class="input">Representative <span class="link_to" data-view="link_to" data-form="#company_form" data-control="company_salesman_id" data-name="contact-form" data-param="id"></span></label>
                  <select name="company_salesman_id" style="width:100%"'.(hasPermission($company_form, 'company_salesman_id', $company_current_form) ? '' : ' disabled').'></select>
                </section>';
              } 
              ?>
            </div>
          </fieldset>
          <?php
          $addressField = array(
            'form' => $company_form,
            'current_form' => $company_current_form,
            "address1" => "address1",
            "address1_val" => isset($companyEdit->address1) ? $companyEdit->address1 : '',
            "address2" => "address2",
            "address2_val" => isset($companyEdit->address2) ? $companyEdit->address2 : '',
            "postal_code" => "postal_code",
            "city" => "city",
            "state" => "state",
          );
          $form = 'CompanyForm';
          include './address_field.php';
          ?>
          <fieldset>
            <table id="table_phone">
              <caption style="color:black;">Phone</caption>
              <input type="hidden" class="form-control primary_phone" name="phone" value="">
              <tbody>
                <tr>
                  <td class="hasinput input-phone-tel"></td>
                  <td class="hasinput">
                    <input class="form-control phone-type input-readonly" value="Primary Phone" readonly>
                  </td>
                  <td class="hasinput">
                    <button type="button" class="btn btn-sm btn-default btnEditPhone fa fa-edit"></button>
                  </td>
                  <td>
                    <span class="padding-10 phone_status"></span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                    <td colspan="3" class="text-right padding-5">
                      <button type="button" class="btn btn-sm btn-default no-border-radius fa fa-plus btnAddSecondPhone"> Add Phone</button>
                    </td>
                </tr>
              </tfoot>
            </table>
            <div class="row">
              <?=
                SmartForm::print_field('fax', SmartForm::FORM_FIELD_INPUT, array(
                  'label' => 'Fax',
                  'type' => 'number',
                  'class' => 'text-input',
                  'value' => (isset($companyEdit->fax) ? $companyEdit->fax : ''),
                  'disabled' => !hasPermission($company_form, 'fax', $company_current_form),
                ), 6, true, hasPermission($company_form, 'fax', 'show')) .
                  SmartForm::print_field('email', SmartForm::FORM_FIELD_INPUT, array(
                    'label' => 'Email',
                    'type' => 'email',
                    'value' => (isset($companyEdit->email) ? $companyEdit->email : ''),
                    'disabled' => !hasPermission($company_form, 'email', $company_current_form),
                  ), 6, true, hasPermission($company_form, 'email', 'show'));
              if (hasPermission($company_form, 'www', 'show')) {
                ?>
                <section class="col col-6">
                  <label class="input">Website</label>
                  <div class="input-group" style="display:flex">
                    <select id="company_url_protocol" class="form-control" style="width:68px;" <?= hasPermission($company_form, 'name', $company_current_form) ? '' : 'disabled' ?>>
                      <option value="http://" <?= (isset($companyEdit->www) && startsWith($companyEdit->www, 'http://') ? ' selected' : '') ?>>http://</option>
                      <option value="https://" <?= (isset($companyEdit->www) && startsWith($companyEdit->www, 'https://') ? ' selected' : '') ?>>https://</option>
                    </select>
                    <input type="text" id="company_url_host" class="form-control" value="<?= (isset($companyEdit->www) ? str_replace(['http://', 'https://'], '', $companyEdit->www) : '') ?>" <?= hasPermission($company_form, 'name', $company_current_form) ? '' : 'readonly' ?>>
                    <button type="button" id="btn_company_open_url" class="btn btn-sm btn-default" onclick="url_company_open()"><i class="fa fa-external-link text-success"></i></button>
                  </div>
                </section>
              <?php } ?>
              <?=
                SmartForm::print_field('type', SmartForm::FORM_FIELD_CHECKBOX, array(
                  'label' => 'Company Type',
                  'inline' => "true",
                  'items' => [
                    ['label' => 'Real Estate Broker', 'value' => 'Real Estate Broker', 'disabled' => !hasPermission($company_form, 'type', $company_current_form), 'checked' => (isset($companyEdit->type) && in_array('Real Estate Broker', $companyEdit->type) ? true : false)],
                    ['label' => 'Mortgage', 'value' => 'Mortgage', 'disabled' => !hasPermission($company_form, 'type', $company_current_form), 'checked' => (isset($companyEdit->type) && in_array('Mortgage', $companyEdit->type))],
                    ['label' => 'Bacle', 'value' => 'Bacle', 'disabled' => !hasPermission($company_form, 'type', $company_current_form), 'checked' => (isset($companyEdit->type) && in_array('Bacle', $companyEdit->type) ? true : false)],
                    ['label' => 'Title', 'value' => 'Title', 'disabled' => !hasPermission($company_form, 'type', $company_current_form), 'checked' => (isset($companyEdit->type) && in_array('Title', $companyEdit->type) ? true : false)],
                    ['label' => 'Vendor<sup class="text-danger">*</sup>', 'value' => 'Vendor', 'disabled' => !hasPermission($company_form, 'type', $company_current_form), 'checked' => (isset($companyEdit->type) && in_array('Vendor', $companyEdit->type) ? true : false)],
                  ],
                ), 6, true, hasPermission($company_form, 'type', 'show'));

              ?>
              <?php if (hasPermission($company_form, 'tag', 'show')) { ?>
                <section class="col col-6">
                  <label class="input">Company Tags</label>
                  <input type="text" class="form-control" id="tag" name="tag" value="<?= (isset($companyEdit->tag) ? $companyEdit->tag : '') ?>" <?= hasPermission($company_form, 'type', $company_current_form) ? '' : 'readonly' ?>>
                </section>
              <?php } ?>
              <?php if (hasPermission($company_form, 'type', 'show')) { ?>
            </div>
            <div id="vendor_expand" class="row" style="display : none">
              <section class="col col-6">
                <label class="input">Vendor Type</label>
                <select name="vendor_type" id="vendor_type" class="form-control" style="width:100%" multiple <?= hasPermission($company_form, 'type', $company_current_form) ? '' : 'disabled' ?>>
                  <?php
                    $list_vendor_type = json_decode(file_get_contents('../data/contact-vendor-type.json'));

                    foreach ($list_vendor_type as $item) {
                      echo '<option value="' . $item . '">' . $item . '</option>';
                    }
                    ?>
                </select>
                <div class="license-data">
                  <label class="input">&nbsp;</label>
                  <div data-for="licence_exp" style="margin-bottom:10px;"><label style="width:80px; font-weight:bold">License: </label><input type="date" name="license_exp" class="datepicker input-underline" style="width:90px;" value="<?= (isset($companyEdit->license_exp) ? $companyEdit->license_exp : '') ?>" <?= hasPermission($company_form, 'type', $company_current_form) ? '' : 'disabled readonly' ?>> <label></label></div>
                  <div data-for="w9_exp" style="margin-bottom:10px;"><label style="width:80px; font-weight:bold">W9: </label><input type="date" name="w9_exp" class="datepicker input-underline" style="width:90px;" value="<?= (isset($companyEdit->w9_exp) ? $companyEdit->w9_exp : '') ?>" <?= hasPermission($company_form, 'type', $company_current_form) ? '' : 'disabled readonly' ?>> <label></label></div>
                  <div data-for="insurrance_exp"><label style="width:80px;  font-weight:bold">Insurance: </label><input type="date" name="insurrance_exp" class="datepicker input-underline" style="width:90px;" value="<?= (isset($companyEdit->insurrance_exp) ? $companyEdit->insurrance_exp : '') ?>" <?= hasPermission($company_form, 'type', $company_current_form) ? '' : 'disabled readonly' ?>> <label></label></div>
                </div>
              </section>
              <?=
                  SmartForm::print_field('vendor_note', SmartForm::FORM_FIELD_TEXTAREA, array(
                    'label' => 'Vendor Note',
                    'value' => (isset($vendor) && isset($vendor->notes) ? $vendor->notes : ''),
                    'attr' => array(
                      "rows" => 5
                    )
                  ), 6, true);
                ?>
              <div class="clearfix"></div>
              <?php
                $documentPane = 'vendor_document_pane';
                $documentTitle = 'Vendor Document';
                $documentField = '<input type="hidden" name="vendorID" value="' . (isset($vendor) && isset($vendor->ID) ? $vendor->ID : '') . '">
              <input type="hidden" name="vendordocID" value="">';
                include 'document-table.php';
                ?>
            </div>
          <?php } ?>
          </fieldset>
          <?php
          $pos = strrpos($_SERVER['REQUEST_URI'], "company-form");
          if ($pos > 0) {
            include './notes.php';
          }
          ?>
          <footer>
            <button type="submit" id="btnSubmitCompany" class="btn btn-primary">Submit</button>
            <button type="button" id="btnBackCompany" class="btn btn-default">Back</button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</section>

<script src="<?= ASSETS_URL; ?>/js/script/state.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/validator.plus.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/note.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/document.js"></script>
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
</script>
<script src="<?= ASSETS_URL; ?>/js/util/select-link.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/company-form.js"></script>
<?php
if (hasIdParam() && strrpos($_SERVER['REQUEST_URI'], 'company-form') > 0) {
  print('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.googlemap/1.5/jquery.googlemap.js"></script>');
  print('<script>
    new ControlPage("#company-form-control");
  ');
  print('var marker, map, infowindow;
    var pagefunction = function() {
        
        ');
  if (isset($companyEdit->gps) && $companyEdit->gps!=null && strlen($companyEdit->gps) > 8) { 
    print('var pos = '. ($companyEdit->gps).';');
  } else {
    print('var pos = { lat: 0, lng: 0 };');
  }
  print('
        var mapOptions = {
            zoom: 10,
        };
        mapOptions.center = new google.maps.LatLng(pos.lat, pos.lng);
        map = new google.maps.Map(document.getElementById("gps"), mapOptions);

        $("input[name=gps]").val(JSON.stringify(pos));

        marker = new google.maps.Marker({
            position: mapOptions.center,
            map: map,
            draggable: true
        });
        infowindow = new google.maps.InfoWindow({
            content: "<p> MarkerLocation:" + marker.getPosition() + "</p>"
        });
        map.addListener("center_changed", function() {
            window.setTimeout(function() {
                $("input[name=gps]").val(JSON.stringify(marker.getPosition()));
                map.panTo(marker.getPosition());
            }, 1000);
        });
        google.maps.event.addListener(marker, "click", function() {
            infowindow.open(map, marker);
        });
    }

    $(window).unbind("gMapsLoaded");
    $(window).bind("gMapsLoaded", pagefunction);
    $("#company_form #gps").show();
    window.loadGoogleMaps();');
  print('var companyState = new State({element : "#company_form"});
  ');
  if (isset($companyEdit->ID)) {
    print('companyState.setValue2("#company_form",' . (isset($companyEdit->city) ?  '"' . $companyEdit->city . '"' : 'null') . ', ' . (isset($companyEdit->state) ?  '"' . $companyEdit->state . '"' : 'null') . ', ' . (isset($companyEdit->postal_code) ?  '"' . $companyEdit->postal_code . '"' : 'null') . ');
    ');
  }

  if (isset($companyEdit->phone)) {
    print('_companyPhone.setPrimaryPhone("' . $companyEdit->phone . '");
    ');
  }
  if (isset($companyEdit->second_phone)) {
    print('_companyPhone.loadListPhone(' . json_encode($companyEdit->second_phone) . ');
    ');

  }
  if (isset($vendordoc) && $vendordoc != []) {
    print('companyDocument.pushDocuments(' . json_encode($vendordoc) . ');
    ');
  }
  if (isset($notes) && sizeof($notes) > 0) {
    print('companyNote.displayList(' . json_encode($notes) . ');
    ');
  }
  if (isset($vendor->vendor_type)) {
    print('$("#vendor_type").val( ' . json_encode($vendor->vendor_type)  . ').change();
    ');
  }

  if(isset($companyEdit->company_salesman_id)){
    print('window.company_edit_company_salesman_id = '.$companyEdit->company_salesman_id.';');
  }
  print('</script>');
}
?>