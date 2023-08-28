<div class="clearfix"></div>
<a href="#collaped_quote" data-toggle="collapse" class="" aria-expanded="true">
   <legend title="Scroll Quote Table" style="margin-bottom:20px;">Claim Quote <i class="fa fa-link"></i></legend>
</a>
<style>
   .table_quote .toggle input:checked+i:before {
      right: unset;
      margin: 0px 5px;
   }

   .table_quote td:not(.hasinput) {
      vertical-align: middle;
   }

   .table_quote label.toggle{
      min-width: 80px;
   }

   .table_quote label.toggle i {
      width: 80px;
      right: unset;
   }

   .claim_quote_card {
      min-height: 460px;
      display: flex;
   }
</style>
<div id="message_quote" role="alert" style="display:none"></div>
<div class="panel-collapse collapse in" id="collaped_quote" style="max-height:500px; overflow-y:auto; overflow-x:hidden">
   <?php 
   // <section>
   //    <table class="table table-bordered table-triped table_quote" id="table_quote_claim" style="width:100%">
   //       <thead>
   //          <tr>
   //             <th style="width:fit-content;">Vendor</th>
   //             <th>Type</th>
   //             <th></th>
   //             <th class="col-xs-2">Number</th>
   //             <th class="col-xs-2">Amount</th>
   //             <th style="width:90px">Approved</th>
   //             <th style="max-width:100px;">Date</th>
   //          </tr>
   //       </thead>
   //       <tbody></tbody>
   //    </table>
   // </section>
   ?>
   <div id="pane_quote_claim"></div>
</div>
<div class="modal animated fadeInDown" style="display:none; margin:auto;" id="modal_vendor_renew">
   <div class="modal-dialog bg-color-white padding-20">
      <div class="bg-color-white">
         <section>
            <h3 class="padding-10">Enter new date</h3>
            <div class="col col-xs-10 col-offset-1">
               <input type="date" class="form-control datepicker" id="vendor_renew_date">
               <div style="margin-top:25px; right:25px;">
                  <button type="button" class="btn btn-sm btn-primary btnConfirmRenew">Confirm</button>
                  <button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </section>
      </div>
   </div>
</div>
<script src="./js/script/claim/claim-quote.js"></script>