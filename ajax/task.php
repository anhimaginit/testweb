<?php

$taskForm = 'TaskForm';

use SmartUI\Components\SmartForm;

require_once 'inc/init.php';
require_once '../php/link.php';

$_authenticate->checkFormPermission($taskForm);

$assign_to_list = HTTPMethod::httpPost($link['_employeeList'], array('token' => $_SESSION['token'], 'jwt' => $_SESSION['jwt'], 'private_key' => $_SESSION['userID']));
$assign_to_list = $assign_to_list->list;

$editedTask = array();
$task_current_form = 'add';
$isUpdate = false;
if (hasIdParam()) {
   $editedTask = HTTPMethod::httpPost(
      HOST . '/_taskDetail_id.php',
      array(
         'token' => $_SESSION['token'],
         'jwt' => $_SESSION['jwt'],
         'private_key' => $_SESSION['userID'],
         'taskID' => getID()
      )
   );
   if (isset($editedTask->task) && isset($editedTask->task->id)) {
      $task_current_form = 'edit';
      $editedTask = (object) $editedTask->task;
      $isUpdate = true;
      // echo json_encode($editedTask);
   } else { 
      print('<script>messageForm("The task wasn\'t found in system or you couldn\'t control task '.getID().'. Please check again", false)</script>');
   }
}

?>
<link rel="stylesheet" href="<?= ASSETS_URL ?>/css/bootstrap-timepicker.css">

<section id="widget-grid" class="">
   <div class="row">

      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-md-12 col-lg-12">
         <!-- Widget ID (each widget will need unique ID)-->
         <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
            <header role="heading">
               <h2 style="width:auto">Task Form <?= $isUpdate ? 'ID: ' . $editedTask->id : '' ?> </h2>
               <?php
               // $help_form = 'warranty';
               // include 'btn-help.php';
               // unset($help_form);
               ?>
               <?php if ($isUpdate) { ?>
                  <div class="jarviswidget-ctrls" id="task-form-control" role="menu">
                     <a href="./#ajax/task.php" class="jarviswidget-toggle-btn btn-primary have-text pl-5 pr-5"><i class="fa fa-plus"></i> Create new task</a>
                  </div>
               <?php } ?>
            </header>
            <div>
               <?php
               if ($isUpdate && isset($editedTask->claimID) && $editedTask->claimID != '') {
                  echo '<div>This task is used for claim: ' . $editedTask->claimID . '. <a href="./#ajax/claim-form.php?id=' . $editedTask->claimID . '"> Click here to go to claim <i class="fa fa-external-link"></i></a></div>';
               }
               ?>
               <div class="jarviswidget-editbox"></div>
               <div id="message_form" role="alert" style="display:none"></div>
               <form class="smart-form" id="task_form" method="post">
                  <input type="hidden" name="id" value="<?= ($isUpdate ? $editedTask->id : '') ?>">
                  <?php if ($isUpdate) { ?>
                     <input type="hidden" id="assign" data-name="<?= $editedTask->assign_name ?>" data-value="<?= $editedTask->assign_id ?>">
                     <input type="hidden" id="customer" data-name="<?= $editedTask->cus_name ?>" data-value="<?= $editedTask->customer_id ?>">
                  <?php } ?>
                  <input type="hidden" name="createDate" value="<?= ($isUpdate ? $editedTask->createDate : '') ?>">
                  <fieldset>
                     <div class="row">
                        <?php
                        SmartForm::print_field('taskName', SmartForm::FORM_FIELD_INPUT, array(
                           'label' => 'Task Name',
                           'disabled' => !hasPermission($taskForm, 'taskName', $task_current_form),
                           'value' => ($isUpdate ? $editedTask->taskName : '')
                        ), 6, false, hasPermission($taskForm, 'taskName', 'show'));
                        if (hasPermission($taskForm, 'assign_id', 'show')) {
                           ?>
                           <section class="col col-6">
                              <label class="input">Assign To <a id="assign_link" class="pointer"></a></label>
                              <select name="assign_id" style="width:100%" class="form-control" <?= hasPermission($taskForm, 'assign_id', $task_current_form) ? '' : 'disabled="disabled"' ?>></select>
                           </section>
                        <?php }
                        if ($isUpdate && hasPermission($taskForm, 'customer_id', 'show')) { ?>
                           <section class="col col-6">
                              <label class="input">Customer <span class="link_to" data-view="link_to" data-form="#task_form" data-control="customer_id" data-name="contact-form" data-param="id"></span></label>
                              <select name="customer_id" style="width:100%" class="form-control" <?= hasPermission($taskForm, 'customer_id', $task_current_form) ? '' : 'disabled="disabled"' ?>></select>
                           </section>
                        <?php } ?>
                     </div>
                     <div class="row">
                        <?php

                        SmartForm::print_field('dueDate', SmartForm::FORM_FIELD_INPUT, array(
                           'label' => 'Due Date',
                           'type' => 'date',
                           'class' => 'datepicker',
                           'disabled' => !hasPermission($taskForm, 'dueDate', $task_current_form),
                           'value' => ($isUpdate ? explode(' ', $editedTask->dueDate)[0] : '')
                        ), 6, false, hasPermission($taskForm, 'dueDate', 'show'));

                        SmartForm::print_field('doneDate', SmartForm::FORM_FIELD_INPUT, array(
                           'label' => 'Done Date',
                           'class' => 'datepicker',
                           'type' => 'date',
                           'disabled' => true,
                           'value' => ($isUpdate && $editedTask->doneDate ? explode(' ', $editedTask->doneDate)[0] : ''),
                           'attr' => array(
                              'title="Done date will be automatically updated when status is done"'
                           )
                        ), 6, false, hasPermission($taskForm, 'doneDate', 'show'));

                        if (hasPermission($taskForm, 'time', 'show')) {
                           echo '
                           <section class="col col-md-3 col-sm-6 col-xs-12">
                              <label class="input">Time</label>
                              <div class="input-group" style="display:flex">
                                 <input type="number" class="form-control time_day no-border-right" value="' . ($isUpdate && isset($editedTask->time) ? explode(' ', $editedTask->time)[0] : '')
                              . '" style="width:50%" placeholder="Days"' . (hasPermission($taskForm, 'time', $task_current_form) ? '' : ' readonly') . '>
                                 <input type="text" class="form-control timepicker time_hour no-border-left" value="' . ($isUpdate && isset($editedTask->time) && $editedTask->time != '' && strpos(' ', $editedTask->time) > 0 ? explode(' ', $editedTask->time)[1] : '') . '" style="width:50%" placeholder="hh:mm"' . (hasPermission($taskForm, 'time', $task_current_form) ? '' : ' readonly') . '>
                              </div>
                           </section>
                           ';
                        }

                        if (hasPermission($taskForm, 'time', 'show')) {
                           echo '
                           <section class="col col-md-3 col-sm-6 col-xs-12">
                              <label class="input">Alert</label>
                              <div class="input-group" style="display:flex">
                                 <input type="number" class="form-control alert_day no-border-right" value="' . ($isUpdate && isset($editedTask->alert) ? explode(' ', $editedTask->alert)[0] : '')
                              . '" style="width:50%" placeholder="Days"' . (hasPermission($taskForm, 'time', $task_current_form) ? '' : ' readonly') . '>
                                 <input type="text" class="form-control timepicker alert_hour no-border-left" value="' . ($isUpdate && isset($editedTask->alert) && $editedTask->alert != '' && strpos(' ', $editedTask->alert) > 0 ? explode(' ', $editedTask->alert)[1] : '') . '" style="width:50%" placeholder="hh:mm"' . (hasPermission($taskForm, 'time', $task_current_form) ? '' : ' readonly') . '>
                              </div>
                           </section>
                           ';
                        }

                        if (hasPermission($taskForm, 'time', 'show')) {
                           echo '
                           <section class="col col-md-3 col-sm-6 col-xs-12">
                              <label class="input">Urgent</label>
                              <div class="input-group" style="display:flex">
                                 <input type="number" class="form-control urgent_day no-border-right" value="' . ($isUpdate && isset($editedTask->urgent) ? explode(' ', $editedTask->urgent)[0] : '')
                              . '" style="width:50%" placeholder="Days"' . (hasPermission($taskForm, 'time', $task_current_form) ? '' : ' readonly') . '>
                                 <input type="text" class="form-control timepicker urgent_hour no-border-left" value="' . ($isUpdate && isset($editedTask->urgent) && $editedTask->urgent && strpos(' ', $editedTask->urgent) > 0 ? explode(' ', $editedTask->urgent)[1] : '') . '" style="width:50%" placeholder="hh:mm"' . (hasPermission($taskForm, 'time', $task_current_form) ? '' : ' readonly') . '>
                              </div>
                           </section>
                           ';
                        }

                        SmartForm::print_field('status', SmartForm::FORM_FIELD_SELECT, array(
                           'label' => 'Status',
                           'data' => array(
                              array('label' => 'Open', 'value' => 'open'),
                              array('label' => 'In Progress', 'value' => 'in progress'),
                              array('label' => 'Done', 'value' => 'done'),
                              array('label' => 'Close', 'value' => 'close'),
                           ),
                           'disabled' => !hasPermission($taskForm, 'status', $task_current_form),
                           'value' => 'value',
                           'selected' => ($isUpdate ? $editedTask->status : 'open')
                        ), 3, false, hasPermission($taskForm, 'status', 'show'));

                        SmartForm::print_field('actionset', SmartForm::FORM_FIELD_SELECT, array(
                           'label' => 'Action Set',
                           'data' => array(
                              array('label' => 'Warranty', 'value' => 'warranty'),
                              array('label' => 'Claim', 'value' => 'claim'),
                              array('label' => 'General', 'value' => 'general'),
                           ),
                           'disabled' => !hasPermission($taskForm, 'actionset', $task_current_form),
                           'value' => 'value',
                           'selected' => ($isUpdate ? $editedTask->actionset : 'claim')
                        ), 6, false, hasPermission($taskForm, 'actionset', 'show'));

                        SmartForm::print_field('content', SmartForm::FORM_FIELD_TEXTAREA, array(
                           'label' => 'Content',
                           'class' => 'form-control" rows="8',
                           'disabled' => !hasPermission($taskForm, 'content', $task_current_form),
                           'value' => ($isUpdate ? $editedTask->content : ''),
                           'attr' => array()
                        ), 12, false, hasPermission($taskForm, 'content', 'show'));
                        ?>
                     </div>
                  </fieldset>
                  <footer>
                     <button type="button" class="btn btn-sm btn-default">Cancel</button>
                     <button type="reset" class="btn btn-sm btn-primary">Reset</button>
                     <button type="submit" class="btn btn-sm btn-primary">Submit</button>
                  </footer>

               </form>
            </div>
         </div>
      </article>
   </div>
</section>
<script src="<?= ASSETS_URL ?>/js/plugin/bootstrap-timepicker/jquery-timepicker.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/util/control-select2.js"></script>
<script src="<?= ASSETS_URL ?>/js/util/select-link.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/task/task.js"></script>
<?php if ($isUpdate) { ?>
   <script>
      new ControlPage('#task-form-control');
   </script>

<?php } ?>