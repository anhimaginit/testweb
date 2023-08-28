<?php require_once 'inc/init.php';
include 'dashboard-chart.php';
$dashboardForm = 'Dashboard';

?>

<style>
.select2-selection__choice[title="Open"]{
	border-color: var(--info);
	background-color: var(--info);
}
.select2-selection__choice[title="In Progress"]{
	border-color: var(--success);
	background-color: var(--success);
}

.select2-selection__choice[title="Close"]{
	background-color: var(--light);
}

.select2-selection__choice[title="Done"]{
	border-color: var(--warning);
	background-color: var(--warning);
}

</style>
<!-- widget grid -->
<section id="widget-grid" class="">
	<!-- row -->

	<div class="row">
		<?php if (hasPermission($dashboardForm, 'task', 'show')) { ?>
			<article class="col-sm-12">
				<div class="jarviswidget" id="wid-task" data-widget-colorbutton="false" data-widget-editbutton="false">
					<header>
						<span class="widget-icon"> <i class="fa fa-group"></i></span>
						<h2>Tasks</h2>
					</header>
					<div class="">
						<div class="widget-body widget-hide-overflow widget-body-overflowxy">
							<table id="table_task_priority" class="table table-bordered" width="100%">
								<caption class="text-black">Priority Tasks</caption>
								<tbody></tbody>
							</table>
							<table id="table_task_group" class="table table-bordered" width="100%">
								<caption class="text-black">Assigned Tasks</caption>
								<tbody></tbody>
							</table>
							<table id="table_task_assignTo" class="table table-bordered" width="100%">
								<caption class="text-black">Tasks assigned To</caption>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
			</article>
		<?php }
		if (hasPermission($dashboardForm, 'order', 'show')) {
			?>
			<article class="col-sm-12">

				<!-- new widget -->
				<div class="jarviswidget" id="wid-order" data-widget-colorbutton="false" data-widget-editbutton="false">

					<header>
						<span class="widget-icon"> <i class="fa fa-shopping-cart"></i> </span>
						<h2>Order List</h2>
					</header>

					<!-- widget div-->
					<div>
						<!-- end widget edit box -->

						<div class="widget-body widget-body-overflowxy">
							<div class="row">

							</div>
							<div class="padding-10">
								<div class="row text-right">
									<label> <i class="fa fa-2x fa-stop danger" style="color: var(--danger); border:1px solid gray;"></i> Open </label>
									<label> <i class="fa fa-2x fa-stop warning" style="color: var(--warning); border:1px solid gray;"></i> Payment </label>
									<label> <i class="fa fa-2x fa-stop success" style="color: var(--success); border:1px solid gray;"></i> Paid for </label>

								</div>
							</div>
							<!-- content goes here -->
							<table id="table_order" class="table table-striped table-bordered table-hover" style="width:100%">
								<thead>
									<tr>
										<th></th>
										<th class="hasinput"><input class="form-control" name="bill" placeholder="Filter Warranty Holder"></th>
										<th class="hasinput"><input class="form-control" name="salesperson" placeholder="Filter Salesperson"></th>
										<th class="hasinput"><input class="form-control" name="total" placeholder="Filter Total"></th>
										<th class="hasinput"><input class="form-control" name="payment" placeholder="Filter Payment"></th>
										<th class="hasinput"><input class="form-control" name="balance" placeholder="Filter Balance"></th>
									</tr>
									<tr>
										<th>#&nbsp;Order</th>
										<th>Warranty&nbsp;Holder</th>
										<th>Salesperson</th>
										<th>Total</th>
										<th>Payment</th>
										<th>Balance</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
							<!-- end content -->

						</div>

					</div>
					<!-- end widget div -->
				</div>
				<!-- end widget -->

			</article>
		<?php }
		if (hasPermission($dashboardForm, 'warranty', 'show')) { ?>
			<article class="col-sm-12">
				<!-- new widget -->
				<div class="jarviswidget" id="wid-warranty" data-widget-editbutton="false" data-widget-colorbutton="false">

					<header>
						<span class="widget-icon"> <i class="fa fa-wrench txt-color-white"></i> </span>
						<h2> Warranty List </h2>

					</header>

					<!-- widget div-->
					<div>
						<!-- end widget edit box -->

						<div class="widget-body widget-body-overflowxy">
							<!-- content goes here -->
							<table id="table_warranty" class="table table-striped table-bordered table-hover" style="width:100%">
								<thead>
									<tr>
										<th></th>
										<th class="hasinput"><input class="form-control" name="b_name" placeholder="Filter Order ID"></th>
										<th class="hasinput"><input class="form-control" name="s_name" placeholder="Filter Buyer"></th>
										<th class="hasinput"><input class="form-control" name="total" placeholder="Filter Salesman"></th>
										<th class="hasinput"><input class="form-control" name="payment" placeholder="Filter Start Date"></th>
										<th class="hasinput"><input class="form-control" name="balance" placeholder="Filter End Date"></th>
										<th class="hasinput"><input class="form-control" name="balance" placeholder="Filter Address"></th>
									</tr>
									<tr>
										<th>&nbsp;&nbsp;&nbsp;ID&nbsp;&nbsp;&nbsp;</th>
										<th>Order ID</th>
										<th>Buyer</th>
										<th>Salesman</th>
										<th>Start Date</th>
										<th>End Date</th>
										<th>Address</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
							<!-- end content -->
						</div>

					</div>
					<!-- end widget div -->
				</div>
				<!-- end widget -->
			</article>



		<?php }
		if (hasPermission($dashboardForm, 'invoice', 'show')) { ?>

			<article class="col-sm-12">
				<!-- new widget -->

				<div class="jarviswidget" id="wid-invoice" data-widget-editbutton="false" data-widget-colorbutton="false">

					<header>
						<span class="widget-icon"> <i class="fa fa-barcode txt-color-white"></i> </span>
						<h2> Invoice List </h2>

					</header>

					<!-- widget div-->
					<div>
						<!-- end widget edit box -->

						<div class="widget-body widget-body-overflowxy">
							<!-- content goes here -->
							<table id="table_invoice" class="table table-striped table-bordered table-hover" style="width:100%">
								<thead>
									<tr>
										<th class="hasinput"><input class="form-control" name="invoiceid" placeholder="Filter ID"></th>
										<th class="hasinput"><input class="form-control" name="customer_name" placeholder="Filter Customer"></th>
										<th class="hasinput"><input class="form-control" name="sale_name" placeholder="Filter Salesperson"></th>
										<th class="hasinput"><input class="form-control" name="order_id" placeholder="Filter Order"></th>
										<th class="hasinput"><input class="form-control" name="creatTime" placeholder="Filter Order"></th>
										<th class="hasinput"><input class="form-control" name="total" placeholder="Filter Total"></th>
										<th class="hasinput"><input class="form-control" name="payment" placeholder="Filter Price"></th>
										<th class="hasinput"><input class="form-control" name="balance" placeholder="Filter Balance"></th>

									</tr>
									<tr>
										<th>#</th>
										<th>Customer</th>
										<th>Salesperson</th>
										<th>Order</th>
										<th>Create Time</th>
										<th>Total</th>
										<th>Payment</th>
										<th>Balance</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
							<!-- end content -->
						</div>

					</div>
					<!-- end widget div -->
				</div>

				<!-- end widget -->

			</article>
		<?php }
		if (hasPermission($dashboardForm, 'claim', 'show')) { ?>
			<article class="col-sm-12">
				<div class="jarviswidget" id="wid-claim" data-widget-editbutton="false" data-widget-colorbutton="false">

					<header>
						<span class="widget-icon"> <i class="fa fa-barcode txt-color-white"></i> </span>
						<h2> Claim List </h2>

					</header>
					<div>
						<div class="widget-body widget-body-overflowxy">
						<div>
							<span class="pull-right mg-t-10">
								Status:
								<select name="status" class="pointer" style="min-width:450px" id="claim_select_status" multiple="true">
									<option value="&nbsp;">&nbsp;</option>
									<?php
									$claim_status = [];
									if (!isset($_SESSION['settingPage']->claim_status)) {
										$_SESSION['settingPage']->claim_status = ['Not Assign', 'Open', 'In Progress', 'Approved', 'Assigned','Done',  'Deny', 'Close', 'Cancel'];
										$claim_status = $_SESSION['settingPage']->claim_status;
									} else if (gettype($_SESSION['settingPage']->claim_status) == 'string') {
										$claim_status = json_decode($_SESSION['settingPage']->claim_status);
									}
	
									foreach ($claim_status as $status) {
										echo '<option value="' . $status . '">' . $status . '</option>';
									}
	
									?>
								</select>
							</span>
						</div>
							<table id="table_claim" class="table table-striped table-bordered table-hover" style="width:100%">
								<thead>
									<tr>
										<th class="hasinput"><input type="text" class="form-control" placeholder="Search ID"></th>
										<th class="hasinput hidden"><input type="text" class="form-control" placeholder="Search Created By"></th>
										<th class="hasinput"><input type="text" class="form-control" placeholder="Search Customer"></th>
                                        <th class="hasinput"><input type="text" class="form-control" placeholder="Search Description"></th>
										<th class="hasinput"><input type="text" class="form-control" placeholder="Search Assigned To"></th>
										<th class="hasinput"><input type="text" class="form-control" placeholder="Search Status"></th>
										<th class="hasinput"><input type="text" class="form-control" placeholder="Search Service Fee"></th>
										<th class="hasinput"><input type="text" class="form-control" placeholder="Search Paid Out"></th>
										<th class="hasinput"><input type="text" class="form-control" placeholder="Search Start Date"></th>
									</tr>
									<tr>
										<th>ID</th>
										<th class="hidden">Created By</th>
										<th>Customer</th>
                                        <th>Description</th>
										<th>Assigned To</th>
										<th>Status</th>
										<th>Service Fee</th>
										<th>Paid Out</th>
										<th>Start Date</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</article>
		<?php }
		if (hasPermission($dashboardForm, 'group', 'show')) {
			include 'dashboard.group.php';
		} ?>

		<div class="clearfix"></div>

	</div>

	<!-- end row -->

</section>
<!-- end widget grid -->
<?php $objectChange = '';
// echo '<script> window.dashboard_access = ' . json_encode($_SESSION['form_access']) . '</script>';
if (hasPermission($dashboardForm, 'warranty', 'show')) {
	$objectChange .= '_WarrantyDashBoardList.init();';
	echo '<script src="' . ASSETS_URL . '/js/script/dashboard-warranty-list.js"></script>';
}

if (hasPermission($dashboardForm, 'claim', 'show')) {
	$objectChange .= '_claimDashBoardList.init();';
	echo '<script src="' . ASSETS_URL . '/js/script/dashboard-claim-list.js"></script>';
}

// if(hasPermission($dashboardForm, 'contact', 'show')){
// 	$objectChange .='_ContactDashBoardList.init();';
// 	echo '<script src="'.ASSETS_URL.'/js/script/dashboard-contact-list.js"></script>';
// }
if (hasPermission($dashboardForm, 'order', 'show')) {
	$objectChange .= '_OrderDashBoardList.init();';
	echo '<script src="' . ASSETS_URL . '/js/script/dashboard-order-list.js"></script>';
}
if (hasPermission($dashboardForm, 'group', 'show') || hasPermission($dashboardForm, 'task', 'show')) {
	$objectChange .= '_dashBoardGroup.loadGroup();';
	echo '<script src="' . ASSETS_URL . '/js/script/dashboard-group.js"></script>';
}
if (hasPermission($dashboardForm, 'invoice', 'show')) {
	$objectChange .= '_InvoiceListDashBoardList.init();';
	echo '<script src="' . ASSETS_URL . '/js/script/dashboard-invoice-list.js"></script>';
}
?>
<script src="<?= ASSETS_URL ?>/js/script/dashboard-chart.js"></script>
<script>
	//
	/**
	 * load dasboard folow day time
	 * change vale in select button .date_length load agian all tables
	 * $('.date_length').val(); // day limit
	 */
	$('select[name=date_length]').change(function(e) {
		var length = this.value;
		if (length == 'custom') {
			$('#custom_date').show();
			return;
		} else {
			$('#custom_date').hide();
			$('input[name=start_date]').val('');
			$('input[name=end_date]').val("<?= date('Y-m-d'); ?>");
			_dashBoardChart.createChart();
			<?php echo $objectChange ?>
		}
	}).click(function(e) {
		var length = this.value;
		if (length == 'custom') {
			$('#custom_date').show();
			return;
		}
	});

	function customSubmit() {
		<?php echo $objectChange ?>
        _dashBoardChart.createChart();
		$('#custom_date').hide();
	}
</script>