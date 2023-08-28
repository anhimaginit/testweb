<?php
$discount = 'DiscountForm';

use \SmartUI\Components\SmartForm;

require_once 'inc/init.php';
require_once '../php/link.php';

$_ui->start_track();

$discountEdited = array();

if(getID()){
  $data = array('token'=> $_SESSION['token'], 'id' => getID());
  $discountEdited = HTTPMethod::httpPost($host . '/_discountGetByID.php', $data);
  if($discountEdited->ERROR == ''){
    $discountEdited = $discountEdited->item;
  }
}

?>
<section id="widget-grid" class="">
  <div class="row">
    <article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <div class="jarviswidget" id="wid-discount"  data-widget-colorbutton="false" data-widget-editbutton="false">
        <header>
          <span class="widget-icon"> <i class="fa fa-table"></i> </span>
          <h2>Discount list</h2>
          <a href="./#ajax/discount-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Discount</a>
        </header>
        <div>
      <!-- widget edit box -->
          <div class="jarviswidget-editbox"></div>

          <div class="widget-body no-padding">
          <table id="table_discount" class="table table-responsive table-striped table-bordered table-hover" width="100%">
          </table>
          </div>
        </div>
      </div>
    </article>
  </div>
</section>
<script src="<?= ASSETS_URL; ?>/js/script/discount-list.js"></script>

