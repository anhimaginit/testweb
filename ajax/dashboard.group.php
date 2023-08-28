<article class="col-sm-12">
   <div class="jarviswidget  jarviswidget-color-blueDark" id="wid-group" data-widget-colorbutton="false" data-widget-editbutton="false">
      <header>
         <span class="widget-icon"> <i class="fa fa-group"></i></span>
         <h2>Group</h2>
      </header>
      <div>
         <div class="col-md-4">
            <div class="col-xs-12 col-sm-6 col-md-6">
               <select name="group_type" class="form-control" title="Select mode">
                  <option value="Group" selected>Group</option>
                  <option value="Individual">Individual</option>
               </select>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
               <select name="group" class="form-control" title="Select group">
                  <option value="All" selected>All</option>
               </select>
               <select name="individual" class="form-control" title="Select member" style="display:none"></select>
            </div>
         </div>
         <div class="clearfix padding-5"></div>
         <header>
            <h4 class="bold"><i class="fa fa-users"></i> Member</h4>
         </header>
         <div class="">
            <div class="widget-body widget-hide-overflow widget-body-overflowxy">
               <table id="table_group" class="table table-bordered" width="100%">
                  <tbody></tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
</article>