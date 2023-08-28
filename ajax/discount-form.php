<?php
$discountForm = 'DiscountForm';

use \SmartUI\Components\SmartForm;

require_once 'inc/init.php';
require_once '../php/link.php';

$_authenticate->checkFormPermission($discountForm);

$_ui->start_track();

$discountEdited = array();
$roleDiscount = 'add';
if (getID()) {
  $data = array('token' => $_SESSION['token'], 'id' => getID());
  $discountEdited = HTTPMethod::httpPost($host . '/_discountGetByID.php', $data);
  if ($discountEdited->ERROR == '') {
    $discountEdited = $discountEdited->item;
  }
  if (isset($discountEdited->id)) $roleDiscount = 'edit';
}

?>
<section id="widget-grid" class="">
  <div class="row">
    <article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <div class="jarviswidget" id="wid-discount" data-widget-colorbutton="false" data-widget-editbutton="false">
        <header>
          <span class="widget-icon"> <i class="fa fa-table"></i> </span>
          <h2>Discount <?= ($roleDiscount == 'edit' ? ' code: ' . $discountEdited->discount_code : '') ?></h2>
          <?php
          $help_form = 'discount';
          include 'btn-help.php';
          unset($help_form);
          ?>
          <?php if ($roleDiscount == 'edit') {
            echo '<a href="./#ajax/discount-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Discount</a>';
          } ?>
        </header>
        <div>

          <!-- widget edit box -->
          <div class="jarviswidget-editbox"></div>


          <div class="widget-body no-padding">
            <div id="message_form" role="alert" style="display:none"></div>
            <form class="smart-form" id="discount_form" method="post">
              <input type="hidden" name="id" <?= ($roleDiscount == 'edit' ? 'value="' . $discountEdited->id . '"' : '') ?>>
              <input type="hidden" name="discount_code" <?= (isset($discountEdited->discount_code) ? 'value="' . $discountEdited->discount_code . '"' : '') ?>>
              <fieldset>
                <div class="row">
                  <section class="col col-6">
                    <?php echo SmartForm::print_field('discount_name', SmartForm::FORM_FIELD_INPUT, array(
                      'label' => 'Name',
                      'value' => (isset($discountEdited->discount_name) ? $discountEdited->discount_name : ''),
                      'disabled' => !hasPermission($discountForm, 'discount_name', $roleDiscount),

                    ), 12, true, hasPermission($discountForm, 'discount_name', 'show'));
                    ?>
                    <?php
                    echo SmartForm::print_field('apply_to', SmartForm::FORM_FIELD_RADIO, array(
                      'label' => 'Apply To',
                      'inline' => true,
                      'items' => array(
                        array('label' => 'Total Order', 'disabled' => !hasPermission($discountForm, 'apply_to', $roleDiscount), 'value' => '1', 'checked' => (isset($discountEdited->apply_to) && $discountEdited->apply_to->type == '1')),
                        array('label' => 'Product', 'disabled' => !hasPermission($discountForm, 'apply_to', $roleDiscount), 'value' => '2', 'checked' => (isset($discountEdited->apply_to) && $discountEdited->apply_to->type == '2')),
                        array('label' => 'Add on', 'disabled' => !hasPermission($discountForm, 'apply_to', $roleDiscount), 'value' => '3', 'checked' => (isset($discountEdited->apply_to) && $discountEdited->apply_to->type == '3')),
                      ),
                      'value' => (isset($discountEdited->apply_to) ? $discountEdited->apply_to->type : '1')
                    ), 12, true, hasPermission($discountForm, 'apply_to', 'show'))
                    ?>

                  </section>
                </div>
                <div class="row">

                  <section id="pane_apply_expand" class="col col-6">
                  </section>
                </div>
                <div class="row">
                  <div class="col col-12 col-md-12" style="width:100%">
                    <div id="product_info"></div>
                  </div>
                </div>
                <?php if(hasPermission($discountForm, 'discount_number', 'show')){ ?>
                <div class="row">
                  <section class="col col-7">
                    <label class="input">Discount</label>
                    <div class="input-group">
                      <input id="discount_number" name="discount_number" <?= (isset($discountEdited->apply_to) && isset($discountEdited->apply_to->value->discount) ? 'value="' . $discountEdited->apply_to->value->discount . '"' : '') ?> class="input-currency form-control" <?= hasPermission($discountForm, 'discount_number', $roleDiscount) ? '' : 'readonly' ?>>
                      <select id="discount_type" class="form-control" style="width:45px;" <?= hasPermission($discountForm, 'discount_type', $roleDiscount) ? '' : 'disabled' ?>>
                        <option value="$">$</option>
                        <option value="%">%</option>
                      </select>
                    </div>
                  </section>
                </div>
                <?php } ?>

                <div class="row">
                  <?php
                  echo SmartForm::print_field('start_date', SmartForm::FORM_FIELD_INPUT, array(
                    'label' => 'Start',
                    'type' => 'date',
                    'class' => 'datepicker',
                    'value' => (isset($discountEdited->start_date) ? $discountEdited->start_date : ''),
                    'disabled' => !hasPermission($discountForm, 'start_date', $roleDiscount)
                  ), 6, true, hasPermission($discountForm, 'start_date', 'show'));

                  echo SmartForm::print_field('stop_date', SmartForm::FORM_FIELD_INPUT, array(
                    'label' => 'Stop',
                    'type' => 'date',
                    'class' => 'datepicker',
                    'value' => (isset($discountEdited->stop_date) ? $discountEdited->stop_date : ''),
                    'disabled' => !hasPermission($discountForm, 'stop_date', $roleDiscount)
                  ), 6, true, hasPermission($discountForm, 'stop_date', 'show'));

                  ?>
                </div>
                <div class="row">
                  <?php
                  echo SmartForm::print_field('excludesive_offer', SmartForm::FORM_FIELD_CHECKBOX, array(
                    'inline' => false,
                    'items' => array(
                      array(
                        'label' => 'Excludesive offer',
                        'value' => '1',
                        'checked' => (isset($discountEdited->excludesive_offer) && $discountEdited->excludesive_offer == '1'),
                        'disabled' => !hasPermission($discountForm, 'excludesive_offer', $roleDiscount)
                      )
                    )
                  ), 6, true, hasPermission($discountForm, 'excludesive_offer', 'show'));

                  ?>
                </div>
                <div class="row">
                  <?php
                  echo SmartForm::print_field('nerver_expired', SmartForm::FORM_FIELD_CHECKBOX, array(
                    'inline' => false,
                    'items' => array(array('label' => 'Never expired', 'value' => '1', 'checked' => (isset($discountEdited->nerver_expired) && $discountEdited->nerver_expired == '1'), 'disabled' => !hasPermission($discountForm, 'nerver_expired', $roleDiscount)))
                  ), 6, true, hasPermission($discountForm, 'nerver_expired', 'show'));
                  ?>
                </div>
                <div class="row">
                  <?php
                  echo SmartForm::print_field('active', SmartForm::FORM_FIELD_CHECKBOX, array(
                    'inline' => false,
                    'items' => array(array('label' => 'Active', 'value' => '1', 'checked' => (isset($discountEdited->active) && $discountEdited->active == '1'), 'disabled' => !hasPermission($discountForm, 'active', $roleDiscount)))
                  ), 6, true, hasPermission($discountForm, 'active', 'show'));
                  ?>
                </div>

              </fieldset>
              <footer>
                <?php if (hasPermission($discountForm, 'btnBackDiscount', 'show')) { ?>
                  <button type="button" class="btn btn-default" id="btnBackDiscount" onclick="window.history.back()">Back</button>
                <?php } ?>
                <?php if (hasPermission($discountForm, 'btnSubmitDiscount', 'show')) { ?>
                  <button type="button" class="btn btn-primary" id="btnSubmitDiscount">Submit</button>
                <?php } ?>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </article>
  </div>
</section>
<script src="<?= ASSETS_URL; ?>/js/script/discount.js"></script>
<?php
if (isset($discountEdited->id)) {
  echo '<script>';
  if ($discountEdited->apply_to->type == '1') {
    echo '_discount.loadDiscountType(["' . ($discountEdited->apply_to->value->discount_type) . '"]);';
  } else if ($discountEdited->apply_to->type == '2') {
    echo 'apply_product = ' . json_encode($discountEdited->apply_to->products) . ';';
  } else if ($discountEdited->apply_to->type == '3') {
    echo 'apply_addon = ' . json_encode($discountEdited->apply_to->products) . ';';
  }
  echo 'setTimeout(function(){_discount.apply_expand("[name=apply_to]:checked", true, "' . $discountEdited->apply_to->value->discount_type . '");},1000);';
  echo '</script>';
}
?>