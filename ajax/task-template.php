<?php

$taskForm = 'TaskForm';

use SmartUI\Components\SmartForm;

require_once 'inc/init.php';
require_once '../php/link.php';

$assign_to_list = HTTPMethod::httpPost($link['_employeeList'], array('token' => $_SESSION['token'], 'jwt' => $_SESSION['jwt'], 'private_key' => $_SESSION['userID']));
// echo json_encode($assign_to_list);
$assign_to_list = $assign_to_list->list;
if (basename($_SERVER['PHP_SELF']) == 'claim-form.php') {
   $current_form = 'edit';
}
for ($i = 0; $i < sizeof($assign_to_list); $i++) {
   $assign_to_list[$i]->id = $assign_to_list[$i]->ID;
   $assign_to_list[$i]->text = $assign_to_list[$i]->first_name . ' ' . $assign_to_list[$i]->last_name;
}

$editedTaskTemplate = array();
$task_template_current_form = 'add';


$actionsetList = HTTPMethod::httpPost(HOST.'/_actionset_list.php', array('token'=> $_SESSION['token']));
if(isset($actionsetList) && isset($actionsetList->list))
$actionsetList = $actionsetList->list;
else $actionsetList = [];
?>
<link rel="stylesheet" href="<?= ASSETS_URL ?>/css/bootstrap-timepicker.css">

<section id="widget-grid" class="">
   <div class="row">

      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-md-12 col-lg-12">
         <!-- Widget ID (each widget will need unique ID)-->
         <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
            <header>
               <h2 style="width:auto">Task Template Form <?= $isUpdate ? 'ID: ' . $editedTask->id : '' ?> </h2>
               <?php
               // $help_form = 'warranty';
               // include 'btn-help.php';
               // unset($help_form);
               ?>
            </header>
            <div>
               <div class="jarviswidget-editbox"></div>
               <div id="message_form" role="alert" style="display:none"></div>
               <form class="smart-form" id="task_form" method="post">
                  <input type="hidden" name="id" value="<?= ($isUpdate ? $editedTask->id : '') ?>">
                  <fieldset>
                     <div class="row">
                        <section class="col col-6">
                           <label class="input">For</label>
                           <select name="actionset" class="form-control" style="width:100%">
                           <?php
                           foreach($actionsetList as $actionset){
                              echo '<option value="'. $actionset.'">'.ucwords($actionset).'</option>';
                           }
                           ?>
                           </select>
                        </section>
                     </div>
                     <div class="row">
                        <div class="hidden-xs hidden-sm bold text-center">
                           <div class="col-md-3 bold text-center">Task Name</div>
                           <div class="col-md-2 bold text-center">Time</div>
                           <div class="col-md-2 bold text-center">Alert</div>
                           <div class="col-md-2 bold text-center">Urgent</div>
                           <div class="col-md-3 bold text-center">Assigned to</div>
                        </div>
                        <div id="pane_task"></div>
                        <div class="clearfix"></div>
                        <div class="padding-5">
                           <button type="button" class="btn btn-lg btn-info btnAddTask"><i class="fa fa-plus"></i> Add Task</button>
                        </div>
                  </fieldset>
                  <footer>
                     <button type="button" class="btn btn-sm btn-default">Cancel</button>
                     <button type="button" class="btn btn-sm btn-primary btnReset">Reset</button>
                     <button type="button" class="btn btn-sm btn-primary btnSubmit">Submit</button>
                  </footer>
               </form>
            </div>
         </div>
      </article>
   </div>
</section>
<script src="<?= ASSETS_URL ?>/js/plugin/bootstrap-timepicker/jquery-timepicker.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/util/control-select2.js"></script>
<script>
var assignList = <?= json_encode($assign_to_list) ?>;
assignList.splice(0,0,{id : '0', value: 'Select Assigned to'});
</script>
<script src="<?= ASSETS_URL ?>/js/script/task/task-template.js"></script>