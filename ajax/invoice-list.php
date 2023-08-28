<?php 

require_once 'inc/init.php'; 
$_typesearch = "invoice";
include('search_message.php');
?>
<section id="widget-grid" class="">
	<!-- row -->
	<div class="row">

		<!-- NEW WIDGET START -->
		<article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget" data-widget-editbutton="false">
				<header>
               <h2><i class="fa fa-table"></i> Invoice list </h2>
					<?php if(canAddForm('InvoiceForm')){ ?>
					
               <a href="./#ajax/invoice-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Invoice</a>
					<?php } ?>
				</header>
				<div>
					<div class="jarviswidget-editbox">
					</div>
					<div class="widget-body">
						<?php $event = 'loadTable'; include('search-table.php');?>
						<table id="table_invoice" class="table table-striped table-bordered table-hover" width="100%">
							<thead>
                        <tr>
									<th class="hasinput"><input class="form-control" name="invoiceid" placeholder="Filter ID"></th>
									<th class="hasinput"><input class="form-control" name="customer_name"placeholder="Filter Customer"></th>
									<th class="hasinput"><input class="form-control" name="sale_name"placeholder="Filter Salesperson"></th>
									<th class="hasinput"><input class="form-control" name="order_id" placeholder="Filter Order"></th>
									<th class="hasinput"><input class="form-control" name="creatTime" placeholder="Filter Order"></th>
									<th class="hasinput"><input class="form-control" name="total" placeholder="Filter Total"></th>
									<th class="hasinput"><input class="form-control" name="payment" placeholder="Filter Price"></th>
								</tr>
								<tr>
									<th># Invoice</th>
									<th>Customer</th>
									<th>Salesperson</th>
									<th>Order</th>
									<th>Create Time</th>
									<th>Total</th>
									<th>Payment</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
					<!-- end widget content -->
				</div>
				<!-- end widget div -->
			</div>
			<!-- end widget -->
		</article>
	</div>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/script/pagination.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/invoice-list.js"></script>