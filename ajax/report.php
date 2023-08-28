<?php
include 'inc/init.php';
$form_report = hasParam('r') ?  ucwords(strtolower($_GET['r'])) : 'Contact';
?>
<style>
   table.dataTable thead>tr>th.hasinput {
      padding: unset !important;
   }
</style>
<link rel="stylesheet" href="<?= ASSETS_URL ?>/css/bootstrap-timepicker.css">
<div class=" bg-color-white">
   <div id="notify_report" style="display:none"></div>
   <div id="message_form" style="display:none"></div>
   <ul class="nav nav-tabs">
      <li class="active"><a data-toggle="tab" href="#search-tab">Search</a></li>
      <li><a data-toggle="tab" href="#miscCriteria-tab">Misc Criteria</a></li>
      <!-- <li><a data-toggle="tab" href="#customFields-tab">Custom Fields</a></li> -->
      <li><a data-toggle="tab" href="#columns-tab">Columns</a></li>
   </ul>
   <div class="loading-process padding-10" style="margin:auto; z-index:1000; position:relative; display:none; font-size:24px;">
      <img src="./img/ajax-loader.gif" width="50px" style="margin:auto"> Loading...
   </div>
   <div class="tab-content padding-10">
      <div id="search-tab" class="tab-pane fade in active">
         <h3>Filter <?= $form_report ?> Form</h3>
         <div class="">
            <form id="boxReport" class="smart-form">
            </form>
         </div>
         <div class="clearfix"></div>
      </div>
      <div id="miscCriteria-tab" class="tab-pane fade">
         <h3>Misc Criteria</h3>
         <div class="">
            <form id="miscCriteria" class="smart-form">
            </form>
         </div>
      </div>
      <div id="columns-tab" class="tab-pane fade ">
         <h3>Custom Display Data Table</h3>
         <div class="smart-form">
            <fieldset>
               <section class="col col-md-12 col-sm-12">
                  <select size="16" name="boxCustomColumns" class="" multiple style="width:100%"></select>
               </section>
               <div class="clearfix"></div>
            </fieldset>
         </div>
      </div>
   </div>
   <div class="clearfix"></div>
   <hr>
   <fieldset class="smart-form">
      <div>
         <div>
            <div style="">
               <span class="padding-10">
                  <label class=""><input type="checkbox" id="iptShowAllRows"><i></i> Show all</label>
               </span>
               <span class="padding-10">
                  <label>Number of rows: </label>
                  <select id="sltNumberOfRows" class="col-xs-0">
                     <option value="25" selected>25</option>
                     <option value="50">50</option>
                     <option value="100">100</option>
                     <option value="250">250</option>
                     <option value="500">500</option>
                  </select>
               </span>
               <span class="padding-10">
                  <label> Filter rows:</label>
                  <input type="text" id="iptFilterTable" placeholder="Search this table ">
               </span>
               <span class="padding-10">
                  <label>Load old report :</label>
                  <select id="sltLoadOldReport" style="max-width:150px;"></select>
               </span>

            </div>
         </div>
         <br /><br />

         <section class="col col-sm-5 col-xs-12">
            <div class="input-group-btn">
               <input type="text" class="form-control col col-10" placeholder="report name" id="reportName">
               <button class="btn btn-sm btn-default" id="btnSaveReport"><i class="fa fa-save"></i> Save</button>
               <button class="btn btn-sm btn-default" id="btnResetReport"><i class="fa fa-refresh"></i> Reset</button>
            </div>
         </section>
         <section class="col col-sm-7 col-xs-12 text-right">
            <button class="btn btn-default" style="padding:5px" id="btnDownloadPdfReport"><i class="fa fa-download"></i> PDF Download</button>
            <button class="btn btn-default" style="padding:5px" id="btnDownloadCsvReport"><i class="fa fa-download"></i> CSV Download</button>
            <button class="btn btn-primary" style="padding:5px" data-toggle="modal" data-target="#modalSearch"><i class="fa fa-search"></i> Show Table</button>
            <button class="btn btn-primary" style="padding:5px" id="btnSearchReport"><i class="fa fa-search"></i> Search</button>
         </section>
      </div>
   </fieldset>
   <!-- table -->
</div>
<div id="tableDownloadData" class="hidden">
   <table id="my-table" class="hidden"></table>
</div>

<!-- Modal -->
<div class="modal fade" id="modalSearch" role="dialog">
   <div class="modal-dialog bg-color-white" style="width:90%">
      <div class="report-modal-content modal-content">
         <div class="modal-header">
            <div class="modal-title">
               <b style="font-size:28;">Report</b>
               <span class="pull-right">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <i class="bold padding-10" id="showRecordInfo"></i>
               </span>
            </div>
         </div>
         <div class="modal-body report-modal-body">
            <div>
               <table id="searchReportTable" class="table table-bordered table-hover table-tripped" style="min-width:100%">
                  <thead></thead>
                  <tbody></tbody>
                  <tfoot></tfoot>
               </table>
               <div class="pull-right">
                  <ul class="pagination"></ul>
               </div>
            </div>
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-default text-right" data-dismiss="modal">Close</button>
         </div>
      </div>
   </div>
</div>
<div class="clearfix"></div>

<div id="modalInprogress" style="left:45%;z-index:5000; top:70%; position:absolute; display:none" role="dialog">
   <div class="" style="">
      <div class="loading-process padding-10 bold" style="margin:auto; font-size:28px; color:white">
         Loading <sub><img src="./img/loading.gif" width="20px" style="margin:auto;"></sub>
      </div>
   </div>
</div>

<script src="<?= ASSETS_URL ?>/js/plugin/bootstrap-timepicker/jquery-timepicker.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/pagination.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/report/report.js"></script>
<script>
   <?php

   $claim_status = [];
   if (!isset($_SESSION['settingPage']->claim_status)) {
      $_SESSION['settingPage']->claim_status = ['Not Assigned', 'Open', 'In Progress', 'Approved', 'Assigned', 'Deny', 'Close', 'Cancel'];
      $claim_status = $_SESSION['settingPage']->claim_status;
   } else if (gettype($_SESSION['settingPage']->claim_status) == 'string') {
      $claim_status = json_decode($_SESSION['settingPage']->claim_status);
   }
   if(strtolower($form_report) == 'claim'){
      echo 'var claim_status = ' . json_encode($claim_status). ';';
   }
   ?>

   var form = "<?= $form_report ?>"
   var report = new Report(form);
   report.init();
</script>