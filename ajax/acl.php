<?php

require_once 'inc/init.php';

$roleForm = 'PermissionForm';

// $_authenticate->checkFormPermission($roleForm);

$role = 'edit';

$hasGroup = isset($_GET['gr']);

?>
<div>
    <h1><?= $hasGroup ? 'ACL Role' : 'General ACL (For None Group Users)' ?></h1>
</div>
<section id="widget-grid" class="">
    <div class="row">
        <div class="smart-form padding-5" id="role_form" style="width:98%">
            <div class="smart-form" id="message_form"></div>
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
                    <?php if ($hasGroup) {
                        $groupList = HTTPMethod::httpPost(HOST . '/_groupList.php', array(
                            'token' => $_SESSION['token'],
                            'jwt' => $_SESSION['jwt'],
                            'private_key' => $_SESSION['userID'],
                            'role' => array((object) array(
                                'department' => $_SESSION['actor'],
                                'level' => $_SESSION['level']
                            )),
                            'login_id' => $_SESSION['userID']
                        ))->list;

                        function sortGroup($a, $b)
                        {
                            $r = strcmp($a->department, $b->department);
                            if ($r < 0 || $r > 0) {
                                return $r;
                            } else {
                                $r = strcmp($a->role, $b->role);
                                if ($r < 0 || $r > 0) {
                                    return $r;
                                } else {
                                    return strcmp($a->group_name, $b->group_name);
                                }
                            }
                        }
                        usort($groupList, 'sortGroup');

                        ?>
                        <section class="col col-3">
                            <label class="inputt">Group</label>
                            <label class="select">
                                <select name="group" id="group">
                                    <option value="">Select Group</option>
                                    <?php
                                        $preDepartment = '';
                                        foreach ($groupList as $group) {
                                            if ($preDepartment !== $group->department) {
                                                if ($preDepartment !== '') {
                                                    echo '</optgroup>';
                                                }
                                                echo '<optgroup label="' . $group->department . '">';
                                            }
                                            echo '<option value="' . $group->ID . '" data-level="' . $group->role . '" data-unit="' . $group->department . '">' . $group->group_name . ' (' . $group->role . ')</option>';
                                            $preDepartment = $group->department;
                                        }
                                        if ($preDepartment !== '') {
                                            echo '</optgroup>';
                                        }
                                        ?>
                                </select><i></i>
                            </label>
                        </section>
                    <?php } ?>
                    <section class="col col-3">
                        <label class="input">&nbsp;</label>
                        <button type="button" class="btn btn-sm btn-default btnSearchACL"><i class="fa fa-search"></i> Search</button>
                        <?php if ($hasGroup) { ?>
                            <button type="button" class="btn btn-sm btn-default loadYourACL">Your ACL</button>
                        <?php } ?>
                    </section>
                </div>
            </fieldset>
            <fieldset id="acl_content">
                <div class="tabbable">
                    <ul class="nav nav-tabs bordered">
                    </ul>
                    <div class="tab-content padding-10">
                    </div>
                </div>
            </fieldset>
        </div>
    </div>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/script/acl/acl.js"></script>
<?php if($hasGroup){ ?>
<script src="<?php echo ASSETS_URL; ?>/js/script/acl/acl-group.js"></script>
<?php } ?>
<script>
    <?php if ($hasGroup) { ?>
        action_form = Object.freeze("<?= HOST . '/_aclRuleUpdate.php' ?>");
        action_search = 'loadGroupACL';
    <?php } else { ?>
        action_form = Object.freeze("<?= HOST . '/_aclChangeDefault.php' ?>");
        action_search = 'loadDefaultACL';
    <?php } ?>
</script>