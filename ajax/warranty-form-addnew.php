<?php
$pageTitle = 'Warranty Form';
$warranty_form = 'WarrantyForm';
$contact_form = 'ContactForm';
$contact_current_form = 'add';

require_once 'inc/init.php';

$_authenticate->checkFormPermission($warranty_form);

use \SmartUI\Components\SmartForm;
?>

<section id="widget-grid" class="">
    <div class="row">
        <article class="col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
                <header>
                    <h2 style="width:auto">New Warranty <?= hasIdParam() ? ': <span id="_display_header"></span>' : '' ?> </h2>
                    <?php
                    $help_form = 'warranty-new';
                    include 'btn-help.php';
                    unset($help_form);
                    ?>
                    <?php
                    if (hasIdParam()) {
                        if (canAddForm('WarrantyForm')) {
                            echo ('<a href="./#ajax/warranty-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Warranty</a>');
                        }
                    }
                    ?>
                </header>
                <div>
                    <div class="jarviswidget-editbox">
                    </div>
                    <!-- end widget edit box -->

                    <div id="message_form" role="alert" style="display:none"></div>
                    <!-- Error states for elements -->
                    <form class="smart-form" id="warranty_form" method="post">
                        <div id="message_form_duplicate" role="alert" style="display:none"></div>
                        <input type="hidden" name="ID" value="">
                        <input type="hidden" name="warranty_update_date" value="">
                        <input type="hidden" name="warranty_update_by" value="<?= $_SESSION['userID'] ?>">
                        <input type="hidden" name="warranty_create_by" value="<?= $_SESSION['userID'] ?>">
                        <input type="hidden" name="warranty_serial_number" id="warranty_serial_number">
                        <input type="hidden" id="order_id" value="">
                        <input type="hidden" id="warranty_ID" value="">
                        <input type="hidden" name="total" value="0" readonly="true">
                        <input type="hidden" name="payment" value="0" readonly="true">
                        <input type="hidden" name="balance" value="0" readonly="true">
                        <input type="hidden" id="init_fee">
                        <input type="hidden" id="processing_fee">
                        <input type="hidden" id="period">
                        <input type="hidden" id="warranty_order_id">
                        <fieldset>
                            <?php if (hasPermission($warranty_form, 'warranty_buyer_id', 'show')) { ?>
                                <div class="row">
                                    <section class="col col-6">
                                        <label class="input">Policy Holder <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_buyer_id" data-name="contact-form" data-param="id"></span></label>
                                        <div class="input-group" style="display:flex">
                                            <select name="bill_to" id="billToId" class="warranty_buyer_id form-control" style="width:100%" placeholder="Home Buyer" <?= hasPermission($warranty_form, 'warranty_buyer_id', 'add') ? '' : ' disabled' ?>></select>
                                            <div class="padding-5">
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
                            <?php } ?>
                            <?php if (hasPermission($warranty_form, 'warranty_address1', 'show')) { ?>
                                <div class="row">
                                    <section class="col col-6">
                                        <label class="checkbox">
                                            <input type="checkbox" name="iptWarrantyContactHiden" value="1" checked><i></i> Get Policyholder Contact
                                        </label>
                                    </section>
                                </div>
                            <?php } ?>

                            <div class="row divWarrantyContactHiden">
                                <?php if (hasPermission($warranty_form, 'warranty_address1', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Policy Address</label>
                                        <label class="input">
                                            <input type="text" name="warranty_address1" maxlength="100" <?= hasPermission($warranty_form, 'warranty_address1', 'add') ? '' : ' readonly' ?>>
                                        </label>
                                    </section>
                                <?php } ?>
                                <?php if (hasPermission($warranty_form, 'warranty_address2', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Policy Address 2</label>
                                        <label class="input">
                                            <input type="text" name="warranty_address2" maxlength="100" <?= hasPermission($warranty_form, 'warranty_address2', 'add') ? '' : ' readonly' ?>>
                                        </label>
                                    </section>
                                <?php } ?>
                            </div>
                            <div class="row divWarrantyContactHiden">
                                <?php if (hasPermission($warranty_form, 'warranty_city', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">City</label>
                                        <select name="warranty_city" class="city form-control" style="width:100%" <?= hasPermission($warranty_form, 'warranty_city', 'add') ? '' : ' disabled' ?>></select>
                                    </section>
                                <?php } ?>
                                <?php if (hasPermission($warranty_form, 'warranty_state', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">State</label>
                                        <select name="warranty_state" class="state form-control" style="width:100%" <?= hasPermission($warranty_form, 'warranty_state', 'add') ? '' : ' disabled' ?>></select>
                                    </section>
                                <?php } ?>
                                <?php if (hasPermission($warranty_form, 'warranty_postal_code', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Postal Code</label>
                                        <select name="warranty_postal_code" class="postal_code form-control" style="width:100%" <?= hasPermission($warranty_form, 'warranty_postal_code', 'add') ? '' : ' disabled' ?>></select>
                                    </section>
                                <?php } ?>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div class="row">
                                <?php if (hasPermission($warranty_form, 'warranty_contract_amount', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Contract Amount</label>
                                        <label class="input">
                                            <input type="text" name="warranty_contract_amount" class="input-currency currency" <?= hasPermission($warranty_form, 'warranty_contract_amount', 'add') ? '' : ' readonly' ?>>
                                        </label>
                                    </section>
                                <?php } ?>
                                <?php if (hasPermission($warranty_form, 'warranty_charity_of_choice', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Charity of Choice</label>
                                        <select name="warranty_charity_of_choice" class="form-control" style="width:100%" <?= hasPermission($warranty_form, 'warranty_charity_of_choice', 'add') ? '' : ' disabled' ?>></select>
                                    </section>
                                <?php } ?>
                            </div>
                            <div class="row">
                                <?php if (hasPermission($warranty_form, 'warranty_closing_date', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Closing Date</label>
                                        <label class="input">
                                            <input type="date" name="warranty_closing_date" class="form-control datepicker" <?= hasPermission($warranty_form, 'warranty_closing_date', 'add') ? '' : ' readonly' ?>>
                                        </label>
                                    </section>
                                <?php } ?>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div class="row">
                                <section class="col col-6">
                                    <?php if (hasPermission($warranty_form, 'warranty_eagle', 'show')) { ?>
                                        <label class="checkbox"><input type="checkbox" name="warranty_eagle" class="iptWarrantyCheckHashtag" value="1" <?= hasPermission($warranty_form, 'warranty_eagle', 'add') ? '' : ' disabled' ?>><i></i> Eagle</label>
                                        <?php } ?><?php if (hasPermission($warranty_form, 'warranty_renewal', 'show')) { ?>
                                        <label class="checkbox"><input type="checkbox" name="warranty_renewal" class="iptWarrantyCheckHashtag" value="1" <?= hasPermission($warranty_form, 'warranty_renewal', 'add') ? '' : ' disabled' ?>><i></i> Renewal</label>
                                    <?php } ?>
                                </section>
                            </div>
                            <?php if (hasPermission($warranty_form, 'warranty_product_warranty_order_id', 'show')) { ?>
                                <div class="row">
                                    <section class="col col-6">
                                        <label class="input">Product</label>
                                        <select class="form-control" title="The product has class warranty" style="width:100%" id="product_warranty_order_id" name="product_warranty_order_id" placeholder="Search order" <?= hasPermission($warranty_form, 'warranty_product_warranty_order_id', 'add') ? '' : ' disabled' ?>></select>
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
                            <?php } ?>
                        </fieldset>
                        <fieldset>
                            <?php if (hasPermission($warranty_form, 'warranty_aLaCarte', 'show')) { ?>
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
                            <?php } ?>
                        </fieldset>
                        <fieldset>
                            <div class="row">
                                <div class="col col-6">
                                    <?php if (hasPermission($warranty_form, 'warranty_discount_number', 'show')) { ?>
                                        <section class="">
                                            <label class="input">Discount Code</label>
                                            <div class="input-group" style="display:block">
                                                <input type="text" id="warranty_discount_code" name="warranty_discount_code" class="form-control" <?= hasPermission($warranty_form, 'warranty_discount_number', 'add') ? '' : ' disabled' ?>>
                                            </div>
                                        </section>
                                        <section class="">
                                            <div id="discountDescription" style="width:100%"></div>
                                        </section>
                                    <?php } ?>
                                </div>
                                <div class="col col-6">
                                    <div class="text-right bold col col-xs-7">
                                        <div class="padding-5">Total:</div>
                                        <div class="padding-5">Discount code:</div>
                                        <div class="padding-5">Initial Fee:</div>
                                        <div class="padding-5">Processing Fee:</div>
                                        <div class="padding-5">Number of Payment:</div>
                                        <div class="padding-5">Total Order</div>
                                        <div class="padding-5 _contract_overage">Contract Overage:</div>
                                        <div class="padding-5">Grand Total</div>
                                    </div>
                                    <div class="text-right bold col col-5 col-xs-5">
                                        <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_total_table">$ 0.00</div>
                                        <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_discount_code">$ 0.00</div>
                                        <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_init_fee">$ 0.00</div>
                                        <div class="text-right" style="padding-top:5px; padding-bottom:5px;"><span class="text-right" id="_processing_fee">$ 0.00</span>/<span id="_circle_payment">month</span></div>
                                        <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_period">1</div>
                                        <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_total">$ 0.00</div>
                                        <div class="text-right _contract_overage" style="padding-top:5px; padding-bottom:5px;" id="_contract_overage">$ 0.00</div>
                                        <div class="text-right" style="padding-top:5px; padding-bottom:5px;" id="_grand_total">$ 0.00</div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <div class="row">
                                <?php if (hasPermission($warranty_form, 'warranty_salesman_id', 'show')) { ?>

                                    <section class="col col-6">
                                        <label class="input">Salesman <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="salesperson" data-name="contact-form" data-param="sid"></span></label>
                                        <select name="salesperson" id="salespersonId" class="warranty_salesman_id form-control" style="width:100%" <?= hasPermission($warranty_form, 'warranty_salesman_id', 'add') ? '' : ' disabled' ?>></select>
                                    </section>
                                    <section class="col col-6" style="margin-top:20px">
                                        <label class="checkbox">
                                            <input type="checkbox" name="sales_corporate" id="sales_corporate" value="0" ><i></i> Corporate
                                        </label>
                                    </section>
                                <?php } ?>
                            </div>
                            <div class="row">
                                <?php if (hasPermission($warranty_form, 'warranty_buyer_agent_id', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Buyer Agent <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_buyer_agent_id" data-name="contact-form" data-param="id"></span></label>
                                        <div class="input-group" style="display:flex">
                                            <select name="warranty_buyer_agent_id" class="warranty_buyer_agent_id form-control" <?= hasPermission($warranty_form, 'warranty_buyer_agent_id', 'add') ? '' : ' disabled' ?>></select>
                                            <div class="padding-5">
                                                <label class="radio">
                                                    <input type="radio" name="warranty_payer_type" value="2"> <i></i> Payee
                                                </label>
                                            </div>
                                            <div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_submitter_type" value="2"><i></i> Submitter
											</label>
										</div>
                                            <button type="button" class="btn btn-sm btn-primary btn-add-contact no-border-radius" data-select="warranty_buyer_agent_id" data-form="Real Estate Agent"><i class="fa fa-plus"></i></button>
                                        </div>
                                    </section>
                                <?php } ?>
                                <?php if (hasPermission($warranty_form, 'warranty_seller_agent_id', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Seller Agent <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_saller_agent_id" data-name="contact-form" data-param="id"></span></label>
                                        <div class="input-group" style="display:flex">
                                            <select name="warranty_seller_agent_id" class="warranty_seller_agent_id form-control" <?= hasPermission($warranty_form, 'warranty_seller_agent_id', 'add') ? '' : ' disabled' ?>></select>
                                            <div class="padding-5">
                                                <label class="radio">
                                                    <input type="radio" name="warranty_payer_type" value="3"> <i></i> Payee
                                                </label>
                                            </div>
                                            <div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_submitter_type" value="3"><i></i> Submitter
											</label>
										</div>
                                            <button type="button" class="btn btn-sm btn-primary btn-add-contact no-border-radius" data-select="warranty_seller_agent_id" data-form="Real Estate Agent"><i class="fa fa-plus"></i></button>
                                        </div>
                                    </section>
                                <?php } ?>
                            </div>
                            <div class="row">
                                <?php if (hasPermission($warranty_form, 'warranty_escrow_id', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Escrow <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_escrow_id" data-name="contact-form" data-param="id"></span></label>
                                        <div class="input-group" style="display:flex">
                                            <select name="warranty_escrow_id" class="warranty_escrow_id form-control" <?= hasPermission($warranty_form, 'warranty_escrow_id', 'add') ? '' : ' disabled' ?>></select>
                                            <div class="padding-5">

                                                <label class="radio">
                                                    <input type="radio" name="warranty_payer_type" value="4"> <i></i> Payee
                                                </label>
                                            </div>
                                            <div class="padding-5">
                                                <label class="radio">
                                                    <input type="radio" name="warranty_submitter_type" value="4"><i></i> Submitter
                                                </label>
                                            </div>
                                            <button type="button" class="btn btn-sm btn-primary btn-add-contact no-border-radius" data-select="warranty_escrow_id" data-form="Title"><i class="fa fa-plus"></i></button>
                                        </div>
                                    </section>
                                <?php } ?>
                                <?php if (hasPermission($warranty_form, 'warranty_mortgage_id', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Mortgage <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_mortgage_id" data-name="contact-form" data-param="id"></span></label>
                                        <div class="input-group" style="display:flex">
                                            <select name="warranty_mortgage_id" class="warranty_mortgage_id form-control" <?= hasPermission($warranty_form, 'warranty_mortgage_id', 'add') ? '' : ' disabled' ?>></select>
                                            <div class="padding-5">
                                                <label class="radio">
                                                    <input type="radio" name="warranty_payer_type" value="5"> <i></i> Payee
                                                </label>
                                            </div>
                                            <div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_submitter_type" value="5"><i></i> Submitter
											</label>
										</div>
                                            <button type="button" class="btn btn-sm btn-primary btn-add-contact no-border-radius" data-select="warranty_mortgage_id" data-form="Mortgage"><i class="fa fa-plus"></i></button>
                                        </div>
                                    </section>
                                <?php } ?>
                            </div>
                        </fieldset>

                        <fieldset>
                            <div class="row">
                                <?php if (hasPermission($warranty_form, 'warranty_subscription', 'show')) { ?>
                                    <section class="col col-6">
                                        <label class="input">Payment Subscription</label>
                                        <select class="form-control" title="Payment Subscription" id="subscription" name="subscription" style="width:100%" placeholder="Subcsription" <?= hasPermission($warranty_form, 'warranty_subscription', 'add') ? '' : ' disabled' ?>>
                                            <option value='""' selected="">None</option>
                                            <option value="1">Month to Month Billing</option>
                                            <option value="2">Quarter Billing</option>
                                            <option value="3">Yearly Billing</option>
                                        </select>
                                        <p></p>
                                    </section>
                                <?php } ?>
                                <?php /*if (hasPermission($warranty_form, 'warranty_payer_typement_type', 'show')) { 
                                ?>
                                <!-- <section class="col col-6">
                                        <label class="input">Payment Type</label>
                                        <select class="form-control" name="payment_type" id="payment_type" style="width:100%" title="payment type" <?= hasPermission($warranty_form, 'warranty_payer_typement_type', 'add') ? '' : ' disabled' ?>>
                                            <option value="check">Check</option>
                                            <option value="bank to bank">Bank to bank</option>
                                            <option value="cash">Cash</option>
                                            <option value="credit">Credit</option>
                                        </select>
                                        <p></p>
                                    </section> -->
                                <?php // } */
                                ?>
                            </div>
                        </fieldset>
                        <?php $pos = strrpos($_SERVER['REQUEST_URI'], "warranty-form");
                        if ($pos > 0) {
                            include('notes.php');
                            /*
                            <div class="row">
                                <section class="col col-xs-12">
                                    <div class="pull-right padding-10">
                                        <button type="button" class="btn buttonPaymentWarranty btn-lg btn-primary collapsible" data-id="1" disabled>Payment</button>
                                    </div>
                                </section>
                            </div>
                            */
                        } ?>


                        <footer>
                            <?php if (hasPermission($warranty_form, 'btnSubmitWarranty', 'show')) { ?>
                                <button type="button" id="btnSubmitWarranty" class="btn btn-primary">Submit</button>
                            <?php } ?>
                            <?php if (hasPermission($warranty_form, 'btnBackWarranty', 'show')) { ?>
                                <button type="button" id="btnBackWarranty" class="btn btn-default" onclick="window.history.back();">Back</button>
                            <?php } ?>
                            <div class="pull-right skip_email">
                                <label class="checkbox">
                                    <input type="checkbox" name="skip_email"><i></i> Skip Email
                                </label>
                            </div>
                        </footer>
                    </form>
                    <?php if ($pos > 0) {
                        //include('warranty-payment.php');
                    } ?>
                </div>
            </div>
        </article>
    </div>
</section>

<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="add_new_contact">
    <div class="modal-dialog" style="min-width:60%;">
        <div class="modal-content">
            <div id="message_form_contact" role="alert" style="display:none"></div>
            <form class="smart-form" id="contact_form" method="post">
                <input type="hidden" name="ID" value="">
                <input type="hidden" name="create_by" value="<?= (isset($_SESSION['userID']) ? $_SESSION['userID'] : '') ?>">
                <input type="hidden" name="send_to" value="">
                <input type="hidden" name="contact_update" value="">
                <input type="hidden" name="submit_by" value="<?= (isset($_SESSION['userID']) ? $_SESSION['userID'] : '') ?>">
                <input type="hidden" name="userID" readonly="true">
                <input type="checkbox" class="hidden" name="contact_type" value="Policy Holder" checked>
                <fieldset>
                    <div class="row">
                        <?= SmartForm::print_field('first_name', SmartForm::FORM_FIELD_INPUT, array(
                            'label' => 'First Name',
                            'class' => '"' . (!hasPermission($contact_form, 'first_name', $contact_current_form) ? ' readonly="true' : ''),
                        ), 6, true, hasPermission($contact_form, 'first_name', 'show')); ?>
                    </div>
                    <div class="row">
                        <?= SmartForm::print_field('middle_name', SmartForm::FORM_FIELD_INPUT, array(
                            'label' => 'Middle Name',
                            'class' => '"' . (!hasPermission($contact_form, 'middle_name', $contact_current_form) ? ' readonly="true' : ''),
                        ), 6, true, hasPermission($contact_form, 'middle_name', 'show')) ?>
                    </div>
                    <div class="row">
                        <?= SmartForm::print_field('last_name', SmartForm::FORM_FIELD_INPUT, array(
                            'label' => 'Last Name',
                            'class' => '' . (!hasPermission($contact_form, 'last_name', $contact_current_form) ? '" readonly="true' : ''),
                        ), 6, true, hasPermission($contact_form, 'last_name', 'show')) ?>
                    </div>
                    <div class="row">
                    <?php if (hasPermission($contact_form, 'company_name', 'show')) { ?>
                        <section class="col col-6">
                            <label class="input">Company Name</label>
                            <select name="company_name" class="form-control" style="width:100%" <?php (!hasPermission($contact_form, 'company_name', $contact_current_form) ? ' disabled="disabled' : '') ?>></select>
                        </section>
                        <div class="col-2 pull-left">
                            <div>
                                <div>&nbsp;</div>
                                <button type="button" id="btnAddCompanyContact" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#add_new_company">Add Company</button>
                            </div>
                        </div>
                    <?php } ?>
                    </div>
                    <div class="row">
                        <?= SmartForm::print_field('primary_email', SmartForm::FORM_FIELD_INPUT, array(
                            'label' => 'Email',
                            'type' => 'email',
                            'class' => (hasPermission($contact_form, 'primary_email', $contact_current_form) ? '' : '" readonly="true'),
                        ), 6, true, hasPermission($contact_form, 'primary_email', 'show')) ?>
                    </div>
                </fieldset>
                <?php include './contact-phone.php'; ?>
                <fieldset style="z-index: 1">
                    <div class="row">
                        <section class="col col-6">
                            <label class="input">Website</label>
                            <div class="input-group" style="display:flex">
                                <select id="url_protocol" class="form-control" style="width:68px;" <?= (!hasPermission($contact_form, 'primary_website', $contact_current_form) ? ' disabled' : '') ?>>
                                    <option value="http://">http://</option>
                                    <option value="https://">https://</option>
                                </select>
                                <input type="text" id="url_host" class="form-control" <?= (!hasPermission($contact_form, 'primary_website', $contact_current_form) ? ' disabled' : '') ?>>
                                <div class="input-group-btn" style="width:34px">
                                    <button type="button" id="btn_open_url" class="btn btn-sm btn-default" onclick="url_open()"><i class="fa fa-external-link text-success"></i></button>
                                </div>
                            </div>
                        </section>
                    </div>
                </fieldset>
                <?php
                $addressField = array(
                    'form' => $contact_form,
                    'current_form' => $contact_current_form,
                    "address1" => "primary_street_address1",
                    "address2" => "primary_street_address2",
                    "postal_code" => "primary_postal_code",
                    "city" => "primary_city",
                    "state" => "primary_state",
                );
                $form = 'ContactForm';
                include './address_field.php';
                unset($addressField); ?>

                <fieldset>
                    <div class="row">
                        <section class="col col-6">
                            <?php if (hasPermission($contact_form, 'contact_tags', $contact_current_form)) { ?>
                                <section class="">
                                    <label class="input">Tags</label>
                                    <input type="text" class="form-control" id="contact_tags" name="contact_tags" value="" <?= (hasPermission($contact_form, 'contact_tags', $contact_current_form) ? '' : 'readonly') ?>>
                                </section><?php } ?>
                            <?php if (hasPermission($contact_form, 'contact_notes', 'show')) { ?>
                                <label class="input">Notes</label>
                                <label class="textarea">
                                    <textarea name="contact_notes" rows="5" <?= (hasPermission($contact_form, 'contact_notes', $contact_current_form) ? '' : 'readonly') ?>></textarea>
                                </label>
                            <?php } ?>
                        </section>
                    </div>
                </fieldset>
                <footer>
                    <?php
                    if (hasPermission($contact_form, 'btnSubmitContact', 'show')) {
                        echo '<button type="submit" id="btnSubmitContact" class="btn btn-primary">Submit</button>';
                    }
                    // button Back
                    if (hasPermission($contact_form, 'btnBackContact', 'show')) {
                        echo '<button type="button" class="btn btn-default" data-dismiss="modal">Back</button>';
                    }
                    ?>
                </footer>
            </form>
        </div>
    </div>

</div>

<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="add_new_company">
    <div class="modal-dialog" style="min-width:60%;">
        <div class="modal-content">
            <?php include '../company.php'; ?>
        </div>
    </div>
</div>

<script src="<?= ASSETS_URL ?>/js/script/validator.plus.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL; ?>/js/script/state.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/note.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-append.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/contact/contact-form.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/util/control-select2.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/util/select-link.js" type="text/javascript"></script>

<script src="<?= ASSETS_URL ?>/js/script/select-template.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/script/billing/billing.js"></script>
<script src="<?= ASSETS_URL ?>/js/u/purchase-price.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/u/purchase.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/script/warranty-form-addnew.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL; ?>/js/script/warranty-edit-contact.js" type="text/javascript"></script>

<script src="<?= ASSETS_URL; ?>/js/script/company-form.js"></script>
<script src="<?= ASSETS_URL; ?>/js/u/company.js"></script>

<script type="text/javascript">
    $('input, select, textarea').mousedown(function() {
        $('#message_form').hide(200);
    });
</script>