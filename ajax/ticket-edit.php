<?php require_once 'inc/init.php';

$complete = false;
$editTicket = array();
$notes = array();

if (hasIdParam()) {
   $complete = true;
   $editTicketRequest = HTTPMethod::httpPost(HOST . '/_heldDeskGet_ID.php', array(
      'token' => $_SESSION['token'],
      'id' => getID()
   ));

   // echo json_encode($editTicketRequest);
   if($editTicketRequest != null && isset($editTicketRequest->notes)){
      $notes = $editTicketRequest->notes;
   }
   if ($editTicketRequest != null && isset($editTicketRequest->list)) {
      $editTicket = $editTicketRequest->list;
      $editTicket->notes = $notes;
   }

   if (!isset($editTicket->id)) {
      die('<h3>Cannot find the ticket</h3>');
   }
} else {
   header("Location: ticket-new.php");
   exit();
}

setcookie('ticket_edit', json_encode($editTicket), time() + 3600, '/', false, false);
?>
<style>
   .inbox-info-bar .control-label {
      top: 8px;
   }

   #viewImagePane img {
      cursor: zoom-in;
      width: 100%;
   }

   .feedback-detail p{
      margin: 0 0;
   }
</style>
<section id="widget-grid" class="bg-color-white">
   <div class="feedback-body padding-20">
      <div id="message_form" role="alert" style="display:none"></div>
      <div class="">
         <div class="pull-right padding-20"></div>
         <h2 class="email-open-header uppercase-character bold padding-20 <?= $editTicket->form ?>">Help Desk: <?= $editTicket->form ?> Form</h2>
      </div>

      <div><?= isset($editTicket->create_date) &&  $editTicket->create_date != '' ? 'Created at ' . $editTicket->create_date : '' ?>
      <?= isset($editTicket->create_by_name) && $editTicket->create_by_name != '' ? ' By: <a href="./#ajax/contact-form.php?id=' . $editTicket->create_by . '">' . $editTicket->create_by_name . '</a>' : 'By Not Login User' ?></div>
      <div><?= isset($editTicket->last_update_time) && $editTicket->last_update_time != '' ? 'Last Updated at ' . $editTicket->last_update_time : '' ?> 
      <?= isset($editTicket->last_update_name) && $editTicket->last_update_name != '' ? ' By: <a href="./#ajax/contact-form.php?id=' . $editTicket->last_update . '">' . $editTicket->last_update_name . '</a>' : 'By Unknown User' ?></div>

      <h3 class=" uppercase-character"><?= $editTicket->subject ?></h3>
      <div class="feedback-detail well" style="padding-top:20px; margin-top:10px">
         <?= $editTicket->problem ?>
      </div>
      <form id="ticket_form" method="post">
         <input type="hidden" name="ID" value="<?= $editTicket->id ?> ">
         <div>
            <div>
               <label class="input">Assigned To</label>
               <select name="assign_to" class="form-control input-underline" style="width:100%"></select>
            </div>
         </div>
         <div>
            <div>
               <label class="input mg-t-10">Status</label>
               <select name="status" class="form-control input-underline pointer" style="width:100%">
                  <option value="open" <?= isset($editTicket->status) && $editTicket->status == 'open' ? 'selected' : '' ?>>Open</option>
                  <option value="done" <?= isset($editTicket->status) && $editTicket->status == 'done' ? 'selected' : '' ?>>Done</option>
                  <option value="close" <?= isset($editTicket->status) && $editTicket->status == 'close' ? 'selected' : '' ?>>Close</option>
                  <option value="cancel" <?= isset($editTicket->status) && $editTicket->status == 'cancel' ? 'selected' : '' ?>>Cancel</option>
               </select>
            </div>
         </div>
         <div>&nbsp;</div>
         <div class="col">
            <div>
               <label class="form-control-label">Screenshot</label>
               <div id="viewImagePane"></div>
            </div>
         </div>
         <div class="clearfix"></div>

         <div>
            <div>
               <label class="control-label">Note</label>
               <table id="table_note_info" class="table table-bordered" style="table-layout: auto; width: 100%;"></table>
            </div>
         </div>
   </div>

   <div class="text-right">
      <button type="button" class="btn btn-default" onclick="window.history.back()">Back</button>
      <button type="submit" class="btn btn-primary" onclick="$('#ticket_form').submit()">Submit</button>
   </div>
   </form>
   </div>
   <div class="clearfix"></div>
</section>

<?php
$mail_popup_id = 'note_mail_popup';
$mail_popup_event = 'sendMailNote()';
include 'email-template.php';
unset($mail_popup_id);
unset($mail_popup_event);
?>

<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="previewImage">
   <div class="modal-dialog" style="min-width:60%;">
      <div class="modal-content">
      </div>
   </div>
</div>

<script src="js/script/note.js"></script>
<script src="js/script/select-template.js"></script>
<script src="js/script/help/ticket-edit.js"></script>