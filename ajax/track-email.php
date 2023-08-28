<fieldset>
<div class="clearfix"></div>
   <a href="#collaped_track_mail" data-toggle="collapse" class="" aria-expanded="true"><legend title="Scroll mail"><legend>Email <i class="fa fa-link"></i></legend></a>
   <div class="panel-collapse collapse in" id="collaped_track_mail" style="max-height:500px; overflow-y:auto;">
   <table id="table_track_email" class="table table-bordered table-hover table-tripped" style="width: 100%;">
      <thead>
         <tr>
            <th style="max-width:120px;">Status</th>
            <th>Opened/Unopened</th>
            <th>Date Sent</th>
            <th>To</th>
            <th>Title</th>
            <th></th>

         </tr>
      <thead>
      <tbody></tbody>
   </table>
   </div>
</fieldset>

<div class="modal animated fadeInDown" style="display:none; max-height:600px;" id="pane_content_email">
    <div class="modal-dialog">
        <div class="modal-content">
            <fieldset>
               <legend>Content</legend>
               <table style="font-size:18px;">
                  <tbody>
                     <tr>
                        <td><b> Title: </b></td>
                        <td><label id="lblTitle"></label></td>
                     </tr>
                     <tr>
                        <td><b> Sent Date: </b></td>
                        <td><label id="lblSendDate"></label></td>
                     </tr>
                     <tr>
                        <td><b> Sent To: </b></td>
                        <td><label id="lblSendTo"></label></td>
                     </tr>
                     <tr>
                        <td><b> Status: </b></td>
                        <td><label id="lblSendStatus"></label></td>
                     </tr>
                     <tr>
                        <td><b> Opened: </b></td>
                        <td><label id="lblOpened"></label></td>
                     </tr>
                     <tr>
                        <td><b> Content: </b></td>
                        <td></td>
                     </tr>
                     <tr>
                        <td colspan="2">
                           <div class="well" id="lblContent" style="min-height:250px; margin:auto; overflow-y:scroll;"></div>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </fieldset>
        </div>
    </div>
</div>
