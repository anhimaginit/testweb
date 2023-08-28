<fieldset>
   <div class="row">
      <section class="col col-6">
         <label class="input">Subscription</label>
         <input type="hidden" id="init_fee" value="0">
         <input type="hidden" id="processing_fee" value="0">
         <input type="hidden" id="period" value="0">
         <input type="hidden" id="endDate" name="endDate" value="0">
         <select name="subscription" class="form-control" style="width:100%"></select>
         <p></p>
      </section>
   </div>
   <div class="row hidden">
      <section class="col col-3">
         <label class="checkbox">
            <input type="checkbox" name="offSecondPayFee"><i></i> Off Second Pay Fee
         </label>
      </section>
   </div>
   <div class="row hidden">
      <section class="col col-3">
         <label class="checkbox">
            <input type="checkbox" name="optionPayingLater"><i></i> Paying Later
         </label>
      </section>
   </div>
</fieldset>