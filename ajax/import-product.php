<?php

require_once 'inc/init.php';
require_once '../php/link.php';

?>
<section id="widget-grid" class="">
    <div class="jarviswidget">
        <header>
            <h2>Import Product </h2>
            <?php
            $help_form = 'import';
            include 'btn-help.php';
            unset($help_form);
            ?>
        </header>
        <div>
            <div class="jarviswidget-editbox"></div>
            <div class="widget-body no-padding">
                <div id="message_form" role="alert" style="display:none"></div>
                <form class="smart-form" id="import_product_form" method="post">
                    <fieldset class="prod-import">
                        <div class="row">
                            <section class="col col-6">
                                <label class="input">
                                    <input type="file" class="form-control" id="prod_import" name="prod_import" accept=".csv,.CSV">
                                </label>
                            </section>
                        </div>

                        <div class="row">
                            <section class="col col-6">
                                <button type="button" id="import-next" class="btn btn-sm btn-primary">Next</button>
                            </section>
                        </div>
                    </fieldset>
                    <fieldset id="process-prods" style="display: none">
                        <div class="row">
                            <div class="col col-xs-12 data-import-content" id="prod-import-contents"></div>
                        </div>
                        <div class="row">
                            <div class="col col-6">
                                <button type="button" style="margin-top: 10px; margin-bottom: 10px" class="btn btn-sm btn-primary prods-back">Back</button>&nbsp;&nbsp;&nbsp;
                                <button type="button" style="margin-top: 10px; margin-bottom: 10px" class="btn btn-sm btn-primary" id="prods-submit">Import</button>
                            </div>
                        </div>

                    </fieldset>

                    <fieldset class="prod-errs" style="display: none">
                        <div class="row">
                            <label class="col col-10 has-err">Import Error - add new</label>
                            <div class="col col-10" id="prod-import-errs-add"></div>

                            <label class="col col-10 has-err" style="margin-top: 10px">Import Error - update</label>
                            <div class="col col-10" id="prod-import-errs-up"></div>
                        </div>
                        <div class="row">
                            <div class="col col-6">
                                <button type="button" class="btn btn-sm btn-primary prods-previous">Back</button>&nbsp;&nbsp;&nbsp;
                                <button type="button" class="btn btn-sm btn-primary prods-back">Reload</button>
                            </div>

                        </div>
                    </fieldset>
                    <footer></footer>
                </form>
            </div>
        </div>
    </div>
</section>
<script src="<?php echo ASSETS_URL; ?>/js/jquery-csv/jquery.csv.min.js"></script>
<script src="<?php echo ASSETS_URL; ?>/js/script/import/import-product.js"></script>