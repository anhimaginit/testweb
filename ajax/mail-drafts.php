<!------ Include the above in your HEAD tag ---------->
<div>
    <div class="mail-box">

        <aside class="lg-side">
            <div class="inbox-head">
                <h3><strong>DRAFTS</strong></h3>
                <form action="#" class="pull-right position">
                    <!-- <div class="input-append">
                        <input type="text" class="sr-input" placeholder="Search Mail">
                        <button class="btn sr-btn" type="button"><i class="fa fa-search"></i></button>
                    </div> -->
                </form>
            </div>
            <div id="message_form" style="display:none"></div>
            <div class="inbox-body">
                <div class="mail-option smart-form padding-5">
                    <div class="btn-group padding-5">
                        <label class="checkbox"><input type="checkbox" class="check-all-mail"><i></i> All</label>
                    </div>
                    <div class="btn-group">
                        <a data-original-title="Refresh" data-placement="top" data-toggle="dropdown" href="#" class="text-dark mini tooltips btnRefreshMail padding-5">
                            <i class=" fa fa-refresh"></i>
                        </a>
                    </div>
                    <div class="btn-group">
                        <a data-toggle="dropdown" href="#" class="padding-5 text-dark mini blue btnRemoveMail" aria-expanded="false">
                            <i class="fa fa-trash"></i>
                        </a>
                    </div>
                    <ul class="unstyled inbox-pagination">
                        <li>
                            <a id="np-btn-angle-left" class="np-btn"><i class="fa fa-angle-left text-dark pagination-left"></i></a>
                        </li>
                        <li><span id="lbl-current-page"></span></li>
                        <li>
                            <a id="np-btn-angle-right" class="np-btn"><i class="fa fa-angle-right text-dark pagination-right"></i></a>
                        </li>
                    </ul>
                </div>
                <table class="table table-inbox table-hover smart-form" style="width:100%" id="mailDraft">
                    <tbody></tbody>
                </table>
            </div>
        </aside>
    </div>
</div>
<script src="./js/script/mail/mail-op.js"></script>
<script src="./js/script/mail/mail-draft.js"></script>
<script>
    var mailOp = new MailOp();
    mailOp.bindEvent();
    var myMailDraft = new MailDraft();
    myMailDraft.loadEmailDraft();
</script>