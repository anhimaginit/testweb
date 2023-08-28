function Task() {
   window.complete = false;
}
Task.prototype = {
   constructor: Task,
   init: function (callback) {
      this.setView();
      this.bindEvent();
      this.loadData();
      if (callback) callback();
   },
   bindEvent: function () {
      $('#task_form').validate(this.taskOptionValidate);

      $(document).on('change', '#task_form [name=assign_id]', function () {
         var id = this.value;
         if (id != '') {
            $('#task_form #assign_link').html('Go to contact information <i class="fa fa-external-link"></i>');
            $('#task_form #assign_link').unbind('click').bind('click', function () {
               window.open('./#ajax/contact-form.php?id=' + id, '_blank');
            });
         } else {
            $('#task_form #assign_link').empty();
            $('#task_form #assign_link').unbind('click');
         }
      });

      $(document).on('click', 'input, select, textarea, button', function () {
         $('#message_form').empty().hide();
      })
   },
   loadData: function () {
      $.ajax({
         url: link._employeeList,
         type: 'post',
         dataType: 'json',
         data: { token: localStorage.getItemValue('token'), jwt: localStorage.getItemValue('jwt'), private_key: localStorage.getItemValue('userID') },
         success: function (res) {
            res.list.forEach(function (item, index) {
               res.list[index].id = item.ID;
               res.list[index].text = item.first_name + ' ' + item.last_name;
            });
            $('[name=assign_id]').select2({
               placeholder: 'Select Assign',
               minimumInputLength: 0,
               language: {
                  inputTooShort: function () {
                     return 'Enter name';
                  },
               },
               allowClear: true,
               data: res.list,
               escapeMarkup: function (markup) { return markup; },
               templateResult: function (data) {
                  var add = [];
                  data.primary_state ? add.push(data.primary_state) : '';
                  data.primary_city ? add.push(data.primary_city) : '';
                  var result =
                     '<div class="select2-result-repository clearfix padding-5">' +
                     '<div class="select2-result-repository__meta">' +
                     '<div class="select2-result-repository__title">' + data.text +
                     '<div class="pull-right">' + data.primary_email + '</div>' +
                     '</div>' +
                     '<div class="">' +
                     '<div class="pull-left">' + data.primary_phone + '</div>' +
                     '<div class="pull-right">' + add.join(' - ') + '</div>' +
                     '</div>' +
                     '</div>' +
                     '</div>';
                  return result;
               },
               templateSelection: function (data) {
                  if (!data.text) return data.id;
                  return data.text;
               }
            });
            if ($('#assign').data('value') != '') {
               $('[name=assign_id]').val($('#assign').data('value')).trigger('change');
            } else {
               $('[name=assign_id]').val(null).trigger('change');
            }
         },
         error: function (e) {
            console.error(e);
         }
      })
   },
   setView: function () {
      new ControlSelect2(['[name=customer_id'], { customer_id: _linkSelect.customer }, function () {
         if ($('#customer').data('value') != '') {
            $('[name=customer_id]').append('<option value="' + $('#customer').data('value') + '">' + $('#customer').data('name') + '</option>').trigger('change');
         }
      });

      $('#task_form .datepicker').datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         showOtherMonths: true,
         prevText: '<i class="fa fa-chevron-left"></i>',
         nextText: '<i class="fa fa-chevron-right"></i>'
      });

      $('#task_form .timepicker').timepicker({
         timeFormat: 'HH:mm',
         interval: 15,
         minTime: '00:00',
         maxTime: '23:59',
         startTime: '00:00',
         dynamic: false,
         dropdown: true,
         scrollbar: false
      });
      $('#task_form [name=content]').closest('section').addClass('col col-xs-12');

      $('#task_form [name=content]').summernote({
         height: 300,
         focus: false,
         tabsize: 2,
         placeholder: 'Enter content',
         toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            // ['height', ['height']],
            // ['view', ['fullscreen', 'codeview', 'help']]
         ]
      });
      $('#task_form [name=content]').summernote('code' , $('#task_form [name=content]').val())
   },
   taskOptionValidate: {
      rules: {
         taskName: { required: true },
         assign_id: {},
         customer_id: {},
         dueDate: {},
         doneDate: {},
         time: {},
         status: {},
         actionset: {},
         content: {}
      },
      messages: {
         taskName: { required: 'Please enter task name' }
      },
      submitHandler: function (form) {
         let $task = $(form);
         var _formData = {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID')
         }

         var _data = $("#task_form").serializeArray()
         _data.forEach(function (elem) {
            if (elem.name != '' && elem.value != '') {
               _formData[elem.name] = elem.value;
            }
         });

         _formData.time = (numeral($task.find('input.time_day').val() || 0).value() + ' ' + $task.find('input.time_hour').val()).trim();
         _formData.alert = (numeral($task.find('input.alert_day').val() || 0).value() + ' ' + $task.find('input.alert_hour').val()).trim();
         _formData.urgent = (numeral($task.find('input.urgent_day').val() || 0).value() + ' ' + $task.find('input.urgent_hour').val()).trim();

         var _myLink = link._taskAddNew;

         if (_formData.id && _formData.id != '') {
            _myLink = link._taskUpdate;
         } else {
            _formData.createDate = getDateTime();
            delete _formData.id;
         }
         if (_formData.status == 'done') {
            if (!_formData.doneDate || _formData.doneDate == '') {
               _formData.doneDate = getDateTime();
            }
         } else {
            delete _formData.doneDate;
         }

         _formData.content = $('#task_form [name=content]').summernote('code');

         $.ajax({
            url: _myLink,
            type: 'post',
            dataType: 'json',
            data: _formData,
            success: function (res) {
               if (res.ERROR == '' && res.SAVE == 'SUCCESS') {
                  if (!_formData.id) {
                     var cf = window.confirm('You have successfully create the task. Go to task?');
                     if (cf) {
                        document.location.href += '?id=' + res.id;
                     }
                  } else {
                     messageForm('You have successfully save the task', true);
                  }
               } else {
                  messageForm('Error! An error occurred. ' + res.ERROR, false);
               }
            },
            error: function (e) {

            }
         });

      }
   }
}

var taskForm = new Task();
taskForm.init();