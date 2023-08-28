<div class="ui-widget ui-chatbox" style="display:none; right:25px; width:400px;" outline="0" id="resend_mail_popup">
	<div class="ui-widget-header ui-chatbox-titlebar busy ui-dialog-header">
		<span>Send Mail</span>
		<a href="javascript:void(0)" onclick="close_resend_mail()" class="ui-chatbox-icon" role="button">
			<i	class="fa fa-times"></i>
		</a>
		<a href="javascript:void(0)" class="ui-chatbox-icon" role="button" style="display:none">
			<i	class="fa fa-plus"></i>
		</a>
		<a href="javascript:void(0)" class="ui-chatbox-icon" role="button">
			<i class="fa fa-minus"></i>
		</a>
	</div>
	<div class="true ui-widget-content ui-chatbox-content padding-5">
		<fieldset class="">
			<section class="col col-6">
				<input type="email" id="mail_send_to" class="form-control" placeholder="To">
			</section>
			<section class="col col-6">
				<input type="text" id="mail_title" class="form-control" placeholder="Subject">
			</section>
			<section class="col col-4">
				<textarea id="mail_content" rows="15" class="form-control"></textarea>
			</section>
		</fieldset>
		
		<footer class="text-right">
			<button type="button" class="btn btn-sm btn-primary" id="accept_resend_mail">Send</button>
			<button type="button" class="btn btn-sm btn-default" onclick="close_resend_mail()">Cancel</button>
		</footer>
	</div>
</div>

<script>
  $('#resend_mail_popup #mail_content' ).summernote({
    height: 200,
    focus: false,
    tabsize: 2,
    placeholder: 'Content',
    toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
    ]
  });
</script>