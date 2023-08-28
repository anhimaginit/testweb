function NoteContact(create_date, note, type, typeID, noteID, contactID, enter_by, noteID, enter_by_name) {
   if (typeof create_date == 'string') {
      this.create_date = create_date;
      this.note = note;
      this.type = type;
      this.typeID = typeID ? typeID : 0;
      this.contactID = contactID;
      this.enter_by = enter_by ? enter_by : '1';
      this.noteID = noteID ? noteID : '';
      this.enter_by_name = enter_by_name ? enter_by_name : 'Unknown';
   } else if (typeof create_date == 'object') {
      this.create_date = create_date.create_date;
      this.note = create_date.note;
      this.type = create_date.type;
      this.typeID = create_date.typeID;
      this.contactID = create_date.contactID;
      this.enter_by_name = create_date.enter_by_name ? create_date.enter_by_name : 'Unknown';
      this.enter_by = create_date.enter_by ? create_date.enter_by : '1';
      this.noteID = create_date.noteID ? create_date.noteID : '';
   } else {
      this.create_date = getDateTime(new Date());
      this.note = '';
      this.type = 'Contact';
      this.typeID = 0;
      this.noteID = 0;
      this.contactID = 0;
      this.enter_by = '1';
      this.enter_by_name = enter_by_name ? enter_by_name : 'Unknown';

   }
}
NoteContact.prototype.constructor = NoteContact;
NoteContact.prototype = {
   init: function () {
      NoteContact.prototype.bindEvent();
   },
   bindEvent: function () {
      clearNoteForm = this.clearNoteForm;
      $('#btnAddNotes').bind('click', function () {
         if ($('#note_note').val() != '') {
            var newNote = new NoteContact({
               create_date: getDateTime(new Date()),
               note: $('#note_note').val(),
               type: $('#note_type').val(),
               typeID: localStorage.getItemValue('userID'),
               contactID: localStorage.getItemValue('userID'),
               enter_by_name: decodeURIComponent(localStorage.getItemValue('user_name')),
               enter_by: localStorage.getItemValue('userID')
            });
            $('#table_note_info tbody').prepend(newNote.createTableNoteRow());
            clearNoteForm();
         }
      });
   },
   setID: function (id) {
      this.noteID = id;
   },
   clearNoteForm: function () {
      $('#note_note').val('');
      $('#note_type_id').val('');
   },
   createTableNoteRow: function () {
      return '<tr>' +
         '<td>' + this.create_date + '</td>' +
         '<td>' + this.note + '</td>' +
         '<td>' + this.type + '</td>' +
         '<td class="hidden">' + (this.typeID ? this.typeID : '') + '</td>' +
         '<td>' + (this.enter_by_name ? this.enter_by_name : '') + '</td>' +
         '<td class="hidden">' + (this.contactID ? this.contactID : '') + '</td>' +
         '<td class="hidden">' + (this.noteID ? this.noteID : '') + '</td>' +
         '<td class="hidden">' + (this.enter_by ? this.enter_by : '1') + '</td>' +
         '</tr>';
   },
   getNotes: function (table) {
      if (!table) table = '#table_note_info';
      var result = [];
      result.length = 0;
      $(table + ' tbody').find('tr').each(function (row, elem) {
         var $tds = $(this).find('td'),
            date = $tds.eq(0).text(),
            note = $tds.eq(1).text();
         type = $tds.eq(2).text();
         typeID = $tds.eq(3).text();
         // enter_by = $tds.eq(4).text();
         contactID = $tds.eq(5).text();
         noteID = $tds.eq(6).text();
         enter_by = $tds.eq(7).text();

         if (date != '' && note != '' && type != '') {
            item = { 'create_date': date, 'note': note, 'type': type, 'typeID': typeID, 'enter_by': enter_by };
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
      $(element).remove();
   },
   displayList: function (listNotes) {
      if (listNotes != undefined && listNotes.length > 0) {
         var _html = '';
         listNotes.forEach(function (element) {
            var _note = new NoteContact(element);
            _html += _note.createTableNoteRow();
         });
         $('#table_note_info tbody').append(_html);
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
               $('#table_note_info tbody').prepend(newRow);
            }
         }
      })
   },
}
var __notecontact = new NoteContact();
__notecontact.init();