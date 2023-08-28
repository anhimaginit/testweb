<?php
require_once 'init.php';

$page_title = 'Purchase Home Warranty';
$page_css[] = "your_style.css";
$no_main_header = true;
// $page_body_prop = array("id" => "extr-page", "class" => "animated fadeInDown");
$page_body_prop = array();
if (!isset($page_html_prop)) $page_html_prop = array();
include("inc/header.php");

?>
<div class="container">
    <div class="row">
        <!-- widget div-->
        <div>
            <h1><b>Purchase Home Warranty</b></h1>
            <form class="smart-form" id="warranty_form" method="post">
                <div id="message_form" role="alert" style="display:none"></div>
                <input type="hidden" name="ID" value="">
                <input type="hidden" name="warranty_update_date" value="">
                <input type="hidden" name="warranty_update_by" value="">
                <input type="hidden" name="warranty_serial_number" id="warranty_serial_number">
                <input type="hidden" id="order_id" value="">
                <input type="hidden" id="warranty_ID" value="">
                <fieldset>
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Policy Holder</label>
                            <div class="input-group">
                                <select name="bill_to" id="billToId" class="warranty_buyer_id form-control" style="width:100%" placeholder="Home Buyer"></select>
                                <div class="input-group-btn padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_payer_type" value="1"> <i></i> Payee
                                    </label>
                                </div>
                                <div class="padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_submitter_type" value="1"><i></i> Submitter
                                    </label>
                                </div>

                            </div>
                        </section>
                        <section class="col col-6">
                            <label class="input">Add New Contact</label>
                            <button class="btn btn-sm btn-primary btn-add-contact" data-select="bill_to" data-form="Policy Holder" title="Add new contact" type="button"><i class="fa fa-plus"></i> Add New</button>
                        </section>
                    </div>
                    <div class="row">
                        <section class="col col-6">
                            <label class="checkbox">
                                <input type="checkbox" name="iptWarrantyContactHiden" value="1" checked><i></i> Get Policy holder Contact
                            </label>
                        </section>
                    </div>
                    <div class="row divWarrantyContactHiden">
                        <section class="col col-6">
                            <label class="input">Policy Address</label>
                            <label class="input">
                                <input type="text" name="warranty_address1" maxlength="100">
                            </label>
                        </section>
                        <section class="col col-6">
                            <label class="input">Policy Address 2</label>
                            <label class="input">
                                <input type="text" name="warranty_address2" maxlength="100">
                            </label>
                        </section>
                    </div>
                    <div class="row divWarrantyContactHiden">
                        <section class="col col-6">
                            <label class="input">City</label>
                            <select name="warranty_city" class="city form-control" style="width:100%"></select>
                        </section>
                        <section class="col col-6">
                            <label class="input">State</label>
                            <select name="warranty_state" class="state form-control" style="width:100%"></select>
                        </section>
                        <section class="col col-6">
                            <label class="input">Postal Code</label>
                            <select name="warranty_postal_code" class="postal_code form-control" style="width:100%"></select>
                        </section>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Contract Amount</label>
                            <label class="input">
                                <input type="text" name="warranty_contract_amount" class="input-currency currency">
                            </label>
                        </section>
                        <section class="col col-6">
                            <label class="input">Charity of Choice</label>
                            <select name="warranty_charity_of_choice" class="form-control" style="width:100%"></select>
                        </section>
                    </div>
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Closing Date</label>
                            <label class="input">
                                <input type="date" name="warranty_closing_date" class="form-control datepicker">
                            </label>
                        </section>
                    </div>
                    <div class="row">
                        <section class="col col-6">
                            <label class="checkbox"><input type="checkbox" name="warranty_eagle" class="iptWarrantyCheckHashtag" value="1"><i></i> Eagle</label>
                            <label class="checkbox"><input type="checkbox" name="warranty_renewal" class="iptWarrantyCheckHashtag" value="1"><i></i> Renewal</label>
                        </section>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Product</label>
                            <select class="form-control" title="The product has class warranty" style="width:100%" id="product_warranty_order_id" name="product_warranty_order_id" placeholder="Search order"></select>
                            <p></p>
                        </section>
                    </div>
                    <div class="row">
                        <section class="padding-10">
                            <table class="table table-tripped" id="" style="width:100%">
                                <thead>
                                    <tr>
                                        <th>Quantity</th>
                                        <th>SKU</th>
                                        <th>Name</th>
                                        <th class="hidden"></th>
                                        <th>Class</th>
                                        <th class="text-right">Price</th>
                                        <th class="text-right">Line Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="" id="iptProductQuantity"></td>
                                        <td class="" id="iptProductSKU"></td>
                                        <td class="" id="iptProductName"></td>
                                        <td class="" id="iptProductClass"></td>
                                        <td class="text-right" id="iptProductPrice"></td>
                                        <td class="text-right" id="iptProductDiscountLineTotal"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="row">
                        <section class="col col-12">
                            <label class="input">A La Carte</label>
                        </section>
                        <section class="padding-10">
                            <p id="table_error"></p>
                            <table class="table" id="table_product_ordered" style="width:100%">
                                <thead>
                                    <tr>
                                        <th style="width:40px;" class="text-center">Quantity</th>
                                        <th style="width:80px;" class="text-center">SKU</th>
                                        <th>Name</th>
                                        <th class="hidden"></th>
                                        <th style="width:80px;" class="text-center">Class</th>
                                        <th style="width:80px;" class="text-right">Price</th>
                                        <th style="width:80px;" class="text-right">Line Total</th>
                                        <th style="width:25px;"></th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <hr>
                        </section>
                    </div>

                </fieldset>
                <fieldset>
                    <div class="row">
                        <div class="col col-6">
                            <section class="">
                                <label class="input">Discount Code</label>
                                <div class="input-group" style="display:block">
                                    <input type="text" id="warranty_discount_code" name="warranty_discount_code" class="form-control">
                                </div>
                            </section>
                            <section class="">
                                <label class="input"><i class="fa fa-list-alt"></i> Discount information</label>
                                <div id="discountDescription" style="width:100%"></div>
                            </section>
                        </div>
                        <div class="col col-6">
                            <div class="text-right bold col col-xs-7">
                                <div class="padding-5">Total:</div>
                                <div class="padding-5">Discount code:</div>
                                <div class="padding-5">Initial Fee:</div>
                                <div class="padding-5">Processing Fee:</div>
                                <div class="padding-5">Number of Payment:</div>
                                <div class="padding-5">Total Order</div>
                            </div>
                            <div class="text-right bold col col-5 col-xs-5">
                                <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_total_table">$ 0.00</div>
                                <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_discount_code">$ 0.00</div>
                                <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_init_fee">$ 0.00</div>
                                <div class="text-right" style="padding-top:5px; padding-bottom:5px;"><span class="text-right" id="_processing_fee">$ 0.00</span>/<span id="_circle_payment">month</span></div>
                                <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_period">1</div>
                                <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_total">$ 0.00</div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Salesman</label>
                            <select name="salesperson" id="salespersonId" class="warranty_salesman_id form-control" style="width:100%" placeholder="Add New"></select>
                        </section>
                    </div>
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Buyer Agent</label>
                            <div class="input-group">
                                <select name="warranty_buyer_agent_id" class="warranty_buyer_agent_id form-control" style="width:100%"></select>
                                <div class="input-group-btn padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_payer_type" value="2"> <i></i> Payee
                                    </label>
                                </div>
                                <div class="padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_submitter_type" value="2"><i></i> Submitter
                                    </label>
                                </div>
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-sm btn-primary btn-add-contact" data-select="warranty_buyer_agent_id" data-form="Real Estate Agent"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </section>
                        <section class="col col-6">
                            <label class="input">Seller Agent</label>
                            <div class="input-group">
                                <select name="warranty_seller_agent_id" class="warranty_seller_agent_id form-control" style="width:100%"></select>
                                <div class="input-group-btn padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_payer_type" value="3"> <i></i> Payee
                                    </label>
                                </div>
                                <div class="padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_submitter_type" value="3"><i></i> Submitter
                                    </label>
                                </div>
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-sm btn-primary btn-add-contact" data-select="warranty_seller_agent_id" data-form="Real Estate Agent"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Escrow</label>
                            <div class="input-group">
                                <select name="warranty_escrow_id" class="warranty_escrow_id form-control" style="width:100%"></select>
                                <div class="input-group-btn padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_payer_type" value="4"> <i></i> Payee
                                    </label>
                                </div>
                                <div class="padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_submitter_type" value="4"><i></i> Submitter
                                    </label>
                                </div>
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-sm btn-primary btn-add-contact" data-select="warranty_escrow_id" data-form="Title"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </section>
                        <section class="col col-6">
                            <label class="input">Mortgage</label>
                            <div class="input-group">
                                <select name="warranty_mortgage_id" class="warranty_mortgage_id form-control" style="width:100%"></select>
                                <div class="input-group-btn padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_payer_type" value="5"> <i></i> Payee
                                    </label>
                                </div>
                                <div class="padding-5">
                                    <label class="radio">
                                        <input type="radio" name="warranty_submitter_type" value="5"><i></i> Submitter
                                    </label>
                                </div>
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-sm btn-primary btn-add-contact" data-select="warranty_mortgage_id" data-form="Mortgage"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </section>
                    </div>
                </fieldset>

                <fieldset>
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Payment Subscription</label>
                            <select class="form-control" title="Payment Subscription" id="subscription" name="subscription" style="width:100%" placeholder="Subcsription">
                                <option value='""' selected="">None</option>
                                <option value="1">Month to Month Billing</option>
                                <option value="2">Quarter Billing</option>
                                <option value="3">Yearly Billing</option>
                            </select>
                            <p></p>
                        </section>

                        <section class="col col-6">
                            <label class="input">Payment Type</label>
                            <select class="form-control" name="payment_type" id="payment_type" style="width:100%" title="payment type" id="" name="">
                                <option value="check">Check</option>
                                <option value="bank to bank">Bank to bank</option>
                                <option value="cash">Cash</option>
                                <option value="credit">Credit</option>
                            </select>
                            <p></p>
                        </section>
                    </div>
                </fieldset>
                <footer>
                    <button type="button" id="btnSubmitWarranty" class="btn btn-primary">Submit</button>
                    <button type="button" id="btnBackWarranty" class="btn btn-default" onclick="window.history.back();">Back</button>
                    <div class="pull-right skip_email">
                        <label class="checkbox">
                            <input type="checkbox" name="skip_email"><i></i> Skip Email
                        </label>
                    </div>
                </footer>
            </form>
        </div>
    </div>
</div>

<div class="clearfix" style="height:60px;"></div>
<input type="hidden" id="init_fee">
<input type="hidden" id="processing_fee">
<input type="hidden" id="period">

<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="add_new_contact">
    <div class="modal-dialog" style="min-width:60%;">
        <div class="modal-content">
            <?php include 'contact.php'; ?>
        </div>
    </div>
</div>

<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="add_new_company">
    <div class="modal-dialog" style="min-width:60%;">
        <div class="modal-content">
            <?php include 'company.php'; ?>
        </div>
    </div>
</div>
<!-- FOOTER -->
<?php
include("inc/footer.php");
?>
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/bootstrap/bootstrap.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/jquery-validate/jquery.validate.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/jquery-cookie/jquery.cookie.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/select2/select2.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/bloodhound/bloodhound.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/typeahead/typeahead.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/tags-input-autocomplete/src/jquery.tagsinput-revisited.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/intlTelInput-jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/intlTelInput.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/utils.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/3.1.62/jquery.inputmask.bundle.js"></script>

<script src="<?= ASSETS_URL ?>/js/plugin/bootstrap-timepicker/bootstrap-timepicker.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/clockpicker/clockpicker.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/x-editable/moment.min.js"></script>

<script src="<?= ASSETS_URL ?>/js/your_script.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/validator.plus.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL  ?>/js/script/call-ajax.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/state.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/validator.plus.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-append.js"></script>
<script src="<?= ASSETS_URL ?>/js/u/contact.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/util/control-select2.js" type="text/javascript"></script>

<script src="<?= ASSETS_URL ?>/js/script/select-template.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/script/billing/billing.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/state.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/u/purchase-price.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/u/purchase.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/u/purchase-home-warranty.js" type="text/javascript"></script>

<script src="<?= ASSETS_URL; ?>/js/script/company-form.js"></script>
<script src="<?= ASSETS_URL; ?>/js/u/company.js"></script>

<script type="text/javascript">
    $('input, select, textarea').mousedown(function() {
        $('#message_form').hide(200);
    });
</script>
</body>

</html>