function HelpDesk() { }
HelpDesk.prototype.constructor = HelpDesk;
HelpDesk.prototype = {
   init: function () {
      this.setView();
      this.bindEvent();
   },
   setView: function () {
      $('#help_form select[name=role]').select2({
         placeholder: 'Select role'
      });

      $('#help_form select[name=unit]').select2({
         placeholder: 'Select unit'
      });
   },
   bindEvent: function () {
      var _self = this;

      $('#help_form').validate(_self.validatorHelpOptions);

      $('input[name=selectFile]').bind('change', function () {
         _self.readFile(this);
      });

      $('#help_form select').on('select2:selecting', function (e) {
         var value = e.params.args.data.id;
         if (value == 'All') {
            $(this).find('option').prop('checked', true);
            $(this).find('option[value=All]').prop('checked', false);
            $(this).select2();
         }
      });
   },
   readFile2: function (fileInput) {
      if (!fileInput) {
         fileInput = document.getElementsByName('selectFile');
      }
      var docx2html = require('docx2html');
      var option = { container: document.getElementsByName('contentFile') }
      docx2html(fileInput.files[0], option).then(function (html) {
         html.toString()
      })
   },
   readFile: function (input) {
      if (!input) {
         input = document.getElementsByName('selectFile');
      }
      if (input.files && input.files[0]) {
         var reader = new FileReader();
         var type = input.value.toLowerCase().split('.').pop();
         var filetypes = ['html', 'css', 'js', 'json', 'php', 'ejs', 'txt'];
         reader.onload = function (e) {
            // var filetypes = ['jpg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'pdf'];
            // if(filetypes.includes(input.value.toLowerCase().split('.').pop())){
            //    var item = `<div class=""><object data="`+e.target.result+ `" width="100%" height="auto" type="application/*"></object>
            //    </div>`
            //    CKEDITOR.instances['contentFile'].setData(item);
            // }else{
            if (filetypes.includes(type)) {
               CKEDITOR.instances['contentFile'].setData(e.target.result);
            }
            // }
         };
         reader.readAsText(input.files[0]);

         var reader2 = new FileReader();
         reader2.onload = function (e) {
            readURLValue = e.target.result;
            var _html = '';
            var other_type = readURLValue.split(';')[0].split(':')[1];
            if (type == 'jpg' | 'jpeg' | 'png' | 'gif') {
               _html = '<img class="img img-responsive img-thumbnail" src="' + 'data:image/jpeg;' + readURLValue.split(';')[1] + '" style="width:auto; height:auto; max-width:800px">'
            } else {
               _html = `<div class=""><object data="` + readURLValue + `" width="800px" height="auto" type="` + other_type + `"></object></div>`;
            }
            if (!filetypes.includes(type)) {
               CKEDITOR.instances['contentFile'].setData(_html);
            }
         };
         reader2.readAsDataURL(input.files[0]);
      }
   },
   validatorHelpOptions: {
      rules: {
         selectFile: { required: false },
         contentFile: { required: true },
         title: { required: true },
         index: { number: true, min: 0 },
         role: { required: true },
         unit: { required: true },
      },
      submitHandler: function (e) {
         var _data = {}
         _data.title = $('#help_form [name=title]').val();
         _data.index = parseInt($('#help_form [name=index]').val());
         _data.role = $('#help_form [name=role]').val();
         _data.unit = $('#help_form [name=unit]').val();
         _data.file_name = $('#help_form [name=selectFile]').val() != '' ? $('#help_form [name=selectFile]').val().split('\\').pop() : new Date().getTime() + _data.title + '.html';
         _data.my_file = CKEDITOR.instances['contentFile'].getData().toString();
         var _link = host2 + 'php/action-help-desk.php';
         $.ajax({
            url: _link,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
               if (res.error == '') {
                  messageForm('You have successfully push help file', true);
               } else {
                  messageForm(res.error, false);
               }
            },
            error: function (e) {
            }
         })
      }
   }
}

var _helper = new HelpDesk();
_helper.init();

$(document).ready(function () {
   $('input, select, button').bind('click', function () {
      $('#message_form').css('display', 'none');
   });
});