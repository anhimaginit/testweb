<link rel="stylesheet" type="text/css" href="<?= ASSETS_URL ?>/js/plugin/datetimepicker/jquery.datetimepicker.css">

<fieldset style="overflow:auto">
   <div class="clearfix"></div>
   <legend>Claim Assign Task</legend>
   <input type="hidden" name="">

   <div id="message_task_table" role="alert" style="display:none"></div>
   <table id="tblTaskTemplateList" class="table table-bordered table-tripped" style="width:100%;">
      <thead>
         <tr>
            <th style="min-width:120px;">Task Name</th>
            <th style="min-width:50px;">Time</th>
            <th>Assigned to</th>
            <th style="width:120px;">Create Date</th>
            <th style="width:120px;">Due Date</th>
            <th style="width:80px;">Status</th>
            <th style="width:fit-content">Action</th>
         </tr>
      </thead>
      <tbody></tbody>
      <tfoot>
         <tr>
            <td class="text-right" colspan="7">
               <label class="btn btn-sm btn-primary" id="btnAddTaskItem">Add Task</label>
            </td>
         </tr>
      </tfoot>
   </table>
</fieldset>

<script>
    var jsonAssignTaskTable = <?php echo json_encode(isset($claimDataEdit->assign_task) ? $claimDataEdit->assign_task : array()) ?>;
</script>
<script src="<?php echo ASSETS_URL ?>/js/plugin/datetimepicker/build/jquery.datetimepicker.full.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/claim/claim-task.js"></script>

<script>
   var claimTask = new ClaimTask();
   claimTask.init();
</script>
<!-- <script src="<?php echo ASSETS_URL; ?>/js/script/claim/claim-form.task.js"></script> -->