<?php require_once 'inc/init.php';

$claim_start_fee = $_SESSION['settingPage']->claim_start_fee != '' ? $_SESSION['settingPage']->claim_start_fee : 65.00;

?>
<link rel="stylesheet" href="<?= $_myhost ?>/css/payment.css">
<section id="widget-grid" class="">
   <div class="row">

      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-xs-12 col-md-12 col-lg-12">

         <!-- Widget ID (each widget will need unique ID)-->
         <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
            <header>
               <h2>Start Claim</h2>
            </header>
            <div class="jarviswidget-body" style="max-width:100%">
               <div id="message_form" role="alert" style="display:none"></div>
               <form class="smart-form" id="claim_start" method="POST">
                  <fieldset>
                     <div class="row">
                        <section class="col col-xs-12">
                           <div class="bold uppercase" style="font-size:17px; color:orange">
                              <div class="col-sm-4 col-xs-12"><span class="">Customer: </span><span class="text-success" id="_customer">AnyOne</span></div>
                              <div class="col-sm-4 col-xs-12"><span class="">Warranty: </span><span class="text-success" id="_warranty">12356484</span></div>
                              <div class="col-sm-4 col-xs-12"><span class="">Payee: </span><span class="text-success" id="_payee">12356484</span></div>
                           </div>
                        </section>
                     </div>
                     <div class="row">
                        <section class="col col-xs-12">
                           <div class="bold uppercase" style="font-size:17px; color:orange">
                              <div class="col-sm-4 col-xs-12"><span class="col-lg-6 col-xl-5 col-md-7 col-sm-12 col-xs-12">Order ID: </span><span class="text-success" id="_payment_order_id">#-1</span></div>
                              <div class="col-sm-4 col-xs-12"><span class="col-lg-6 col-xl-5 col-md-7 col-sm-12 col-xs-12">Invoice ID: </span><span class="text-success" id="_payment_invoice_id">#-1</span></div>
                              <div class="col-sm-4 col-xs-12"><span class="col-lg-6 col-xl-5 col-md-7 col-sm-12 col-xs-12">Claim ID: </span><span class="text-success" id="_payment_claim_id">#-1</span></div>
                           </div>
                        </section>
                     </div>
                     <hr>
                     <div class="padding-10"></div>
                     <div class="row">
                        <section class="col col-xs-12">
                           <div class="bold uppercase" style="font-size:17px;">
                              <div style="color: orange;">
                                 <div class="col-sm-4 col-xs-6"><span class="col-lg-6 col-xl-5 col-md-7 col-sm-12 col-xs-12">Service Fee: </span><span class="text-success" id="_payment_service_fee">$ <?= $claim_start_fee ?></span></div>
                                 <div class="col-sm-4 col-xs-6"><span class="col-lg-6 col-xl-5 col-md-7 col-sm-12 col-xs-12">Balance: </span><span class="text-success" id="_payment_balance">$ <?= $claim_start_fee ?></span></div>
                                 <div class="col-sm-4 col-xs-6"><span class="col-lg-6 col-xl-5 col-md-7 col-sm-12 col-xs-12">On Account: </span><span class="text-success" id="_payment_on_account">$ 0</span></div>
                                 <div class="col-sm-4 col-xs-6"><span class="col-lg-6 col-xl-5 col-md-7 col-sm-12 col-xs-12">Discount: </span><span class="text-success" id="_payment_discount_code">$ 0</span></div>
                              </div>
                           </div>
                        </section>
                     </div>
                     <div class="row">
                        <section class="col col-xs-12">
                           <div class="bold uppercase" style="font-size:17px;">
                              <div style="color: var(--danger);">
                                 <div class="col-sm-4 col-xs-6"><span class="col-lg-6 col-xl-5 col-md-7 col-sm-12 col-xs-12">Total: </span><span class="text-success" id="_payment_total">$ <?= $claim_start_fee ?></span></div>
                              </div>
                           </div>
                        </section>
                     </div>
                  </fieldset>
                  <fieldset>
                     <div class="row">
                        <div class="col col-6">
                           <section>
                              <label class="input">Discount Code</label>
                              <label class="input">
                                 <input type="text" name="discount_code">
                              </label>
                           </section>
                           <section>
                              <div id="discount_pane"></div>
                           </section>
                           <section>
                              <label class="input">Payment Methods</label>
                              <div class="inline-group">
                                 <label class="radio ">
                                    <input type="radio" class="acct_payment_type" name="pay_type" value="Cash" checked>
                                    <i></i>Cash</label>
                                 <label class="radio">
                                    <input type="radio" class="acct_payment_type" name="pay_type" value="Check">
                                    <i></i>Check</label>
                                 <label class="radio">
                                    <input type="radio" class="acct_payment_type" name="pay_type" value="OnAcct">
                                    <i></i>On Acct</label>
                                 <label class="radio">
                                    <input type="radio" class="acct_payment_type" name="pay_type" value="CC">
                                    <i></i>CC</label>
                              </div>
                           </section>
                           <section>
                              <label class="input">Note</label>
                              <label class="textarea">
                                 <textarea name="pay_note" rows="6"></textarea>
                              </label>
                           </section>
                        </div>
                     </div>
                  </fieldset>
                  <footer>
                     <button type="button" class="btn btn-sm btn-default" onclick="window.close()">Close</button>
                     <button type="button" class="btn btn-sm btn-warning btnConfirm">Confirm</button>
                  </footer>
               </form>

            </div>
         </div>
      </article>
   </div>

</section>

<script src="<?= ASSETS_URL ?>/js/script/claim/claim-discount.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/claim/claim-start.js"></script>
<script>
var _claimStart = new ClaimStart();
_claimStart.init();
</script>