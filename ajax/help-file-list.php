<?php
require_once 'inc/init.php';
?>

<style>
    #preView img {
        max-width: 100%;
    }

    .help-file-title {
        font-size: xx-large;
        font-family: Arial Narrow;
        font-weight: 600;
    }
</style>

<section id="widget-grid" class="">
    <div class="row">
        <!-- NEW WIDGET START -->
        <article class="col-sm-12 col-md-12 col-lg-12">

            <!-- Widget ID (each widget will need unique ID)-->
            <div class="jarviswidget" data-widget-colorbutton="false" data-widget-editbutton="false">
                <header>
                    <h2 style="width:auto;">Help Files</h2>
                    <a href="./#ajax/help-file.php" class="btn btn-primary pull-right">Create new content</a>
                </header>
                <!-- widget div-->
                <div>
                    <table class="table table-bordered" style="width:100%" id="table_help_file">
                    </table>
                </div>
            </div>
        </article>
    </div>
</section>
<div class="modal fade" style="display:none; margin:auto; max-height:600px;" id="preView">
    <div class="modal-dialog" style="min-width:60%;margin:auto;">
        <div class="modal-header" style="height:auto; background:#e5e5e5">
            <div>Preview File</div>
        </div>
        <div class="modal-content padding-10">
        </div>
    </div>
</div>
<script src="./js/script/help/help-file-list.js"></script>