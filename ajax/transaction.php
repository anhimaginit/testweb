<fieldset>
    <?php
   if (hasPermission($claim_form, 'claim_transaction', $current_form)) {
      ?>
      <!-- <div class="row">
         <section>
            <button type="button" id="btnAddDocument" onclick="$('#addDocumentFile').click()" class="btn btn-sm btn-default">Add Document</button>
            <input type="file" id="addDocumentFile" class="hidden">
         </section>
      </div> -->
      <div class="row">
         <section class="col col-sm-12">
            <caption>
               <h5>Claim Limits</h5>
            </caption>
            <table class="table" id="limit_table" style="width:100%">
               <thead>
                  <tr>
                     <th>Item</th>
                     <th class="text-right">Original</th>
                     <th class="text-right">Current</th>
                     <th class="text-right">Available</th>
                     <th class="text-right">Payout</th>
                  </tr>
               </thead>
               <tbody></tbody>
               <tfoot>
                  <tr>
                     <td colspan="5">
                        <div class="row">
                           <div class="pull-right">
                              <section class="col col-12">
                                 <div class="onoffswitch-container">
                                    <span class="onoffswitch-title" id="lbl_please_pay">Accountant approved to pay <span id="_total" class="well padding-5" style="font-size:20px;">$ total</span></span>
                                    <span class="onoffswitch">
                                       <input type="checkbox" name="please_pay_flag" class="onoffswitch-checkbox" id="please_pay" <?= isset($claimDataEdit->please_pay_flag) ? ($claimDataEdit->please_pay_flag == 1 ? 'checked' : '') : '' ?><?= hasPermission($claim_form, 'accountant_approve_pay', $current_form) ? '' : ' readonly' ?>>
                                       <label class="onoffswitch-label" for="please_pay">
                                          <span class="onoffswitch-inner" data-swchon-text="ON" data-swchoff-text="OFF"></span>
                                          <span class="onoffswitch-switch"></span>
                                       </label>
                                    </span>
                                 </div>
                              </section>
                           </div>
                        </div>
                     </td>
                  </tr>
               </tfoot>
            </table>
         </section>
         <section class="col col-sm-12">
            <table class="table" id="transaction_table" style="width:100%">
               <caption>
                  <h5>Transactions</h5>
               </caption>
               <thead>
                  <tr>
                     <th></th>
                     <th class="text-right">Origin</th>
                     <th class="text-right">Current</th>
                     <th class="text-right">Available</th>
                     <th class="text-right">Amount</th>
                  </tr>
               </thead>
               <tbody></tbody>
               <tfoot></tfoot>
            </table>
         </section>
      </div>
   <?php } ?>
</fieldset>
