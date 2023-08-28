function TaskTemplate() { }

TaskTemplate.prototype = {
   init: function () {
      this.setView();
      this.bindEvent();
      // this.setViewCard();
   },
   bindEvent: function () {
      $(document).on('focusin', 'input, select, textarea, .select2', function () {
         $('#message_form').hide();
      });
      $('.btnAddTask').click(function () {
         $('#pane_task').append(TaskTemplate.prototype.createTaskCard());
         TaskTemplate.prototype.setViewCard();
      });

      $('.btnSubmit').click(function () {
         TaskTemplate.prototype.submitForm();
      });

      $('.btnReset').click(function () {
         $('#pane_task').empty();
         $('[name=actionset]').val(null).trigger('change');
      });

      $(document).unbind('click', '.btnRemoveTask').on('click', '.btnRemoveTask', function () {
         TaskTemplate.prototype.removeTask(this);
      });
   },
   setView: function (data) {
      $('[name=actionset]').select2({
         placeholder: 'Search or add new action',
         tags: "true",
         allowClear: true,
         createTag: function (params) {
            var term = $.trim(params.term);
            if (term === '') return;
            return {
               id: term,
               text: term.upperCaseFirst(),
               newTags: true
            }
         }
      }).on('select2:select', function (e) {
         let data = e.params.data;
         $('#pane_task').empty();
         TaskTemplate.prototype.searchTemplate(data.id);
      });
      $('[name=actionset]').val(null).trigger('change');
   },
   searchTemplate: function (term) {
      let _self = this;
      let _myData = $.extend({}, template_data);
      _myData.actionset = term;
      $.ajax({
         url: link._taskTemplate,
         type: 'post',
         dataType: 'json',
         data: _myData,
         success: function (res) {
            if (res.ERROR == '') {
               $('#pane_task').empty();
               res.list.forEach(function (elem, index) {
                  $('#pane_task').append(_self.createTaskCard(elem));
                  _self.setViewCard(elem, index);
               });
            } else {
               messageForm('An error was occured. Please try again', false);
            }
         }
      })
   },

   submitForm: function () {
      let _data = $.extend({}, template_data);
      _data.actionset = $('[name=actionset').val();
      if (!_data.actionset || _data.actionset == '') {
         return;
      }
      _data.json_template = JSON.stringify(this.getTasks());
      $.ajax({
         url: link._taskTemplateUpdate,
         type: 'post',
         dataType: 'json',
         data: _data,
         success: function (res) {
            if (res.ERROR == '') {
               messageForm('Task template is saved successfully', true);
            } else {
               messageForm('An error was occured. Please try again', false);
            }
         }
      });
   },

   setViewCard: function (dataTemplate = {}, index) {

      if (index !== undefined) {
         $('#pane_task>.task_card>div:eq(' + index + ') select.assignto').select2({
            data: assignList,
         });
         $('#pane_task>.task_card>div:eq(' + index + ') select.assignto').val(dataTemplate.assignto).trigger('change');
      } else {
         $('#pane_task select.assignto:not(.select2-hidden-accessible)').select2({
            data: assignList
         });
         // $('#pane_task .task_card:last select.assignto:last').select2({
         //    data: assignList,
         // });
      }

      $('.timepicker').timepicker({
         timeFormat: 'HH:mm',
         interval: 15,
         minTime: '00:00',
         maxTime: '23:59',
         startTime: '00:00',
         dynamic: false,
         dropdown: true,
         scrollbar: false
      });
   },
   removeTask: function (elem) {
      elem.closest('.task_card').remove();
   },
   createTaskCard: function (data) {
      let _html = `
         <div class="col-xs-12 task_card">
            <div class="">
               <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="input hidden-lg hidden-md">Task Name</label>
                  <div class="mg-r-10">
                     <input type="text" class="form-control task_name" value="${data && data.task ? data.task : ''}">
                  </div>
               </div>
               <div class="col-md-2 col-sm-4 col-xs-6">
                  <label class="input hidden-lg hidden-md">Time</label>
                  <div class="input-group" style="display:flex">
                     <input type="number" class="form-control time_day no-border-right" value="${data && data.time ? (data.time.indexOf(' ') > 0 ? data.time.split(' ')[0] : '') : ''}" style="width:50%" placeholder="Days">
                     <input type="text" class="form-control timepicker time_hour no-border-left" value="${data && data.time ? data.time.split(' ').pop() : ''}" style="width:50%" placeholder="hh:mm">
                  </div>
               </div>
               <div class="col-md-2 col-sm-4 col-xs-6">
                  <label class="input hidden-lg hidden-md">Urgent</label>
                  <div class="input-group" style="display:flex">
                     <input type="number" class="form-control urgent_day no-border-right" value="${data && data.urgent ? (data.urgent.indexOf(' ') > 0 ? data.urgent.split(' ')[0] : '') : ''}" style="width:50%" placeholder="Days">
                     <input type="text" class="form-control timepicker urgent_hour no-border-left" value="${data && data.urgent ? data.urgent.split(' ').pop() : ''}" style="width:50%" placeholder="hh:mm">
                  </div>
               </div>
               <div class="col-md-2 col-sm-4 col-xs-6">
                  <label class="input hidden-lg hidden-md">Alert</label>
                  <div class="input-group" style="display:flex">
                     <input type="number" class="form-control alert_day no-border-right" value="${data && data.alert ? (data.alert.indexOf(' ') > 0 ? data.alert.split(' ')[0] : '') : ''}" style="width:50%" placeholder="Days">
                     <input type="text" class="form-control timepicker alert_hour no-border-left" value="${data && data.alert ? data.alert.split(' ').pop() : ''}" style="width:50%" placeholder="hh:mm">
                  </div>
               </div>
               <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="input hidden-lg hidden-md">Assigned to</label>
                  <div class="mg-r-10">
                     <div class="input-group" style="display:flex">
                        <select class="form-control assignto" style="width:100%"></select>
                        <button type="button" class="btn btn-sm btn-default btnRemoveTask"><i class="fa fa-trash text-danger"></i></button>
                     </div>
                  </div>
               </div>
               <div class="clearfix"></div>
               <hr class="hidden-lg hidden-md" style="margin:5px">
            </div>
         </div>
      `;
      return _html;
   },
   getTasks: function () {
      let result = [];
      $('#task_form #pane_task .task_card').each(function () {
         let $task = $(this);
         let elem = {
            task: $task.find('input.task_name').val() || '',
            time: (numeral($task.find('input.time_day').val() || 0).value() + ' ' + ($task.find('input.time_hour').val()).trim() || '00:00'),
            alert: (numeral($task.find('input.alert_day').val() || 0).value() + ' ' + ($task.find('input.alert_hour').val()).trim() || '00:00'),
            urgent: (numeral($task.find('input.urgent_day').val() || 0).value() + ' ' + ($task.find('input.urgent_hour').val()).trim() || '00:00'),
            assignto: $task.find('select.assignto').val() || ''
         };
         result.push(elem);
      });
      return result;
   }
}

var task_temp = new TaskTemplate();
task_temp.init();