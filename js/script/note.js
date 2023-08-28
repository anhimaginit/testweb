function NoteTable(options) {
  delete table;
  if (!options) options = { table: '#table_note_info', form: '' };
  this.options = options;
  this.options.type = this.options.form;
  let _self = this;

  sendMailNote = function () {
    _self.sendMail();
  }

  if (this.options.form == 'Help Desk') {
    window[options.form + '_internal'] = true;
  } else if (isSystemAdmin()) {
    window[options.form + '_internal'] = false;
  } else {
    $.get('php/getSession.php?data=int_acl&child=acl_rules-' + options.form + 'Form', function (res) {
      if (res && res != '') {
        let data = JSON.parse(res);
        if (!data['View Internal Office Note'] || !data['View Internal Office Note'].show) {
          window[options.form + '_internal'] = false;
        } else {
          window[options.form + '_internal'] = data['View Internal Office Note'].show == 'true' || data['View Internal Office Note'].show == true || false;
        }
      } else {
        window[options.form + '_internal'] = false;
      }
    })
  }

}
var flag_text = {
  internal: 'Internal Only',
  global: 'Public'
}

var formID = {
  Contact: 'contact_form',
  Product: 'product_form',
  Order: 'order_form',
  Warranty: 'warranty_form',
  Invoice: 'form_invoice',
  Claim: 'claim_form',
  Company: 'company_form',
  ClaimTransaction: 'claim_transaction_form',
  'Help Desk': 'ticket_form'
}


NoteTable.prototype = {
  constructor: NoteTable,
  init: function (callback) {
    let _self = this;

    let hasID = getUrlParameter('id') || getUrlParameter('aid') || getUrlParameter('salespersonid') || getUrlParameter('uid');
    $(this.options.table).DataTable({
      sDom: "<'dt-toolbar'<'col-sm-12 col-xs-12'>>" + "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i>" + (window[_self.options.form + '_internal'] ? "<'col-xs-12 col-sm-6'p>" : '') + ">",
      destroy: true,
      filter: true,
      ordering: false,
      searching: false,
      displayStart: 100,
      bInfo: false,
      showNEntries: false,
      pageLength: window[_self.options.form + '_internal'] ? 10 : 1000,
      lengthChange: false,
      paging: window[_self.options.form + '_internal'],
      columns: [
        { data: 'create_date', searchable: true, title: 'Date' },
        { data: function (data) { return data.description ? data.description : '' }, className: 'hasinput input-table input-description col-xs-3 text-v-center wordbreak-word', searchable: true, title: 'Title' },
        {
          data: function (data) {
            if (data.noteID == undefined || data.noteID == null || data.noteID == '') {
              return (data.note ? (`${data.note}`).replace(/\n/g, '<br>') : '');
            } else if (data.note) {
              let noteHTML = (`${data.note}`).replace(/\n/g, '<br>');
              let subNote = NoteTable.prototype.substring150(data.note);
              return '<span class="sub-note-p">' +
                '<span class="sub-note">' + subNote +
                '</span><span class="entire-note hidden">' + noteHTML + '</span>' +
                '<span class="sub-note-close hidden" style="color: #0000ff;cursor: pointer;"><u>Close</u></span>' +
                '</span>';
            } else {
              return '';
            }

          }, className: 'hasinput input-table input-note col-xs-3 text-v-center wordbreak-word', searchable: true, title: 'Note'
        },
        { data: 'type', searchable: true, title: 'Type' },
        { data: function (data) { return data.enter_by_name || 'Unknown' }, searchable: true, title: 'Enter By' },
        {
          data: function (data) {
            data.internal_flag = (data.internal_flag == 1 ? true : false);
            return '<input type="checkbox" style="display:none"' + (data.internal_flag ? ' checked' : '') + '>' +
              '<a class="pointer ' + (data.internal_flag ? 'text-success' : 'text-warning') + '">' +
              '<span class="pointer fa ' + (data.internal_flag ? 'fa-flag' : 'fa-flag-o') + '"></span>' +
              '&nbsp;<label>' + (data.internal_flag ? flag_text.global : flag_text.internal) + '</label>' +
              '</a>';
          }, className: 'pointer note-flag', searchable: true, title: 'Flag'
        },
        {
          mRender: function (row, type, data) {
            return '<button type="button" class="btn btn-sm btn-warning btnSendMailNote">Send mail</button>'
          }, title: 'Send mail', className: 'p-2' + (hasID ? '' : ' hidden')
        }
      ],
      createdRow: function (row, data, dataIndex) {
        if (data.noteID) {
          $(row).children().removeClass('note-flag input-table hasinput pointer');
          $(row).addClass('cursor-default');
        }

        if (_self.hiddenInternalNote(data)) {
          $(row).addClass('hidden');
        }

      },
      initComplete: function () {
        _self.displayList([]);
        if (callback) callback();
      }
    });

    _self.bindEvent();
  },

  hiddenInternalNote: function (data) {
    let isSAdmin = isSystemAdmin();
    let hasId = data.noteID && data.noteID != '';
    let internal_flag = data.internal_flag == 0;
    let acl_note = !window[this.options.form + '_internal'];
    let differentUser = data.contactID && data.contactID !== localStorage.getItemValue('userID');
    return hasId && internal_flag && acl_note && differentUser && !isSAdmin;
  },

  clearTable() {
    let table = $(this.options.table).DataTable();
    if (table) {
      table.clear();
      table.draw();
    }
  },

  createTableNoteRow: function (data, callback, isClear) {
    let table = $(this.options.table).DataTable();
    if (!data) {
      var item = this.defaultEmptyDataNote();
      data = [item];
    }
    if (isClear) {
      table.clear();
    }
    table.rows.add(data).draw();
    table.page('last').draw('page');
    if (callback) callback(data);
  },

  updateFlag: function (elem) {
    let table = $(this.options.table).DataTable();

    let checked = $(elem).find('input:checkbox').prop('checked');
    let indexTr = $(elem).closest('tr').index();
    let page = table.page();
    let lenght = table.page.len();
    if (indexTr >= 0) {
      let currentIndex = page * lenght + indexTr;

      let _data = table.data()[currentIndex];

      _data.internal_flag = !_data.internal_flag;

      table.row(currentIndex).data(_data);
      if (checked == true) {
        $(elem).find('span').removeClass('fa-flag');
        $(elem).find('span').addClass('fa-flag-o');
        $(elem).find('label').text(flag_text.internal)
        $(elem).find('a').attr('class', 'text-warning');
      } else {
        $(elem).find('span').removeClass('fa-flag-o');
        $(elem).find('span').addClass('fa-flag');
        $(elem).find('label').text(flag_text.global);
        $(elem).find('a').attr('class', 'text-success');
      }
      $(elem).find('input:checkbox').prop('checked', _data.internal_flag);
    }
  },

  bindEvent: function () {
    let _self = this;
    let currentFormID = this.options.table + ' tbody';

    $(document).unbind('click', currentFormID + ' .note-flag').on('click', currentFormID + ' .note-flag', function (e) {
      let table = $(_self.options.table).DataTable();
      $this = $(this);
      $this = $(e.target);
      $tr = $this.parents('tr');
      let indexTr = $tr.index();
      let pages = table.page.info();
      let page = pages.page;
      let length = pages.length;
      let currentIndex = page * length + indexTr;

      if (currentIndex >= 0 && currentIndex < pages.recordsTotal) {
        let _data = table.data()[currentIndex];
        _data.internal_flag = !_data.internal_flag;
        table.row(currentIndex).data(_data);
        table.page(page).draw('page');
      }
      return false;
    });
    $(document).unbind('click', currentFormID + ' .input-table').on('click', currentFormID + ' .input-table', function () {
      if ($(this).children('input').length > 0) {
        return;
      }
      let table = $(_self.options.table).DataTable();

      let indexTr = $(this).closest('tr').index();
      if (indexTr >= 0) {
        let pages = table.page.info();
        let page = pages.page;
        let length = pages.length;
        let currentIndex = page * length + indexTr;
        if (currentIndex == pages.recordsTotal - 1) {
          _self.createTableNoteRow();
        }
      }
      let text = $(this).html();
      if ($(this).hasClass('input-note')) {
        $(this).html('<input class="form-control" data-attr="note" placeholder="Note" style="width:100%">');
        $(this).find('input').focus().val(text);
      } else if ($(this).hasClass('input-description')) {
        $(this).html('<input class="form-control" data-attr="description" placeholder="Title" style="width:100%">');
        $(this).find('input').focus().val(text);
      }
    });
    $(document).unbind('mouseover', currentFormID + ' .input-table').on('mouseover', currentFormID + ' .input-table', function () {
      $(this).attr('title', 'Click to edit');
    });
    $(document).unbind('focusout', currentFormID + ' .input-table input:text').on('focusout', currentFormID + ' .input-table input:text', function (e) {
      let value = this.value;
      let table = $(_self.options.table).DataTable();
      $this = $(e.target);
      let name = $this.data('attr');
      $td = $this.parent("td:first");
      let indexTr = table.cell($td[0], 0).index().row;
      // let indexTr = $tr.index();
      let pages = table.page.info();
      let page = pages.page;
      let length = pages.length;
      let currentIndex = page * length + indexTr;
      if (currentIndex < pages.recordsTotal) {

        let _data = table.row(currentIndex).data();
        // if(!_data) return;
        _data[name] = value;
        table.row(currentIndex).data(_data).draw();
        table.page(page).draw('page');
      }
      // $(this).replaceWith(value);
    });

    $(document).unbind('click', currentFormID + ' .entire-note-view').on('click', currentFormID + ' .entire-note-view', function () {
      $(this).closest('.sub-note-p').find('.sub-note').addClass('hidden');
      $(this).closest('.sub-note-p').find('.entire-note').removeClass('hidden');
      $(this).closest('.sub-note-p').find('.sub-note-close').removeClass('hidden');
    });

    $(document).unbind('click', currentFormID + ' .sub-note-close').on('click', currentFormID + ' .sub-note-close', function () {
      $(this).closest('.sub-note-p').find('.sub-note').removeClass('hidden');
      $(this).closest('.sub-note-p').find('.entire-note').addClass('hidden');
      $(this).closest('.sub-note-p').find('.sub-note-close').addClass('hidden');
    });

    $(document).unbind('click', '.btnSendMailNote').on('click', '.btnSendMailNote', function () {
      var note = $(this).closest('tr').find('td');
      $('#note_mail_popup_body .resend_name').val('');
      $('#note_mail_popup_body .resend_mail').val('');
      $('#note_mail_popup_body .resend_subject').val('Notice by ' + localStorage.getItemValue('user_name'));
      $('#note_mail_popup_body .resend_content').summernote('code', (
        'The ' + _self.options.type + ' ' + ($('#' + formID[_self.options.type] + ' [name=ID]').val() || '') + ' send note:<br>' +
        'Title: ' + note.eq(1).text() + '<br>' +
        'Type: ' + note.eq(3).text() + '<br>' +
        'Enter By ' + note.eq(4).text() + '<br>' +
        'Flag: ' + (note.eq(8).find('input').prop('checked') == true ? flag_text.global : flag_text.internal) + '<br>' +
        'Create time: ' + note.eq(0).text() + '<br>' +
        'Content: ' + note.eq(2).find('.sub-note').text() + '<br>'
      ));
      $('#note_mail_popup').show();
    });
  },
  sendMail: function () {
    let _myData = $.extend({}, template_data);
    _myData.ID = $('#' + formID[this.options.type] + ' [name=ID]').val();
    _myData.type = this.options.type.toLowerCase() || 'contact';
    _myData.name = $('#note_mail_popup_body .resend_name').val() || '';
    _myData.email = $('#note_mail_popup_body .resend_mail').val() || '';
    if (!_myData.email || _myData.email == '') {
      messageForm('Please enter email', 'warning', '#note_mail_popup_body .message_chat');
      return;
    }
    _myData.subject = $('#note_mail_popup_body .resend_subject').val();
    let content = '<div>';
    content += '<div>' + $('#note_mail_popup_body .resend_content').summernote('code').replace(/\r?\n|\r/g, '<br>') + '</div>';
    content += '</div>';
    _myData.content = content;
    $.ajax({
      url: link._mailToCutomer,
      type: 'post',
      data: _myData,
      dataType: 'json',
      success: function (res) {
        if (res.ERROR != '' || (res.ERROR == '' && res.sent == 'FAIL')) {
          messageForm('Error! An error occured. Please try again later', false, '#note_mail_popup_body .message_chat');
        } else {
          messageForm('The email is sent', true, '#note_mail_popup_body .message_chat');
        }
      },
      error: function (e) {
        messageForm('Error! An error occured. Please try again later', false, '#note_mail_popup_body .message_chat');
      }
    });
  },
  displayList: function (listNotes) {
    let table = $(this.options.table).DataTable();
    let item = this.defaultEmptyDataNote();
    listNotes.push(item);
    table.clear();
    table.rows.add(listNotes).draw();;
    table.page('last').draw('page');
  },

  defaultEmptyDataNote: function () {
    return {
      create_date: getDateTime(),
      note: '',
      description: '',
      type: this.options.type,
      typeID: '',
      noteID: '',
      contactID: '',
      enter_by: localStorage.getItemValue('userID'),
      enter_by_name: localStorage.getItemValue('user_name'),
      internal_flag: 1
    }
  },

  getNotes: function () {
    let table = $(this.options.table).DataTable();
    let tab = table.rows().data();
    let result = [];
    for (let i = 0; i < tab.length; i++) {
      let item = $.extend({}, tab[i]);
      delete item.enter_by_name;
      delete item.create_by_name;
      item.internal_flag = (item.internal_flag == true || item.internal_flag == 1 ? 1 : 0);
      if (item.note != '' || item.description != '')
        result.push(item);
    }
    return result;
  },
  /**
   * 
   * @param {JSONObject} note 
   * @param {Function} callback 
   * insert a note to DB
   */
  insertNewNoteToDB: function (note, callback) {
    $.ajax({
      url: link._noteAddNew,
      type: 'post',
      dataType: 'json',
      data: { token: localStorage.getItemValue('token'), data: note },
      success: function (res) {
        if (callback) callback(res);
      },
      error: function (e) {
        if (callback) callback(e);
      }
    })
  },

  deletePhoneTemplate: function (contactID, phone) {
    let _data = {
      create_date: getDateTime(),
      note: 'Delete Phone Number',
      description: 'Delete phone number ' + phone + ' by ' + localStorage.getItemValue('user_name'),
      type: 'Contact',
      contactID: contactID,
      enter_by: localStorage.getItemValue('userID'),
      internal_flag: 1,
    }
    if (contactID == '') delete _data.contactID;
    return _data;
  },

  substring150: function (str) {
    if (!str) return '';
    let sub_temp = str.substring(0, 100);
    let n = sub_temp.lastIndexOf(" ");
    let sub_temp1 = sub_temp.substring(0, n);

    if (str.length > 100) {
      sub_temp1 = sub_temp + '<span class="entire-note-view" style="color: #0000ff;cursor: pointer">, <u>View</u></span>'
    } else {
      sub_temp1 = str;
    }
    return sub_temp1
  }
  //---------------------
}
