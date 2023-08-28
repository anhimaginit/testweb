<?php require_once 'inc/init.php';

$files = json_decode(file_get_contents('../data/feedback-list.json'));
$complete = false;
if (isset($_GET['r']) && $_GET['r'] == true) {
   $complete = true;
}
?>
<style>
   .inbox-info-bar .control-label {
      top: 8px;
   }
</style>
<div id="inbox-content" class="inbox-body no-content-padding feedback-content">
   <div class="col-md-3">
      <h6> <?= $complete ? 'Complete' : '' ?> Feedback
         <input type="text" class="form-control" placeholder="Search" id="searchFeedback">
      </h6>
      <ul class="list-group" id="content_feedback_nav">
         <?php
         foreach ($files as $item) {
            if (isset($item->isComplete) === $complete) {
               echo '
                  <li class="list-group-item load_feedback" data-file="' . $item->url . '" data-loading-text="<i class=\'fa fa-refresh fa-spin\'></i> &nbsp; Loading...">
                     <div><img src="' . $item->avt . '" alt="avatar" class=""> <span class="bold text-primary"> ' . $item->user_name . '</span> <span class="label uppercase-first ' . $item->topic
                  . '">' . $item->topic . '</span>' . ($complete ? '<i class="fa fa-times-circle text-danger pull-right deleteFeedback"></i>' : '') . '</div>
                     <div class="feedback_subject">' . substr($item->subject, 0, 60) . '</div>
                  </li>';
            }
         }
         ?>
      </ul>
   </div>
   <div class="col col-md-9" id="feedback_content">
   </div>
   <div class="inbox-footer">
   </div>
</div>
<script src="js/plugin/summernote/summernote.min.js"></script>
<?php if ($complete) { ?>
   <script>
      $(document).unbind("click", ".deleteFeedback").on("click", ".deleteFeedback", function(e) {
         e.preventDefault();
         var cf = confirm("Are you really want to delete feedback?");
         if (cf) {
            let li = $(this).closest("li");
            let index = li.index();
            let file = li.data("file");
            $.ajax({
               url: "./php/feedback-delete.php",
               type: "post",
               data: {
                  index: index,
                  file: file
               },
               dataType: "json",
               success: function(res) {
                  alert(res.message);
                  if (res.error == false) {
                     if (li.hasClass('active')) {
                        $('#feedback_content').empty();
                     }
                     li.remove();
                  }
               }
            });
         }
         return false;
      });
   </script>
<?php } ?>
<script>
   $('#content_feedback_nav .load_feedback').unbind('click').on('click', function() {
      var $btn = $(this);
      $btn.button('loading');

      let url = $btn.data('file');
      $.ajax({
         url: 'ajax/feedback-item.php',
         type: 'get',
         data: {
            url: url
         },
         success: function(res) {
            $('#feedback_content').html(res);
            $btn.button('reset');
            $('#content_feedback_nav li.active').removeClass('active');
            $btn.addClass('active');
         },
         error: function(e) {
            $btn.button('reset');
         }
      })
   });

   $('#searchFeedback').unbind('keyup').keyup(function() {
      let text = this.value;
      $('#content_feedback_nav li').hide().filter(function() {
         return this.innerHTML.toLowerCase().includes(text.toLowerCase());
      }).show();
   });

   $(document).unbind('click', '.btnCheckReadFeedback').on('click', '.btnCheckReadFeedback', function() {
      var cf = confirm('Are you really want to confirm this problem to completed?');
      if (cf) {
         let li = $('#content_feedback_nav li.active');
         let index = li.index();
         let file = li.data('file');
         $.ajax({
            url: './php/feedback-complete.php',
            type: 'post',
            data: {
               index: index,
               file: file,
            },
            dataType: 'json',
            success: function(res) {
               alert(res.message);
               if (res.error == false) {
                  li.remove();
                  $('#feedback_content').empty();
               }
            }
         });
      }
   });
</script>