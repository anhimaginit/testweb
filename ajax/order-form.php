<?php
$order_form = 'OrderForm';

require_once 'inc/init.php';

$_authenticate->checkFormPermission($order_form);

$operation_order = (getID() ? 'edit' : 'add');
$order_current_permission = strrpos($_SERVER['REQUEST_URI'] , 'order-form')>0;
?>
<section id="widget-grid" class="">
<div class="row">

	<!-- NEW WIDGET START -->
	<article class="col-sm-12 col-md-12 col-lg-12">

		<!-- Widget ID (each widget will need unique ID)-->
		<div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
			<header>
				<h2 style="width:auto">Order Form <?= hasIdParam() && $order_current_permission==true ? 'edit: <span id="heading_title_id"></span>' : '' ?></h2>
				<?php 
            $help_form = 'order';
            include 'btn-help.php';
            unset($help_form);
				?>
				<?php 
				if(getID()){
					if($order_current_permission==true){ 
						echo '<div class="jarviswidget-ctrls" id="order-form-control" role="menu">
								<a href="./#ajax/order-form.php" class="jarviswidget-toggle-btn btn-primary have-text"><i class="fa fa-plus"></i> Create new Order</a>
							</div>';
					}
				} 
				?>
			</header>
			<!-- widget div-->
			<div class="jarviswidget-body" style="max-width:100%">

				<!-- end widget edit box -->
				
				<?php 
				$canAddContact = canAddForm('ContactForm') && basename($_SERVER['PHP_SELF']) =='order-form.php';
				if($canAddContact && basename($_SERVER['PHP_SELF'])=='order-form.php'){?>

				<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="add_contact_modal">
					<div class="modal-dialog"  style="min-width:60%;">
						<div class="modal-content">
							<?php include('contact-form.php')?>
						</div>
					</div>
				</div>

				<?php } ?>
				<div class="row" id="pane_link_to_warranty"></div>
				<div class="row" id="pane_link_to_invoice"></div>
				<form class="smart-form" id="order_form" method="POST">
					<div id="message_form" role="alert" style="display:none"></div>
					<fieldset>
						<div class="row">
							<input type="hidden" name="warranty" value="0">
							<input type="hidden" name="createTime" value="<?= date('Y-m-d');?>">
							<input type="hidden" name="order_id" value="">
							<input type="hidden" name="updateTime" value="<?= date('Y-m-d')?>">
							<input type="hidden" name="total" value="0" readonly="true">
							<input type="hidden" name="payment" value="0" readonly="true">
							<input type="hidden" name="balance" value="0" readonly="true">
							<section class="col col-6">
								<label class="input">Order Title:</label>
								<input type="text" class="form-control" name="order_title"<?= hasPermission($order_form, 'order_title', $operation_order ) ? '' : ' readonly' ?>>
							</section>
							<section class="col col-xs-<?= $canAddContact ? 5 : 6?>">
								<label class="input">Bill To: <span class="link_to" data-view="link_to" data-form="#order_form" data-control="bill_to" data-name="contact-form" data-param="id"></span></label>
								<select name="bill_to" class="form-control select2" id="bill_to_ID" style="width:100%" <?= hasPermission($order_form, 'bill_to', $operation_order ) ? '' : ' disabled' ?>></select>
								<p></p>
							</section>

							<?php if($canAddContact && basename($_SERVER['PHP_SELF'])=='order-form.php'){ ?>

							<section class="col col-xs-1" style="margin-top:19px; margin-left:-22px;">
								<button class="btn btn-sm btn-primary" id="btnAddContactOrder1" data-toggle="modal" data-target="#add_contact_modal" type="button" title="Create new contact"><i class="fa fa-plus"></i></button>
							</section>

							<?php } ?>
						</div>
					</fieldset>
					<fieldset>
						<div class="row">
							<section class="padding-10">
								<?php include 'order-form.productstable.php'; ?>
							</section>
						</div>
						<?php if(hasIdParam()){ echo '
						<div class="row">
							<div class="text-right">
								<button type="button" class="btn btn-lg btn-primary btnPaymentOrder">Payment</button>
							</div>
						</div>
						'; } ?>
						<div class="row" id="discount_pane">
								
						</div>
						<div class="row">
								<section class="col col-6">
									<label class="input">Discount code:</label>
									<label class="input">
										<input name="discount_code">
										<b class="tooltip tooltip-top-right"><i class="fa fa-barcode txt-color-teal"></i> Enter your discount code</b>
									</label>
								</section>
						</div>
					</fieldset>
					<?php include 'billing.php';  ?>
					<fieldset>
						<div class="row">
							<section class="col col-6">
								<label class="input">Salesperson: <span class="link_to" data-view="link_to" data-form="#order_form" data-control="salesperson" data-name="contact-form" data-param="id"></span></label>
								<select name="salesperson" id="salespersonId" class="form-control select2" style="width:100%" <?= hasPermission($order_form, 'salesperson', $operation_order ) ? '' : ' disabled' ?>><option value="">Select Salesperson</option></select><i></i>
								<p></p>
							</section>
							<section class="col col-6">
								<label class="input">Note:</label>
								<textarea name="note" rows="4" class="form-control"></textarea>
							</section>
						</div>
					</fieldset>
					<?php
						if(basename($_SERVER['PHP_SELF'])=='order-form.php'){$type_note = 'order'; $can_add_note = false; if($order_current_permission==true){ $can_add_note = true; }  ; include('notes.php');} ?>
					<footer>
					<?php 
					if (hasPermission($order_form, 'btnBackOrder', 'show' )) {
						echo('<button type="button" class="btn btn-default" id="btnBackOrder" form="order_form">Back</button>');
					}
					if (hasPermission($order_form, 'btnSubmitOrder', 'show' )) {
						echo('<button type="submit" class="btn btn-primary" id="btnSubmitOrder" onmousedown="setAction(`submit`)" form="order_form">Submit</button>');
					}
					if (hasPermission($order_form, 'btnForwardOrderToWarranty', 'show')) {
						echo('<button type="submit" class="btn btn-default" id="btnForwardOrderToWarranty" onmousedown="setAction(`forward`)"  form="order_form">Forward to Warranty</button>');
					}
					?>
					</footer>
				</form>
			</div>
		</div>
	</article>
</div>
</section>
<script src="./js/script/billing/billing.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/select-template.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/util/select-link.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/util/control-select2.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/order-discount.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/script/order-form.products.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/script/note.js" type="text/javascript"></script>
<script src="<?= ASSETS_URL ?>/js/script/order-form.js" type="text/javascript"></script>
<?php if (getID() && $order_current_permission==true) { ?>
<script>new ControlPage('#order-form-control');</script>
<?php } ?>