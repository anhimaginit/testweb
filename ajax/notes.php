<fieldset>
<div class="clearfix"></div>
   <legend>Notes <i class="fa fa-link"></i></legend>
   <section class="padding-10 div_contain_note_table">
      <table id="table_note_info" class="table table-bordered" style="table-layout: auto; width: 100%;"></table>
   </section>
</fieldset>

<?php 
$mail_popup_id = 'note_mail_popup';
$mail_popup_event = 'sendMailNote()';
include 'email-template.php';
unset($mail_popup_id);
unset($mail_popup_event);
?>

