<fieldset id="<?= $documentPane ?>" <?php if(isset($documentVisible) && $documentVisible == false){echo 'style="display: none"';} ?>>
   <a href="#collaped_document_<?= $documentPane ?>" data-toggle="collapse" class="" aria-expanded="true"><legend><?= $documentTitle ? $documentTitle : 'Documents' ?> <i class="fa fa-link"></i></legend></a>
   <div class="panel-collapse collapse in" id="collaped_document_<?= $documentPane ?>" style="max-height:500px; overflow-y:scroll;">
   <?php if(isset($documentField)){ echo $documentField; } ?>
   <table id="table_document" class="table table-bordered" style="width:100%">
      <thead>
         <th class="hidden">#</th>
         <th class="hidden"></th>
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
            <td class="hasinput docType"  style="width:185px">
               <select class="form-control doc_type">
                  <option value=""></option>
                  <option value="License">License</option>
                  <option value="Employee">Employee</option>
                  <option value="Education">Education</option>
               </select>
            </td>
            <td class="hasinput expDate" style="max-width:100px;"><input type="date" class="form-control datepicker" value="<?= date('Y-m-d') ?>"></td><!--Expired date-->
            <td class="text-center needUpdate"><label class="checkbox "><input type="checkbox" value="1"><i></i></label></td><!-- need update-->
            <td class="text-center _active"><label class="checkbox"><input type="checkbox" value="1"><i></i></label></td><!--Active-->
            <td class="attachment" style="margin:auto; " title="Please choose attachment file which has maximum 500KB" rel="tooltip"><!--Attachment-->
               <a id="attachfile" href="javascript:void(0);"><span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;"></span> Select attachment</a>
               <input type="file" class="hidden inputattachfile" accept=".pdf, image/*" >
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

<?php 
   unset($documentPane);
   unset($documentField);
   unset($documentVisible);
   unset($documentTitle);
?>