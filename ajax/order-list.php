<?php require_once 'inc/init.php'; 
$_typesearch = "order";
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
               <h2><i class="fa fa-table"></i> Order list </h2>
					<?php if(canAddForm('OrderForm')){ ?>

               <a href="./#ajax/order-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Order</a>
					<?php }?>
				</header>
				<div>
					<div class="jarviswidget-editbox">
					</div>
					<div class="widget-body">
						<?php $event = 'loadTable'; include('search-table.php');?>
						<table id="table_order" class="table table-striped table-bordered table-hover" width="100%">
							<thead>
								<tr>
									<th class="hasinput"><input class="form-control" name="order_title" placeholder="Title"></th></th>
									<th class="hasinput"><input class="form-control" name="b_name" placeholder="Bill"></th>
									<th class="hasinput"><input class="form-control" name="s_name" placeholder="Salesperson"></th>
									<th class="hasinput"><input class="form-control" name="total" placeholder="Total"></th>
									<th class="hasinput"><input class="form-control" name="payment" placeholder="Payment"></th>
									<th class="hasinput"><input class="form-control" name="balance" placeholder="Balance"></th>
									<th class="hasinput"><input class="form-control" name="balance" placeholder="Waranty"></th>
									<th class="hasinput hidden"><input class="form-control" name="balance" placeholder="Invoice Date"></th>
									<th class="hasinput"><input class="form-control" name="balance" placeholder="Create Date"></th>
								</tr>
								<tr>
									<th class="col-md-2"> #&nbsp;Order </th>
									<th class="col-md-2">Bill To</th>
									<th class="col-md-2">Salesperson</th>
									<th>Total</th>
									<th>Payment</th>
									<th>Balance</th>
									<th>Warranty</th>
									<th class="hidden">Invoice Date</th>
									<th>Create Date</th>
								</tr>
							</thead>
							<tbody>
                     </tbody>
						</table>
						<div class="text-right" style="margin-right:15px;"><ul class="pagination"></ul></div>
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
<script src="<?php echo ASSETS_URL; ?>/js/script/order-list.js"></script>