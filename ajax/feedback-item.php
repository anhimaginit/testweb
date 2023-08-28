<?php
if (!session_id()) session_start();

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');

if (!isset($_GET['url'])) {
   die('<h3>Cannot find content</h3>');
}

$value_feedback = file_get_contents('./feedback/' . urldecode($_GET['url']));

if ($value_feedback) {
   $value_feedback = json_decode($value_feedback);
   ?>
   <div class="feedback-body padding-20">
      <div>
         <div class="pull-right padding-10 pl-20">
            <a type="button" class="btn btn-default fa fa-download btnDownloadFeedback" 
            href="./ajax/feedback/pdf/<?= str_replace('.json', '.pdf', $value_feedback->url) ?>" 
            download="Feedback <?= $value_feedback->topic ?> - <?= $value_feedback->subject ?>.pdf"> Download</a>
            <?php if(!isset($value_feedback->isComplete) ||(isset($value_feedback->isComplete) && $value_feedback->isComplete!== true && $value_feedback->isComplete!== 'true')){
               echo '<a type="button" class="btn btn-default fa fa-check btnCheckReadFeedback"> Complete</a>';
            } ?>
         </div>
         <h2 class="email-open-header uppercase-first bold <?= $value_feedback->topic ?>"><?= $value_feedback->topic ?></h2>
      </div>

      <h3><?= $value_feedback->subject ?></h3>
      <div class="bold"><a href="./#ajax/contact-form.php?id=<?= $value_feedback->user ?>"><img src="<?= $value_feedback->avt ?>" alt="avt" class="avatar"> <?= $value_feedback->user_name ?></a><span class="pull-right text-light"><?= $value_feedback->time ?></span></div>
      <div class="feedback-detail well" style="padding-top:20px; margin-top:10px">
         <?= $value_feedback->content ?>
      </div>

   </div>
<?php
} else {
   die('<h3>Cannot find file</h3>');
}
?>