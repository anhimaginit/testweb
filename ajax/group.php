<?php
require_once 'inc/init.php';

$formGroup = 'GroupForm';
$_authenticate->checkFormPermission($formGroup);

$mylink = HOST . '/_groupListUnit.php';
if (isSuperAdmin()) {
   $mylink = HOST . '/_groupList.php';
}

$group = HTTPMethod::httpPost($mylink, array(
   'token' => $_SESSION['token'],
   'jwt' => $_SESSION['jwt'],
   'private_key' => $_SESSION['userID'],
   'unit' => $_SESSION['actor'],
   'role' => $_SESSION['int_acl_short'],
   'login_id' => $_SESSION['userID']
));

$group = $group->list;

$role = HTTPMethod::httpPost(HOST . '/_roles.php', array(
   'token' => $_SESSION['token'],
   'jwt' => $_SESSION['jwt'],
   'private_key' => $_SESSION['userID'],
   'role' => $_SESSION['int_acl_short'],
   'login_id' => $_SESSION['userID']
));

$groupEdited = [];
$roleGroup = 'add';
if (hasIdParam()) {
   $groupEdited = HTTPMethod::httpPost(HOST . '/_groupGetByID.php', array(
      'ID' => getID(),
      'token' => $_SESSION['token'],
      'jwt' => $_SESSION['jwt'],
      'private_key' => $_SESSION['userID']
   ));
   if (isset($groupEdited->group)) {
      $groupEdited = $groupEdited->group;
       //print_r($groupEdited);
      // $groupEdited->users = json_decode($groupEdited->users);
   }
   // foreach ($group as $g) {
   //    if ($g->ID == getID()) {
   //       $groupEdited = $g;
   //    }
   // }
}
$isUpdate = false;
if (isset($groupEdited->ID)) {
   $isUpdate = true;
   $roleGroup = 'edit';
}
?>
<section id="widget-grid" class="">
   <div class="row">

      <article class="col-sm-12 col-md-12 col-lg-12">

         <div class="jarviswidget" id="wid-id-1" data-widget-editbutton="false" data-widget-custombutton="false">
            <header>
               <span class="widget-icon"><i class="fa fa-users"></i> </span>
               <h2> Group </h2>
               <?php
               $help_form = 'group';
               include 'btn-help.php';
               unset($help_form);
               ?>
               <?php if ($isUpdate) echo '<a href="./#ajax/group.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new group</a>'; ?>
            </header>
            <div>
               <div class="jarviswidget-editbox"></div>
               <!-- end widget edit box -->

               <!-- widget content -->
               <div class="widget-body">
                  <div id="message_form" role="alert" style="display:none"></div>
                  <form class="smart-form" id="group_form" method="post">
                     <input type="hidden" name="ID" value="<?= isset($groupEdited->ID) ? $groupEdited->ID : '' ?>">
                     <fieldset>
                        <legend>Your group</legend>
                        <section id="your_group"></section>
                     </fieldset>
                     <fieldset>
                        <div class="row">
                           <?php if (hasPermission($formGroup, 'department', 'show')) { ?>
                           <section class="col col-6">
                              <label class="input">Unit</label>
                              <select name="department" class="form-control" style="width:100%" <?= hasPermission($formGroup, 'department', $roleGroup) ? '' : 'disabled' ?>>
                                 <option value="">Select Unit</option>
                                 <?php
                                    foreach ($role->units as $u) {
                                       $checked =  $isUpdate == true && $u == $groupEdited->department ? 'selected' : '';
                                       echo '<option value="' . $u . '" ' . $checked . '>' . $u . '</option>';
                                    };
                                    ?>
                              </select>
                           </section>
                           <?php } ?>
                           <?php if (hasPermission($formGroup, 'group_name', 'show')) { ?>
                           <section class="col col-6">
                              <label class="input">Group Name</label>
                              <select name="group_name" class="form-control" style="width:100%" <?= hasPermission($formGroup, 'group_name', $roleGroup) ? '' : 'disabled' ?>>
                              </select>
                           </section>
                           <?php } ?>
                        </div>
                        <div class="row">
                           <?php if (hasPermission($formGroup, 'role', 'show')) { ?>
                           <section class="col col-6">
                              <label class="input">Role</label>
                              <select name="role" class="form-control" style="width:100%" <?= hasPermission($formGroup, 'role', $roleGroup) ? '' : 'disabled' ?>>
                                 <option value="">Select Role</option>
                                 <?php

                                    foreach ($role->roles as $r) {
                                       $checked =  $isUpdate == true && $r == $groupEdited->role ? 'selected' : '';
                                       echo '<option value="' . $r . '" ' . $checked . '>' . $r . '</option>';
                                    };
                                    ?>
                              </select>
                           </section>
                           <?php } ?>
                           <?php if (hasPermission($formGroup, 'users', 'show')) { ?>
                           <section class="col col-6">
                              <label class="input">Users</label>
                              <select name="users" class="form-control" style="width:100%" multiple <?= hasPermission($formGroup, 'users', $roleGroup) ? '' : 'disabled' ?>></select>
                           </section>
                           <?php } ?>
                        </div>
                        <div class="row">
                           <?php if (hasPermission($formGroup, 'parent_group', 'show')) { ?>
                           <section class="col col-6">
                              <label class="input">Parent Group</label>
                              <select name="parent_group" class="form-control" style="width:100%" <?= hasPermission($formGroup, 'parent_group', $roleGroup) ? '' : 'disabled' ?>></select>
                           </section>
                           <?php } ?>
                           <?php if (hasPermission($formGroup, 'parent_id', 'show')) { ?>
                           <section class="col col-6">
                              <label class="input">Supervisor</label>
                              <select name="parent_id" class="form-control" style="width:100%" multiple <?= hasPermission($formGroup, 'parent_id', $roleGroup) ? '' : 'disabled' ?>></select>
                           </section>
                           <?php } ?>
                        </div>
                     </fieldset>
                     <?php if (hasPermission($formGroup, 'btnSubmitGroup', 'show')) { ?>
                     <footer>
                        <button type="button" class="btn btn-sm btn-primary" id="btnSubmitGroup">Create</button>
                     </footer>
                     <?php } ?>
                  </form>
               </div>
            </div>
         </div>
      </article>
   </div>
</section>
<script>
   window.group_list = <?=json_encode($group) ?>
</script>
<script>
    window.roleList = <?=json_encode($role->roles) ?>
</script>
<script>
    window.unitList = <?= json_encode($role->units) ?>
</script>
<script src="<?= ASSETS_URL ?>/js/util/control-select2.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/group/group.js"></script>
<script>
   var _group = new Group();

   <?php if (isset($groupEdited->ID)) {
      echo '_group.initUpdate(' . json_encode($groupEdited) . ');';
   } else {
      echo '_group.init();';
   } ?>
</script>