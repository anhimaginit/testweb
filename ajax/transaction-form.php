<?php

$pageTitle = 'Warranty Form';

require_once 'inc/init.php';
$claimTransaction = 'ClaimForm';

$_authenticate->checkFormPermission($claimTransaction);

?>
<section id="widget-grid" class="">
   <div class="row">

      <!-- NEW WIDGET START -->
      <article class="col-sm-12 col-md-12 col-lg-12">
         <!-- Widget ID (each widget will need unique ID)-->
         <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
            <header>
               <h2 style="width:auto">Claim Transaction
                  <?php
                  if (hasIdParam()) {
                     echo (': ' . getID() . '</h2>');
                     echo ('<a href="./#ajax/warranty-form.php" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Create new Transaction</a>');
                  } else {
                     echo ('</h2>');
                  }
                  ?>
            </header>
            <!-- widget div-->
            <div>

               <!-- widget edit box -->
               <div class="jarviswidget-editbox">
                  <!-- This area used as dropdown edit box -->
               </div>
               <!-- end widget edit box -->

               <div id="message_form" role="alert" style="display:none"></div>
               <form class="smart-form" id="transaction_form" method="post">
                  <?php include 'transaction.php' ?>
                  <footer>
                     <button type="button" id="btnSubmitTransaction" class="btn btn-primary">Submit</button>
                     <button type="button" id="btnBackTransaction" class="btn btn-default" onclick="window.history.back();">Back</button>
                  </footer>
               </form>
            </div>
         </div>
      </article>
   </div>
</section>
<script type="text/javascript">
   $('input').mousedown(function() {
      $('#message_form').hide(200);
   });
</script>