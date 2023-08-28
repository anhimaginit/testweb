function MailTemplate() { }
MailTemplate.prototype = {
   constructor: MailTemplate,
   init: function () {
      this.bindEvent()
   },
   bindEvent: function () {
      this.eventLastRow();
   },

   eventLastRow: function () {
      var _self = this;
      var length = $('#template_table_attribute tbody').find('tr').length;
      $('#template_table_attribute tbody input:last').focusin(function (e) {
         if ($(this).closest('tr').index() == length - 1) {
            $('#template_table_attribute tbody').append(_self.newLine());
            _self.eventLastRow();
         }
      });
      $('#template_table_attribute tbody button:last').click(function () {
         if (length > 1)
            _self.removeLine(this);
      });
   },

   newLine: function () {
      return '<tr>' +
         '<td class="hasinput"><input type="text" class="form-control input-underline" placeholder="Input info name. ex: Customer name"></td>' +
         '<td class="hasinput" style="width:20px;"><button class="btn btn-sm btn-ribbon btn-default" style="background:white;border:1px solid #ccc;"><i class="fa fa-times text-danger"></i></button></td>' +
         '</tr>';
   },
   removeLine: function (elem) {
      $(elem).closest('tr').remove();
   },
   getTemplate: function () {
      var result = ['<legend style="font-size: 18px; margin-bottom: 10px;">Contractor Informations</legend>'];
      var attr = [];
      $('#template_table_attribute').find('input').each(function (index, elem) {
         attr.push(elem.value);
         result.push('<div class="form-group">' +
            '<span style="width:40%; line-height: 2.2; font-size: 14px; margin-top: 15px;">Contractor Name:</span>' +
            '<input type="text" style="width:60%; border: 1px solid #ccc; height: 32px; line-height: 1.42857143; padding-left: 5px; float:right" placeholder="Enter Name">' +
            '</div>');
      });
   },
   preView: function (data) {

   },
   submit: function () {

   }
}
new MailTemplate().init();