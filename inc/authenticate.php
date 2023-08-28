<?php
if (!session_id()) {
    session_start();
}

$myhost = dirname(__DIR__);
$_tmp = '';
$_tmp2 = '';
if ($_SERVER['HTTP_HOST'] == 'localhost') {
    $_tmp = 'https://api.warrantyproject.com';
    // $_tmp = 'https://api.salescontrolcenter.com';
    $_tmp2 = 'http://localhost/crm';
} else {
    $_tmp = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://api.' . $_SERVER['HTTP_HOST'];
    $_tmp2 = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
}
define('HOST', $_tmp);
define('HOST2', $_tmp2);

class Authentication
{

    public function checkFormPermission($form)
    {
        if (isset($form)) {
            if (!self::checkFormAccess() && !canAddForm($form)) {
                echo '
                <script>
                    $("[data-action=\'deniedPermission\']").click();
                </script>';
                exit();
            } else {
                $_SESSION['int_acl']['acl_rules'] = (array) $_SESSION['int_acl']['acl_rules'];
                // self::getFileInForm($form);
                return true;
            }
        }
    }

    public function checkFormAccess()
    {
        if (!isset($_SESSION['jwt'])) {
            return false;
        }
        if (isSuperAdmin()) {
            return true;
        }
        $page_navigation = json_encode($_SESSION['page_navigation']);
        $current_file  = str_replace('.php', '', basename($_SERVER['PHP_SELF']));
        $canAccess = strpos($page_navigation, $current_file);
        if ($_SERVER['HTTP_HOST'] == 'localhost') $canAccess = true;
        $id = getID();
        $current_id = $_SESSION['userID'];
        switch ($current_file) {
            case 'contact-form':
                if ($canAccess) return true;
                else if ($id == $current_id) return true;
                else return false;
                break;
            case 'claim-form':
                return $canAccess;
                break;
            case 'error400':
            case 'error404':
            case 'error405':
            case 'map':
            case 'task-new':
            case 'calendar':
            case 'sms-inbox-new':
                return true;
                break;
                // case 'setting.php': return isAdmin(); break;
            default:
                return $canAccess;
        }
    }

    public function settingPageTitle()
    {
        $current_file  = basename($_SERVER['PHP_SELF']);
        $title = '';
        switch ($current_file) {
            case 'dashboard.php':
                $title = 'Dashboard';
                break;
            case 'help-create-content':
                $title = 'Create Help Content';
                break;
            case 'help-desk.php':
                $title = 'Issue Ticket';
                break;
            case 'help-desk-edit.php':
                $title = 'Edit Issue Ticket';
                break;
            case 'help-list.php':
                $title = 'Help Files';
                break;
            case 'help-ticket-list.php':
                $title = 'Ticket List';
                break;
            case 'role-form.php':
                $title = 'ACL Management';
                break;
            case 'state-management.php':
                $title = 'State Management';
                break;
            case 'group.php':
                $title = 'Group Management';
                break;
            case 'group-list.php':
                $title = 'Group List';
                break;
            case 'billing-template.php':
                $title = 'Billing Template';
                break;
            case 'discount-form.php':
                $title = 'Discount';
                break;
            case 'discount-list.php':
                $title = 'Discount List';
                break;
            case 'setting.php':
                $title = 'Setting';
                break;

            case 'contact-form.php':
                $title = 'Contact';
                break;
            case 'company-form.php':
                $title = 'Company';
                break;
            case 'product-form.php':
                $title = 'Product';
                break;
            case 'order-form.php':
                $title = 'Order';
                break;
            case 'warranty-form.php':
                $title = 'Warranty';
                break;
            case 'warranty-form-addnew-form.php':
                $title = 'Warranty';
                break;
            case 'invoice-form.php':
                $title = 'Invoice';
                break;
            case 'claim-form.php':
                $title = 'Claim';
                break;
            case 'import-form.php':
                $title = 'Import';
                break;

            case 'contact-list.php':
                $title = 'Contact List';
                break;
            case 'company-list.php':
                $title = 'Company List';
                break;
            case 'product-list.php':
                $title = 'Product List';
                break;
            case 'order-list.php':
                $title = 'Order List';
                break;
            case 'warranty-list.php':
                $title = 'Warranty List';
                break;
            case 'invoice-list.php':
                $title = 'Invoice List';
                break;
            case 'claim-list.php':
                $title = 'Claim List';
                break;

            case 'report-contact.php':
                $title = 'Report Contact';
                break;

            case 'mail-sent.php':
                $title = 'Sent Mail';
                break;
            case 'mail-compose.php':
                $title = 'Compose Mail';
                break;
            case 'mail.php':
                $title = 'Inbox';
                break;
            case 'mail-drafts.php':
                $title = 'Drafts Mail';
                break;

            case 'map.php':
                $title = 'Location';
                break;
            case 'task.php':
                $title = 'Task';
                break;
            case 'task-list.php':
                $title = 'Task List';
                break;
            case 'report.php':
                $title = 'Report ' . ucfirst($_GET['r']);
                break;
            default:
                $title = '';
        }
        return ($title != '' ? $title . ' - ' : '') . $_SESSION['settingPage']->company_name;
    }

    public function formExist()
    {
        $current_file  = basename($_SERVER['PHP_SELF']);
        $dir = '../ajax';

        $files1 = scandir($dir, 1);

        array_push(
            $files1,
            'signin.php',
            'logout.php',
            'claim-request.php',
            'index.php',
            'upload.php',
            'register-form.php',
            'resetpassword-newpass.php',
            'resetpassword',
            'forgotpassword.php',
            'invoice-print.php',
            'purchase-home-warranty.php'
        );

        $file_names = array();

        foreach ($files1 as $file_name) {
            if (strrpos($file_name, '.') > 0 && $file_name != '..') {
                array_push($file_names, $file_name);
            }
        }
        return in_array($current_file, $file_names);
    }

    public function checkToken()
    {
        if (!isset($_SESSION['jwt'])) {
            header("Location: " . HOST2 . '/signin');
            // echo ('<script>console.log("No jwt"); logout();</script>');
        } else {
            if (!self::checkFormAccess()) {
                echo '
                <script>
                    $("[data-action=\'deniedPermission\']").click();
                </script>';
                exit();
            }
            if (!self::formExist()) {
                echo '
                <script>
                    $("[data-action=\'fileDontExists\']").click();
                </script>';
                exit();
            }
        }
    }
    public function getFileInForm($form)
    {
        $json_file_include = file_get_contents('../data/widget.json');
        if (isset($json_file_include->$form)) {
            $_SESSION['_' . $form] = $json_file_include->$form;
        }
    }

    function startsWith($string, $startString)
    {
        $len = strlen($startString);
        return (substr($string, 0, $len) === $startString);
    }
}

if (!isset($_SESSION['jwt'])) {
    header("Location: " . HOST2 . '/signin.php');
    // echo '<script>logout();</script>';
} else if (!isset($forward_from_email)) {
    $_authenticate = new Authentication();
    $_authenticate->checkToken();
    echo '<script> document.title = "' . $_authenticate->settingPageTitle() . '"
    $("[rel=tooltip]").tooltip();
    $("[data-toggle=tooltip]").tooltip();

    $(\'[role="alert"]\').each(function(){
        let form = $(this).parent().find("form:first");
        if(form[0]){
            $(this).prependTo(form);
        }
    });

    $("#content table").each(function(){
        $(this).parent().prepend(\'<div role="alert" style="display:none" class="message_table"></div>\');
    });

    $.ajaxSetup({
        statusCode: {
            404: function (res) {//Not Found
                assignErrorPage(404, \'<i class="fa fa-fw fa-warning fa-lg text-warning"></i> Page Not Found\',
                    `<div>The page you requested could not be found, either contact your webmaster or try again.</div>`);
            },
        }
    })

    // $("input, button, select, .select2").mousedown(function (e) {
    //     $(\'[role="alert"]\').hide();
    //     $(".message_table").hide();
    //     $(".message_chat").hide();
    // });
    </script>';
    if (hasParam('r') || hasParam('gr')) {
        echo '
        <script> 
            $("aside .open, aside, aside .active").removeClass("open active");
            $("aside ul").attr("style", "");
            $("aside li a[href=\'"+window.location.href.substring(' . (strlen(HOST2) + 1) . ')+"\']").closest("li").parents("li").addClass("open");
            $("aside li a[href=\'"+window.location.href.substring(' . (strlen(HOST2) + 1) . ')+"\']").closest("li").parents("ul").css({display : "block"});
            $("aside li a[href=\'"+window.location.href.substring(' . (strlen(HOST2) + 1) . ')+"\']").closest("li").addClass("active");
        </script>';
    } else {
        echo '
        <script> 
            $("aside .open, aside, aside .active").removeClass("open active");
            $("aside ul").attr("style", "");
            $("aside li a[href=\'"+window.location.href.substring(' . (strlen(HOST2) + 1) . ').split("?")[0]+"\']").closest("li").parents("li").addClass("open");
            $("aside li a[href=\'"+window.location.href.substring(' . (strlen(HOST2) + 1) . ').split("?")[0]+"\']").closest("li").parents("ul").css({display : "block"});
            $("aside li a[href=\'"+window.location.href.substring(' . (strlen(HOST2) + 1) . ').split("?")[0]+"\']").closest("li").addClass("active");
        </script>';
    }

    echo "<script>
        var page_scripts = document.getElementsByTagName('script');
        for(let i=0; i< page_scripts.length; i++){
            let _script = page_scripts[i];
            let _src= _script.getAttribute('src');
            if(_src && _src.startsWith('" . HOST2 . "/js/script')) {
                _script.setAttribute('src', _src+='?updated='+Math.random());
            }
        }
        </script>";
}
