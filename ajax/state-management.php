<?php
require_once 'inc/init.php';
?>

<style>
   #state_new_list tbody tr td:not(.hasinput) {
      cursor: text;
   }
</style>
<link rel="stylesheet" type="text/css" href="<?= ASSETS_URL ?>/css/checkbox.css">
<section id="widget-grid" class="">
   <div class="row">

      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-md-12 col-lg-12">
         <!-- Widget ID (each widget will need unique ID)-->
         <div class="jarviswidget" data-widget-colorbutton="true" data-widget-editbutton="false">
            <header>
               <h2><i class="fa fa-cog"></i> State Management</h2>
               <?php
               // $help_form = 'warranty';
               // include 'btn-help.php';
               // unset($help_form);
               ?>
            </header>
            <div>
               <div class="jarviswidget-editbox"></div>
               <div class="widget-body">
                  <div id="message_form" role="alert" style="display:none"></div>
                  <fieldset class="filter_pane">
                     <div class="row">
                        <div class="col-md-11 col-xs-12 pl-0 pr-0">
                           <section class="col-sm-4 col-xs-6">
                              <label class="input">City</label>
                              <input type="text" name="city" class="form-control" minlength="3">
                           </section>
                           <section class="col-sm-4 col-xs-6">
                              <label class="input">State</label>
                              <div class="input-group" style="display:flex">
                                 <select name="state" class="form-control" style="width:100%"></select>
                                 <span class="btn-sm btn-clear-select no-border-radius input-group-addon pointer hover-danger" style="width:unset; padding: 9px 11px;" data-select="state" rel="tooltip" data-placement="top" title="" data-original-title="Clear"> <i class="fa fa-minus"></i> </span>
                              </div>
                           </section>
                           <section class="col-sm-4 col-xs-6">
                              <label class="input">Zipcode</label>
                              <input type="text" name="postal_code" class="form-control">
                           </section>
                        </div>
                        <div class="col-md-1 col-xs-12 pl-0">
                           <label class="input">&nbsp;</label>
                           <label class="input">&nbsp;</label>
                           <button type="button" class="btn btn-primary btnSearch"><i class="fa fa-search"></i> Search</button>
                        </div>
                     </div>
                  </fieldset>
                  <table id="state_system_list" class="table table-hovered table-bordered" style="width:100%">
                     <caption>
                        <h3 class="bold text-black">Search result</h3>
                     </caption>
                  </table>
                  <caption>
                     <h3 class="bold text-black">Insert new state</h3>
                  </caption>
                  <div>
                     <table id="state_new_list" class="table table-hovered table-bordered" style="width:100%">
                        <thead>
                           <tr>
                              <th class="hidden col-xs-1"></th>
                              <th class="col-xs-2">City</th>
                              <th class="col-xs-2">State</th>
                              <th class="col-xs-2">State Code</th>
                              <th class="col-xs-2">Postal Code</th>
                              <th></th>
                           </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                           <tr>
                              <td class="col-xs-1 hidden"><input type="checkbox" id="checkAllState"><label> All</label> </td>
                              <td colspan="5">
                                 <button type="button" class="btn btn-primary pull-right btnAddRecord" style="margin-right:3px;">Add record</button>
                                 <label class="mg-2 pull-right">&nbsp;</label>
                                 <!-- <button type="button" class="btn btn-primary pull-right btnPushRecord">Push into system</button> -->
                              </td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </article>
   </div>
</section>

<script src="<?= ASSETS_URL ?>/js/script/admin-state.js"></script>