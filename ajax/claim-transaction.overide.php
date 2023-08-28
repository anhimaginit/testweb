<fieldset>
<section>
   <div class="row">
      <div class="col col-5">
         <div class="form-horizontal" id="overide_form">
            <input type="hidden" id="overide_row" name="overide_index">
            <div class="form-group padding-10">
               <div class="col-sm-9 text-center">
                  <h5><b>Overide Form</b></h5>
               </div>
            </div>
            <div id="message_form" role="alert" class="mg-20" style="display:none"></div>
            <div class="form-group padding-5">
               <label class="control-label padding-5 col-sm-3">Limit Name:</label>
               <div class="col-sm-8">
                  <input class="form-control" name="overide_name" readonly>
               </div>
            </div>
            <div class="form-group padding-5">
               <label class="control-label padding-5 col-sm-3">Available:</label>
               <div class="col-sm-8">
                  <input type="number" class="form-control" name="overide_available" readonly>
               </div>
            </div>
            <div class="form-group padding-5">
               <label class="control-label padding-5 col-sm-3">Overide Amount:</label>
               <div class="col-sm-8">
                  <input type="number" class="form-control" name="overide_amount">
               </div>   
            </div>
            <div class="form-group padding-5">
               <label class="control-label padding-5 col-sm-3">Password:</label>
               <div class="col-sm-8">
                  <input type="password" class="form-control" name="overide_password">
               </div>
            </div>
            <div class="form-group padding-5">
               <div class="col-sm-11">
                  <button type="button" class="btn btn-sm btn-primary pull-right btnGetOverrideForm">Overide</button>
               </div>
            </div>
         </div>
      </div>
   </div>
</section>
</fieldset>

<script src="<?= ASSETS_URL; ?>/js/script/claim/transaction.overide.js"></script>

