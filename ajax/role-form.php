<?php

require_once 'inc/init.php';

$roleForm = 'PermissionForm';

$_authenticate->checkFormPermission($roleForm);

$role = 'edit';
?>
<div>
  <?php
  // $help_form = 'acl';
  // include 'btn-help.php';
  // unset($help_form);
  ?>
  <h1>ACL Management</h1>
</div>
<section id="widget-grid" class="">
  <div class="row">
    <div class="smart-form" id="message_form"></div>
    <div class="smart-form padding-5" id="role_form" style="width:98%">
      <fieldset>
        <div class="row">
          <section class="col col-3">
            <label class="label">Unit</label>
            <label class="select">
              <select name="acl_types" id="unit"></select><i></i>
            </label>
          </section>
          <section class="col col-3">
            <label class="label">Role</label>
            <label class="select ">
              <select name="level" id="levels"></select><i></i>
            </label>
          </section>
          <section class="col col-3">
            <label class="label">Group</label>
            <label class="select">
              <select name="group" id="group"></select><i></i>
            </label>
          </section>
          <section class="col col-3">
            <label class="label">&nbsp;</label>
            <button type="button" class="btn btn-sm btn-default load_self pull-right">View Your ACL</button>
          </section>
        </div>
      </fieldset>
      <fieldset id="acl_content">
      </fieldset>
    </div>
  </div>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/script/acl/acl-append.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/acl/acl-role.js"></script>