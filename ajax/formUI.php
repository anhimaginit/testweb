<?php
require_once 'inc/init.php';
?>
<style>
  table tbody tr td {
    vertical-align: top;
  }

  td {
    word-break: unset;
  }
</style>
<div>
  <h2>Create Form</h2>
</div>
<section id="widget-grid" class="">
  <div class="row">
    <article class="col-sm-12 col-md-12 col-lg-12">
      <div id="message_form" role="alert" style="display:none"></div>
      <form class="smart-form" id="creation_form" method="post">
        <fieldset>
          <div class="row">
            <section class="col col-6">
              <label class="input">Form: <i class="text-danger">*</i></label>
              <input type="text" class="form-control" name="form_name">
            </section>
          </div>
          <div class="row">
            <section class="bg-white">
              <div class="padding-5">
                <table class="table" id="table_form_attribute" style="width:100%">
                  <thead>
                    <th>Label</th>
                    <th>Element</th>
                    <th>Type</th>
                    <th>Data Type</th>
                    <th>Source</th>
                    <th>Attributes</th>
                    <th>Extends</th>
                    <th></th>
                  </thead>
                  <tbody></tbody>
                  <tfoot></tfoot>
                </table>
              </div>
            </section>
          </div>
          <div class="row">

            <section class="col">
              <button type="button" class="btn btn-sm btn-default btnAddFieldset">Add Fieldset</button>
            </section>
          </div>
          <div class="row field_group">
          </div>
          <div class="pull-right">
            <button type="button" class="btn btn-sm btn-primary" id="btnSubmitForm">Create</button>
          </div>
        </fieldset>
      </form>
    </article>
  </div>
</section>

<script src="<?= ASSETS_URL ?>/js/script/form-control/uiform.js"></script>
<script>
  var _form = new UIForm();
</script>