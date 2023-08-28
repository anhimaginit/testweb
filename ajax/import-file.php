<?php
require_once 'inc/init.php';
?>
<section id="widget-grid" class="">
   <div class="row">
      <article class="col-sm-12 col-md-12 col-lg-12">
         <div class="jarviswidget" id="wid-form-import" data-widget-editbutton="false" data-widget-deletebutton="false">
            <header>
					<span class="widget-icon"> <i class="fa fa-check"></i> </span>
					<h2>Import File </h2>
				</header>
				<div>
               <div class="jarviswidget-editbox"></div>
               <div class="widget-body">
                  <div class="row">
                     <form class="smart-form" action="<?=HOST?>/_import_fileCSV.php" id="form_import">
                        <input type="hidden" name="token" value="<?=$_SESSION['token']?>">
                        <input type="hidden" name="jwt" value="<?=$_SESSION['jwt']?>">
                        <input type="hidden" name="private_key" value="<?=$_SESSION['userID']?>">
                        <fieldset>
                           <div class="form-group">
                              <label class="padding-5">Import for Form:</label>
                              <select name="form" class="form-control col-6">
                                 <option value="ContactForm">Contact Form</option>
                                 <option value="CompanyForm">Company Form</option>
                                 <option value="ProductForm">Product Form</option>
                                 <option value="OrderForm">Order Form</option>
                                 <option value="WarrantyForm">Warranty Form</option>
                                 <option value="ClaimForm">Claim Form</option>
                                 <option value="InvoiceForm">Invoice Form</option>
                              </select>
                           </div>
                           <div class="form-group">
                              <label class="padding-5">Import File: </label>
                              
                              <input type="file" name="productFile" accept=".csv, .txt" class="import-file btn btn-default form-control col-6">
                           </div>
                        </fieldset>
                        <fieldset>
                           <div id="import_file"></div>
                        </fieldset>
                        <footer>
                           <button type="button" class="btn btn-default">Cancel</button>
                           <button type="submit" class="btn btn-primary" form="form_import">Submit</button>
                        </footer>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </article>
   </div>
</section>
<script src="<?= ASSETS_URL ?>/js/script/compare-strings.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/import-file.js"></script>
<script>
   var _import = new ImportFile({
      table : 'import_file',
      form : 'form_import'
   });
   _import.init();
</script>