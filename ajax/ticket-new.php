<?php require_once 'inc/init.php'; ?>
<style>
   .inbox-info-bar .control-label {
      top: 8px;
   }

   .inbox-info-bar {
      width: 100%;
   }

   .inbox-info-bar .row {
      margin: 5px 10px;

   }
</style>
<div class="row">
   <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4">
      <h3>New Ticket</h3>
   </div>
</div>

<section id="widget-grid" class="bg-color-white padding-10">
   <div class="row">
      <div id="message_form" role="alert" style="display:none"></div>
      <form id="ticket_form" class="padding-10" method="POST">
         <input type="hidden" name="id">
         <input type="hidden" name="avt" value="<?php echo isset($_SESSION['firebase_user']) ? $_SESSION['firebase_user']['photoURL'] : './img/avatars/sunny.png' ?>">
         <div class="inbox-info-bar">
            <div class="row">
               <div class="form-group">
                  <label class="control-label col-md-1 text-right bold">Form</label>
                  <div class="col-md-4">
                     <select name="form" class="form-control no-border">
                        <?php
                        $navigation = ['Dashboard', 'opGroupHelp', 'New Ticket', 'Ticket List', 'Help Desk', 'Help List', 'Help Content', 'opGroupAdministrator', 'Role', 'State', 'Add Group', 'Group List', 'Billing Template', 'Add Discount', 'Discount List', 'Discount Repport', 'Setting', 'endGroup', 'opGroupContact', 'Add Contact', 'Contact List', 'Contact Report', 'endGroup',  'opGroupCompany', 'Add Company', 'Company List', 'Company Report', 'endGroup', 'opGroupProduct', 'Add Product', 'Product List', 'Products Report', 'endGroup', 'opGroupOrder', 'Add Order', 'Order List', 'Order Report', 'endGroup', 'opGroupWarranty', 'Add Warranty', 'Add/Edit Warranty', 'Warranty List', 'Warranty Report', 'endGroup', 'opGroupInvoice', 'Add Invoice', 'Invoice List', 'Invoice Report', 'endGroup', 'opGroupClaim', 'Add Claim', 'Add/Update Claim Limit', 'Claim List', 'Claim Report', 'endGroup', 'opGroupImport', 'Import Product', 'Import Contact', 'endGroup', 'opGroupTask', 'Add Task', 'Task List', 'Task Template', 'endGroup',  'opGroupMail', 'Compose', 'Inbox', 'Sent', 'Drafts', 'endGroup'];
                        $htm = '';
                        foreach ($navigation as $item) {
                           if (startsWith($item, 'opGroup')) {
                              $htm .= '<optgroup label="' . (substr($item, 7)) . '">';
                           } else if ($item == 'endGroup') {
                              $htm .= '</optgroup>';
                           } else {
                              $htm .= '<option value="' . $item . '">' . $item . '</option>';
                           }
                        }
                        echo $htm;
                        ?>
                     </select>
                  </div>
               </div>
            </div>
         </div>
         <div class="inbox-info-bar">
            <div class="row">
               <div class="form-group">
                  <label class="control-label col-md-1 text-right bold">Subject</label>
                  <div class="col-md-11">
                     <input type="text" class="form-control no-border" name="subject">
                  </div>
               </div>
            </div>
         </div>
         <div class="inbox-info-bar">
            <div class="row">
               <div class="form-group">
                  <label class="control-label col-md-1 text-right bold mg-b-10">Problem</label>
                  <div class="col-md-12">
                     <div id="contentMail" class="inbox-message no-padding"></div>
                  </div>
               </div>
            </div>
         </div>
         <div class="inbox-info-bar">
            <div class="row">
               <div class="form-group">
                  <label class="control-label col-md-1 text-right bold mg-b-10">Screenshot</label>
                  <div class="col-md-12">
                     <input type="file" accept="image/*" class="form-control no-border" name="screenshot" multiple>
                  </div>
                  <div class="col-xs-12" id="viewImagePane"></div>
               </div>
            </div>
         </div>
         <div class="inbox-info-bar">
            <div class="row">
               <div class="form-group">
                  <label class="control-label col-md-1 text-right bold mg-b-10">Note</label>
                  <table id="table_note_info" class="table table-bordered" style="table-layout: auto; width: 100%;"></table>
               </div>
            </div>
         </div>
         <div class="inbox-info-bar">
            <div class="row">
               <div class="form-group">
                  <label class="control-label col-md-1 text-right bold mg-b-10">Status</label>
                  <div class="col-md-4">
                  <select name="status" class="form-control no-border">
                     <option value="open">Open</option>
                     <option value="inprocess">In Process</option>
                     <option value="done">Done</option>
                     <option value="close">Close</option>
                     <option value="cancel">Cancel</option>
                  </select>
                  </div>
               </div>
            </div>
         </div>

         <div class="inbox-compose-footer" style="width:100%">
            <button class="btn btn-default" type="button" onclick="window.history.back()"> Back </button>
            <button data-loading-text="<i class='fa fa-refresh fa-spin'></i> &nbsp; Sending..." class="btn btn-primary pull-right" type="button" id="send">
               Send <i class="fa fa-arrow-circle-right fa-lg"></i>
            </button>
         </div>
      </form>
   </div>
</section>
<?php
$mail_popup_id = 'note_mail_popup';
$mail_popup_event = 'sendMailNote()';
include 'email-template.php';
unset($mail_popup_id);
unset($mail_popup_event);
?>
<script src="js/plugin/summernote/summernote.min.js"></script>
<script src="js/script/note.js"></script>
<script src="js/util/new-ticket.js"></script>