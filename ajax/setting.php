<?php

require_once 'inc/init.php';
$settingForm = 'SettingForm';

$_authenticate->checkFormPermission($settingForm);

$setting_url = '../data/setting.json';
$data = (object) array();
if (is_file($setting_url)) {
  $data = (object) json_decode(file_get_contents($setting_url));
}
$array = array(
  'page_title',
  'company_name', 'company_email', 'company_fax', 'company_address', 'company_address2', 'company_city', 'company_postal_code', 'company_state', 'gps',
  'footer_info', 'color_site', 'top_menu_color', 'color_site_hover', 'background', 'navigation',
  'phone', 'logo', 'logo_ico', 'claim_start_fee', 'claim_status'
);
if (!isset($data->claim_start_fee)) {
  $data->claim_start_fee = '65.00';
}

if (!isset($data->claim_status)) {
  $data->claim_status = ['Not Assign', 'Open', 'In Progress', 'Approved', 'Assigned', 'Deny', 'Close', 'Cancel'];
} else if (gettype($data->claim_status) == 'string') {
  $data->claim_status = json_decode($data->claim_status);
}
foreach ($array as $key) {
  if (!isset($data->$key)) $data->$key = '';
}

$contact_vendor_type = json_decode(file_get_contents('../data/contact-vendor-type.json'));
$contact_employee_type = json_decode(file_get_contents('../data/contact-employee-type.json'));


?>
<style>
.input-phone-tel input:read-only:hover{cursor: pointer !important;}
.input-phone-tel input{margin-bottom:2px;}
.input-phone-tel a{margin: 5px;}
.input-phone-tel{
   min-width: 170px;
}
</style>
<div>
  <h1>Setting</h1>
</div>
<section id="widget-grid" class="">
  <div class="row">

    <!-- NEW WIDGET START -->
    <article class="col-sm-12 col-md-12 col-lg-12">
      <!-- Widget ID (each widget will need unique ID)-->
      <div class="jarviswidget2" data-widget-colorbutton="false" data-widget-editbutton="false">
        <div>
          <div id="message_form" role="alert" style="display:none"></div>
          <form class="smart-form" id="setting_form" method="post">
            <input type="hidden" name="ID" value="<?= $_SESSION['userID'] ?>">
            <fieldset>
              <?php if (hasPermission($settingForm, 'page_title', 'edit')) { ?>
                <div class="row">
                  <section class="col col-6">
                    <label class="input">Page Title</label>
                    <input type="text" class="form-control" name="page_title" value="<?= $data->page_title ?>">
                  </section>
                </div>
              <?php } ?>
              <?php if (hasPermission($settingForm, 'logo_ico', 'edit')) { ?>
                <div class="row">
                  <section class="col col-6" title="Logo display in browser tab">
                    <label class="input">Logo Page Title</label>
                    <input type="file" name="logo_ico" class="form-control" accept=".ico">
                  </section>
                  <section class="col col-6">
                    <span>
                      <label class="input">&nbsp;</label>
                      <label>Ex: <img src="<?= ASSETS_URL ?>/img/setting/page_title.png" alt="Logo in page title"></label>
                    </span>
                    <span>
                      <label>Preview: <img id="logo_ico_preview" src="<?= $data->logo_ico ?>" height="25px"></label>
                    </span>
                  </section>
                </div>
              <?php } ?>
              <?php if (hasPermission($settingForm, 'logo', 'edit')) { ?>
                <div class="row">
                  <section class="col col-6" title="Website logo">
                    <label class="input">Logo Website</label>
                    <input type="file" name="logo" class="form-control" accept="image/*">
                  </section>
                  <section class="col col-6">
                    <span>
                      <label class="input">&nbsp;</label>
                      <label for="">Ex: <img src="<?= ASSETS_URL ?>/img/logo.png" height="30px" alt="Logo"></label>
                    </span>
                    <span>
                      <label>Preview: <img id="logo_preview" src="<?= $data->logo ?>" height="25px"></label>
                    </span>
                  </section>
                </div>
              <?php } ?>
              <div class="row">
                <?php if (hasPermission($settingForm, 'color_site', 'edit')) { ?>
                  <section class="col col-3">
                    <label class="input">Website Color</label>
                    <input type="color" name="color_site" class="form-control" value="<?= $data->color_site != '' ? $data->color_site : '#474544' ?>">
                  </section>
                <?php } ?>
                <?php if (hasPermission($settingForm, 'background', 'edit')) { ?>
                  <section class="col col-3">
                    <label class="input">Background Color</label>
                    <input type="color" name="background" class="form-control" value="<?= $data->background != '' ? $data->background : '#f3f3f3' ?>">
                  </section>
                <?php } ?>
                <?php if (hasPermission($settingForm, 'top_menu_color', 'edit')) { ?>
                  <section class="col col-3">
                    <label class="input">Top Menu Color</label>
                    <input type="color" name="top_menu_color" class="form-control" value="<?= $data->top_menu_color != '' ? $data->top_menu_color : '#f3f3f3' ?>">
                  </section>
                <?php } ?>
                <?php if (hasPermission($settingForm, 'navigation', 'edit')) { ?>
                  <section class="col col-3">
                    <label class="input">Navigation Text Color</label>
                    <input type="color" name="navigation" class="form-control" value="<?= $data->navigation != '' ? $data->navigation : '#c0bbb7' ?>">
                  </section>
                <?php } ?>
              </div>
              <?php if (hasPermission($settingForm, 'footer_info', 'edit')) { ?>
                <div class="row">
                  <section class="col col-6">
                    <label class="input">Footer Info</label>
                    <textarea name="footer_info" class="form-control" rows="7"><?= $data->footer_info ?></textarea>
                  </section>
                </div>
              <?php } ?>
              <?php if (hasPermission($settingForm, 'company_name', 'edit')) { ?>
                <div class="row">
                  <section class="col col-6">
                    <label class="input">Company Name</label>
                    <input type="text" class="form-control" name="company_name" value="<?= $data->company_name ?>">
                  </section>
                </div>
              <?php } ?>
              <?php if (hasPermission($settingForm, 'company_email', 'edit')) { ?>
                <div class="row">
                  <section class="col col-6">
                    <label class="input">Company Email</label>
                    <input type="email" class="form-control" name="company_email" value="<?= $data->company_email ?>">
                  </section>
                </div>
              <?php } ?>
              <?php if (hasPermission($settingForm, 'company_fax', 'edit')) { ?>
                <div class="row">
                  <section class="col col-6">
                    <label class="input">Fax</label>
                    <input type="number" class="form-control" name="company_fax" value="<?= $data->company_fax ?>">
                  </section>
                </div>
              <?php } ?>
              <?php if (hasPermission($settingForm, 'phone', 'edit')) { ?>
                <div class="row">
                  <section class="col col-6">
                    <label class="input">Phone</label>
                    <table id="table_phone">
                      <tbody>
                      </tbody>
                    </table>
                  </section>
                </div>
              <?php } ?>
            </fieldset>
            <?php
            $addressField = array(
              'form' => 'SettingForm',
              'current_form' => 'edit',
              'address1_label' => 'Company Address',
              "address1" => "company_address",
              'address1_val' => $data->company_address,
              'address2_label' => 'Company Address 2',
              "address2" => "company_address2",
              'address2_val' => $data->company_address2,
              "postal_code" => "company_postal_code",
              "city" => "company_city",
              "state" => "company_state",
            );
            include 'address_field.php';
            unset($addressField);
            ?>
            <fieldset>
              <legend>Data</legend>
              <h3>Claim Form</h3>
              <div class="row">
                <section class="col col-6">
                  <label class="input">Claim Start Fee</label>
                  <input type="number" class="form-control input-currency" name="claim_start_fee" value="<?= $data->claim_start_fee ?>">
                </section>
                <section class="col col-6">
                  <label class="input">Claim Status</label>
                  <input class="form-control tagsinput" id="claim_status" name="claim_status" value="<?= join(',', $data->claim_status) ?>">
                </section>
              </div>
              <h3>Contact Form</h3>
              <div class="row">
                <section class="col col-6">
                  <label class="input">Vendor Types</label>
                  <input class="form-control tagsinput" id="contact_vendor_type" name="contact_vendor_type" value="<?= join(',', $contact_vendor_type) ?>">
                </section>

                <section class="col col-6">
                  <label class="input">Employee Types</label>
                  <input class="form-control tagsinput" id="contact_employee_type" name="contact_employee_type" value="<?= join(',', $contact_employee_type) ?>">
                  <div id="employee_dep_email" style="width:100px;height:100px;background:transparent;">
<!--                    <span>Email for claim</span>-->
                  </div>
                </section>
              </div>
            </fieldset>
            <footer>
              <?php if (hasPermission($settingForm, 'btnSubmitSetting', 'show')) { ?>
                <button type="submit" id="btnSubmitSetting" class="btn btn-primary">Submit</button>
              <?php } ?>
              <?php if (hasPermission($settingForm, 'btnBackSetting', 'show')) { ?>
                <button type="button" id="btnBackSetting" class="btn btn-default" onclick="window.history.back();">Back</button>
              <?php } ?>
            </footer>
          </form>
        </div>
      </div>
    </article>
  </div>
</section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.googlemap/1.5/jquery.googlemap.js"></script>

<script>
  var marker, map, infowindow;
  var pagefunction = function() {
    <?php if ($data->gps) {
      echo 'var pos = ' . $data->gps . ';';
    } else {
      echo 'var pos = { lat: 10, lng: 10};';
    } ?>

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
      content: '<p>Marker Location:' + marker.getPosition() + '</p>'
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
</script>
<script src="<?php echo ASSETS_URL; ?>/js/script/state.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/setting/setting.js"></script>
<script>
  <?php if ($data->company_city != null && $data->company_city != '') { ?>
    state.setValue2(null, <?= '"' . $data->company_city . '","' . $data->company_state . '",' . $data->company_postal_code  ?>);
  <?php }
  if ($data->phone && sizeof($data->phone) > 0) { ?>
    _contactPhone.loadListPhone(<?= json_encode($data->phone) ?>);
  <?php } else { ?>
    _contactPhone.createPhoneRow();
  <?php } ?>
</script>