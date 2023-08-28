<?php
$claim_form = 'ClaimForm';
require_once 'inc/init.php';
require_once '../php/link.php';

use \SmartUI\Components\SmartForm;

$_authenticate->checkFormPermission($claim_form);

$_ui->start_track();
$claimDataEdit = array();
if (hasIdParam()) {
   $claimDataEdit = HTTPMethod::httpPost($link['_claimGetById'], array('token' => $_SESSION['token'], 'ID' => getID(), 'jwt' => $_SESSION['jwt'], 'private_key' => $_SESSION['userID']));
   if (null !== $claimDataEdit && $claimDataEdit != '') {
      $claimDataEdit = (object) $claimDataEdit->Claim;
      // echo json_encode($claimDataEdit);
   }
}
$current_form = 'add';

if (isset($claimDataEdit->ID)) {
   $assign_to_list = HTTPMethod::httpPost($link['_employeeList'], array('token' => $_SESSION['token'], 'jwt' => $_SESSION['jwt'], 'private_key' => $_SESSION['userID']));
   // echo json_encode($assign_to_list);
   $assign_to_list = $assign_to_list->list;
   if (basename($_SERVER['PHP_SELF']) == 'claim-form.php') {
      $current_form = 'edit';
   }
   for ($i = 0; $i < sizeof($assign_to_list); $i++) {
      $assign_to_list[$i]->id = $assign_to_list[$i]->ID;
      $assign_to_list[$i]->text = $assign_to_list[$i]->first_name . ' ' . $assign_to_list[$i]->last_name;
   }
} else if (hasIdParam() && !isset($claimDataEdit->ID)) {
   echo "<script>messageForm('No data found with claim id = " . getID() . ", please choose another id', false);</script>";
}

$claim_status = [];
if (!isset($_SESSION['settingPage']->claim_status)) {
   $_SESSION['settingPage']->claim_status = ['Not Assigned', 'Open', 'In Progress', 'Approved', 'Assigned', 'Deny', 'Close', 'Cancel'];
   $claim_status = $_SESSION['settingPage']->claim_status;
} else if (gettype($_SESSION['settingPage']->claim_status) == 'string') {
   $claim_status = json_decode($_SESSION['settingPage']->claim_status);
}
?>
<style>
   hr.line_note{
      padding-bottom: 5px;
   }
</style>
<script>
   var assigned_persons = <?= isset($assign_to_list) ? json_encode($assign_to_list) : '[]' ?>
</script>
<div class="row">
   <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
      <!-- <h1 class="page-title txt-color-blueDark">Home > Claim</h1> -->
   </div>
</div>
<section id="widget-grid" class="">
   <div class="row">

      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-md-12 col-lg-12">

         <!-- Widget ID (each widget will need unique ID)-->
         <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
            <header>
               <?php
               $help_form = 'claim';
               include 'btn-help.php';
               unset($help_form);
               ?>
               <h2 style="width:auto">Claim Form <?= $current_form == 'edit' ? ': ID-' . $claimDataEdit->ID : '' ?></h2>
               <?php
               if ($current_form == 'edit') {
                  echo '<div class="jarviswidget-ctrls" id="claim-form-control" role="menu">';
                  if (isset($_SESSION['page_navigation']['claim']['sub']['addclaim'])) {
                     echo ('<a href="./#ajax/claim-form.php" class="btn-primary have-text"><i class="fa fa-plus"></i> Create new Claim</a>');
                  }
                  echo '</div>';
               }
               ?>
            </header>
            <!-- widget div-->
            <div class="jarviswidget-body" style="max-width:100%">

               <!-- end widget edit box -->
               <div id="message_form" role="alert" style="display:none"></div>
               <div class="row" id="pane_link_to_warranty"></div>
               <form class="smart-form" id="claim_form" method="POST">

                  <input type="hidden" name="ID" value="<?= ($current_form == 'edit' ? $claimDataEdit->ID : '') ?>">
                  <input type="hidden" name="create_by" value="<?= (isset($claimDataEdit->create_by) ? $claimDataEdit->create_by : $_SESSION['userID']) ?>">
                  <fieldset>
                     <div class="row">
                        <section class="col col-6">
                           <label class="input">Customer <span class="link_to" data-view="link_to" data-form="#claim_form" data-control="customer" data-name="contact-form" data-param="id"></span></label>
                           <?php
                           $option = isset($claimDataEdit->customer_name) && isset($claimDataEdit->customer) ? $claimDataEdit->customer_name : (isset($_GET['contactname']) ? $_GET['contactname'] : $_SESSION['user_name']);
                           $optionID = isset($claimDataEdit->customer) ? $claimDataEdit->customer : (isset($_GET['contactid']) ? $_GET['contactid'] : $_SESSION['userID']);
                           $customer_option = '<option value="' . $optionID . '">' . $option . '</option>';
                           ?>
                           <select name="customer" class="form-control" style="width:100%"><?= $customer_option ?></select>
                        </section>
                        <section class="col col-6">
                           <label class="input">Warranty</label>
                           <label class="select">
                              <select name="warranty_ID">
                              </select><i></i>
                           </label>
                        </section>
                     </div>
                     <div class="row">
                        <section class="col col-6">
                           <div>
                              <div class="well" style="display:none" id="warranty_card"></div>
                           </div>
                           <?php
                           if ($current_form == 'edit' && hasPermission($claim_form, 'claim_assign', 'show')) { ?>
                              <section class="" id="pane_assign">
                                 <label class="input padding-top-10">Assigned <span class="link_to" data-form="#claim_form" data-view="link_to" data-control="claim_assign" data-name="contact-form" data-param="id"></span></label>
                                 <select name="claim_assign" style="width:100%" <?= !hasPermission($claim_form, 'claim_assign', $current_form) ? ' disabled' : '' ?>></select>
                              </section>
                              <!-- <div class="clearfix"></div> -->
                           <?php
                              echo SmartForm::print_field(
                                 'start_date',
                                 SmartForm::FORM_FIELD_INPUT,
                                 array(
                                    'id' => 'start_date',
                                    'label' => 'Start Date',
                                    'type' => 'date',
                                    'class' => 'input-readonly',
                                    'value' => hasIdParam() && isset($claimDataEdit->start_date) ? $claimDataEdit->start_date : '',
                                    'attr' => array(
                                       'readonly="true"'
                                    )
                                 ),
                                 12,
                                 true,
                                 hasPermission($claim_form, 'start_date', 'show')
                              );

                              echo SmartForm::print_field(
                                 'end_date',
                                 SmartForm::FORM_FIELD_INPUT,
                                 array(
                                    'id' => 'end_date',
                                    'label' => 'End Date',
                                    'type' => 'date',
                                    'class' => 'datepicker',
                                    'value' => isset($claimDataEdit->end_date) ? $claimDataEdit->end_date : '',
                                    'attr' => array(
                                       (!hasPermission($claim_form, 'end_date', $current_form) ? 'readonly' : '')
                                    )
                                 ),
                                 12,
                                 true,
                                 hasPermission($claim_form, 'end_date', 'show')
                              );

                              echo SmartForm::print_field(
                                 'status',
                                 SmartForm::FORM_FIELD_SELECT,
                                 array(
                                    'label' => 'Status',
                                    'data' => $claim_status,
                                    'selected' => isset($claimDataEdit->status) ? $claimDataEdit->status : '0',
                                    'attr' => array(
                                       (hasPermission($claim_form, 'status', $current_form) ? '' : 'readonly')
                                    )
                                 ),
                                 12,
                                 true,
                                 hasPermission($claim_form, 'status', 'show')
                              );
                           }
                           ?>
                        </section>


                        <section class="col col-6">
                           <?php
                           echo  SmartForm::print_field(
                              'note',
                              SmartForm::FORM_FIELD_TEXTAREA,
                              array(
                                 'label' => 'Description',
                                 'col' => 3,
                                 'value' => isset($claimDataEdit->note) ? $claimDataEdit->note : '',
                                 'attr' => array(
                                    (!hasPermission($claim_form, 'note', $current_form) ? 'readonly' : '')
                                 )
                              ),
                              12,
                              hasPermission($claim_form, 'note', 'show')
                           ) . '<div class="clearfix"></div>';

                           ?>
                           <?php if ($current_form == 'edit') { ?>
                              <div class="well padding-10 claim_start_info">
                              <div id="message_invoice_service_fee" role="alert" style="display:none"></div>
                                 <section class="col col-xs-12">
                                    <div class="bold uppercase" style="font-size:16px; color:orange">
                                       <div class="col-md-6 col-sm-12"><span class="col-md-7 col-sm-6 col-xs-6">Order&nbsp;ID: </span><span class="text-success" id="_payment_order_id"></span></div>
                                       <div class="col-md-6 col-sm-12"><span class="col-md-7 col-sm-6 col-xs-6">Invoice&nbsp;ID: </span><span class="text-success" id="_payment_invoice_id"></span></div>
                                       <div class="col-md-6 col-sm-12"><span class="col-md-7 col-sm-6 col-xs-6">Claim&nbsp;ID: </span><span class="text-success" id="_payment_claim_id"></span></div>
                                    </div>
                                 </section>
                                 <hr>
                                 <div class="padding-10"></div>
                                 <section class="col col-xs-12">
                                    <div class="bold uppercase" style="font-size:16px;">
                                       <div style="color: orange;">
                                          <div class="col-md-6 col-sm-12 item"><span class="col-md-7 col-sm-6 col-xs-6">Service&nbsp;Fee: </span><span class="text-success" id="_payment_service_fee"></span></div>
                                          <div class="col-md-6 col-sm-12 item"><span class="col-md-7 col-sm-6 col-xs-6">Balance: </span><span class="text-success" id="_payment_balance"></span></div>
                                          <div class="col-md-6 col-sm-12 item"><span class="col-md-7 col-sm-6 col-xs-6">Payment: </span><span class="text-success" id="_payment_payment"></span></div>
                                          <div class="col-md-6 col-sm-12 item"><span class="col-md-7 col-sm-6 col-xs-6">On&nbsp;Account: </span><span class="text-success" id="_payment_on_account"></span></div>
                                          <div class="col-md-6 col-sm-12 item"><span class="col-md-7 col-sm-6 col-xs-6">Discount: </span><span class="text-success" id="_payment_discount_code"></span></div>
                                       </div>
                                    </div>
                                 </section>
                                 <section class="col col-xs-12">
                                    <div class="bold uppercase" style="font-size:16px;">
                                       <div style="color: var(--danger);">
                                          <div class="col-md-6 col-sm-12"><span class="col-md-7 col-sm-6 col-xs-6">Total: </span><span class="text-success" id="_payment_total"></span></div>
                                       </div>
                                       <div id="_balance_target"></div>
                                    </div>
                                 </section>
                                 <section class="col col-xs-12">
                                    <div class="hidden" style="font-size:16px;">
                                       <label class="bold ">Payment Note</label>
                                       <div id="_payment_note" style="font-size:14px;"></div>
                                    </div>
                                 </section>
                                 <div class="clearfix"></div>
                                 <?php if (!isset($claimDataEdit->balance) || (isset($claimDataEdit->payment) && $claimDataEdit->payment < $claimDataEdit->total)) {
                                       // <div>
                                       //    <label class="input">Discount Code</label>
                                       //    <label class="input">
                                       //       <input type="text" name="discount_code" class="form-control">
                                       //    </label>
                                       // </div>
                                       // <div class="padding-10" id="discount_pane"></div>
                                       ?>
                                    <div>
                                       <label class="input">Payment Methods</label>
                                       <div class="inline-group">
                                          <label class="radio ">
                                             <input type="radio" class="acct_payment_type" name="pay_type" value="Cash" checked>
                                             <i></i>Cash</label>
                                          <label class="radio">
                                             <input type="radio" class="acct_payment_type" name="pay_type" value="Check">
                                             <i></i>Check</label>
                                          <?php if (isset($claimDataEdit->total_overage) && $claimDataEdit->total_overage > 0) { ?>
                                             <label class="radio">
                                                <input type="radio" class="acct_payment_type" name="pay_type" value="OnAcct">
                                                <i></i>On Account</label>
                                          <?php } ?>
                                          <label class="radio">
                                             <input type="radio" class="acct_payment_type" name="pay_type" value="CC">
                                             <i></i>CC</label>
                                       </div>
                                    </div>
                                    <div style="padding-top:10px;">
                                       <label class="input">Amount</label>
                                       <label class="input">
                                          <input class="input-currency" name="acc_pay_amount">
                                       </label>
                                    </div>
                                    <div style="padding-top:10px;">
                                       <label class="input">Payment Date</label>
                                       <label class="input">
                                          <input class="form-control datetimepicker" name="acc_pay_date">
                                       </label>
                                    </div>
                                    <div style="padding-top:10px;">
                                       <label class="input">Payment Note</label>
                                       <label class="textarea">
                                          <textarea name="pay_note" rows="6"></textarea>
                                       </label>
                                    </div>
                                    <div class="text-right padding-10">
                                       <button type="button" class="btn btn-sm btn-warning btnConfirmPayment">Confirm</button>
                                    </div>
                                 <?php } else { ?>

                                 <?php } ?>
                              </div>
                           <?php } ?>
                        </section>


                     </div>
                  </fieldset>
                  <?php
                  if (isset($claimDataEdit->assign_task)) {
                     include 'claim-form.task.php';
                  }

                  ?>

                  <fieldset>
                      <?php
                      if ($current_form == 'edit') {
                        include './notes.php';
                      }
                      ?>
                      <div class="clearfix"></div>
                  </fieldset>
                  <?php
                  if (hasPermission($claim_form, 'UID', 'show') &&  $current_form == 'edit') {
                     $isVendorDisable = !hasPermission($claim_form, 'UID', $current_form) ? ' disabled' : '';
                     ?>
                     <fieldset>
                        <div class="row">
                           <section class="col col-6">
                              <label class="input">Select Vendor</label>
                              <select name="UID" class="form-control" style="width:100%" multiple <?= $isVendorDisable ?>></select>
                           </section>
                        </div>
                        <?php include 'claim-quote.php' ?>
                     </fieldset>
                  <?php
                  }
                  if ($current_form == 'edit') {
                     include 'transaction.php';
                  }
                  if ($current_form == 'edit') {
                     ?>
                     <fieldset>
<!--                        --><?php //include './notes.php'; ?>
                        <div class="clearfix"></div>
                        <?php
                           $disabledPaid = !hasPermission($claim_form, 'paid', $current_form) || (isset($claimDataEdit->balance) && $claimDataEdit->balance > 0);
                           echo SmartForm::print_field(
                              'paid',
                              SmartForm::FORM_FIELD_CHECKBOX,
                              array(
                                 'items' => array(array('label' => 'Paid', 'value' => ($disabledPaid ? '" style="cursor:block" disabled="true' : ''))),
                                 'checked' => isset($claimDataEdit->paid) ? $claimDataEdit->paid == true ? true : false : 'false',

                              ),
                              2,
                              true,
                              hasPermission($claim_form, 'paid', 'show')
                           );

                           echo SmartForm::print_field(
                              'inactive',
                              SmartForm::FORM_FIELD_CHECKBOX,
                              array(
                                 'items' => array(array('label' => 'Inactive')),
                                 'checked' => isset($claimDataEdit->inactive) ? $claimDataEdit->inactive == true ? true : false : false,
                              ),
                              2,
                              true,
                              true
                           );
                           // echo json_encode($claimDataEdit);
                           ?>
                     </fieldset>
                  <?php } ?>
                  <footer>
                     <?php if (hasPermission($claim_form, 'btnBackClaim', 'show')) {
                        echo '<button type="button" class="btn btn-default" id="btnBackClaim" onclick="window.history.back()">Back</button>';
                     }
                     if (hasPermission($claim_form, 'btnSubmitClaim', 'show')) {
                        $type = 'submit';
                        if ($current_form == 'edit') $type = 'submit';
                        echo '<button type="' . $type . '" class="btn btn-primary" id="btnSubmitClaim">' . (isset($claimDataEdit->ID) ? 'Save' : 'Start Claim') . '</button>';
                     } ?>
                  </footer>
               </form>
            </div>
         </div>
      </article>
   </div>
</section>

<?php if ($current_form == 'edit') {
   $mail_popup_id = 'resend_mail_popup';
   $mail_popup_event = 'sendContract()';
   include 'email-template.php';
   unset($mail_popup_id);
   unset($mail_popup_event);

   $mail_popup_id = 'deny_mail_popup';
   $mail_popup_event = 'notifyVendor()';
   include 'email-template.php';
   unset($mail_popup_id);
   unset($mail_popup_event);

   $mail_popup_id = 'note_mail_popup';
   $mail_popup_event = 'sendMailNote()';
   include 'email-template.php';
   unset($mail_popup_id);
   unset($mail_popup_event);

   $mail_popup_id = 'warranty_mail_popup';
   $mail_popup_event = 'sendMailWarranty()';
   include 'email-template.php';
   unset($mail_popup_id);
   unset($mail_popup_event);

   ?>
   <input type="hidden" id="deny_type">
   <input type="hidden" id="deny_object">
   <div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="modal_overide_claim">
      <div class="modal-dialog">
         <div class="modal-content">
            <?php include 'claim-transaction.overide.php'; ?>
         </div>
      </div>
   </div>
<?php }

?>

<script src="<?= ASSETS_URL ?>/js/util/control-select2.js"></script>
<script src="<?= ASSETS_URL ?>/js/util/select-link.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/validator.plus.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/select-template.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/note.js"></script>

<script>
   window.hwcontact_phone = '<?= (isset($_SESSION['settingPage']->phone) && $_SESSION['settingPage']->phone != '' && sizeof($_SESSION['settingPage']->phone) > 0) ? $_SESSION['settingPage']->phone[0]->phone : '+18016839004' ?>';
   <?php
   if ($current_form == 'edit') {
      echo 'window.claim_config = {';
      //approve quote
      $approve_quote = getPermission($claim_form, 'customer_approve_quote');
      if ($approve_quote !== array()) {
         echo ' approve_quote:' . json_encode($approve_quote) . ', ';
      }

      //approve invoice
      $approve_invoice = getPermission($claim_form, 'customer_approve_invoice');
      if ($approve_invoice !== array()) {
         echo 'approve_invoice:' . json_encode($approve_invoice) . ', ';
      }

      //approve payment
      $approve_pay = getPermission($claim_form, 'accountant_approved_pay');
      if ($approve_pay !== array()) {
         echo 'approve_pay:' . json_encode($approve_pay) . ', ';
      }

      //create transaction
      $create_transaction = getPermission($claim_form, 'create_transaction');
      if ($create_transaction !== array()) {
         echo 'create_transaction:' . json_encode($create_transaction);
      }
      echo '};';
   } ?>
</script>
<script src="<?php echo ASSETS_URL; ?>/js/script/claim/claim-send-mail.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/claim/claim.js"></script>
<?php if (isset($claimDataEdit->ID)) {
   echo '<script src="' . ASSETS_URL . '/js/script/claim/claim-discount.js"></script>';
   echo '<script src="' . ASSETS_URL . '/js/script/claim/claim-invoice-payment.js"></script>';
} ?>
<script>
   <?php

   if ($current_form != 'edit') {
      echo '_claim.loadWarranty();';
   } else {
      echo "new ControlPage('#claim-form-control');";
      if (isset($claimDataEdit->notes)) {
         ?>
         claimNote.displayList(
            <?= json_encode($claimDataEdit->notes) ?>
         );
   <?php
      }
      $dataSet = array(
         'customer' => $claimDataEdit->customer,
         'customer_name' => $claimDataEdit->customer_name,
         'warranty_ID' => $claimDataEdit->warranty_ID,
         'claim_assign' => $claimDataEdit->claim_assign,
         'claim_asg_name' => $claimDataEdit->claim_asg_name,
         'ID' => $claimDataEdit->ID,
         'paid' => $claimDataEdit->paid,
         'limit' => (isset($claimDataEdit->claim_limit) ? $claimDataEdit->claim_limit : []),
      );
      if (isset($claimDataEdit->transactionID)) {
         $dataSet['transactionID'] = $claimDataEdit->transactionID;
      }
      if (isset($claimDataEdit->assign_task)) {
         $dataSet['assign_task'] = $claimDataEdit->assign_task;
      }
      if (isset($claimDataEdit->UID)) {
         $dataSet['vendor'] = $claimDataEdit->UID;
         $dataSet['quote'] = $claimDataEdit->data_quote;
      }
      echo 'window.claim_new_info = ';
      echo json_encode(array(
         'order_id' => $claimDataEdit->order_id,
         'invID' => $claimDataEdit->invoice_id,
         'ID' => $claimDataEdit->ID,
         'total_overage' => $claimDataEdit->total_overage,
         'balance' => $claimDataEdit->balance,
         'total' => $claimDataEdit->total,
         'payment' => $claimDataEdit->payment,
         'payment_acct' => $claimDataEdit->payment_acct
      )) . ";";
      echo '_claim.setData(' . json_encode($dataSet) . ');';

   } ?>
</script>