<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script>
	if (!window.jQuery) {
		document.write('<script src="<?= ASSETS_URL  ?>/js/libs/jquery-3.2.1.min.js"><\/script>');
	}
</script>

<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script>
	if (!window.jQuery.ui) {
		document.write('<script src="<?= ASSETS_URL  ?>/js/libs/jquery-ui.min.js"><\/script>');
	}
</script>

<!-- Cookie -->
<script src="<?= ASSETS_URL; ?>/js/plugin/jquery-cookie/jquery.cookie.js"></script>

<!-- Input Phone -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/intlTelInput-jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/intlTelInput.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/utils.js"></script>

<!-- autocomplete tagsinput -->
<script src="<?= ASSETS_URL ?>/js/plugin/tags-input-autocomplete/src/jquery.tagsinput-revisited.js"></script>

<!-- IMPORTANT: APP CONFIG -->
<script src="<?= ASSETS_URL  ?>/js/app.config.js"></script>
<!-- data table -->
<script src="<?= ASSETS_URL  ?>/js/bootstrap/bootstrap-select.js"></script>
<!-- End data table -->

<!-- JS TOUCH : include this plugin for mobile drag / drop touch events-->
<script src="<?= ASSETS_URL  ?>/js/plugin/jquery-touch/jquery.ui.touch-punch.min.js"></script>

<!-- BOOTSTRAP JS -->
<script src="<?= ASSETS_URL  ?>/js/bootstrap/bootstrap.min.js"></script>
<script src="<?= ASSETS_URL  ?>/js/bootstrap/bootstrap-select.js"></script>
<script src="<?= ASSETS_URL  ?>/js/libs/jspdf.min.js"></script>
<script src="<?= ASSETS_URL  ?>/js/libs/jspdf.plugin.autotable.js"></script>

<!-- CUSTOM NOTIFICATION -->
<script src="<?= ASSETS_URL  ?>/js/notification/SmartNotification.min.js"></script>

<!-- JARVIS WIDGETS -->
<script src="<?= ASSETS_URL  ?>/js/smartwidgets/jarvis.widget.min.js"></script>

<!-- JQUERY SELECT2 INPUT -->
<script src="<?= ASSETS_URL  ?>/js/plugin/select2/select2.min.js"></script>

<!-- browser msie issue fix -->
<script src="<?= ASSETS_URL  ?>/js/plugin/msie-fix/jquery.mb.browser.min.js"></script>

<!-- FastClick: For mobile devices -->
<script src="<?= ASSETS_URL  ?>/js/plugin/fastclick/fastclick.min.js"></script>


<!--[if IE 8]>

	<h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>

	<![endif]-->
<!-- JQUERY VALIDATE -->
<script src="<?= ASSETS_URL  ?>/js/plugin/jquery-validate/jquery.validate.min.js"></script>

<!-- Demo purpose only -->
<!-- <script src="<?= ASSETS_URL  ?>/js/demo.min.js"></script> -->
<script>
	var idleTimer;
	var refresh_jwtInterval;
	var offsetTimer;
	var template_data = {};
</script>

<!-- MAIN APP JS FILE -->
<script src="<?= ASSETS_URL  ?>/js/app.js"></script>

<!-- ENHANCEMENT PLUGINS : NOT A REQUIREMENT -->
<!-- Voice command : plugin -->

<!-- SmartChat UI : plugin -->

<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>

<!-- <script src="<?= ASSETS_URL ?>/js/plugin/knob/jquery.knob.min.js"></script>
<script src="https://fastcdn.org/FileSaver.js/1.1.20151003/FileSaver.min.js"></script> -->

<script>
	if ($.cookie('currentPage')) {
		$.cookie('prePage', $.cookie('currentPage'));
		$.cookie('currentPage', window.location.href, {
			path: '/',
			maxAge: 30 * 60
		})
	} else {
		$.cookie('currentPage', window.location.href, {
			path: '/',
			maxAge: 30 * 60
		});
	}
</script>
</body>

</html>