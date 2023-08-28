<?php

use SmartUI\Components\SmartForm;

$pageTitle = 'Warranty Form';
$warranty_form = 'WarrantyForm';

$contact_form = 'ContactForm';
$contact_current_form = 'add';

require_once 'inc/init.php';

$onlyView = false;

$current_form = 'add';
if (hasIdParam()) $current_form = 'edit';

?>
<section id="widget-grid" class="">
	<div class="row">

		<!-- NEW WIDGET START -->
		<article class="col-sm-12 col-md-12 col-lg-12">
			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
				<header>
					<h2 style="width:auto">Warranty Form <?= hasIdParam() ? ': <span id="_display_header"></span>' : '' ?> </h2>
					<?php
					$help_form = 'warranty';
					include 'btn-help.php';
					unset($help_form);
					?>
					<?php
					if (hasIdParam()) {
						echo '<div class="jarviswidget-ctrls" id="warranty-form-control" role="menu">
								<a href="./#ajax/warranty-form-addnew.php" class="btn-primary have-text"><i class="fa fa-plus"></i> Create new Warranty</a>
							</div>';
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

					
					<!-- Error states for elements -->
					<?php if (canAddForm('OrderForm')) { ?>
					<div class="modal" style="display:none; margin:auto; max-height:600px;" id="add_order_modal">
						<div class="modal-dialog" style="min-width:60%;">
							<div class="modal-content">
								<?php include('order-form.php') ?>
							</div>
						</div>
					</div>
					<?php } ?>
					<form class="smart-form" id="warranty_form" method="post">
						<div id="message_form" role="alert" style="display:none"></div>
						<input type="hidden" name="ID" value="">
						<input type="hidden" name="warranty_update_date" value="">
						<input type="hidden" name="warranty_update_by" value="<?= $_SESSION['userID'] ?>">
						<input type="hidden" name="warranty_create_by" value="<?= $_SESSION['userID'] ?>">
						<input type="hidden" name="warranty_serial_number" id="warranty_serial_number">
						<fieldset>
							<div class="row">
								<?php if (hasPermission($warranty_form, 'warranty_buyer_id', 'show')) { 	?>
								<section class="col col-6">
									<label class="input">Home Buyer: <span id="view_contact_buyer"></span></label>
									<div class="input-group" style="display:flex">
										<select name="warranty_buyer_id" class="warranty_buyer_id form-control" style="width:100%" placeholder="Home Buyer" <?= hasPermission($warranty_form, 'warranty_buyer_id', $current_form) ? '' : ' disabled' ?>></select>
										<div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_payer_type" value="1"><i></i> Payee
											</label>
										</div>
										<div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_submitter_type" value="1"><i></i> Submitter
											</label>
										</div>
									</div>
								</section>
								<?php }
								if (hasIdParam()) { ?>
								<section class="col col-6">
									<label class="input">Type</label>
									<label class="input">
										<input type="text" class="form-control input-readonly" name="warranty_type_name" readonly>
									</label>
								</section>
								<?php } ?>
							</div>
							<div class="row">
								<?php
								echo SmartForm::print_field('contact_address', SmartForm::FORM_FIELD_CHECKBOX, array(
									'items' => array(
										array('id' => 'contact_address', 'label' => 'Get Policy Holder contact', 'value' => true, 'checked' => true, 'disabled' => false)
									),

								), 6, true, hasPermission($warranty_form, 'warranty_buyer_id', 'show'));
								?>
							</div>
						</fieldset>
						<?php
						$addressField = array(
							'form' => $warranty_form,
							'current_form' => $current_form,
							'address1_label' => 'Policy Address',
							"address1" => "warranty_address1",
							'address2_label' => 'Policy Address 2',
							"address2" => "warranty_address2",
							"postal_code" => "warranty_postal_code",
							"city" => "warranty_city",
							"state" => "warranty_state",
						);
						include 'address_field.php';
						unset($addressField);
						?>
						<fieldset class="warranty_agent">
							<?php if (hasPermission($warranty_form, 'warranty_salesman_id', 'show')) { ?>
							<div class="row">
								<section class="col col-6">
									<span class="hidden" id="view_contact_salesman"></span>
									<label class="input">Salesman: <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_salesman_id" data-name="contact-form" data-param="sid"></span></label>
									<select name="warranty_salesman_id" id="salespersonId" class="warranty_salesman_id form-control" style="width:100%" placeholder="Salesman" <?= hasPermission($warranty_form, 'warranty_salesman_id', $current_form) ? '' : ' readonly' ?>></select>
									<p></p>
								</section>
								<section class="col col-6" style="margin-top:20px">
									<label class="checkbox">
										<input type="checkbox" name="sales_corporate" id="sales_corporate" value="0" ><i></i> Corporate
									</label>
								</section>
							</div>
							<?php } ?>
							<div class="row">
								<?php if (hasPermission($warranty_form, 'warranty_buyer_agent_id', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Buyer Agent: <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_buyer_agent_id" data-name="contact-form" data-param="id"></span></label>
									<div class="input-group" style="display:flex;">
										<select name="warranty_buyer_agent_id" class="warranty_buyer_agent_id form-control" <?= hasPermission($warranty_form, 'warranty_buyer_agent_id', $current_form) ? '' : ' disabled' ?>></select>
										<div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_payer_type" value="2"><i></i> Payee
											</label>
										</div>
										<div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_submitter_type" value="2"><i></i> Submitter
											</label>
										</div>
										<button type="button" class="btn btn-sm btn-primary btn-add-contact no-border-radius" data-select="warranty_buyer_agent_id" data-form="Real Estate Agent"><i class="fa fa-plus"></i></button>
									</div>
									<!-- <section class="col col-6"> -->
									<label class="input">&nbsp;</label>
									<!-- </section> -->
								</section>
								<?php } ?>
								<?php if (hasPermission($warranty_form, 'warranty_seller_agent_id', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Seller Agent: <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_seller_agent_id" data-name="contact-form" data-param="id"></span></label>
									<div class="input-group" style="display:flex">
										<select name="warranty_seller_agent_id" class="warranty_seller_agent_id form-control" <?= hasPermission($warranty_form, 'warranty_seller_agent_id', $current_form) ? '' : ' disabled' ?>></select>
										<div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_payer_type" value="3"><i></i> Payee
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
								<?php if (hasPermission($warranty_form, 'warranty_escrow_id', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Escrow: <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_escrow_id" data-name="contact-form" data-param="id"></span></label>
									<div class="input-group" style="display:flex">
										<select name="warranty_escrow_id" class="warranty_escrow_id form-control" <?= hasPermission($warranty_form, 'warranty_escrow_id', $current_form) ? '' : ' disabled' ?>></select>
										<div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_payer_type" value="4"><i></i> Payee
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
								<?php if (hasPermission($warranty_form, 'warranty_mortgage_id', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Mortgage: <span class="link_to" data-view="link_to" data-form="#warranty_form" data-control="warranty_mortgage_id" data-name="contact-form" data-param="id"></span></label>
									<div class="input-group" style="display:flex">
										<select name="warranty_mortgage_id" class="warranty_mortgage_id form-control" <?= hasPermission($warranty_form, 'warranty_mortgage_id', $current_form) ? '' : ' disabled' ?>></select>
										<div class="padding-5">
											<label class="radio">
												<input type="radio" name="warranty_payer_type" value="5"><i></i> Payee
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
								<?php if (hasPermission($warranty_form, 'warranty_contract_amount', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Contract Amount: </label>
									<label class="input">
										<input name="warranty_contract_amount" class="input-currency currency" <?= hasPermission($warranty_form, 'warranty_contract_amount', $current_form) ? '' : ' readonly' ?>>
									</label>
								</section>
								<?php } ?>
								<?php if (hasPermission($warranty_form, 'warranty_charity_of_choice', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Charity of Choice: </label>
									<select name="warranty_charity_of_choice" class="form-control" style="width:100%" <?= hasPermission($warranty_form, 'warranty_charity_of_choice', $current_form) ? '' : ' readonly' ?>></select>
								</section>
								<?php } ?>
							</div>
							<div class="row">
								<?php if (hasPermission($warranty_form, 'warranty_start_date', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Start Date: </label>
									<label class="input">
										<input type="date" name="warranty_start_date" class="form-control datepicker" <?= hasPermission($warranty_form, 'warranty_start_date', $current_form) ? '' : ' readonly' ?>>
									</label>
								</section>
								<?php } ?>
								<?php if (hasPermission($warranty_form, 'warranty_end_date', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">End Date: </label>
									<label class="input">
										<input type="date" name="warranty_end_date" class="form-control datepicker" <?= hasPermission($warranty_form, 'warranty_end_date', $current_form) ? '' : ' readonly' ?>>
									</label>
								</section>
								<?php } ?>
							</div>
							<div class="row">
								<?php if (hasPermission($warranty_form, 'warranty_closing_date', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Closing Date: </label>
									<label class="input">
										<input type="date" name="warranty_closing_date" class="form-control datepicker" <?= hasPermission($warranty_form, 'warranty_closing_date', $current_form) ? '' : ' readonly' ?>>
									</label>
								</section>
								<?php } ?>
							</div>
							<div class="row">
								<?php if (hasPermission($warranty_form, 'warranty_eagle', 'show') || hasPermission($warranty_form, 'warranty_renewal', 'show')) {  ?>
								<section class="col col-6">
									<?php if (hasPermission($warranty_form, 'warranty_eagle', 'show')) { ?>

									<label class="checkbox"><input type="checkbox" name="warranty_eagle" value="1" <?= hasPermission($warranty_form, 'warranty_eagle', $current_form) ? '' : ' readonly' ?>><i></i> Eagle</label>
									<?php }
										if (hasPermission($warranty_form, 'warranty_renewal', 'show')) { ?>

									<label class="checkbox"><input type="checkbox" name="warranty_renewal" value="1" <?= hasPermission($warranty_form, 'warranty_renewal', $current_form) ? '' : ' readonly' ?>><i></i> Renewal</label>
									<?php } ?>
								</section>
								<?php } ?>
							</div>
						</fieldset>
						<fieldset>
							<div class="row">
								<?php if (hasPermission($warranty_form, 'warranty_order_id', 'show')) {  ?>
								<section class="col col-6">
									<label class="input">Order ID: </label>
									<select multiple class="form-control" title="The order has warranty product class" id="warranty_order_id" name="warranty_order_id" placeholder="Search order" style="width:100%" <?= hasPermission($warranty_form, 'warranty_order_id', $current_form) ? '' : ' disabled' ?>></select>
									<p></p>
								</section>
								<?php } ?>
								<?php if (canAddForm('OrderForm')) { ?>
								<section class="col col-xs-2" style="margin-top:19px; margin-left:-19px;">
									<button class="btn btn-sm btn-primary" data-toggle="modal" title="Add new order" data-target="#add_order_modal" type="button"><i class="fa fa-plus"></i> Add Order</button>
								</section>
								<?php } ?>
							</div>
							<p></p>
							<?php $_page = 'warranty-form';
							include('product-table.php') ?>
						</fieldset>


						<!-- Claim limit -->
						<?php
						if (hasIdParam()) {
							include('warranty-form.claim.php');
						}
						?>

						<?php $pos = strrpos($_SERVER['REQUEST_URI'], "warranty-form");
						if ($pos > 0) {
							$type_note = 'warranty';
							$can_add_note = false;
							if (isset($warranty_current_permission) && $warranty_current_permission == true) {
								$can_add_note = true;
							}
							include('notes.php');
						} ?>
						<fieldset>
							<div class="row">
								<?php if (hasPermission($warranty_form, 'warranty_inactive', 'show')) {  ?>
								<section class="col col-6">
									<label class="checkbox"><input type="checkbox" name="warranty_inactive" value="1" <?= hasPermission($warranty_form, 'warranty_inactive', $current_form) ? '' : ' disabled' ?>><i></i> Inactive</label>
								</section>
								<?php } ?>
							</div>
						</fieldset>
						<?php 
						/*
						<div class="row">
							<section class="col col-xs-12">
								<div class="pull-right padding-10">
									<button type="button" class="btn buttonPaymentWarranty btn-lg btn-primary collapsible" data-id="1" disabled>Payment</button>
								</div>
							</section>
						</div>
						*/
						?>
						<footer>
				
							<?php if (hasPermission($warranty_form, 'btnBackWarranty', 'show')) {  ?>
							<button type="button" id="btnBackWarranty" class="btn btn-default" onclick="window.history.back();">Back</button>
							<?php } ?>
							<?php if (hasPermission($warranty_form, 'btnSubmitWarranty', 'show')) {
								echo '<button type="button" id="btnSubmitWarranty" class="btn btn-primary">Submit</button>';
							}
							if(!hasIdParam()){
								echo '<div class="pull-right skip_email">
									<label class="checkbox">
										<input type="checkbox" name="skip_email"><i></i> Skip Email
									</label>
								</div>';
							}
							?>
						</footer>
					</form>
					<?php if ($pos > 0) {
						//include('warranty-payment.php');
					} ?>
				</div>
			</div>
		</article>
	</div>

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
									<div class="input-group-btn">
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
</section>
<script src="<?= ASSETS_URL ?>/js/util/control-select2.js"></script>
<script src="<?= ASSETS_URL; ?>/js/plugin/clockpicker/clockpicker.min.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/validator.plus.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL; ?>/js/script/state.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/note.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/product-table.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL; ?>/js/script/select-template.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL; ?>/js/util/select-link.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL; ?>/js/script/warranty-form.claim.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL; ?>/js/script/warranty.js" type="text/javascript"></script>

<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-phone.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-append.js"></script>
<script src="<?= ASSETS_URL; ?>/js/script/contact/contact-form.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL; ?>/js/script/warranty-edit-contact.js" type="text/javascript"></script>

<script type="text/javascript">
	$('input, select, textarea').mousedown(function() {
		$('#message_form').hide(200);
	});

	$('.btnAddClaimWarranty').click(function() {
		var w = screen.width - 200 < 800 ? screen.width - 200 : 800,
			h = screen.height - 100 < 500 ? screen.height - 100 : 500;
		var left = (screen.width / 2) - (w / 2);
		var top = (screen.height / 2) - (h / 2);
		var claimWindow = window.open(host2 + '#ajax/claim-form.php?warrantyID=' + $('[name=ID]').val() + '&contactid=' + $('[name="warranty_buyer_id"]').val() + '&contactname=' + $('[name="warranty_buyer_id"] option:selected').text(), 'Add Claim', 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left + ', titlebar=0, location=0');

		claimWindow.onload = function(){
         claimWindow.document.getElementById('header').remove();
         claimWindow.document.getElementById('shortcut').remove();
         claimWindow.document.getElementById('ribbon').remove();
         claimWindow.document.getElementById('left-panel').remove();
         claimWindow.document.getElementById('content').setAttribute('style', 'width:100%;');
         claimWindow.document.getElementById('main').setAttribute('style', 'margin-left:0px;');
      }

		claimWindow.onbeforeunload = function() {
			if (window.claimDataForward) {
				var _appendWarrantyClaim = new WarrantyClaim($('[name=ID]').val());
				_appendWarrantyClaim.appendList(window.claimDataForward);
			}
		}
	});
</script>

<?php if (hasIdParam() && $current_form==true) { ?>
<script>new ControlPage('#warranty-form-control');</script>
<?php } ?>