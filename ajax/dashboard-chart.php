<?php
require_once '../inc/http-request.php';

$list = array(
    array('label' => 'Order Open'),
    array('label' => 'Order Close'),
    array('label' => 'Order Total'),
);
function drawChart($listData)
{
    $result = '';
    foreach ($listData as $item) {
        $result .= '
         <li class="sparks-info">
            <h5> ' . $item['label'] . ' <span class="txt-color-blue text-center" style="font-size:22px;" id="chart_total_' . str_replace('Order ', '', $item['label']) . '"></span></h5>
            <div class="sparkline txt-color-blue" id="chart_' . str_replace('Order ', '', $item['label']) . '" style="font-size:25px;">
            </div>
         </li>';
    }
    return $result;
}
?>

<div class="row">
	<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
		<h1 class="page-title txt-color-blueDark"><i class="fa-fw fa fa-home"></i> Dashboard <span>> My Dashboard</span></h1>
	</div>
	<div class="col-xs-12 col-sm-6 col-md-8 col-lg-8">
      <ul id="sparks" class="">
         <li>
            <div class="smart-form default-days">
               <select name="date_length" class="date_length form-control" style="max-width:80px;" required>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="custom">Custom</option>
               </select><i></i>
            </div>
         </li>
      <?php echo drawChart($list) ?>
      </ul>
      <div class="modal-dialog demo-modal" id="custom_date" style="position:absolute; display:none;">
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
               <h4 class="modal-title">Custom date</h4>
            </div>
            <div class="modal-body">
               <form class="form-inline editableform" style="">
                  <div class="control-group form-group">
                     <div>
                        <div class="editable-input" style="position: relative;">
                           <input name="start_date" type="date" class="datepicker col-md-5 form-control" max="<?= date("Y-m-d") ?>" title="Begin date" placeholder="Begin date">
                           <input name="end_date" type="date" class="datepicker col-md-5 form-control" value="<?= date("Y-m-d") ?>" max="<?= date("Y-m-d") ?>" title="Finish date" placeholder="Finish date">
                        </div>
                     </div>
                     <div class="editable-error-block help-block" style="display: none;"></div>
                  </div>
               </form>
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-default" data-dismiss="modal"> Close </button>
               <button type="button" class="btn btn-primary" onclick="customSubmit();"><i class="fa fa-check"></i> OK</button>
            </div>
         </div><!-- /.modal-content -->
      </div>
	</div>
</div>

<script>
   $('#custom_date button[data-dismiss="modal"]').click(function(){
      $('#custom_date').hide();
      $('.date_length').val('30').trigger('change');
   });
</script> 