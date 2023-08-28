<link rel="stylesheet" type="text/css" href="<?= ASSETS_URL ?>/js/plugin/datetimepicker/jquery.datetimepicker.css">
<link rel="stylesheet" href="<?= ASSETS_URL ?>/css/payment.css">
<form class="smart-form" id="form-pay-acct" method="POST" autocomplete="false">
    <div id="message_form" role="alert" style="display:none"></div>
    <fieldset id="pay_acct_method" class="smart-form">
        <div class="row payment_content">
            <section>
                <h5>Payment Methods
                    <small class="pull-right text-dark bold">On Account: <span id="on_account_amount">$ 0.00</span></small>
                </h5>
            </section>
        </div>
    </fieldset>
    <fieldset>
        <section>
            <div class="inline-group">
                <label class="radio ">
                    <input type="radio" class="acct_payment_type" name="pay_type" value="Cash" checked="">
                    <i></i>Cash</label>
                <label class="radio">
                    <input type="radio" class="acct_payment_type" name="pay_type" value="Check">
                    <i></i>Check</label>
                <label class="radio">
                    <input type="radio" class="acct_payment_type" name="pay_type" value="OnAcct">
                    <i></i>On Account</label>
                <label class="radio">
                    <input type="radio" class="acct_payment_type" name="pay_type" value="CC">
                    <i></i>CC</label>
            </div>
        </section>
    </fieldset>
    <fieldset>
        <div class="row">
            <section class="col col-md-12 col-6">
                <label class="label">Pay Amount($)</label>
                <input type="text" class="form-control text-right input-currency" name="pay_amount" id="pay_amount_acct">
            </section>
        </div>

        <div class="row">
            <section class="col col-md-12 col-6">
                <label class="label">Payment Date</label>
                <input type="text" class="form-control datetimepicker" name="pay_date" id="pay_date_acct">
            </section>
        </div>

        <div id="card-info" style="display: none">
            <div class="row">
                <section class="col col-md-12 col-6">
                    <label class="label">Card Number</label>
                    <input type="number" class="form-control" name="cardNumber" maxlength="19">
                </section>
            </div>
            <div class="row">
                <section class="col col-md-6 col-6">
                    <label class="label">Card Code</label>
                    <input type="text" class="form-control" type="password" name="cardCode">
                </section>
            </div>
            <div class="row">
                <section class="col col-md-12 col-6">
                    <label class="label">Expiration Date</label>
                    <input type="text" class="form-control" type="text" name="expirationDate">
                </section>
            </div>
        </div>
        <div class="row">
            <section class="col col-md-12 col-6">
                <label class="label">Note</label>
                <textarea type="text" class="form-control" name="pay_note" rows="4"></textarea>
            </section>
        </div>
    </fieldset>
</form>
<script src="<?php echo ASSETS_URL ?>/js/plugin/datetimepicker/build/jquery.datetimepicker.full.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/pay-acct.js"></script>