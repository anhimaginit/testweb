function HelpDesk() { }
HelpDesk.prototype.constructor = HelpDesk;
HelpDesk.prototype = {
   init: function () {
      this.setView();
      this.bindEvent();
   },
   setView: function () {
   },
   bindEvent: function () {
      var _self = this;
      $('#help_form').validate(_self.validatorHelpOptions);
   },
   validatorHelpOptions: {
      rules: {
         contentFile: { required: true },
         title: { required: true },
         index: { number: true, min: 0 },
      },
      submitHandler: function (e) {
         var _data = {}
         _data.id = $('#help_form [name=id]').val();
         _data.title = $('#help_form [name=title]').val();
         _data.index = numeral($('#help_form [name=index]').val()).value();
         _data.file_name = $('#help_form [name=filename]').val().endsWith('html') ? $('#help_form [name=filename]').val() : $('#help_form [name=filename]').val() + '.html';
         _data.my_file = $('#contentFile').summernote('code')
         var _link = host2 + 'php/action-help-desk.php';
         if (_data.id == '') delete _data.id;
         $.ajax({
            url: _link,
            type: 'post',
            data: _data,
            success: function (res) {
               res = JSON.parse(res);
               if (res.error == '') {
                  messageForm('You have successfully save help file', true);
                  if (res.id) {
                     $('#help_form [name=id]').val(res.id);
                  }
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
loadScript('js/plugin/docx2html/dist/docx2html.js', HelpDesk);
var _helper = new HelpDesk();
_helper.init();

$(document).ready(function () {
   $('input, select, button').bind('click', function () {
      $('#message_form').css('display', 'none');
   });
});