function DocumentTable(option) {

   this.table = option.table;
   this.form = option.form;
   this.varName = option.varName;
   this.field = option.field;
   this.documentID = option.documentID; //contactID / vendorID
   this.inputFormID = option.inputFormID; //ID

   this.getTable = '#' + option.form + ' #' + option.table + ' ';
   this.listDoc = [];
   this.documentAttachFiles = [];
   this.indexAttach = -1;
   this.attachElement = null;
   this.readURLContactValue = null;
}
DocumentTable.prototype.constructor = DocumentTable;

DocumentTable.prototype = {
   init: function () {
      removeDocument = this.removeDocument;
      this.bindEvent();
      previewFile = this.previewFile;
      setFileForDoc = this.setFileForDoc;
      updateAttachment = this.updateAttachment;

      this.select2Defined();
   },
   bindEvent: function () {
      var _self = this;
      $(_self.getTable + 'tfoot tr:eq(0) select, ' +
         _self.getTable + 'tfoot tr:eq(0) td input:text, ' +
         _self.getTable + 'tfoot tr:eq(0) td input[type=date]').change(function () {
            if (this.value != '') {
               _self.addDocument();
            }
         });

      /**
      $('#contact_start_date').datepicker({
         dateFormat: 'yy-mm-dd',
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>',
         onSelect: function (selectedDate) {
            $('#contact_exp_date').datepicker('option', 'minDate', selectedDate);
         }
      });
      $('#contact_date_entered').datepicker({
         dateFormat: 'yy-mm-dd',
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>',
      });
      */
      $(_self.getTable + '.datepicker').datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         showOtherMonths: true,
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>',
         minDate: new Date(),
         maxDate: '+100Y',
      });

      $(_self.getTable + '#attachfile').click(function () {
         _self.indexAttach = -1;
         $(_self.getTable + '.inputattachfile').click();
      });

      $(_self.getTable + '.inputattachfile').change(function () {
         if ($(this).files && $(this).file[0] && $(this).files[0].size > 512000) {
            messageForm("File is too large!", 'warning', $(_self.getTable).parent().find('.message_table:first'));
            $(this).val('');
            return;
         };
         if ($(this).val() != '' && _self.indexAttach == -1) {
            _self.readURLDocument(this);
            $(_self.getTable + '#attachfile').parent().find('i').remove();
            $(_self.getTable + '#attachfile').html('<span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;"></span> ' +
               $(_self.getTable + '.inputattachfile').val().split('\\').pop());
            $(_self.getTable + '#attachfile').after(' <i class="fa fa-check-circle text-success"></i>');
            setTimeout(function () { _self.addDocument() }, 100);
         } else if ($(this).val() != '' && _self.indexAttach != -1 && _self.indexAttach != undefined) {
            if ($(_self.getTable + '.inputattachfile')[0].files && $(_self.getTable + '.inputattachfile')[0].files[0]) {
               _self.updateAttachment();
            }
         }
      });


   },
   pushDocuments: function (list) {
      var _self = this;
      var result = '';
      if (list != undefined && list != '') {
         list.forEach(function (item) {
            $(_self.getTable + 'input[name=' + self.field + ']').val(item.ID);
            item.need_update = (item.need_update == 1 || item.need_update == '1' ? 'Yes' : 'No');
            item.active = (item.active == 1 || item.active == '1' ? 'Yes' : 'No');
            result += _self.createDocumentRow(item);
         });
      }
      $(_self.getTable + ' tbody').html(result);
      $(_self.getTable + 'input[name=' + self.field + ']').val('');

      _self.select2Defined();
   },
   updateAttachment: function () {
      var _self = this;
      var reader = new FileReader();
      reader.onload = function (e) {
         _self.documentAttachFiles.splice(_self.indexAttach, 1, e.target.result);
      }
      reader.readAsDataURL($(_self.getTable + '.inputattachfile')[0].files[0]);
      setTimeout(function () {
         var file_name = $(_self.getTable + '.inputattachfile').val().split('\\').pop();
         if ($(_self.attachElement).parent().prop("tagName").toLowerCase() == 'a') {

            $(_self.attachElement).closest('td').find('input').val(file_name);
            $(_self.attachElement).parent().replaceWith('<a href="javascript:void(0);"><span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;" onclick="setFileForDoc(this, ' + _self.varName + ');"></span><span onclick="previewFile(this, ' + _self.varName + ');">' + file_name + '</span></a>');
            $(_self.getTable + '.inputattachfile').val('');
            _self.indexAttach = -1;
            _self.attachElement = null;
         } else {
            $(_self.attachElement).find('input').val(file_name);
            $(_self.attachElement).replaceWith('<td class="attachment"><input type="hidden" value="' + file_name + '"><a href="javascript:void(0);"><span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;" onclick="setFileForDoc(this, ' + _self.varName + ')"></span><span onclick="previewFile(this, ' + _self.varName + ');">' + file_name + '</span></a></td>');
            $(_self.getTable + '.inputattachfile').val('');
            _self.indexAttach = -1;
            _self.attachElement = null;
         }

      }, 100);
   },
   addDocument: function () {

      var _self = this;
      var $tds = $(_self.getTable + 'tfoot tr:eq(0)');
      // get data from tfoot
      var _data = {
         document_type: $tds.find('td.docType select').val(),
         start_date: '',
         exp_date: $tds.find('td.expDate input').val(),
         date_entered: '',
         need_update: $tds.find('td.needUpdate input').prop('checked') == true ? 'Yes' : 'No',
         active: $tds.find('td._active input').prop('checked') == true ? 'Yes' : 'No',
         image: _self.readURLContactValue ? _self.readURLContactValue : ''
      }
      _data[_self.inputFormID] = $(_self.form + ' input[name="' + _self.inputFormID + '"]').val();
      _data[_self.field] = $(_self.form + ' input[name="' + _self.field + '"]').val();

      //if user select file,  _self.readURLContactValue will not null
      //if user doesn't select file, image will set blank
      if (_self.readURLContactValue) {
         _data.image = _self.readURLContactValue;
         _data.image_name = $(_self.getTable + '.inputattachfile').val().split('\\').pop();
      } else {
         _data.image = '';
      }
      //unset file selected
      _self.readURLContactValue = null;
      //if has blank data or null from input field, stop insert
      $(_self.getTable + 'tbody').append(_self.createDocumentRow(_data));
      //reset form input new contact document
      $tds.find('.docType select').val('');//document type
      $tds.find('.expDate input').val('');//expery date
      $tds.find('.needUpdate input').prop('checked', true);
      $tds.find('._active input').prop('checked', true);
      $(_self.getTable + '#attachfile').parent().find('i').remove();
      $(_self.getTable + '#attachfile').html('<span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;"></span> Select attachment');
      $(_self.getTable + '.inputattachfile').val('');
      _self.select2Defined(_self.getTable + ' tbody .doc_type:last');
      _self.indexAttach = -1;
      var needScroll = document.getElementById(_self.table);
      needScroll.scrollTop = needScroll.scrollHeight;
   },

   readURLDocument: function (input) {
      var _self = this;
      if (input.files && input.files[0]) {
         var reader = new FileReader();
         reader.onload = function (e) {
            _self.readURLContactValue = e.target.result;
         };
         reader.readAsDataURL(input.files[0]);
      }
   },
   /**
    * 
    * @param {Object} data : include {
    * ID: number
    * contactID: number
    * document_type: String
    * start_date: Date
    * exp_date: Date
    * date_entered: Date
    * need_update: boolean
    * active:boolean
    * image: String (link) or img (data base64)
    * image_name: String
    * }
    * 
    * @returns {String} string html for new contact document row
    */
   createDocumentRow: function (data) {
      var _self = this;
      // if (data.document_type == '' || data.start_date == '' || data.exp_date == '') {
      //    return '';
      // }

      if (!data.image) data.image = '';
      if (!_self.documentAttachFiles) {
         _self.documentAttachFiles = new Array();
      }
      _self.documentAttachFiles.push(data.image);
      let plusOption = '';

      if (data.document_type && !$(_self.getTable + 'tfoot tr:eq(0) td.docType select option[value="' + data.document_type + '"]')[0]) {
         plusOption = '<option value="' + data.document_type + '" selected>' + data.document_type + '</option>'
      }

      var create_document_type = $(_self.getTable + 'tfoot tr:eq(0) td.docType select').html().split('selected').join('').split('"' + (data.document_type ? data.document_type : '') + '"').join('"' + (data.document_type ? data.document_type : '') + '" selected');
      var result =
         '<tr>' +
         '<td class="hidden ID">' + (data[_self.inputFormID] ? data[_self.inputFormID] : '') + '</td>' +
         '<td class="hidden docID">' + (data[_self.documentID] ? data[_self.documentID] : '') + '</td>' +
         '<td class="hasinput docType" style="width:185px"><select class="form-control doc_type">' + plusOption + create_document_type + '</select></td>' +
         '<td class="hidden startDate">' + (data.start_date ? data.start_date : '') + '</td>' +
         '<td class="hasinput expDate"><input type="date" class="form-control" value="' + (data.exp_date ? data.exp_date : '') + '"></td>' +
         '<td class="hidden dateEntered">' + (data.date_entered ? data.date_entered : '') + '</td>' +
         '<td class="needUpdate"><label class="checkbox"><input type="checkbox"' + (data.need_update == 'Yes' ? ' checked' : '') + '><i></i></label></td>' +
         '<td class="_active"><label  class="checkbox"><input type="checkbox"' + (data.active == 'Yes' ? ' checked' : '') + '><i></i></label></td>' +
         '<td class="attachment" ' + (!data.image || data.image == '' ? ' onclick="setFileForDoc(this,' + _self.varName + ');"' : '') + '>' +
         '<input type="hidden" value="' + (data.image_name ? data.image_name : (data.image && data.image.startsWith('/photo') ? data.image : '')) + '">' +
         (data.image && data.image != '' ? '<a href="javascript:void(0);">' +
            '<span class="glyphicon glyphicon-paperclip text-info" style="font-size:20px;" onclick="setFileForDoc(this, ' + _self.varName + ');"></span>' +
            '<span onclick="previewFile(this, ' + _self.varName + ');">' +
            (data.image_name ? data.image_name : (data.image && data.image.startsWith('/photo') ? data.image.split('/').pop() : '')) +
            '</span></a>' : '') +
         '</td>' +
         '<td><i class="fa fa-minus-square text-danger" title="Inactive document" onclick="removeDocument(this, ' + _self.varName + ')"></i></td>' +
         '</tr>';
      return result.toString();

   },
   // for remove contact document and attachment
   removeDocument: function (elem, doc) {
      if (!doc) return;
      doc.documentAttachFiles.splice($(elem).closest('tr').index(), 0, '');
      $(elem).closest('tr').find('td._active input').prop('checked', false);
      $(elem).closest('tr').find('td.attachment input').html('<input type="hidden" value="">');
      $(elem).closest('tr').find('td.attachment').attr('click', 'setFileForDoc(this, ' + doc + ')');
      // .click(function () {
      //    doc.setFileForDoc(elem);
      // })
   },
   // for update attachment
   setFileForDoc: function (elem, doc) {
      if (!doc) return;
      doc.indexAttach = $(elem).closest('tr').index();//index row
      doc.attachElement = elem;
      $(elem).closest('form').find('.inputattachfile').click();
   },
   /**
    * @param {Object} elem : element clicked
    * @result : void
    * 
    *  preview attachment file in contact document */
   previewFile: function (elem, doc) {
      var file = doc.documentAttachFiles[$(elem).closest('tr').index()];
      if (file.startsWith('/photo')) {
         if (file.endsWith('.pdf')) {
            $('#' + doc.form + ' #filePreview .modal-content').html('<embed src="' + host + file + '" width="800px" height="2100px" style="overflow:scroll">')
         } else {
            $('#' + doc.form + ' #filePreview .modal-content').html('<img class="img img-responsive img-thumbnail" src="' + host + file + '" style="width:100%; height:auto">');
         }
      } else {
         if (file.startsWith('data:image/')) {
            $('#' + doc.form + ' #filePreview .modal-content').html('<img class="img img-responsive img-thumbnail" src="' + file + '" style="width:100%; height:auto">');
         } else {
            $('#' + doc.form + ' #filePreview .modal-content').html('<object data="' + file + '" width="100%" height="1000px" type="application/pdf"></object>')
         }
      }
      $('#' + doc.form + ' #filePreview').modal('show');
   },
   /** 
    * @param table : table need to get data;
    * @result : list contact document from table
    * 
   */
   getDocuments: function () {
      var _self = this;
      var result = [];
      $(_self.getTable + ' tbody').find('tr').each(function (row, elem) {
         var $tds = $(this);
         var _data = {
            // ID: $tds.eq(0).text(),
            // contactID: $tds.eq(1).text(),
            document_type: $tds.find('td.docType select').val(),
            start_date: $tds.find('td.startDate').text(),
            exp_date: $tds.find('td.expDate input').val(),
            date_entered: $tds.find('td.dateEntered').text(),
            need_update: $tds.find('td.needUpdate input').prop('checked') == true ? 1 : 0,
            active: $tds.find('td._active input').prop('checked') == true ? 1 : 0,
            image_name: $tds.find('td.attachment input').val(),
            image: _self.documentAttachFiles[row],
         }

         _data[_self.inputFormID] = $tds.find('.ID').text();
         _data[_self.documentID] = $tds.find('.docID').text();

         if (_data[_self.inputFormID] == '' || _data[_self.inputFormID] == undefined) {
            delete _data[_self.inputFormID]
         }

         if (_data.image == '') {
            delete _data.image;
            delete _data.image_name;
         }

         if (_data[_self.documentID] == '' || _data[_self.documentID] == undefined) {
            delete _data[_self.documentID];
         }

         if (!_data.exp_date || _data.exp_date == '') {
            _data.exp_date = new Date(new Date().getTime() + 86400000 * 365);
         }

         if (_data.image && _data.image != '' && _data.document_type == '') {
            _data.document_type = 'Untitle';
            result.push(_data);
         } else if (_data.document_type && _data.document_type != '') {
            result.push(_data);
         }
      });
      return result;
   },
   select2Defined: function (elem) {
      if (!elem) elem = this.getTable + 'select.doc_type';
      $(elem).select2({
         containerCssClass: 'input-underline w100',
         allowClear: true,
         tags: true,
         createTag: function (newTag) {
            return {
               id: newTag.term,
               text: newTag.term,
               isNew: true
            };
         }
      });
      $(this.getTable + 'tr td:eq(2) .select2-container').css({ 'width': '180px' })
   },
   datePickerDefined: function (elem) {
      if (!elem) elem = this.getTable + 'input.exp_date';
      $(elem).datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         showOtherMonths: true,
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>'
      })
   }
}