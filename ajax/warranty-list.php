<?php require_once "inc/init.php";
?>
<section id="widget-grid" class="">
	<?php $_typesearch = "warranty";
	include('search_message.php'); ?>
	<!-- row -->
	<div class="row">

		<!-- NEW WIDGET START -->
		<article class="col-sm-12 col-md-12 col-lg-12">

			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget" data-widget-colorbutton="true" data-widget-editbutton="true">
				<!-- <section><a href="./contact-form.php" class="btn btn-default"><i class="fa fa-2x fa-plus text-primary"></i></a></section> -->
				<header>
					<h2><i class="fa fa-table"></i> Warranty list </h2>
					<?php if (canAddForm('WarrantyForm')) { ?>

						<a href="./#ajax/warranty-form-addnew.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Warranty</a>
					<?php } ?>
				</header>
				<div role="content">
					<!-- widget edit box -->


					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->
					</div>
					<!-- end widget edit box -->

					<!-- widget content -->
					<div class="widget-body">
						<?php $event = 'loadTable';
						include('search-table.php'); ?>
						<table id="table_warranty" class="table table-responsive table-bordered table-striped table-hover" width="100%">
							<thead>
								<tr>
									<th class="hasinput"> <input type="text" name="warranty_order_id" class="form-control" placeholder="Filter Order" /> </th>
									<th class="hasinput"> <input type="text" name="buyer" class="form-control" placeholder="Filter Buyer" /> </th>
									<th class="hasinput"> <input type="text" name="warranty_address1" class="form-control" placeholder="Filter Address" /> </th>
									<th class="hasinput"> <input type="text" name="warranty_type" class="form-control" placeholder="Filter Type" /> </th>
									<th class="hasinput"> <input type="text" name="salesman" class="form-control" placeholder="Filter Salesman" /> </th>
									<th class="hasinput"> <input type="text" name="warranty_creation_date" class="form-control" placeholder="Filter Create Date" /> </th>
								</tr>
								<tr>
									<th>Order</th>
									<th>Buyer</th>
									<th>Address</th>
									<th>Type</th>
									<th>Salesman</th>
									<th>Create&nbsp;Date</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
							<tfoot></tfoot>
						</table>
					</div>
				</div>
			</div>
			<!-- end widget -->

		</article>
	</div>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/script/warranty-list.js"></script>