<fieldset>
   <a href="#collaped_vendor_doc" data-toggle="collapse" class="" aria-expanded="true"><legend>Vendor Document <i class="fa fa-link"></i></legend></a>
   <div class="panel-collapse collapse in" id="collaped_vendor_doc">
   <input type="hidden" name="vendorID" value="<?= isset($vendor) && isset($vendor->ID) ? $vendor->ID : '' ?>">
   <input type="hidden" name="vendordocID" value="">
   <p class="note">Document type maybe: License, Employee, Education,...</p>
   <table id="table_vendor_doc" class="table table-tripped table-bordered" style="width:100%">
      <thead>
         <th class="hidden">#</th>
         <th class="hidden">vendorID</th>
         <th>Document Type</th>
         <th  class="hidden">Start Date</th>
         <th>Expired Date</th>
         <th  class="hidden">Date Entered</th>
         <th>Need Update</th>
         <th>Active</th>
         <th>Attachment</th>
         <th></th>
      </thead>
      <tbody></tbody>
      <tfoot>
         <tr>
            <td class="hidden"></td>
            <td class="hidden"></td>
            <td class="hasinput">
               <select class="form-control">
                  <option value="">Select Type</option>
                  <option value="License">License</option>
                  <option value="Employee">Employee</option>
                  <option value="Education">Education</option>
               </select></td>
            <td class="hidden" style="max-width: 100px;" ><input type="date" class="form-control" value="<?= date('Y-m-d') ?>"></td>
            <td class="hasinput" style="max-width: 100px;" ><input type="date" id="exp_date" class="form-control"></td>
            <td class="hidden" style="max-width: 100px;" ><input type="date" value="<?= date('Y-m-d') ?>" class="form-control"></td>
            <td class="text-center"><label class="checkbox "><input type="checkbox" value="1" checked><i></i></label></td>
            <td class="text-center"><label class="checkbox"><input type="checkbox" value="1" checked><i></i></label></td>
            <td style="margin:auto; " title="Please choose attachment file which has maximum 500KB" rel="tooltip">
               <a id="attachFileVendor" href="javascript:void(0);"><span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;"></span> Select attachment</a>
               <input type="file" class="hidden inputAttachFileVendor" id="inputAttachFileVendor" accept=".pdf, image/*" >
            </td>
            <td></td>
         </tr>
      </tfoot>
   </table>
   <div id="table_vendor_doc_error"></div>
   </div>
</fieldset>

<?php if(strrpos($_SERVER['REQUEST_URI'], 'company-form') > 0){ ?>
<div class="modal fade" style="display:none; margin:auto; max-height:600px;" id="filePreview">
    <div class="modal-dialog" style="min-width:60%; margin:auto;">
        <div class="modal-content">
        </div>
    </div>
</div>
<?php } ?>