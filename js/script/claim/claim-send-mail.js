function SendMail() {
  this.bindEvent();
  sendContract = this.sendContract;
  notifyVendor = this.notifyVendor;
  sendMailNote = this.sendMailNote;
  sendMailWarranty = this.sendMailWarranty;
}
SendMail.prototype = {
  constructor: SendMail,
  bindEvent: function () {
    $(document).unbind('click', '.btnContentMail, .btnSendNotifyVendor, .btnSendWarranty, #warranty_infomation_table tbody tr:not(.ignore_open_window)')
      .on('click', '.btnContentMail', function () {
        SendMail.prototype.setContentContract($(this).closest('tr'))
      })
      .on('click', '.btnSendNotifyVendor', function () {
        SendMail.prototype.setContextVendorNotify($(this));
      })
      .on('click', '.btnSendWarranty', function (e) {
        SendMail.prototype.setMailWarranty()
      })
      .on('click', '#warranty_infomation_table tbody tr:not(.ignore_open_window)', function (e) {
        window.open('./#ajax/warranty-form.php?id=' + window.warranty_info.ID, '_blank');
      });
  },

  setMailWarranty: function () {
    if (!window.warranty_info) return;
    $('#warranty_mail_popup .resend_name').val(window.warranty_info.buyer_name);
    $('#warranty_mail_popup .resend_mail').importTags(window.warranty_info.buyer_email);
    $('#warranty_mail_popup_body .resend_subject').val('Your Freedom HW Claims Information');
    let code = `
    <div><a href="${host2 + '#ajax/claim-form?id=' + getUrlParameter('id')}">The claim ${getUrlParameter('id')}</div>
    <div>Warranty: <a href="${host2 + '#ajax/warranty-form?id=' + window.warranty_info.ID}">${window.warranty_info.warranty_serial_number}</a></div>
    <div>Assigned to: ${$('[name="claim_assign"] option:selected').text()}</div>
    `
    $('#warranty_mail_popup_body .resend_content').summernote('code', code);

    $('#warranty_mail_popup').show();
  },

  setContentContract: function (row) {
    let task = jsonAssignTaskTable[row.index()];
    let assigner = {};
    for (let i = 0; i < assigned_persons.length; i++) {
      if (assigned_persons[i].id == task.assign_id) {
        assigner = assigned_persons[i];
        break;
      }
    }
    if (!assigner.id) {
      messageForm('This task haven\'t assigned person', 'warning', '#resend_mail_popup .message_chat');
      return
    }
    var name = assigner.text,
      mail = assigner.primary_email,
      assignedID = task.assign_id,
      subject = 'Task Claim ' + $('#claim_form [name=ID]').val() + ' - ' + task.taskName + ' - by ' + localStorage.getItemValue('user_name');
    $('#resend_mail_popup_body .resend_name').val(name);
    $('#resend_mail_popup_body .resend_mail').importTags(mail);
    $('#resend_mail_popup_body #assignedID').val(assignedID);
    $('#resend_mail_popup_body .resend_subject').val(subject);
    $('#resend_mail_popup_body .resend_content').summernote('code', (
      `Task Claim ${task.taskName} assigned to ${name} (${mail})\n`
    ));
    $('#resend_mail_popup').show();
  },
  setContextVendorNotify: function (elem) {
    elem = $(elem);
    window.btnSendNotifyVendorCurrentIndex = elem.closest('section').index();
    $('#deny_mail_popup .resend_name').val(window.warranty_info.buyer_name);
    $('#deny_mail_popup .resend_mail').importTags(window.warranty_info.buyer_email);
    let ob = elem.data('for');

    let amount = elem.closest('tbody').find('input[name="' + (ob == 'quote' ? 'quote' : 'inv') + '_amount"]').val();
    $('#deny_mail_popup .resend_subject').val('Claim ' + $('#claim_form [name=ID]').val() + ' decline ' + ob + ' ' + (amount ? amount : '$ 0'));
    $('#deny_mail_popup').show();
    $('#deny_object').val(ob);
  },
  sendContract: function () {
    var _myData = $.extend({}, template_data);
    _myData.claimID = $('#claim_form [name=ID]').val();
    _myData.name = $('#resend_mail_popup_body .resend_name').val();
    _myData.email = $('#resend_mail_popup_body .resend_mail').val();
    _myData.subject = $('#resend_mail_popup_body .resend_subject').val();
    var content = '<div>';
    content += '<div>' + $('#resend_mail_popup_body .resend_content').summernote('code').replace(/\r?\n|\r/g, '<br>') + '</div>';
    content += '</div>';
    _myData.content = content;
    SendMail.prototype.sendMail(_myData, true, function (res) {
      close_resend_mail();
    })
  },
  sendMailNote: function () {
    var _myData = $.extend({}, template_data);
    _myData.ID = $('#claim_form [name=ID]').val();
    _myData.claimID = $('#claim_form [name=ID]').val();
    _myData.name = $('#note_mail_popup_body .resend_name').val();
    _myData.email = $('#note_mail_popup_body .resend_mail').val();
    _myData.subject = $('#note_mail_popup_body .resend_subject').val();
    var content = '<div>';
    content += '<div>' + $('#note_mail_popup_body .resend_content').summernote('code').replace(/\r?\n|\r/g, '<br>') + '</div>';
    content += '</div>';
    _myData.content = content;
    SendMail.prototype.sendMail(_myData, true, function () {
      $('#note_mail_popup').hide();
    });

  },
  sendMailWarranty: function () {
    var _myData = $.extend({}, template_data);
    _myData.warrantyID = window.warranty_info.ID;
    _myData.ID = $('#claim_form [name=ID]').val();
    _myData.claimID = $('#claim_form [name=ID]').val();
    _myData.name = $('#warranty_mail_popup_body .resend_name').val();
    _myData.email = $('#warranty_mail_popup_body .resend_mail').val();
    _myData.subject = $('#warranty_mail_popup_body .resend_subject').val();
    var content = '<div>';
    content += '<div>' + $('#warranty_mail_popup_body .resend_content').summernote('code').replace(/\r?\n|\r/g, '<br>') + '</div>';
    content += '</div>';
    _myData.content = content;
    SendMail.prototype.sendMail(_myData, false, function (res) {
      $('#warranty_mail_popup').hide();
      if (res.ERROR != '' || (res.ERROR == '' && res.sent == 'FAIL')) {
        messageForm('Error! An error occured. Please try again later', false, '#resend_mail_popup .message_chat');
      } else {
        messageForm('The warranty email is sent', true, '#claim_form #message_form');
      }
    });
  },
  notifyVendor: function (elem) {
    // var elem = $('[data-for="' + $('#deny_object').val() + '"]');
    var _myData = $.extend({}, template_data);
    _myData.ID = $('#claim_form [name=ID]').val();
    _myData.claimID = $('#claim_form [name=ID]').val();
    // _myData.assignedID = $('#claim_form [name="customer"]').val();
    _myData.email = $('#deny_mail_popup .resend_mail').val();
    _myData.name = $('#deny_mail_popup .resend_name').val();
    _myData.subject = $('#deny_mail_popup .resend_subject').val();

    _myData.quote_data = claimQuote.getQuoteDataRow(window.btnSendNotifyVendorCurrentIndex, $('#deny_object').val() == 'quote', $('#deny_object').val() == 'invoice');
    var content = '<div><p>' + _myData.subject + '</p>';
    content += '<br><div>' + $('#deny_mail_popup .resend_content').summernote('code').replace(/\r?\n|\r/g, '<br>') + '</div>';
    content += '</div>';
    _myData.content = content;

    SendMail.prototype.sendMail(_myData, true);
  },
  sendMail: function (data, notify = false, callback) {
    data.content = data.content.replace(/\r?\n|\r/g, '');
    $.ajax({
      url: link._mailToCutomer,
      type: 'post',
      data: data,
      dataType: 'json',
      success: function (res) {
        if (notify) {
          if (res.ERROR != '' || (res.ERROR == '' && res.sent == 'FAIL')) {
            messageForm('Error! An error occured. Please try again later', false, '#resend_mail_popup .message_chat');
          } else {
            messageForm('The email is sent', true, '#resend_mail_popup .message_chat');
          }
        }
        if (callback) callback(res);
      },
      error: function (e) {
        messageForm('Error! An error occured. Please try again later', false, '#resend_mail_popup .message_chat');
        if (callback) callback(res);
      }
    });
  }
}

var sendMail = new SendMail();