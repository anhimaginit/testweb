		<!-- Left panel : Navigation area -->
		<!-- Note: This width of the aside area can be adjusted through LESS variables -->
		<aside id="left-panel">

			<!-- User info -->
			<div class="login-info">
				<span> <!-- User image size is adjusted inside CSS, it should stay as is -->

					<!-- <a href="javascript:void(0);" id="show-shortcut" data-action="toggleShortcut"> -->
					<a href="javascript:void(0);" data-action="toggleShortcut">
						<img src="<?= isset($_SESSION['firebase_user']) && isset($_SESSION['firebase_user']['photoURL']) ? $_SESSION['firebase_user']['photoURL'] : ASSETS_URL .'/img/avatars/sunny.png' ?>" alt="me" class="online" />
						<span>
						
							<?= isset($_SESSION['user_name']) ? urldecode($_SESSION['user_name']) : 
								(isset($_SESSION['actor']) ? $_SESSION['actor'] : 'User - '. $_SESSION['settingPage']->company_name) ?>
						</span>
						<i class="fa fa-angle-down"></i>
					</a>

				</span>
			</div>
			<nav>
				<?php
					$_ui->create_nav($page_nav)->print_html();
				?>

			</nav>
			<span class="minifyme" data-action="minifyMenu"> <i class="fa fa-arrow-circle-left hit"></i></span>

		</aside>
		<!-- END NAVIGATION -->