<?php
$invoice_form = 'InvoiceForm';

require_once 'inc/init.php';
//check permission and get field role
$_authenticate->checkFormPermission($invoice_form);

$operation_invoice = (hasIdParam() ? 'edit' : 'add');

$current_permission = canAddForm($invoice_form);
?>
<section id="widget-grid" class="">
  <div class="row">
    <!-- NEW WIDGET START -->
    <article class="col-sm-12 col-md-12 col-lg-12">

      <!-- Widget ID (each widget will need unique ID)-->
      <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
        <header>
          <h2>Invoice Form <?= $current_permission == true ? 'ID:' . getID() : '' ?> </h2>
          <?php
          $help_form = 'invoice';
          include 'btn-help.php';
          unset($help_form);
          ?>
          <?php
          if (hasIdParam()) {
            if ($current_permission == true) {
              echo '
              <div class="jarviswidget-ctrls" id="invoice-form-control" role="menu">
                <a class="button-icon btn-default pointer have-text send-invoice" rel="tooltip" data-title="Send Invoice" data-placement="top" data-toggle="modal" data-target="#receiverMail"><i class="fa fa-envelope-o text-success"></i> Send</a>
                <a class="button-icon btn-default pointer have-text view-invoice" rel="tooltip" data-title="View Invoice" data-placement="top"><i class="fa fa-eye"></i> View</a>
                <a class="button-icon btn-default pointer have-text pdf-invoice" rel="tooltip" data-title="Save Invoice as PDF" data-placement="top"><i class="fa fa-file-pdf-o text-danger"></i> Save as PDF</a>
                <a class="button-icon btn-default pointer have-text print-invoice" rel="tooltip" data-title="Print Invoice" data-placement="top"><i class="fa fa-print"></i> Print</a>
                <a href="./#ajax/invoice-form.php" class="btn-primary have-text" rel="tooltip" data-title="Create new Invoice" data-placement="top"><i class="fa fa-plus"></i> Create new Invoice</a>
              </div>';
            }
          }
          ?>
        </header>
        <!-- widget div-->
        <div>

          <!-- widget edit box -->
          <div class="jarviswidget-editbox">
            <!-- This area used as dropdown edit box -->
          </div>
          <!-- end widget edit box -->

          <div id="message_form" role="alert" style="display:none"></div>

          <form class="smart-form" id="form_invoice" method="POST" autocomplete="false">
            <input type="hidden" name="ID">
            <input type="hidden" name="createTime">
            <input type="hidden" name="updateTime">
            <fieldset>
              <legend>Invoice</legend>
              <div class="row">
                <section class="col col-4">
                  <label class="input">Invoice Number</label>
                  <div class="form-group">
                    <div class="col col-md-12">
                      <div class="row">
                        <div class="col-sm-12">
                          <div class="input-group">
                            <span class="input-group-addon" id="invoice_extend_number"><?= date("Y"); ?></span>
                            <input class="form-control" name="invoiceid" type="number" max-length="6" <?= hasPermission($invoice_form, 'invoiceid', $operation_invoice) ? '' : ' readonly' ?>>
                            <span class="input-group-addon item_addon" style="min-width:20px; text-align:center; display:none;"><i class="fa fa-check" style="color:green;"></i></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p id="invoice_error"></p>
                </section>
                <section class="col col-4">
                  <label class="input">Customer</label>
                  <select name="customer" class="form-control" style="width:100%" <?= hasPermission($invoice_form, 'customer', $operation_invoice) ? '' : ' disabled' ?>>
                    <option value="">Select Item</option>
                  </select><i></i>
                </section>
                <section class="col col-4">
                  <label class="input">Salesperson</label>
                  <select name="salesperson" class="form-control" style="width:100%" <?= hasPermission($invoice_form, 'salesperson', $operation_invoice) ? '' : ' disabled' ?>>
                    <option value="">Select Item</option>
                  </select><i></i>
                </section>
              </div>
              <div class="row">
                <section class="col col-4">
                  <label class="input">Order</label>
                  <label class="select">
                    <select name="order_id" id="order_search" <?= hasPermission($invoice_form, 'order_id', $operation_invoice) ? '' : ' disabled' ?>></select><i></i>
                  </label>
                  <p id="search_order_error"></p>
                </section>
              </div>
            </fieldset>
            <fieldset>
              <legend>Order Informations</legend>
              <?php $_page = 'invoice-form';
              include('product-table.php') ?>
              <input name="ledger" type="hidden" value="">
              <input type="hidden" id="idInvoiceForward">
            </fieldset>

              <fieldset>
                  <button type="button" class="btn btn-primary acct-pay-btn" id="display-acct-pay" data-target="#acct-pay-modal" data-role="modal">Add Payment</button>
              </fieldset>

              <fieldset>
                  <legend>Payments</legend>
                  <div style="max-height:400px; overflow-y:auto; ">
                      <table id="tb_acct_pay_show" class="table table-tripped table-bordered" style="width:100%">
                          <thead>
                          <tr>
                              <th style="width:50px;" class="text-center">#</th>
                              <th class="text-center">Tran ID</th>
                              <th class="text-center">Payment Amount</th>
                              <th class="text-center">Payment Type</th>
                              <th class="text-center">Payment Date</th>
                              <th class="text-center">Payment Note</th>
                          </tr>
                          </thead>
                          <tbody></tbody>
                      </table>
                  </div>
              </fieldset>

            <?php if (hasPermission($invoice_form, 'ledger', 'show')) { ?>
              <fieldset style="display: none">
                <legend>Ledger</legend>
                <div style="max-height:400px; overflow-y:auto;">
                  <table id="tb_ledger_show" class="table table-tripped table-bordered" style="width:100%">
                    <thead>
                      <tr>
                        <th style="width:50px;" class="text-center">#</th>
                        <th class="text-center">Payment</th>
                        <th class="text-center">Method</th>
                        <th class="text-center">Note</th>
                        <th class="text-center">Invoice date</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </fieldset>
            <?php } ?>
            <fieldset id="schedule_table" class="hidden" style="display:none">
              <legend>Schedule Payments</legend>
              <table id="tb_invoice_schedule" class="table table-tripped table-bordered" style="width:100%">
                <thead>
                  <tr>
                    <th class="text-center">ID</th>
                    <th class="text-center">Order ID</th>
                    <th class="text-center">Payment Amount</th>
                    <th class="text-center">Invoice Date</th>
                    <th class="text-center">Confirm</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </fieldset>
            <fieldset id="history_table" class="hidden" style="display:none">
              <legend>Historical Payments</legend>
              <table id="tb_invoice_history" class="table table-tripped table-bordered" style="width:100%">
                <thead></thead>
                <tbody></tbody>
              </table>
            </fieldset>
            <?php include('notes.php'); ?>
            <footer>
              <?php
              if (hasPermission($invoice_form, 'btnBackInvoice', 'show')) echo '<button type="button" class="btn btn-default" id="btnBackInvoice" form="form_invoice" onclick="window.history.back()">Back</button>';
              if (hasPermission($invoice_form, 'btnBackInvoice', 'show')) echo '<button type="submit" class="btn btn-primary" id="btnSubmitInvoice" form="form_invoice">Submit</button>';
              ?>

            </footer>
          </form>
        </div>
      </div>
    </article>
  </div>
  <?php if (hasIdParam()) { ?>
    <div class="modal fade" id="previewInvoice">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content" style="display: inline-block;">
          <div class="modal-body" style="margin:auto"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="receiverMail">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content" style="display: inline-block;">
          <div class="modal-body" style="margin:auto; min-width:400px;">
            <div class="bold">Enter receiver email</div>
            <input type="text" class="form-control receiver_input" id="receiver_input" placeholder="ex: yourmail@mail.com">
            <div class="bold">Title</div>
            <input type="text" class="form-control title_input" placeholder="Mail title">
            <div class="bold">Content</div>
            <textarea class="form-control content_mail" rows="10" placeholder="Content" ></textarea>
            <br>
            <div><i class="fa-paperclip fa"></i> Archive: <b> Invoice-<span class="invoice_file"></span>.pdf</b></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary btn-submit-sendMail">Send Mail</button>
          </div>
        </div>
      </div>
    </div>
  <?php } ?>
  <div class="modal fade animated fadeInDown" style="display:none; margin:auto;" id="acct-pay-modal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-body" style="margin:auto">
                  <?php
                  include 'pay-acct.php';
                  ?>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary " id="acct-pay-btn-sub" >Submit</button>
              </div>
          </div>
      </div>
  </div>
</section>
<script src="<?= ASSETS_URL ?>/js/util/control-select2.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/select-template.js" type="text/javascript"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/ledger.js" type="text/javascript"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/validator.plus.js" type="text/javascript"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/note.js" type="text/javascript"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/product-table.js" type="text/javascript"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/invoice-form2.js" type="text/javascript"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/invoice-print.js" type="text/javascript"></script>
<?php if(hasIdParam() && $current_permission ==true){ ?>
<script>
  new ControlPage('#invoice-form-control');
</script>
<?php } ?>