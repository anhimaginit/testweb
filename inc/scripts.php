<!--================================================== -->

<!-- PACE LOADER - turn this on if you want ajax loading to show (caution: uses lots of memory on iDevices)
<script data-pace-options='{ "restartOnRequestAfter": true }' src="<?= ASSETS_URL  ?>/js/plugin/pace/pace.min.js"></script>-->

<!-- Link to Google CDN's jQuery + jQueryUI; fall back to local -->
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
	var idleTimer;
	var refresh_jwtInterval;
	var offsetTimer;
	var template_data = {};
</script>

<!-- Cookie -->
<script src="<?= ASSETS_URL; ?>/js/plugin/jquery-cookie/jquery.cookie.js"></script>
<!-- Bootstrap -->
<script src="<?= ASSETS_URL  ?>/js/bootstrap/bootstrap.min.js"></script>
<script src="<?= ASSETS_URL  ?>/js/bootstrap/bootstrap-select.js"></script>

<!-- JQUERY VALIDATE -->
<script src="<?= ASSETS_URL  ?>/js/plugin/jquery-validate/jquery.validate.min.js"></script>
<script src="<?= ASSETS_URL; ?>/js/plugin/bootstrapvalidator/bootstrapValidator.min.js"></script>

<!-- JQUERY SELECT2 INPUT -->
<script src="<?= ASSETS_URL  ?>/js/plugin/select2/select2.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/bloodhound/bloodhound.js"></script>
<script src="<?= ASSETS_URL ?>/js/plugin/typeahead/typeahead.min.js"></script>

<!-- Input Phone -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/intlTelInput-jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/intlTelInput.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/15.0.1/js/utils.js"></script>

<!-- autocomplete tagsinput -->
<script src="<?= ASSETS_URL ?>/js/plugin/tags-input-autocomplete/src/jquery.tagsinput-revisited.js"></script>
<script src="<?= ASSETS_URL; ?>/js/plugin/bootstrap-tags/bootstrap-tagsinput.min.js"></script>
<!-- summernote -->
<script src="js/plugin/summernote/summernote.min.js"></script>

<!-- firebase -->
<script src="https://www.gstatic.com/firebasejs/5.0.4/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.0.4/firebase-auth.js"></script>

<script src="https://cdn.firebase.com/libs/firebaseui/3.0.0/firebaseui.js"></script>
<!-- take capture -->

<script src="<?= ASSETS_URL  ?>/js/plugin/html2canvas/html2canvas.min.js"></script>

<!-- IMPORTANT: APP CONFIG -->
<script src="js/app.config.js"></script>
<script src="<?= ASSETS_URL  ?>/js/your_script.js"></script>
<script src="./js/script/prev-next-form.js"></script>
<script src="<?= ASSETS_URL  ?>/js/script/call-ajax.js"></script>
<script src="<?= ASSETS_URL  ?>/js/util/take-screenshot.js"></script>
<script src="<?= ASSETS_URL  ?>/js/script/search-all.js"></script>
<!-- data table -->
<script src="<?= ASSETS_URL  ?>/js/plugin/datatables/jquery.dataTables.min.js"></script>
<script src="<?= ASSETS_URL  ?>/js/plugin/datatables/dataTables.colVis.min.js"></script>
<script src="<?= ASSETS_URL  ?>/js/plugin/datatables/dataTables.tableTools.min.js"></script>
<script src="<?= ASSETS_URL  ?>/js/plugin/datatables/dataTables.rowsGroup.js"></script>
<script src="<?= ASSETS_URL  ?>/js/plugin/datatables/dataTables.bootstrap.min.js"></script>
<script src="<?= ASSETS_URL  ?>/js/plugin/datatable-responsive/datatables.responsive.min.js"></script>

<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.5.1/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.5.1/js/buttons.flash.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>

<!-- <script type="text/javascript" src="<?= ASSETS_URL  ?>/js/plugin/pdfmake/build/pdfmake.js"></script> -->
<script type="text/javascript" src="<?= ASSETS_URL  ?>/js/plugin/pdfmake/build/pdfmake.min.js"></script>
<script type="text/javascript" src="<?= ASSETS_URL  ?>/js/plugin/pdfmake/build/vfs_fonts.js"></script>

<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.5.1/js/buttons.html5.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/buttons/1.2.1/js/buttons.print.min.js"></script>
<!-- End data table -->

<!-- JS TOUCH : include this plugin for mobile drag / drop touch events-->
<script src="<?= ASSETS_URL  ?>/js/plugin/jquery-touch/jquery.ui.touch-punch.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>

<script src="<?= ASSETS_URL  ?>/js/libs/jspdf.min.js"></script>
<script src="<?= ASSETS_URL  ?>/js/libs/jspdf.plugin.autotable.js"></script>

<!-- CUSTOM NOTIFICATION -->
<script src="<?= ASSETS_URL  ?>/js/notification/SmartNotification.min.js"></script>

<script src="<?= ASSETS_URL  ?>/js/script/logout.js"></script>
<!-- MAIN APP JS FILE -->
<script src="<?= ASSETS_URL  ?>/js/app.js"></script>
<!-- JARVIS WIDGETS -->
<script src="<?= ASSETS_URL  ?>/js/smartwidgets/jarvis.widget.min.js"></script>

<script src="<?= ASSETS_URL  ?>/js/plugin/msie-fix/jquery.mb.browser.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/3.1.62/jquery.inputmask.bundle.js"></script>

<!-- FastClick: For mobile devices -->
<script src="<?= ASSETS_URL  ?>/js/plugin/fastclick/fastclick.min.js"></script>
<script src="<?= ASSETS_URL ?>/js/script/reslogin.js"></script>
<script src="<?= ASSETS_URL  ?>/js/script/refresh-jwt.js"></script>
<script>
	var track;
	var config = {
		apiKey: "AIzaSyA_8dzdQbvGq7bLBmg8qIBBGpnW284EwjU",
		authDomain: "freedom-hw-crm.firebaseapp.com",
		databaseURL: "https://freedom-hw-crm.firebaseio.com",
		projectId: "freedom-hw-crm",
		storageBucket: "freedom-hw-crm.appspot.com",
		messagingSenderId: "871561714410",
		appId: "1:871561714410:web:3ea663be152a8181"
	};
	firebase.initializeApp(config);

	if ($.cookie('currentPage')) {
		$.cookie('prePage', $.cookie('currentPage'), {
			path: '/'
		});
		$.cookie('currentPage', window.location.href, {
			path: '/',
			maxAge: 30 * 60
		});
	} else {
		$.cookie('currentPage', window.location.href, {
			path: '/',
			maxAge: 30 * 60
		});
	}
	$(document).ready(function() {
		new ReLogin().init();
	})
</script>