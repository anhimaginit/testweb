function NoteContact(create_date, note, type, typeID, contactID, enter_by, noteID, enter_by_name, internal_flag) {
    if (typeof create_date == 'string') {
        this.create_date = create_date;
        this.note = note;
        this.type = type;
        this.typeID = typeID ? typeID : 0;
        this.contactID = contactID;
        this.enter_by = enter_by ? enter_by : '1';
        this.noteID = noteID ? noteID : '';
        this.enter_by_name = enter_by_name ? enter_by_name : 'Unknown';
        this.internal_flag = internal_flag ? parseInt(internal_flag) : 0;

    } else if (typeof create_date == 'object') {
        this.create_date = create_date.create_date;
        this.note = create_date.note;
        this.type = create_date.type;
        this.typeID = create_date.typeID;
        this.contactID = create_date.contactID;
        this.enter_by_name = create_date.enter_by_name ? create_date.enter_by_name : 'Unknown';
        this.enter_by = create_date.enter_by ? create_date.enter_by : '1';
        this.noteID = create_date.noteID ? create_date.noteID : '';
        this.internal_flag = create_date.internal_flag ? parseInt(create_date.internal_flag) : 0;
    } else {
        this.create_date = getDateTime(new Date());
        this.note = '';

        var form = document.location.href.split('/').pop().split('.')[0].replace(/addnew|-|form|1|2|3|4|5|6|7|8|9|0/g, '');
        this.type = form.charAt(0).toUpperCase() + form.slice(1);

        this.typeID = 0;
        this.noteID = 0;
        this.contactID = 0;
        this.enter_by = localStorage.getItemValue('userID');
        this.enter_by_name = decodeURIComponent(localStorage.getItemValue('user_name'));
        this.internal_flag = 1;
    }

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
}
var flag_text = {
    internal: 'Internal Office Only',
    global: 'All Office'
}
NoteContact.prototype.constructor = NoteContact;
NoteContact.prototype = {
    init: function () {
        if ($('#table_note_info tbody').children('tr').length == 0)
            $('#table_note_info tbody').append(this.createTableNoteRow(true));
        setTimeout(this.bindEvent(), 200);
        // this.bindEvent();
    },
    unbindEvent: function () {
        var _self = this;
        var currentFormID = '#' + formID[_self.type] + ' #table_note_info tbody';
        $(currentFormID + ' input').unbind('focus click hover');
        $(currentFormID + ' tr td:nth-child(9)').unbind('click');
        $(currentFormID + ' tr:last').remove();
    },
    bindEvent: function () {
        var _self = this;
        var currentFormID = '#' + formID[_self.type] + ' #table_note_info tbody';
        $(document).on('focusin', currentFormID + ' tr:last input', function () {
            if (this.value.length > 1) return;
            var index = $(this).closest('tr').index();
            var tableLength = $(currentFormID).children('tr').length - 1;
            if (index == tableLength) {
                _self.create_date = getDateTime();
                $(currentFormID).append(_self.createTableNoteRow(true));
                // var needScroll = document.getElementById('note_info_pane');
                // if (!needScroll) {
                //     needScroll = document.getElementById('collaped_notes');
                // }
                // needScroll.scrollTop = needScroll.scrollHeight;
                // _self.bindEvent();
            }
        });
        $(document).on('click', currentFormID + ' tr td.note-flag', function () {
            var checked = $(this).find('input').prop('checked');
            if (checked) {
                $(this).find('span').removeClass('fa-flag');
                $(this).find('span').addClass('fa-flag-o');
                $(this).find('label').text(flag_text.internal)
                $(this).find('a').attr('class', 'text-warning');
            } else {
                $(this).find('span').removeClass('fa-flag-o');
                $(this).find('span').addClass('fa-flag');
                $(this).find('label').text(flag_text.global);
                $(this).find('a').attr('class', 'text-success');
            }
            $(this).find('input').prop('checked', !checked)
        });
    },
    setID: function (id) {
        this.noteID = id;
    },

    createTableNoteRow: function (isNew) {
        var _class = '';
        if ((this.enter_by != localStorage.getItemValue('userID') || (this.contactID && this.enter_by != this.contactID)) && !this.internal_flag) _class = ' class="hidden"';
        return '<tr' + _class + '>' +
            '<td class="" style="width:140px;">' + this.create_date + '</td>' +
            '<td class="hasinput" title="' + this.note + '"><input type="text" class="form-control" value="' + this.note + '"' + (isNew ? ' placeholder="Note"' : ' readonly') + '>' + '</td>' +
            '<td class="" style="max-width:50px;">' + this.type + '</td>' +
            '<td class="hidden">' + (this.typeID ? this.typeID : '') + '</td>' +
            '<td class="" style="width:140px;">' + (this.enter_by_name ? this.enter_by_name : '') + '</td>' +
            '<td class="hidden">' + (this.contactID ? this.contactID : '') + '</td>' +
            '<td class="hidden">' + (this.noteID ? this.noteID : '') + '</td>' +
            '<td class="hidden">' + (this.enter_by ? this.enter_by : localStorage.getItemValue('userID')) + '</td>' +
            '<td class="pointer note-flag"><input type="checkbox" style="display:none"' + (this.internal_flag ? ' checked' : '') + '><a class="pointer ' + (this.internal_flag ? 'text-success' : 'text-warning') + '"><span class="fa ' + (this.internal_flag ? 'fa-flag' : 'fa-flag-o') + '"></span>&nbsp;<label>' + (this.internal_flag ? flag_text.global : flag_text.internal) + '</label></a></td>' +
            '</tr>';
    },
    getNotes: function (table) {
        if (!table) table = '#' + formID[this.type] + ' #table_note_info';
        var result = [];
        result.length = 0;
        $(table + ' tbody').find('tr').each(function (row, elem) {
            var $tds = $(this).find('td'),
                date = $tds.eq(0).text(),
                note = $tds.eq(1).find('input').val(),
                type = $tds.eq(2).text(),
                typeID = $tds.eq(3).text(),
                // enter_by_name = $tds.eq(4).text();
                contactID = $tds.eq(5).text(),
                noteID = $tds.eq(6).text(),
                enter_by = $tds.eq(7).text(),
                internal_flag = $tds.eq(8).find('input').prop('checked') == true ? 1 : 0;

            if (date != '' && note != '' && type != '') {
                item = { 'create_date': date, 'note': note, 'type': type, 'typeID': typeID, 'enter_by': enter_by, 'internal_flag': internal_flag };
                if (noteID != '') {
                    item.noteID = noteID;
                    item.contactID = contactID
                }
                result.push(item);
            }
        });
        return result;
    },
    removeItemNote: function (element) {
        $(element).closest('tr').remove();
    },

    displayList: function (listNotes, cannotEdit) {
        if (listNotes != undefined && listNotes.length > 0) {
            var _html = '';
            for (var i = listNotes.length - 1; i >= 0; i--) {
                var _note = new NoteContact(listNotes[i]);
                _html += _note.createTableNoteRow();
            }
            $('#' + formID[this.type] + ' #table_note_info tbody').prepend(_html);
            // var needScroll = document.getElementById('note_info_pane');
            // if (!needScroll) {
            //     needScroll = document.getElementById('collaped_notes');
            // }
            // needScroll.scrollTop = needScroll.scrollHeight;
            if (!cannotEdit)
                this.bindEvent();
        } else {
            return;
        }
    },
    requestAddNote: function () {
        var _data = {};
        _data.note = [JSON.parse(JSON.stringify(this))];

        var cn = new NoteContact(_data.note[0]);

        if (_data.note[0].noteID == '') {
            delete _data.note[0].noteID;
            delete _data.note[0].enter_by_id;
            delete _data.note[0].enter_by_name;
        }
        _data.id = localStorage.getItemValue('userID')
        _data.token = localStorage.getItemValue('token');
        _data.jwt = localStorage.getItemValue('jwt');
        _data.private_key = localStorage.getItemValue('userID');
        $.ajax({
            url: link._note_AddNew,
            type: 'POST',
            data: _data,
            dataType: 'json',
            success: function (res) {
                if (res.id) {
                    cn.setID(res.id);
                    var newRow = cn.createTableNoteRow();
                    $('#' + formID[this.type] + ' #table_note_info tbody').prepend(newRow);
                }
            }
        })
    },
}
var _notecontact = new NoteContact();
_notecontact.init();