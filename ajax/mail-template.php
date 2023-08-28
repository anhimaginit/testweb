<?php
$invoice_form = 'InvoiceForm';

require_once 'inc/init.php';

?>
<section id="widget-grid" class="">
   <div class="row">
      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-md-12 col-lg-12">

         <!-- Widget ID (each widget will need unique ID)-->
         <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
            <header>
               <h2 style="width:auto;">Mail template
                  <?php
                  if (hasParam('t')) {
                     echo ('edit: ' . $_GET['t'] . '</h2>');
                  } else {
                     echo ('</h2>');
                  }
                  ?>
            </header>
            <!-- widget div-->
            <div>
               <div class="row">
                  <div class="col col-md-6 col-sm-12">

                     <table class="table" style="border:none" id="template_table_attribute">
                        <thead>
                           <tr>
                              <th>Infomation Name:</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td class="hasinput"><input type="text" class="form-control input-underline" placeholder="Input info name. ex: Customer name"></td>
                              <td class="hasinput" style="width:20px"><button class="btn btn-sm btn-ribbon btn-default" style="background:white;border:1px solid #ccc;"><i class="fa fa-times text-danger"></i></button></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
                  <div id='preview' style="width:100%; height:auto;"></div>
               </div>
               <footer>
                  <button type="button" class="btn btn-default" onclick="window.history.back()">Cancel</button>
                  <button type="button" class="btn btn-primary submit">Submit</button>
               </footer>
            </div>
         </div>
      </article>
   </div>
</section>
<script src="<?= ASSETS_URL; ?>/js/script/mail-template.js"></script>