<?php
set_time_limit(0);
require_once 'inc/init.php';

$_typesearch = "claim";
include 'search_message.php';
?>

<?php
/*//$a = {"contact_keep":"5822","contact_was_merged":["53079"]};
$x = json_decode({"contact_keep":"5822","contact_was_merged":["53079"]});
print_r($x);
die();
*/ ?>

<style>
    .sticky{
        display: inline-block;
        position: fixed;
        top: 0;
        right:0;
        z-index: 999;
    }

    #load-more {
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    right: 0;
    background: transparent url(https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif) center center no-repeat;
    opacity: .5;
    z-index: 9999;
    /*box-shadow:inset 0 0 0 2000px rgba(255, 0, 150, 0.3);*/
    box-shadow:inset 0 0 0 2000px rgba(37, 34, 36, 0.3);
}
</style>
<section id="widget-grid" class="">
    <div class="row">
        <article class="col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget" data-widget-editbutton="true">
                <header>
                    <h2><i class="fa fa-table"></i> Duplicate list </h2>
                </header>
                <div>
                    <div class="jarviswidget-editbox"></div>
                    <div class="widget-body">
                        <?php $event = 'search';
                        include 'search-table.php'; ?>
                        <div id="message_form" role="alert" style="display:none"></div>
                        <div id="" style="margin-bottom: 10px; display: inline-block;">
                            <!--<select id="select-dp-type" class="custom-select custom-select-sm">
                                <option>Select the duplicate type</option>
                                <option value="pr_phone">Primary Phone</option>
                                <option value="pr_email" selected>Primary Email</option>
                            </select>-->
                        </div>
                        <!--<div id="more-info-merge-tbl" class="merge-tbl-info" style="margin-bottom: 40px; margin:0 auto; text-align:center;">
                            <button type="button" id="btn-merge-dp" class="btn btn-danger btn-email-merge" style="margin-right:10px;">Merge To Selected Record</button>
                            <button type="button" id="btn-unmerge-dp" class="btn btn-danger btn-phone-merge">Unmerge Selected Record</button>
                        </div>-->

                        <div id="search_duplicate" class="smart-form row padding-5">
                            <div class="col col-sm-6 col-sm-offset-3">
                                <label class="input">
                                    <input type="text" placeholder="Enter email or phone to search.." id="search_query">
                                    <span id="search_duplicate_item" class="icon-append pointer fa fa-search"></span>
                                </label>
                            </div>

                            <div class="col col-sm-6 id="search_all_duplicate">
                            <span style="font-size:14px; margin-right:13px;">Or</span>
                            <select id="select-dp-type" class="custom-select custom-select-sm" style="padding:5px;">
                                <option selected disabled>Search all by select...</option>
                                <option value="pr_email">Search all duplication by email</option>
                                <option value="pr_phone">Search all duplication by phone number</option>
                            </select>
                        </div>
                    </div>

                   <!-- <div id="more-info-merge-tbl" class="merge-tbl-info" style="margin-bottom: 40px; margin:0 auto; text-align:right;">
                        <button type="button" id="btn-merge-dp" class="btn btn-danger btn-email-merge" style="margin-right:10px;display: none;">Merge To Selected Record</button>
                    </div>-->

                    <div class="row" id="total_and_merge" style="margin-top: 30px; display: none;">
                        <div id="count_info_dp" class="col col-sm-6">

                        </div>
                        <div id="more-info-merge-tbl" class="col col-sm-6 merge-tbl-info" style="text-align: right;">
                            <button type="button" id="btn-merge-dp" class="btn btn-danger btn-email-merge" style="margin-right:10px;">Merge To Selected Record</button>
                        </div>
                    </div>

                    <div id="tb_duplicate_list">
                        <div id="count_info_dp" style="margin-top:30px;"></div>
                    </div>
                </div>
                <div id="loading" class="loading-process padding-10" style="display:none; font-size:24px;"></div>
                <div id="load-more" class="loading-process padding-10" style="display:none; font-size:24px;"></div>
            </div>
    </div>
    </article>
    </div>
</section>


<script src="<?php echo ASSETS_URL; ?>/js/script/merge/merge-form.js"></script>