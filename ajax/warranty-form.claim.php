<?php
$canAddClaim = hasIdParam() && 
isset($_SESSION['page_navigation']['claim']) && 
isset($_SESSION['page_navigation']['claim']['sub']) && 
isset($_SESSION['page_navigation']['claim']['sub']['addclaim']);
?>
<fieldset>
   <legend>Claim <?php if ($canAddClaim) { ?> <button type="button" class="btn btn-sm btn-default pull-right btnAddClaimWarranty">Add Claim</button> <?php } ?></legend>
   <table id="warranty_claim" class="table table-bordered table-hover" style="width:100%;">
      <thead>
         <th>#&nbsp;ID</th>
         <th>Create By</th>
         <th>Customer</th>
         <th>Status</th>
         <th>Transaction</th>
         <th>Paid</th>
         <th>Start Date</th>
      </thead>
      <tbody></tbody>
      <tfoot></tfoot>
   </table>
</fieldset>