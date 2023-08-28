<?php
require_once 'inc/init.php';
$help_extend = json_decode(file_get_contents('../data/help-extend.json'));
?>

<style>
#preView img{
   max-width: 100%;
}
</style>

<section id="widget-grid" class="">
   <div class="row">
      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-md-12 col-lg-12">

         <!-- Widget ID (each widget will need unique ID)-->
         <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
            <header>
               <h2 style="width:auto;">Help Files</h2>
               <a href="./#ajax/help-create-content.php" class="btn btn-primary pull-right">Create new content</a>
            </header>
            <!-- widget div-->
            <div>
               <table class="table table-bordered">
                  <thead>
                     <th>Help</th>
                     <?php if(isAdmin()){ echo '<th>Preview</th><th>Delete</th>'; }?>
                  </thead>
                  <tbody>
                     <?php
                     foreach ($help_extend as $subhelp) {
                        if (isset($subhelp->title) && isset($subhelp->url) && isset($subhelp->id)) {
                           echo '<tr>';
                           if (!isUser()) {
                              echo '<td title="Go to edit ' . $subhelp->title . '" onclick="window.open(`./#ajax/help-create-content.php?help=' . ($subhelp->url) . '&id=' . $subhelp->id . '&title=' . $subhelp->title . '&index=' . $subhelp->index . '`, `_self`)">' . $subhelp->title . '</td>';
                              echo '<td onclick="preview(\'' . $subhelp->url . '\')"><button type="button" class=""><i class="fa fa-eye"></i> Preview</button></td>';
                           } else {
                              echo '<td onclick="preview(\'' . $subhelp->url . '\')">' . $subhelp->title . '</td>';
                           }
                           if(isAdmin()){
                              echo '<td><button onclick="deleteFile(`' . $subhelp->id . '`, this)" title="Delete ' . $subhelp->title . ' file"><i class="fa fa-trash"></i></button></td>';
                           }
                           echo '</tr>';
                        }
                     }
                     ?>
                  </tbody>
               </table>
            </div>
         </div>
      </article>
   </div>
</section>
<div class="modal fade" style="display:none; margin:auto; max-height:600px;" id="preView">
   <div class="modal-dialog" style="min-width:60%;margin:auto;">
      <div class="modal-header" style="height:auto; background:#e5e5e5">
         <div>Preview File</div>
      </div>
      <div class="modal-content padding-10" style="">
      </div>
   </div>
</div>
<script>
   function preview(filename) {
      if (filename) {
         var link = host2 + '/ajax/help/' + filename;
         var rawFile = new XMLHttpRequest();
         rawFile.open("GET", link, false);
         rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4) {
               if (rawFile.status === 200 || rawFile.status == 0) {
                  var allText = rawFile.responseText;
                  $('#preView').find('.modal-content').html(allText);
                  $('#preView').modal('show');
                  return allText;
               }
            }
         }
         rawFile.send(null);
      }
   }
<?php if(isAdmin()){ ?>
   function deleteFile(fileID, elem) {
      var isdelete = confirm('Do you like to delete this file?');
      if (isdelete) {
         $.ajax({
            url: host2 + '/php/delete-help.php',
            type: 'post',
            data: {
               id: fileID
            },
            dataType: 'json',
            success: function(res) {
               if (res.error == '' && res.success) {
                  alert('Deleted file');
                  $(elem).closest('tr').remove();
               } else {
                  alert(res.error);
               }
            },
            error: function(e) {
            }
         });
      }
   }
<?php } ?>
</script>