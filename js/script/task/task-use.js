function TaskForm(option) {
   if(!option){
      option = {
         element : '[name=assign_task]'
      }
   }
   this.option = option;
   window.freeTask = [];
   window.selectedTask = [];
   this.init();
}
TaskForm.prototype = {
   constructor: TaskForm,
   init: function () {
      var _self = this;
      this.setView();
      _self.bindEvent();
      this.loadFreeTask(function () {
      });
   },
   bindEvent: function () {
      $(this.option.element).on('change', function () {
         console.log(this.value);
      })

   },
   setView: function () {
      function initializeDuallistbox() {
         var initializeDuallistbox = $(this.option.element).bootstrapDualListbox({
            nonSelectedListLabel: 'Available Task',
            selectedListLabel: 'Selected Task',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: false,
            nonSelectedFilter: ''
         });
      }
      loadScript("js/plugin/bootstrap-duallistbox/jquery.bootstrap-duallistbox.min.js", initializeDuallistbox);
   },
   loadData: function (selectedAssign, callback) {
      if (selectedAssign) {
         window.selectedTask = selectedAssign
         var select = $(this.option.element);
         selectedAssign.forEach(function (item, index) {
            select.append('<option value="' + item.id + '" selected>' + item.taskName + ' (from data)</option>');
         });
         window.freeTask.push.apply(window.freeTask, selectedAssign);
         if (callback) callback();
      }
   },
   /**
    * 
    * @param {Function} callback 
    * @purpose : load free task from database
    */
   loadFreeTask: function (callback) {
      $.ajax({
         url: link._taskList,
         type: 'post',
         dataType: 'json',
         data: {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID')
         }, 
         success: function (res) {
            window.freeTask = res;
            if (callback) callback(res);
         },
         error: function (e) {

         }
      })
   },
   /**
    * 
    * @param {Number} index : index in window.freeTask
    */
   selectedTask: function (index) {
      if (index && index != '') {
         window.selectedTask.push(window.freeTask[index]);
      }
   },
   /**
    * 
    * @param {Number} index : index in window.selectedTask
    */
   unselectedTask: function (index) {
      if (index && index != '') {
         window.selectedTask.splice(index, 1);
      }
   },
   getAssignTask: function () {
      return window.selectedTask;
   },
   getAssignTaskID: function () {
      var result = [];
      window.selectedTask.forEach(function (item, index) {
         result.push(item.id);
      });
   }
}

var taskForm = new TaskForm();