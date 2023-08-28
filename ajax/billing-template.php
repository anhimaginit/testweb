<?php
require_once 'inc/init.php';
// require_once dirname(__DIR__) . '/php/createDataFieldset.php';
// $template = '[{"billingDate":{"type":"radio","label":"Billing Date","col":12,"properties":{"items":["30th of month","1st of month","15th of month"],"inline":true}}},{"billingCircleEvery":{"type":"input","col":3,"properties":{"placeholder":"Billing Cycle","label":"Billing Cycle","type":"number"},"append":[{"name":"billingPeriod","data":{"type":"select","col":1,"properties":{"class":"text-left","placeholder":"Select Billing Circle","data":["Month","Quarter","Year"],"prop":{"style":"width:80px; float:left;"}}}}]},"processingFee":{"type":"input","col":2,"properties":{"placeholder":"Processing Fee","label":"Processing Fee","type":"text","icon":"fa-dollar","icon_append":false,"class":"input-currency currency billing-currency","attr":["readonly=\'true\'"]}},"paymentAmount":{"type":"input","col":2,"properties":{"placeholder":"Payment Amount","type":"text","label":"Payment Amount","icon":"fa-dollar","icon_append":false,"class":"input-currency currency"}},"initiedFee":{"type":"input","col":2,"properties":{"placeholder":"Initial Fee","label":"Initial Fee","type":"text","icon":"fa-dollar","icon_append":false,"class":"input-currency currency billing-currency","attr":["readonly=\'true\'"]}}},{"status":{"type":"select","col":2,"properties":{"label":"Status","display":"display","value":"value","data":[{"display":"Select a status","value":false},{"display":"Active","value":true},{"display":"Inactive","value":false}]}},"startDate":{"type":"input","col":2,"properties":{"type":"date","label":"Start Date","icon":"fa-calendar","value":"2019-04-24","attr":["readonly=\'true\'"]}},"endDate":{"type":"input","col":2,"properties":{"type":"date","label":"End Date","class":"datepicker","icon":"fa-calendar","value":"2020-04-23"}}},{"optionPayingLater":{"type":"checkbox","col":6,"properties":{"items":["Payling Later"]}}},{"offSecondPayFee":{"type":"checkbox","col":6,"properties":{"items":["Off Second Pay Fee"]}}}]';
// $_html = createFieldsets(json_decode($template));

$billingForm = 'BillingTemplateForm';
$roleBilling = 'add';
if(getID()) $roleBilling = 'edit';

$_authenticate->checkFormPermission($billingForm);
?>

<section id="widget-grid" class="">
   <div class="row">

      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-md-12 col-lg-12">

         <!-- Widget id (each widget will need unique id)-->
         <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
            <header>
               <h2>Billing Template</h2>
               <?php 
               $help_form = 'billing';
               include 'btn-help.php';
               unset($help_form);
               ?>
               <?php if(getID()){echo '<a href="./#ajax/billing-template.php" class="btn btn-primary pull-right">Create new Subscription</a>';} ?>
            </header>
            <!-- widget div-->
            <div class="jarviswidget-body" style="max-width:100%">

               <!-- end widget edit box -->
               <div id="message_form" role="alert" style="display:none"></div>
               <form class="smart-form" id="billing_form" method="post">
                  <input type="hidden" name="id">
                  <input type="hidden" name="paymentAmount" value="0" placeholder="Payment Amount">
                  <?php if(hasPermission($billingForm, 'name', 'show')){ ?>
                  <fieldset>
                     <div class="row">
                        <section class="col col-4">
                           <label class="input">Template Name</label>
                           <label class="input">
                              <input type="text" name="name" maxlength="250" <?= hasPermission($billingForm, 'name', $roleBilling) ? '' : 'readonly'; ?>>
                           </label>
                        </section>
                     </div>
                  </fieldset>
                  <?php } ?>
                  <fieldset id="subcription_detail">
                  <?php if(hasPermission($billingForm, 'paymentPeriod', 'show')){ ?>
                  <?php if(hasPermission($billingForm, 'paymentPeriod', $roleBilling)){ ?>
                     <div class="row">
                        <section class="col col-3">
                           <label class="input">Subscription Plan (month)</label>
                           <label class="input">
                              <input type="number" name="paymentPeriod" placeholder="Subscription Plan" min='1' <?= hasPermission($billingForm, 'paymentPeriod', $roleBilling) ? '' : 'readonly'; ?>>
                           </label>
                        </section>
                     </div>
                  <?php } ?>
                  <?php } ?>
                     <div class="row">
                     <?php if(hasPermission($billingForm, 'billingCircleEvery', 'show')){ ?>
                        <section class="col col-3">
                           <!-- <label class="input">Between To Pay</label> -->
                           <label class="input">Billing Cycle Every</label>
                           <select name="billingCircleEvery" class="form-control text-left" <?= hasPermission($billingForm, 'name', $roleBilling) ? '' : 'disabled'; ?>>
                              <option value="day">Day</option>
                              <option value="month">Month</option>
                              <option value="quarter">Quarter</option>
                              <option value="year">Year</option>
                           </select>
                        </section>
                     <?php } ?>
                     <?php if(hasPermission($billingForm, 'billingDate', 'show')){ ?>
                        <section class="col col-2" id="pane_dayOfMonth">
                           <label class="input">Day of Month</label>
                           <label class="select">
                              <select name="billingDate" id="agsBillingDate" <?= hasPermission($billingForm, 'billingDate', $roleBilling) ? '' : 'disabled'; ?>>
                                 <?php 
                                 $month = date('m');
                                 $year = date('y');
                                 $day = date('d');
                                 $numDayOfMonth = 1;
                                 if(in_array($month, [1,3,5,7,8,10,12])){
                                    $numDayOfMonth = 31;
                                 }else if(in_array($month, [4,6,9,11])){
                                    $numDayOfMonth = 30;
                                 }else if($month==2 && $year%4==0){
                                    $numDayOfMonth = 29;
                                 }else{
                                    $numDayOfMonth = 28;
                                 }
                                 for($i=1; $i<=$numDayOfMonth; $i++){
                                    echo '<option value='.$i.'>'.$i.'</option>';
                                 }
                                 ?>
                              </select><i></i>
                           </label>
                        </section>

                        <section class="col col-3" id="pane_betweenToPay">
                           <label class="input">Next payment (number of days)</label>
                           <label class="input">
                              <input name="betweenToPay" type="number" <?= hasPermission($billingForm, 'betweenToPay', $roleBilling) ? '' : 'readonly'; ?>>
                           </label>
                        </section>
                        <?php } ?>
                     </div>
                     <?php if(hasPermission($billingForm, 'optionPayingLater', 'show')){ ?>
                     <div class="row">
                        <section class="col col-12">
                           <div class="inline-group">
                              <label class="checkbox"><input type="checkbox" name="optionPayingLater" value="1" <?= hasPermission($billingForm, 'optionPayingLater', $roleBilling) ? '' : 'disabled'; ?>><i></i>Skip first month</label>
                           </div>
                        </section>
                     </div>
                     <?php } ?>
                     <div class="row">
                        <?php if(hasPermission($billingForm, 'processingFee', 'show')){ ?>
                        <section class="col col-4">
                           <label class="label">Processing Fee</label>
                           <label class="input">
                              <i class="icon-append fa fa-dollar"></i>
                              <input class="input-currency currency billing-currency" type="number" name="processingFee" value="" placeholder="Processing Fee" <?= hasPermission($billingForm, 'processingFee', $roleBilling) ? '' : 'readonly'; ?>>
                           </label>
                        </section>
                        <?php } ?>
                        <?php if(hasPermission($billingForm, 'initiedFee', 'show')){ ?>
                        <section class="col col-4">
                           <label class="label">Initial Fee</label>
                           <label class="input">
                              <i class="icon-append fa fa-dollar"></i>
                              <input class="input-currency currency billing-currency" type="number" name="initiedFee" value="" placeholder="Initial Fee" <?= hasPermission($billingForm, 'initiedFee', $roleBilling) ? '' : 'disabled'; ?>>
                           </label>
                        </section>
                        <?php } ?>
                     </div>
                     <?php if(hasPermission($billingForm, 'status', 'show')){ ?>
                     <div class="row">
                        <section class="col col-2">
                           <label class="label">Status</label>
                           <label class="select ">
                              <select name="status" <?= hasPermission($billingForm, 'status', $roleBilling) ? '' : 'disabled'; ?>>
                                 <option value=true selected>Active</option>
                                 <option value=false>Inactive</option>
                              </select><i></i>
                           </label>
                        </section>
                     </div>
                     <?php } ?>
                  </fieldset>
                  <footer>
                  <?php if(hasPermission($billingForm, 'btnSubmitBilling', 'show')){ ?>
                     <button type="submit" id="btnSubmitBilling" class="btn btn-primary">Submit</button>
                  <?php } ?>
                  <?php if(hasPermission($billingForm, 'btnBackBilling', 'show')){ ?>
                     <button type="button" id="btnBackBilling" class="btn btn-default" onclick="window.history.back();">Back</button>
                  <?php } ?>
                  </footer>
               </form>
               <?php if(hasPermission($billingForm, 'table_billing_template_wrapper', 'show')){ ?>
               <fieldset>
                  <legend>Billing Template List</legend>
                  <table id="table_billing_template" class="table table-bordered table-triped" style="width:100%"></table>
               </fieldset>
               <?php } ?>
            </div>
         </div>
      </article>
   </div>
</section>
<script src="./js/script/billing/billing-template.js"></script>
<script>
   var billing_template = new BillingTemplate();
   billing_template.init();

   // $("#agsBillingDate").change(function() {      
   //    $("#billingDate").val('day '+$(this).val()+' of month');      
   // });

</script>