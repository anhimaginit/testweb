<?php require_once 'inc/init.php';
$_typesearch = "group";
include('search_message.php');
?>
<style>
	.userName {
		padding-left: 5px;
		padding-right: 5px;
		border-radius: 2px;
	}
</style>
<section id="widget-grid" class="">
	<div class="row">
		<script src="<?= ASSETS_URL ?>/js/plugin/gojs/release/go.js"></script>
		<!-- NEW WIDGET START -->
		<article class="col-sm-12 col-md-12 col-lg-12">

			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget" data-widget-colorbutton="true" data-widget-editbutton="true">
				<header>
					<h2><i class="fa fa-table"></i> Group list </h2>
					<a href="./#ajax/group.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Group</a>
				</header>
				<div>
					<!-- widget edit box -->
					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->
					</div>
					<!-- end widget edit box -->

					<!-- widget content -->
					<div class="widget-body">
						<?php $event = 'loadTable';
						include('search-table.php'); ?>
						<table id="table_group" class="table table-bordered" style="width:100%">
							<thead>
								<tr>
									<th></th>
									<th class="hasinput"><input class="form-control" placeholder="Filter Unit"></th>
									<th class="hasinput"><input class="form-control" placeholder="Filter Group"></th>
									<th class="hasinput"><input class="form-control" placeholder="Filter Role"></th>
									<th class="hasinput"><input class="form-control" placeholder="Filter Member"></th>
									<th class="hasinput"><input class="form-control" placeholder="Filter Parent Group"></th>
									<th class="hasinput"><input class="form-control" placeholder="Filter Parent"></th>
									<th></th>
								</tr>
								<tr>
									<th>ID</th>
									<th>Unit</th>
									<th>Group</th>
									<th>Role</th>
									<th>Member</th>
									<th>Parent Group</th>
									<th>Parent</th>
									<th></th>
								</tr>
							</thead>
							<tbody></tbody>
							<tfoot></tfoot>
						</table>
					</div>
					<div class="row">
						<div class="col col-xs-12">
							<div id="hierachy_pane" style="width:100%;height:400px;"></div>
						</div>
						<?php if (isSuperAdmin()) { ?>
							<div class="col col-xs-6">
								<button type="button" class="btn btn-default export_sale">Export Sales Diagram</button>
								<div id="hierachy_pane_sales" style="width:100%;height:300px;"></div>
							</div>
							<div class="col col-xs-6">
								<button type="button" class="btn btn-default export_affiliate">Export Affiliate Diagram</button>
								<div id="hierachy_pane_affiliate" style="width:100%;height:300px;"></div>
							</div>
							<div class="col col-xs-6">
								<button type="button" class="btn btn-default export_vendor">Export Vendor Diagram</button>
								<div id="hierachy_pane_vendor" style="width:100%;height:300px;"></div>
							</div>
							<div class="col col-xs-6">
								<button type="button" class="btn btn-default export_policy">Export Policy Holder Diagram</button>
								<div id="hierachy_pane_policy" style="width:100%;height:300px;"></div>
							</div>
							<div class="col col-xs-6">
								<button type="button" class="btn btn-default export_employee">Export Employee Diagram</button>
								<div id="hierachy_pane_employee" style="width:100%;height:300px;"></div>
							</div>
							<div class="col col-xs-6">
								<button type="button" class="btn btn-default export_customer">Export Customer Diagram</button>
								<div id="hierachy_pane_customer" style="width:100%;height:300px;"></div>
							</div>
						<?php } ?>
					</div>
					<?php
					?>
				</div>
			</div>


		</article>
	</div>
</section>
<script>
	<?php
	$departments = json_decode(file_get_contents(ASSETS_URL . '/data/contact-type.json'));
	array_pop($departments);
	echo 'window.department = ' . json_encode($departments);
	?>
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/group/diagram-group.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/group/group-list.js"></script>
