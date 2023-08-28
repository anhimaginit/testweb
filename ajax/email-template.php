<style>
  #<?= $mail_popup_id ?>_body footer {
    padding: 0;
    border: unset;
    background: white;
  }

  #<?= $mail_popup_id ?>_body fieldset {
    padding: 0;
  }

  #<?= $mail_popup_id ?>_body .tagsinput {
    border: unset;
  }
</style>

<div class="ui-widget ui-chatbox" style="display:none; right:25px; width:450px;" outline="0" id="<?= $mail_popup_id ?>">
  <div class="ui-widget-header ui-chatbox-titlebar ui-dialog-header">
    <span>Send Mail</span>
    <a href="javascript:void(0)" onclick="jQuery('#<?= $mail_popup_id ?>').hide()" class="ui-chatbox-icon">
      <i class="fa fa-times"></i>
    </a>
    <a href="javascript:void(0)" style=" display:none" class="ui-chatbox-icon">
      <i class="fa fa-plus"></i>
    </a>
    <a href="javascript:void(0)" class="ui-chatbox-icon" data-toggle="collapse" data-target="#<?= $mail_popup_id ?>_body">
      <i class="fa fa-minus"></i>
    </a>
  </div>
  <div class="true ui-widget-content ui-chatbox-content">
    <div class="padding-5 collapse in" id="<?= $mail_popup_id ?>_body">
      <div role="alert" style="display:none" class="message_chat"></div>
      <fieldset class="">
        <div id="mail_content" style="min-height:300px;">
          <table style="width:100%">
            <tbody>
              <tr>
                <td>Name:</td>
                <td class="hasinput"><input type="text" class="resend_name form-control"></td>
              </tr>
              <tr>
                <td>Email:</td>
                <td class="hasinput"><input type="text" class="resend_mail form-control" style="border-bottom:unset !important;"></td>
              </tr>
              <tr>
                <td>Subject:</td>
                <td class="hasinput"><input type="text" class="resend_subject form-control"></td>
              </tr>
            </tbody>
          </table>
          <div class="row">
            <section class="col col-md-12">
              <textarea style="width:100%; height:300px;" class="resend_content" placeholder="Content"></textarea>
            </section>
          </div>
        </div>
      </fieldset>

      <footer class="text-right">
        <button type="button" class="btn btn-sm btn-primary" onclick="<?= $mail_popup_event ?>">Send</button>
        <button type="button" class="btn btn-sm btn-default" onclick="jQuery('#<?= $mail_popup_id ?>').hide()">Cancel</button>
      </footer>
    </div>
  </div>
</div>

<script src="js/plugin/summernote/summernote.min.js"></script>
<script>
  $('#<?= $mail_popup_id ?>_body .resend_mail').tagsInput({
    placeholder: 'Enter email',
    removeWithBackspace: false,
    delimiter: [';', ',', '\\', ' ', '&', '#'],
  })

  $('#<?= $mail_popup_id ?>_body .resend_content' ).summernote({
    height: 200,
    focus: false,
    tabsize: 2,
    placeholder: 'Enter content',
    toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
    ]
  });
</script>