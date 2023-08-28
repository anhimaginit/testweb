<fieldset>
   <div class="tabbable contact-tab">
      <ul class="nav nav-tabs bordered">
         <li class="active"><a href="#notesTab" data-toggle="tab" rel="tooltip" data-placement="top">Notes</a></li>
         <li><a href="#textTab" data-toggle="tab" rel="tooltip" data-placement="top">Text</a></li>
         <li data-tab="order-form" data-content="Order"><a href="#orderTab" data-toggle="tab" rel="tooltip" data-placement="top">Orders</a></li>
         <li data-tab="claim-form" data-content="Claim"><a href="#claimTab" data-toggle="tab" rel="tooltip" data-placement="top">Claims</a></li>
         <li data-tab="warranty-form-addnew" data-content="Warranty"><a href="#warrantyTab" data-toggle="tab" rel="tooltip" data-placement="top">Warranties</a></li>
         <li><a href="#documentTab" data-toggle="tab" rel="tooltip" data-placement="top">Documents</a></li>
         <li class="pull-right" style="display:none">
            <button type="button" class="btn btn-sm btn-default padding-5" id="btnControlTabAdd"><i class="fa fa-plus"></i> <span id="txtControlTabAdd">Add New</span></button>
         </li>

      </ul>
      <div class="tab-content padding-10">
         <div class="tab-pane active div_contain_note_table" id="notesTab">
            <table id="table_note_info" class="table table-bordered padding-10" style="table-layout: auto; width: 100%;"></table>
         </div>

         <div class="tab-pane" id="textTab">
            <div>
               <table id="table_text_list" class="table table-bordered table-striped" style="width:100%">
                  <thead></thead>
                  <tbody></tbody>
               </table>
            </div>
         </div>


         <div class="tab-pane" id="orderTab">
            <div>
               <table id="table_order_list" class="table table-bordered table-striped" style="table-layout: auto; width: 100%;">
                  <thead></thead>
                  <tbody></tbody>
               </table>
            </div>
         </div>
         <div class="tab-pane" id="claimTab">
            <div>
               <table id="table_claim_list" class="table table-bordered table-striped" style="table-layout: auto; width: 100%;">
                  <thead></thead>
                  <tbody></tbody>
               </table>
            </div>
         </div>
         <div class="tab-pane" id="warrantyTab">
            <div>
               <table id="table_warranty_list" class="table table-bordered table-striped" style="table-layout: auto; width: 100%;">
                  <thead></thead>
                  <tbody></tbody>
               </table>
            </div>
         </div>
         <div class="tab-pane" id="documentTab">
            <div id="collaped_document_' . $documentPane . '" style="max-height:400px; overflow-y:scroll;">
               <?php
               if (isset($documentField)) {
                  echo $documentField;
               }
               ?>
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
                        <td class="hasinput docType" style="width:185px">
                           <select class="form-control doc_type">
                              <option value=""></option>
                              <option value="License">License</option>
                              <option value="Employee">Employee</option>
                              <option value="Education">Education</option>
                           </select>
                        </td>
                        <td class="hasinput expDate" style="max-width:100px;"><input type="date" class="form-control" value="' . date('Y-m-d') . '"></td>
                        <td class="text-center needUpdate"><label class="checkbox"><input type="checkbox" value="1"><i></i></label></td>
                        <td class="text-center _active"><label class="checkbox"><input type="checkbox" value="1"><i></i></label></td>
                        <td class="attachment" style="margin:auto; " title="Please choose attachment file which has maximum 500KB" rel="tooltip">
                           <a id="attachfile" href="javascript:void(0);"><span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;"></span> Select attachment</a>
                           <input type="file" class="hidden inputattachfile" accept=".pdf, image/*">
                        </td>
                        <td></td>
                     </tr>
                  </tfoot>
               </table>
            </div>
            <div id="table_document_error"></div>
         </div>
      </div>
   </div>
</fieldset>
<div class="modal fade" style="display:none; margin:auto; max-height:600px;" id="filePreview">
   <div class="modal-dialog" style="min-width:60%;margin:auto;">
      <div class="modal-content">
      </div>
   </div>
</div>


<?php
   $mail_popup_id = 'note_mail_popup';
   $mail_popup_event = 'sendMailNote()';
   include 'email-template.php';
   unset($mail_popup_id);
   unset($mail_popup_event);
?>