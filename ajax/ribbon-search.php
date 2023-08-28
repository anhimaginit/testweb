<div class="pull-right col-xs-11 col-sm-8 col-md-6" style="margin-top:4px;">
   <div class="form-group">
      <div class="col-md-12 col-sm-12">
         <div class="row">
            <div class="col-sm-12">
               <div class="input-group" style="display:flex">
                  <input type="text" id="search_top" tabindex="-1"class="form-control bg-color-white input-readonly" placeholder="Search" readonly onmouseover="this.removeAttribute('readonly');">
                  <div>
                     <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">
                        <i class="fa fa-search"></i><span class="caret"></span>
                     </button>
                     <ul class="dropdown-menu" role="menu" id="_search_type" style="right:0; left:unset">
                        <?php if (canAddForm('ContactForm')) { ?>
                           <li class="active"><a href="javascript:void(0);" onclick="searchType('contact', this)">Contact</a></li>
                        <?php }
                        if (canAddForm('ProductForm')) { ?>

                           <li><a href="javascript:void(0);" onclick="searchType('product', this)">Product</a></li>
                        <?php }
                        if (canAddForm('OrderForm')) { ?>
                           <li><a href="javascript:void(0);" onclick="searchType('order', this)">Order</a></li>
                        <?php }
                        if (canAddForm('WarrantyForm')) { ?>
                           <li><a href="javascript:void(0);" onclick="searchType('warranty', this)">Warranty</a></li>
                        <?php }
                        if (canAddForm('InvoiceForm')) { ?>
                           <li><a href="javascript:void(0);" onclick="searchType('invoice', this)">Invoice</a></li>
                        <?php }
                        if (canAddForm('ClaimForm')) { ?>
                           <li><a href="javascript:void(0);" onclick="searchType('claim', this)">Claim</a></li>
                        <?php }
                        if (canAddForm('CompanyForm')) { ?>
                           <li><a href="javascript:void(0);" onclick="searchType('company', this)">Company</a></li>
                        <?php } ?>
                        <li><a href="javascript:void(0);" onclick="searchType('task', this)">Task</a></li>
                        <li><a href="javascript:void(0);" onclick="searchType('all', this)">Search All</a></li>
                     </ul>
                  </div>
                  <button type="button" class="btn btn-default" tabindex="-1" onclick="refreshSearch()"><i class="fa fa-refresh"></i></button>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>

<div id="take_screenshot_camera">
   <button type="button" class="btn btn-sm btn-default padding-2 dropdown-toggle" data-toggle="dropdown" tabindex="-1">
      <img src="./img/camera.png" width="25px" title="Take Screenshot">
   </button>
   <ul class="dropdown-menu pull-right" role="menu">
      <li><a href="javascript:void(0);" onclick="take_screenshot()">Take Full Page Photo</a></li>
      <li><a href="javascript:void(0);" onclick="take_screenshot(true)">Take Screenshot</a></li>
   </ul>
</div>