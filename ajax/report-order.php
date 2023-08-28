
<div>
  <ul class="nav nav-tabs">
    <li class="active"><a data-toggle="tab" href="#search">Search</a></li>
    <li><a data-toggle="tab" href="#miscCriteria">Misc Criteria</a></li>
    <li><a data-toggle="tab" href="#customFields">Custom Fields</a></li>   
    <li><a data-toggle="tab" href="#columns">Columns</a></li>   
  </ul>

  <div class="tab-content">
    <!-- boxReport -->
    <div id="search" class="tab-pane fade in active">
        <div class="smart-form">
            <fieldset>
                <div id="boxReport"></div>
            </fieldset>
        </div>
    </div>
    <!--end boxReport -->
    <div id="miscCriteria" class="tab-pane fade">
        <div class="smart-form">            
            <fieldset>
                
                <section class="col col-6">
                    <label class="label labelName" data="order_title">Create Time</label>
                    
                        <section class="col col-6">
                            <label class="input">Start Date</label>
                            <input type="date" name="createTimeStartDate" id="createTimeStartDate" value="" class="form-control" >
                            <p></p>
                        </section>
                        <section class="col col-6">
                            <label class="input">End Date</label>
                            <input type="date" name="createTimeEndDate" id="createTimeEndDate" value="" class="form-control" >
                            <p></p>
                        </section>
                    
                </section>
                <section class="col col-6">
                    <label class="label labelName" data="order_title">Update Time</label>
                    
                        <section class="col col-6">
                            <label class="input">Start Date</label>
                            <input type="date" name="updateTimeStartDate" id="updateTimeStartDate" value="" class="form-control" >
                            <p></p>
                        </section>
                        <section class="col col-6">
                            <label class="input">End Date</label>
                            <input type="date" name="updateTimeEndDate" id="updateTimeEndDate" value="" class="form-control" >
                            <p></p>
                        </section>
                    
                </section>
            </fieldset>
      </div>
    </div>
    <div id="customFields" class="tab-pane fade">
      <h3>Custom Fields</h3>
      
    </div>
    <div id="columns" class="tab-pane fade ">    
        <div class="smart-form">
            <fieldset>
                <div class="col col-6">
                    Custom Columns:		
                    <div id="boxCustomColumns" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                </div>
                <div class="col col-6">
                    Available Fields:
                    <div id="boxAvailableFields" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                </div>
            </fieldset>
        </div>
    </div>
  </div>
    <!-- table -->
    <div class="smart-form">
        <fieldset> 
            <div>
                <input type="checkbox" id="iptShowAllRows"><label>Show all</label>
                 | 
                <label>Number of rows:</label> 
                <select id="sltNumberOfRows" class="col-xs-0">
                    <option value="25" selected>25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="250">250</option>
                    <option value="500">500</option>
                </select>
                 | 
                <label> Filter rows:</label> 
                <input type="text" id="iptFilterTable" onkeyup="filterTable('iptFilterTable','searchReportTable')" placeholder="Search this table ">
                 | 
                <label>Load old report :</label> 
                <select id="sltLoadOldReport">
                    <option value="" selected></option>                                 
                </select>
                
                <br /><br />

                <section class="col col-xs-5">
                    <label class="input">
                        <input type="text" placeholder="report name" id="reportName" >
                    </label>
                </section>
                <section class="col col-xs-1">
                    <button class="btn btn-default" style="padding:5px" id="btnSaveReport"><i class="fa fa-thumb-tack"></i> Save</button>
                </section>
                <section class="col col-xs-6 text-right">
                    <button class="btn btn-default" style="padding:5px" id="btnDownloadPdfReport"><i class="fa fa-download"></i> PDF Download</button>
                    <button class="btn btn-default" style="padding:5px" id="btnDownloadCsvReport"><i class="fa fa-download"></i> CSV Download</button>
                    <button class="btn btn-primary" style="padding:5px" id="btnSearchReport" data-toggle="modal" data-target="#modalSearch"><i class="fa fa-search"></i> Search</button>
                </section>
            </div>
        </fieldset>

    </div>
    <!-- table -->
  </div> 
<input type="hidden" value="" name="vrlLoadOldReport" id='vrlLoadOldReport'>
<table id="my-table"><!-- ... --></table>

<!-- Modal -->
<div class="modal fade" id="modalSearch" role="dialog">
    <div class="report-modal-dialog modal-dialog modal-lg" style="height: 80%;">
      <div class="report-modal-content modal-content">
        <div class="modal-header" >
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Report</h4>
        </div>
        <div class="report-modal-body modal-body" >
            <div > 
                <table id="searchReportTable" class="table table-bordered table-hover table-tripped" >
                <thead>
                    <tr></tr>
                </thead>
                <tbody></tbody>
                <tfoot>
                    <tr>
                        <td class="text-center">                         
                        </td>
                    </tr>
                </tfoot>
                </table>
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>


<script src="./js/script/report/report-order.js"></script>







    