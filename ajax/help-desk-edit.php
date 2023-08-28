<?php require_once 'inc/init.php';

$complete = false;
$editTicket = (object) array('notes' => array());

if (hasIdParam()) {
   $complete = true;
   $editTicketRequest = HTTPMethod::httpPost(HOST . '/_heldDeskGet_ID.php', array(
      // $editTicketRequest = HTTPMethod::httpPost('https://api.salescontrolcenter.com/_heldDeskGet_ID.php', array(
      'token' => $_SESSION['token'],
      'id' => getID()
   ));

   if ($editTicketRequest != null && isset($editTicketRequest->list)) {
      $editTicket = (object) $editTicketRequest->list;
   }
   if ($editTicketRequest != null && isset($editTicketRequest->notes)) {
      $editTicket->notes = $editTicketRequest->notes;
   }
   if (!isset($editTicket->id)) {
      die('<h3>Cannot find the ticket</h3>');
   }
} else {
   header("Location: help-desk.php");
   exit();
}

$statusClass = 'general';
switch ($editTicket->status) {
   case 'open':
   case 'cancel':
      $statusClass = 'white';
      break;
   case 'inprocess':
      $statusClass = 'info';
      break;
   case 'done':
      $statusClass = 'warning';
      break;
   case 'close':
      $statusClass = 'danger';
      break;
}
?>
   <style>
      .inbox-info-bar .control-label {
         top: 8px;
      }

      #viewImagePane img {
         cursor: zoom-in;
         width: 100%;
      }
   </style>
   <section id="widget-grid" class="bg-color-white">
      <div class="feedback-body padding-20">
         <form id="ticket_form" method="post">
         <div id="message_form" role="alert" style="display:none"></div>
         <div class="">
            <div class="jarviswidget-ctrls padding-20" id="helpdesk-form-control" role="menu" ></div>
            <h2 class="email-open-header uppercase-character bold padding-20 <?= $statusClass ?>">Help Desk: <?= $editTicket->form ?> Form</h2>
         </div>

         <div><?= isset($editTicket->create_date) &&  $editTicket->create_date != '' ? 'Created at ' . $editTicket->create_date . (isset($editTicket->created_by_name) && $editTicket->created_by_name != '' ? ' By: <a href="./#ajax/contact-form.php?id=' . $editTicket->created_by . '">' . $editTicket->created_by_name . '</a>' : ' By Not Login User') : '' ?>
         </div>
         <div><?= isset($editTicket->last_update_time) && $editTicket->last_update_time != '' ? 'Last Updated at ' . $editTicket->last_update_time . (isset($editTicket->last_update_name) && $editTicket->last_update_name != '' ? ' By: <a href="./#ajax/contact-form.php?id=' . $editTicket->last_update . '">' . $editTicket->last_update_name . '</a>' : ' By Unknown User') : '' ?></div>

         <h3 class=" uppercase-character"><?= $editTicket->subject ?></h3>
         <div class="feedback-detail well" style="padding-top:20px; margin-top:10px">
            <?= $editTicket->problem ?>
         </div>
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
                     <option value="inprocess" <?= isset($editTicket->status) && $editTicket->status == 'inprocess' ? 'selected' : '' ?>>In Process</option>
                     <option value="done" <?= isset($editTicket->status) && $editTicket->status == 'done' ? 'selected' : '' ?>>Done</option>
                     <option value="close" <?= isset($editTicket->status) && $editTicket->status == 'close' ? 'selected' : '' ?>>Close</option>
                     <option value="cancel" <?= isset($editTicket->status) && $editTicket->status == 'cancel' ? 'selected' : '' ?>>Cancel</option>
                  </select>
               </div>
            </div>
            <div>&nbsp;</div>
            <div class="col">
               <div>
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
               <button data-loading-text="<i class='fa fa-refresh fa-spin'></i> &nbsp; Sending..."  onclick="$('#ticket_form').submit()" class="btn btn-primary pull-right" type="button" id="sendTicket">
                  Submit <i class="fa fa-arrow-circle-right fa-lg"></i>
               </button>
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

   <div class="modal animated fadeInDown" style="display:none; margin:auto;" id="previewImage">
      <div class="modal-dialog" style="min-width:80%;">
         <div class="modal-content">
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
               <ol class="carousel-indicators"></ol>
               <div class="carousel-inner"></div>
               <a class="carousel-control-prev" href="javascript:void(0)" role="button" data-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"><i class="fa fa-3x fa-angle-left text-dark"></i></span>
                  <span class="sr-only">Previous</span>
               </a>
               <a class="carousel-control-next" href="javascript:void(0)" role="button" data-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"><i class="fa fa-3x fa-angle-right text-dark"></i></span>
                  <span class="sr-only">Next</span>
               </a>
            </div>
         </div>
      </div>
   </div>

   <?php echo '
   <script>
   ticketEdit = Object.freeze('.json_encode($editTicket).'); 
   new ControlPage("#helpdesk-form-control");
   </script>'?>
   <script src="js/script/note.js"></script>
   <script src="js/script/select-template.js"></script>
   <script src="js/script/help/ticket-edit.js"></script>