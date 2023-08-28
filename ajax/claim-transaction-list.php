<?php

require_once 'inc/init.php';

$_typesearch = "claim";
include 'search_message.php';
?>
<section id="widget-grid" class="">
<div class="row">
	<!-- NEW WIDGET START -->
	<article class="col-sm-12 col-md-12 col-lg-12">

		<!-- Widget ID (each widget will need unique ID)-->
		<div class="jarviswidget" data-widget-editbutton="true">
			<header>
				<h2><i class="fa fa-table"></i> Claim list </h2>
				<a href="./#ajax/claim-form.transaction.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create New Transaction</a>
			</header>
			<div>
			<!-- widget edit box -->


				<div class="jarviswidget-editbox">
					<!-- This area used as dropdown edit box -->
				</div>
				<!-- end widget edit box -->

				<!-- widget content -->
				<div class="widget-body">
					<?php $event = 'search'; include 'search-table.php';?>
					<table id="table_claim_transaction" class="table table-responsive table-bordered" width="100%">
						<thead>
							<tr>
								<th class="hasinput"></th>
								<th class="hasinput"><input type="text" class="form-control" placeholder="Filter Person"></th>
								<th class="hasinput" colspan="5"><input type="text" class="form-control" placeholder="Filter Transaction"></th>	
								<th class="hasinput"><input type="text" class="form-control" placeholder="Filter Date Time"></th>
							</tr>
							<tr>
								<th>#</th>
								<th style="max-width:100px;">Person</th>
								<th class="col-2">Item Name</th>
								<th>Original</th>
								<th>Current</th>
								<th>Available</th>
								<th style="max-width:50px;">Claim</th>
								<th>Create Date</th>
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
<!-- PAGE RELATED PLUGIN(S) -->
<script src="<?php echo ASSETS_URL; ?>/js/script/claim/transaction-list.js"></script>
