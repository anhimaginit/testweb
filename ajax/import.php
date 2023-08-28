<?php
require_once 'inc/init.php';
?>
<section id="widget-grid" class="">
<iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" style="display:none"></iframe>
   <div class="row">
      <article class="col-sm-12 col-md-12 col-lg-12">
         <form class="smart-form" action="<?=HOST?>/_import_fileCSV.php" id="form_import" method="POST" target="dummyframe" enctype="multipart/form-data">
            <div id="message_form" role="alert" style="display:none"></div>
            <input type="hidden" name="token" value="<?=$_SESSION['token']?>">
            <input type="hidden" name="jwt" value="<?=$_SESSION['jwt']?>">
            <input type="hidden" name="private_key" value="<?=$_SESSION['userID']?>">
            <fieldset>
               <section>
                  <div>
                     <label class="label">Select file</label>
                     <input type="file" accept=".csv" class="import-file" name="productFile" for="import_file" class="form-control">
                  </div>
               </section>
               <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#previewCSVFile">Preview</button>
            </fieldset>
            <footer>
               <button type="button" class="btn btn-sm btn-default">Cancel</button>
               <button type="submit" class="btn btn-sm btn-primary">Submit</button>
            </footer>
         </form>
      </article>
   </div>
</section>

<div class="modal animated fadeInDown" style="display:none; margin:auto; max-height:600px;" id="previewCSVFile">
    <div class="modal-dialog" style="min-width:70%;">
        <div class="modal-content">
            <fieldset>
               <section class="col col-12" style="padding:30px;">
                  <div class="import-table" id="import_file">
                  </div>
               </section>
            </fieldset>
        </div>
    </div>
</div>


<script src="<?php echo ASSETS_URL; ?>/js/script/import.js"></script>
<script>
	loadScript("<?php echo ASSETS_URL; ?>/js/script/note.js");
   ImportFile.init({table: 'import_file'});
   $('#form_import').submit(function(e){
      e.preventDefault();

      $.ajax({
         url : $(this).attr('action'),
         type: $(this).attr('method'),
         data : $(this).serialize(),
         dataType : 'json',
         success : function(res){
            if(res.ERROR_ADD.length==0 && res.ERROR_UP.length==0){
               messageForm('Upload successfully', true, '#form_import #message_form');
            }
         }
      })
   });
</script>