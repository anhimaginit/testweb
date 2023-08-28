<style>
  #<?= $sms_forward_id ?>_body footer {
    padding: 0;
    border: unset;
    background: white;
  }

  #<?= $sms_forward_id ?>_body fieldset {
    padding: 0;
  }

  #<?= $sms_forward_id ?>_body .tagsinput {
    border: unset;
  }

  .forward-to-section span.select2-container {
      min-width: 316px;
  }
</style>

<div class="ui-widget ui-chatbox" style="display:none; right:25px; width:450px;" outline="0" id="<?= $sms_forward_id ?>">
  <div></div>
  <div class="ui-widget-header ui-chatbox-titlebar ui-dialog-header">
    <span>Forward SMS</span>
    <a href="javascript:void(0)" onclick="jQuery('#<?= $sms_forward_id ?>').hide()" class="ui-chatbox-icon">
      <i class="fa fa-times"></i>
    </a>
    <a href="javascript:void(0)" style=" display:none" class="ui-chatbox-icon">
      <i class="fa fa-plus"></i>
    </a>
    <a href="javascript:void(0)" class="ui-chatbox-icon" data-toggle="collapse" data-target="#<?= $sms_forward_id ?>_body">
      <i class="fa fa-minus"></i>
    </a>
  </div>
  <div class="true ui-widget-content ui-chatbox-content">
    <div class="padding-5 collapse in" id="<?= $sms_forward_id ?>_body">
      <div role="alert" style="display:none" class="message_chat"></div>
      <fieldset class="">
        <div id="mail_content" style="min-height:300px;">
          <table style="width:100%">
            <tbody>
              <tr style="margin-bottom: 20px;">
                <td><span>To: </span>

                  <div class="">
                      <section class="forward-to-section">
                         <select name="contact_salesman_id" id="forward_to_contact" class=""></select>
                      </section>
                  </div>
                </td>
              </tr>

              <tr class="hidden">
                  <td><input type="text" class="msg_id form-control" value=""></td>
              </tr>

              <tr class="hidden">
                  <td><input type="text" class="receiver_name form-control" value=""></td>
              </tr>

              <tr>
                <td class="row"></td>
              </tr>

              <tr>
                <td class="hasinput"></td>
              </tr>


              <tr>
                <td class="forwarded_from"></span></td>
              </tr>
              <tr>
                <td class="forwarded_date"></span></td>
              </tr>
              <tr>
                <td class="forwared_msg"></td>
              </tr>
              <tr>
                <td class="forwarded_to"></td>
              </tr>

            </tbody>
          </table>
          <div class="row">
            <section class="col col-md-12">
              <textarea style="width:100%; height:300px;" id="forwarded_content" class="resend_content" placeholder="Content"></textarea>
            </section>
          </div>
        </div>
      </fieldset>

      <footer class="text-right">
        <button type="button" class="btn btn-sm btn-primary" id="forward_sms_btn" onclick="">Send</button>
        <button type="button" class="btn btn-sm btn-default" onclick="jQuery('#<?= $sms_forward_id ?>').hide()">Cancel</button>
      </footer>
    </div>
  </div>
</div>

<script src="js/plugin/summernote/summernote.min.js"></script>
<script>
  $('#<?= $sms_forward_id ?>_body .resend_mail').tagsInput({
    placeholder: 'Enter email',
    removeWithBackspace: false,
    delimiter: [';', ',', '\\', ' ', '&', '#'],
  })

  $('#<?= $sms_forward_id ?>_body .resend_content' ).summernote({
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

<script>
    $.ajax({
        url: link._salesmanEmployeeList,
        type: 'post',
        dataType: 'json',
        data: { token: localStorage.getItemValue('token') },
        success: function (res) {
            let text = '';
            res.forEach(function (item) {
                let name = [item.first_name, item.middle_name, item.last_name]
                text += '<option value="' + item.ID + '">' + name.join(' ') + '</option>';;
            });
            $('#forward_sms_body [name="contact_salesman_id"]').html(text);
            $('#forward_sms_body [name="contact_salesman_id"]').select2().val(null).trigger('change');
            if (callback) callback(result)
        },
        error: function (e) {
        }
    })
</script>