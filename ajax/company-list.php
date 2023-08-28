<?php

require_once 'inc/init.php';

$_typesearch = "company";
include('search_message.php');
?>
<section id="widget-grid" class="">
<div class="row">
	<!-- NEW WIDGET START -->
	<article class="col-sm-12 col-md-12 col-lg-12">

		<!-- Widget ID (each widget will need unique ID)-->
		<div class="jarviswidget" data-widget-editbutton="true">
			<!-- <section><a href="./company-form.php" class="btn btn-default"><i class="fa fa-2x fa-plus text-primary"></i></a></section> -->
			<header>
				<h2><i class="fa fa-table"></i> Company list </h2>
				<?php if(canAddForm('CompanyForm')){ ?>
				<a href="./#ajax/company-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create New Company</a>
				<?php } ?>
			</header>
			<div>
			<!-- widget edit box -->


				<div class="jarviswidget-editbox">
					<!-- This area used as dropdown edit box -->
				</div>
				<!-- end widget edit box -->

				<!-- widget content -->
				<div class="widget-body">
					<?php $event = 'search'; include('search-table.php');?>
					<table id="table_company" class="table table-responsive table-striped table-bordered table-hover" width="100%">
						<thead>
							<tr>
								<th style="width:5%;"></th>
								<th class="hasinput">
									<input type="text" class="form-control" placeholder="Filter Name">
								</th>	<th class="hasinput">
									<input type="text" class="form-control" placeholder="Filter Address">
								</th>	<th class="hasinput">
                           <input type="text" class="form-control" placeholder="Filter Phone">
								</th>	<th class="hasinput">
                           <input type="text" class="form-control" placeholder="Filter City">
                        </th>	<th class="hasinput">
                           <input type="text" class="form-control" placeholder="Filter Email">
                        </th>	<th class="hasinput">
                           <input type="text" class="form-control"  placeholder="Filter Type">
                        </th>
							</tr>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Address</th>
								<th>Phone</th>
								<th>City</th>
								<th>Email</th>
								<th>Type</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<!-- end widget -->

	</article>
</div>
</section>
<!-- PAGE RELATED PLUGIN(S) -->
<script src="<?php echo ASSETS_URL; ?>/js/script/company-list.js"></script>