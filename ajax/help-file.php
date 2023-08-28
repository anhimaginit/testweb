<?php
require_once 'inc/init.php';
//get category
$help_category = json_decode(file_get_contents('../data/help/help-category.json'));

$editedHelp = (object) array();
$path = "../data/help/help-file.json";
$myjson = (array) json_decode(file_get_contents($path));
$content = '';
if (isset($_GET['id']) && isset($myjson[$_GET['id']])) {
    $editedHelp = $myjson[$_GET['id']];
    if (isset($editedHelp->content) && file_exists('../' . $editedHelp->content)) {
        $content = file_get_contents('../' . $editedHelp->content);
    }
}

?>
<style>
    .note-editor {
        width: 100%;
    }
</style>
<section id="widget-grid" class="">
    <div class="row">
        <article class="col-sm-12">
            <div class="jarviswidget">
                <header>
                    <span class="widget-icon"> <i class="fa fa-comments-o"></i> </span>
                    <h2>Help Desk</h2>
                    <?php if(isset($editedHelp->id)){
                    echo '<div class="jarviswidget-ctrls" id="help-file-control" role="menu">
                        <a href="./#ajax/help-file.php" class="btn-primary have-text"><i class="fa fa-plus"></i> Create help file</a>
                    </div>';
                    }
                    ?>
                </header>
                <div>
                    <div class="widget-body widget-body-overflowxy">
                        <form id="help_form" method="post">
                            <div id="message_form" role="alert" style="display:none"></div>
                            <input type="hidden" name='id' value="<?= isset($editedHelp->id) ? $editedHelp->id : '' ?>">
                            <input type="hidden" name='created_date' value="<?= isset($editedHelp->created_date) ? $editedHelp->created_date : '' ?>">
                            <fieldset>
                                <div class="clearfix">
                                    <section class="col-md-6 col-sm-12">
                                        <label class="input pt-10">Title</label>
                                        <input name="title" class="form-control" value="<?= isset($editedHelp->title) ? $editedHelp->title : '' ?>" required>
                                    </section>
                                    <section class="col-md-6 col-sm-12">
                                        <label class="hidden-sm">&nbsp;</label>
                                        <div class="pt-5"><span class="bold">Slug: </span><label id="file_slug"><?= isset($editedHelp->slug) ? $editedHelp->slug : '' ?></label></div>
                                    </section>
                                </div>
                                <div class="clearfix">
                                    <section class="col-md-6 col-sm-12">
                                        <label class="input pt-10">Category</label>
                                        <div class="input-group" style="display:flex">
                                            <select name="category" class="form-control" style="width:100%" value="" required>
                                                <?php
                                                    foreach ($help_category as $cate) {
                                                        echo '<option value="' . $cate . '"' . (isset($editedHelp->category) && $editedHelp->category == $cate ? ' selected' : '') . '>' . $cate . '</option>';
                                                    }
                                                ?>
                                            </select>
                                            <span class="btn-sm btn-clear-select no-border-radius input-group-addon pointer hover-danger" style="width:unset; padding: 9px 11px;" data-select="category" rel="tooltip" data-placement="top" title="" data-original-title="Clear category"> <i class="fa fa-minus"></i> </span>
                                        </div>
                                    </section>
                                    <section class="col-md-6 col-sm-12">
                                        <label class="input pt-10">Sub Category</label>
                                        <input name="sub_category" class="form-control" value="<?= isset($editedHelp->sub_category) ? $editedHelp->sub_category : '' ?>">
                                    </section>
                                </div>
                                <div class="clearfix">
                                    <section class="col-md-12">
                                        <label class="form-control-label input pt-10">Content</label>
                                        <textarea id="contentFile" name="contentFile" class="form-control" style="width:100%"><?php echo $content; ?></textarea>
                                    </section>
                                </div>
                            </fieldset>
                            <footer class="pull-right padding-10">
                                <button type="button" class="btn btn-default">Cancel</button>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </footer>
                        </form>
                    </div>
                </div>
            </div>
        </article>
    </div>
</section>
<script src="js/plugin/summernote/summernote.min.js"></script>
<script>
    <?php
        if (isset($_GET['help'])) {
            if (file_exists('help/' . urldecode($_GET['help']))) {
                $fileContent = file_get_contents('help/' . urldecode($_GET['help']));
                echo "$('#contentFile').summernote('code', `" . $fileContent . "`);";
            } else {
                echo 'messageForm("The file ' . $_GET['help'] . ' is not found", false);';
            }
        }
    ?>
</script>
<script src="<?= ASSETS_URL ?>/js/script/help/help-file.js"></script>