<?php

require_once 'inc/init.php';
require_once '../php/link.php';

?>
<section id="widget-grid" class="">
   <div class="jarviswidget">
      <header>
         <h2>Import Contact </h2>
         <?php
         // $help_form = 'import';
         // include 'btn-help.php';
         // unset($help_form);
         ?>
      </header>
      <div>
         <div class="jarviswidget-editbox"></div>
         <div class="widget-body no-padding">
            <div id="message_form" role="alert" style="display:none"></div>
            <form class="smart-form" id="import_contact_form" method="post">
               <fieldset>
                  <!-- <div class="row">
                     <section class="col col-6 import-type">
                        <label>Select Contact Type</label>
                        <label class="select">
                           <select id="import-contact-type" class="form-control">
                              <option value="Lead">Lead</option>
                              <?php
                              // $types = file_get_contents(HOST2.'/data/contact-type.json');
                              // $types = json_decode($types);
                              // for ($i=0; $i<sizeof($types); $i++) {
                              //    echo '<option value="'.$types[$i]->value.'">'.$types[$i]->display.'</option>';
                              // }
                              ?>
                           </select><i></i>
                        </label>
                     </section>
                  </div> -->
                  <div class="row contact-import">
                     <section class="col col-6">
                        <label class="input">
                           <input type="file" class="form-control" id="contact_import" name="contact_import" accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
                        </label>
                     </section>
                     <section class="col col-8">
                        <button type="button" id="import-next" class="btn btn-sm btn-primary">Next</button>
                     </section>
                  </div>
               </fieldset>
               <div class="row">
                  <div class="col col-xs-12">
                     <div class="loading-process padding-10" style="margin:auto; z-index:1000; position:relative; display:none; font-size:24px;">
                        <img src="./img/ajax-loader.gif" width="50px" style="margin:auto"> Loading...
                     </div>
                  </div>
               </div>
               <fieldset id="process-contact" style="display: none">
                  <div class="row">
                     <div class="col col-xs-12" id="contact-import-contents"></div>
                  </div>
               </fieldset>
               <fieldset class="contact-errs" style="display: none">
                  <div class="row">
                     <label class="col col-xs-12 has-err">Import Error - add new</label>
                     <div class="col col-xs-12" id="contact-import-errs-add"></div>

                     <label class="col col-xs-12 has-err" style="margin-top: 10px">Import Error - update</label>
                     <div class="col col-xs-12" id="contact-import-errs-up"></div>
                  </div>
                  <div class="row">
                     <div class="col col-6">
                        <button type="button" class="btn btn-sm btn-primary contact-previous">Back</button>&nbsp;&nbsp;&nbsp;
                        <button type="button" class="btn btn-sm btn-primary contact-back">Reload</button>
                     </div>
                  </div>
               </fieldset>
            </form>
         </div>
      </div>
   </div>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/jquery-csv/jquery.csv.min.js"></script>
<!-- <script src="<?php echo ASSETS_URL; ?>/test.js"></script> -->
<script src="<?php echo ASSETS_URL; ?>/js/script/import/import-contact.js"></script>