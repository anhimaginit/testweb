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
					<?php echo '<a href="./#ajax/claim-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create New Claim</a>'; ?>
				</header>
				<div>
					<!-- widget edit box -->


					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->
					</div>
					<!-- end widget edit box -->

					<!-- widget content -->
					<div class="widget-body">
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
						<?php $event = 'search';
						include 'search-table.php'; ?>

						<table id="table_claim" class="table table-responsive table-bordered table-hover" width="100%">
							<thead></thead>
							<tbody></tbody>
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
<script src="<?php echo ASSETS_URL; ?>/js/script/claim/claim-list.js"></script>