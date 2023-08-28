<?php
require_once 'inc/init.php';
?>
<section id="widget-grid" class="">
   <?php $_typesearch = "task";
   include('search_message.php'); ?>
   <div class="row">
      <article class="col-sm-12 col-md-12 col-lg-12">
         <div class="jarviswidget" data-widget-colorbutton="true" data-widget-editbutton="true">
            <header>
               <h2><i class="fa fa-table"></i> New Tasks </h2>
            </header>
            <div role="content">
               <div class="jarviswidget-editbox"></div>
               <div class="widget-body">
                  <?php $event = 'loadTable';
                  include('search-table.php'); ?>
                  <div>
                  </div>
                  <div class="clearfix"></div>
                  <table id="table_task" class="table table-responsive table-bordered table-striped table-hover" width="100%">
                     <thead>
                        <tr>
                           <th></th>
                           <th class="hasinput"><input type="text" id="filter_name" class="form-control" placeholder="Filter Task Name"></th>
                           <th class="hasinput"><input type="text" class="form-control" placeholder="Filter Assign"></th>
                           <th class="hasinput"><input type="text" class="form-control" placeholder="Filter Customer"></th>
                           <th class="hasinput"><input type="text" class="form-control" placeholder="Action Set"></th>
                           <th class="hasinput"><input type="text" class="form-control" placeholder="Filter Status"></th>
                           <th class="hasinput"><input type="text" class="form-control" placeholder="Filter Due date"></th>
                           <th class="hasinput"><input type="text" class="form-control" placeholder="Filter Done date"></th>
                           <th class="hasinput"><input type="text" class="form-control" placeholder="Filter Time"></th>
                        </tr>
                        <tr>
                           <th>#</th>
                           <th>Task Name</th>
                           <th>Assign</th>
                           <th>Customer</th>
                           <th>Action Set</th>
                           <th>Status</th>
                           <th>Due date</th>
                           <th>Done date</th>
                           <th>Time</th>
                        </tr>
                     </thead>
                     <tbody></tbody>
                     <tfoot></tfoot>
                  </table>
               </div>
            </div>
         </div>
      </article>
   </div>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/script/task/task-new.js"></script>