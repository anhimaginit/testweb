<fieldset id="contact_document_pane" style="display: none">
   <a href="#collaped_document" data-toggle="collapse" class="" aria-expanded="true"><legend>Contact Document <i class="fa fa-link"></i></legend></a>
   <input type="hidden" name="contactdocID" value="">
   <div class="panel-collapse collapse in" id="collaped_document">
   <table id="table_document_contact" class="table table-bordered" style="width:100%">
      <thead>
         <th class="hidden">#</th>
         <th class="hidden">contactID</th>
         <th>Document Type</th>
         <th class="hidden">Start Date</th>
         <th>Expiry Date</th>
         <th class="hidden">Date Entered</th>
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
                  <option value=""></option>
                  <option value="License">License</option>
                  <option value="Employee">Employee</option>
                  <option value="Education">Education</option>
               </select>
            </td>
            <td class="hidden" style="max-width:100px;"><input type="date" id="contact_start_date" class="form-control" value="<?= date('Y-m-d') ?>"></td>
            <td class="hasinput" style="max-width:100px;"><input type="date" id="contact_exp_date" class="form-control" value="<?= date('Y-m-d') ?>"></td>
            <td class="hidden" style="max-width:100px;"><input type="date" id="contact_date_entered" class="form-control" value="<?= date('Y-m-d') ?>"></td>
            <td class="text-center"><label class="checkbox "><input type="checkbox" value="1" checked><i></i></label></td>
            <td class="text-center"><label class="checkbox"><input type="checkbox" value="1" checked><i></i></label></td>
            <td style="margin:auto; " title="Please choose attachment file which has maximum 500KB" rel="tooltip">
               <a id="attachfile" href="javascript:void(0);"><span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;"></span> Select attachment</a>
               <input type="file" class="hidden" id="inputattachfile" accept=".pdf, image/*" >
            </td>
            <td></td>
         </tr>
      </tfoot>
   </table>
   </div>
   <div id="table_document_error"></div>
</fieldset>
<?php /** modal preview file (in table) */ ?>
<div class="modal fade" style="display:none; margin:auto; max-height:600px;" id="filePreview">
    <div class="modal-dialog" style="min-width:60%;margin:auto;">
        <div class="modal-content">
        </div>
    </div>
</div>