<?php

require_once 'inc/init.php';

$_typesearch = "claim";
include 'search_message.php';
?>
<style>
.select2-selection__choice[title="Open"]{
	border-color: var(--dark);
	background-color: var(--light);
}
.select2-selection__choice[title="In Process"]{
	border-color: var(--info);
	background-color: var(--info);
}

.select2-selection__choice[title="Close"]{
	background-color: var(--danger);
}

.select2-selection__choice[title="Cancel"]{
	background-color: var(--danger);
}

.select2-selection__choice[title="Done"]{
	border-color: var(--warning);
	background-color: var(--warning);
}
#table_ticket tbody>tr>td p{
	margin: 0 0;
}
</style>
<section id="widget-grid" class="">
	<div class="row">
		<article class="col-sm-12 col-md-12 col-lg-12">
			<div class="jarviswidget" data-widget-editbutton="true">
				<header>
					<h2><i class="fa fa-table"></i> Ticket List </h2>
					<?php
					echo '<a href="./#ajax/ticket-new.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create New Ticket</a>';
					?>
				</header>
				<div>
					<!-- widget edit box -->
					<!-- end widget edit box -->
					
					<!-- widget content -->
					<div class="widget-body">
						<div class="">
							<span class="pull-right mg-t-10">
								Status:
								<select name="status" class="pointer" style="min-width:460px" id="help_select_status" multiple="true">
									<option value="&nbsp;">&nbsp;</option>
									<option value="open" selected>Open</option>
									<option value="inprocess" selected>In Process</option>
									<option value="done">Done</option>
									<option value="close">Close</option>
									<option value="cancel">Cancel</option>
								</select>
							</span>
						</div>
						<?php $event = 'search';
						include 'search-table.php'; ?>
						<table id="table_ticket" class="table table-responsive table-bordered table-hover" width="100%">
							<thead>
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
	<div class="clearfix"></div>
</section>
<!-- PAGE RELATED PLUGIN(S) -->

<script src="<?php echo ASSETS_URL; ?>/js/script/help/ticket-list.js"></script>