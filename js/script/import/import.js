class ImportFile {
   /**
    * 
    * @param {String} url : link to file
    * @param {String} table  : table id
    */
   constructor(url, table) {
      this.url = url;
      this.table = table;
   }

   static init(option) {
      $('#' + option.table).before('<input type="file" name="productFile" data-for="' + option.table + '" accept=".csv,.txt" class="import-file" style="display:none">');
      var _innerTable = '<table id="table_' + option.table + '" style="width:100%;" class="table table-bordered"></table>';
      $('#' + option.table).append(_innerTable);

      $('.import-file').change(function () {
         ImportFile.readFile({
            data: this.files[0],
            url: $(this).val(),
            table: $(this).data('for')
         });
      });

      $('.import-button').click(function () {
         $('input.import-file[data-for=' + $(this).attr('for') + ']').click();
         // ImportFile.readFile({
         //    url : link._import_fileCSV,
         //    ajaxData : {token : localStorage.getItemValue('token'), jwt : localStorage.getItemValue('jwt'), private_key : localStorage.getItemValue('userID'), productFile : 'csv'},
         //    table : option.table
         // })
      });

   }

   get url() {
      return this.url;
   }

   get data() {
      return ImportFile.readFile(this.url);
   }
   /**
    * 
    * @param {String} option : 
    * {String} url, 
    * {String} table (table id)
    * 
    */
   static readFile(option) {
      if (typeof (FileReader) != "undefined") {
         var reader = new FileReader();
         reader.onload = function (e) {
            var _table = document.getElementById('table_' + option.table);
            var rows = e.target.result.split("\n");

            /** Create body */
            var maxRowLength = -1;
            for (var i = 1; i < rows.length; i++) {
               var cells = rows[i].split(",");
               if (cells.length > 1) {
                  maxRowLength = cells.length > maxRowLength ? cells.length : maxRowLength;
                  var row = _table.insertRow(-1);
                  for (var j = 0; j < cells.length; j++) {
                     var cell = row.insertCell(-1);
                     cell.innerHTML = cells[j].split('"').join('');
                  }
               }
            }

            /** Create thead */
            var title = rows[0].split(',');
            var header = _table.createTHead();
            var row = header.insertRow(0);
            for (var k = 0; k < title.length; k++) {
               var cell = row.insertCell(-1);
               cell.innerHTML = title[k].split('"').join('');
            }
            if (title.length < maxRowLength) {
               var tmp = 1;
               for (var k = title.length; k < maxRowLength; k++) {
                  var cell = row.insertCell(-1);
                  cell.innerHTML = 'Unknown ' + tmp;
                  title[k] = '"Unknown ' + tmp + '"';
                  tmp++;
               }
            }

            /** Create checkbox display */
            ImportFile.createListCheckbox(title, option);

         }
         if (option.data) {
            reader.readAsText(option.data);
         } else {
            $.post(option.url, option.ajaxData, function (fileContent) {
               // reader.readAsText(fileContent);
            })
         }
      }
   }
   /**
    * 
    * @param {Array} list : title list
    * @param {JsonObject} option : url, table, data,...
    */
   static createListCheckbox(list, option) {
      var _html = '<section class="form-group"><div class="" id="checklist_' + option.table + '">';
      list.forEach(function (item) {
         _html += '<label class="checkbox">'+
                     '<input type="checkbox" class="import-checkbox" value='+ item + ' checked><i></i> ' + item.split('"').join('') +
                  '</label>';
      });
      _html += '</div></section>'
      $('#checklist_' + option.table).remove();
      var _table = $('#' + option.table);
      _table.before(_html);
      $('.import-checkbox').change(function () {
         var isShow = $(this).prop('checked');
         var text = $(this).val();
         var tds = $('#table_' + option.table + ' thead tr').eq(0).find('td');
         for (var i = 0; i < tds.length; i++) {
            if (tds.eq(i).text() == text) {
               var index = i + 1;
               if (isShow) {
                  $('#table_' + option.table + ' td:nth-child(' + index + '), #table_' + option.table + ' th:nth-child(' + index + ')').show();
               } else {
                  $('#table_' + option.table + ' td:nth-child(' + index + '), #table_' + option.table + ' th:nth-child(' + index + ')').hide();
               }
            }
         }

      });
   }

   static readFileBy(type) {

   }
}