<?php
require_once 'inc/init.php';

?>

<section id="widget-grid" class="">
   <div class="row">
      <article class="col-sm-12">
         <div class="jarviswidget">
            <header>
               <span class="widget-icon"> <i class="fa fa-comments-o"></i> </span>
               <h2>Help Desk</h2>
            </header>
            <div>
               <div class="widget-body widget-body-overflowxy">
                  <div id="message_form" role="alert" style="display:none"></div>
                  <form id="help_form" method="post">
                     <input type="hidden" name='id' value="<?= isset($_GET['id']) ? urldecode($_GET['id']) : '' ?>">
                     <fieldset>
                        <div class="row">
                           <section class="col-md-6">
                              <label class="input">Title</label>
                              <input name="title" class="form-control" value="<?= isset($_GET['title']) ? urldecode($_GET['title']) : '' ?>" required>
                           </section>
                           <section class="col-md-6">
                              <label class="input">File name</label>
                              <input name="filename" class="form-control" value="<?= isset($_GET['help']) ? urldecode($_GET['help']) : '' ?>" required>
                           </section>
                           <section class="col-md-6">
                              <label class="input">Index</label>
                              <input type="number" name="index" value="<?= isset($_GET['index']) ? urldecode($_GET['index']) : '' ?>" class="form-control">
                           </section>
                        </div>
                     </fieldset>
                     <div class="">
                        <section class="col">
                           <label class="form-control-label">Content</label>
                           <div id="contentFile"></div>
                        </section>
                     </div>
                     <div class="pull-right">
                        <button type="button" class="btn btn-default">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                     </div>
                  </form>
               </div>
            </div>
            <div>
      </article>
   </div>
</section>
<script src="js/plugin/summernote/summernote.min.js"></script>
<!-- <script src="https://cdn.ckeditor.com/4.11.4/decoupled-document/ckeditor.js"></script> -->
<script>
   $('#contentFile').summernote({
      height: 380,
      focus: false,
      tabsize: 2,
      placeholder: 'Enter your problem',
   });
   pageSetUp();

   <?php
   if (isset($_GET['help'])) {
      if (file_exists('help/' . urldecode($_GET['help']))) {
         $fileContent = file_get_contents('help/' . urldecode($_GET['help']));
         echo "$('#contentFile').summernote('code', `" . $fileContent . "`);";
      } else {
         echo 'messageForm("The file ' . $_GET['help'] . ' is not found", false);';
      }
   } ?>
</script>
<script src="<?= ASSETS_URL ?>/js/plugin/docx2html/dist/docx2html.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/help/help-desk.js"></script>