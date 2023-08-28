<?php if (isset($help_form)) { ?>
<a class="pull-right btn-help" data-toggle="help" data-target="#help_box" title="Help" rel="tooltip">
  <img src="./img/help.png" style="vertical-align:unset" alt="Help" width="24px" height="24px">
</a>
<div class="help" style="display:none" id="help_box">
  <span class="pull-right fa fa-times text-danger padding-5" data-toggle="help" data-dismiss="#help_box"></span>
  <div class="clearfix"></div>
  <div id="help_box_content">
    <?php $_myfile_help = __DIR__;
    if(is_numeric(strpos($_myfile_help, 'ajax'))){
    }else{
      $_myfile_help .='/ajax';
    }
    $_myfile_help .='/help-form/'. $help_form . '.html';
    include($_myfile_help);
    unset($_myfile_help);
    ?>
  </div>
</div>
<?php } ?>