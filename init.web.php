<?php
if (!session_id()) {
    session_start();
}
require_once 'init.php';

//CONFIGURATION for SmartAdmin UI

//ribbon breadcrumbs config
//array("Display Name" => "URL");
$breadcrumbs = array(
    "Home" => APP_URL,
);

/*navigation array config

ex:
"dashboard" => array(
"title" => "Display Title",
"url" => "http://yoururl.com",
"url_target" => "_self",
"icon" => "fa-home",
"label_htm" => "<span>Add your custom label/badge html here</span>",
"sub" => array() //contains array of sub items with the same format as the parent
)

 */

if (!isset($_SESSION['jwt'])) {
    header('Location: ' . ASSETS_URL . '/signin.php');
    exit();
}

$page_nav = array(
    "dashboard" => array(
        "title" => "Dashboard",
        "icon" => "fa-home",
        "url" => "#ajax/dashboard.php",
    ),
    'administrator' => array(
        "title" => "Admin",
        "icon" => "fa-cubes",
        "sub" => array(
            "roles" => array(
                "title" => "Roles",
                "icon" => "fa-sliders",
                'sub' => array(
                    "role" => array("title" => "Group Roles", "url" => "#ajax/acl?gr=true"),
                    "generalrole" => array("title" => "General Roles", "url" => "#ajax/acl")
                )
            ),

            "group" => array(
                "title" => "Group",
                "icon" => "fa-users",
                "sub" => array(
                    "addgroup" => array("title" => "Add Group", "url" => "#ajax/group.php"),
                    "listgroup" => array("title" => "Group List", "url" => "#ajax/group-list.php")
                )
            ),
            'state_manage' => array(
                "title" => "State",
                "icon" => "fa-sliders",
                "url" => "#ajax/state-management.php",
            ),

            "billing" => array(
                "title" => "Billing Template",
                "icon" => "fa-money",
                "url" => "#ajax/billing-template.php"
            ),
            'discount' => array(
                "title" => "Discount",
                "icon" => 'fa-certificate',
                "sub" => array(
                    "adddiscount" => array("title" => "Add Discount", "url" => "#ajax/discount-form.php"),
                    "discountlist" => array("title" => "Discount List", "url" => "#ajax/discount-list.php"),
                    'discountreport' => array("title" => "Discount Report", "url" => "#ajax/report.php?r=discount"),

                )
            ),
            'merge' =>array(
                'title' => 'Merge Duplication',
                'icon' => 'fa-codepen',
                'url' => '#ajax/merge-form.php'
            ),
            'setting' => array(
                'title' => 'Setting',
                'icon' => 'fa-cog',
                'url' => '#ajax/setting.php'
            ),
            // 'email_template' => array(
            //     "title" => 'Mail Template',
            //     "icon" => 'fa-envelope-o',
            //     "sub" => array(
            //         "addmailtemplate" => array("title" => "Add Mail Template", "url" => "#ajax/mail-template.php"),
            //         "listmailtemplate" => array("title" => "Mail Template List", "url" => "#ajax/mail-template-list.php")
            //     )
            // )
        )
    ),
    "contact" => array(
        "title" => "Contact",
        "icon" => "fa-phone-square",
        "sub" => array(
            'addcontact' => array("title" => "Add Contact", "url" => "#ajax/contact-form.php"),
            'listcontact' => array("title" => "Contact List", "url" => "#ajax/contact-list.php"),
            'reportcontact' => array("title" => "Contact Report", "url" => "#ajax/report.php?r=contact")
        )
    ),
    "company" => array(
        "title" => "Company",
        "icon" => "fa-institution",
        'sub' => array(
            'addcompany' => array("title" => "Add Company", "url" => "#ajax/company-form.php"),
            'listcompany' => array("title" => "Company List", "url" => "#ajax/company-list.php"),
            'reportcompany' => array("title" => "Company Report", "url" => "#ajax/report.php?r=company")
        )
    ),
    "product" => array(
        "title" => "Product",
        "icon" => "fa-inbox",
        'sub' => array(
            'addproduct' => array("title" => "Add Product", "url" => "#ajax/product-form.php"),
            'listproduct' => array("title" => "Product List", "url" => "#ajax/product-list.php"),
            'reportproducts' => array("title" => "Products Report", "url" => "#ajax/report.php?r=product")
        )

    ),
    "order" => array(
        "title" => "Order",
        "icon" => "fa-shopping-cart",
        'sub' => array(
            'addorder' => array("title" => "Add Order", "url" => "#ajax/order-form.php"),
            'listorder' => array("title" => "Order List", "url" => "#ajax/order-list.php"),
            'reportorder' => array("title" => "Order Report", "url" => "#ajax/report.php?r=order")
        )
    ),
    "warranty" => array(
        "title" => "Warranty",
        "icon" => "fa-wrench",
        'sub' => array(
            'addwarranty' => array("title" => "Add Warranty", "url" => "#ajax/warranty-form-addnew.php"),
            'editwarranty' => array("title" => "Add/Edit Warranty", "url" => "#ajax/warranty-form.php"),
            'listwarranty' => array("title" => "Warranty List", "url" => "#ajax/warranty-list.php"),
            'reportwarranty' => array("title" => "Warranty Report", "url" => "#ajax/report.php?r=warranty")
        )
    ),
    "invoice" => array(
        "title" => "Invoice",
        "icon" => "fa-barcode",
        'sub' => array(
            'addinvoice' => array("title" => "Add Invoice", "url" => "#ajax/invoice-form.php"),
            'listinvoice' => array("title" => "Invoice List", "url" => "#ajax/invoice-list.php"),
            'reportinvoice' => array("title" => "Invoice Report", "url" => "#ajax/report.php?r=invoice"),
            'reportpayment' => array("title" => "Payment Report", "url" => "#ajax/report.php?r=payment"),
        )
    ),
    "claim" => array(
        "title" => "Claim",
        "icon" => "fa-location-arrow",
        'sub' => array(
            'addclaim' => array("title" => "Add Claim", "url" => "#ajax/claim-form.php"),
            'claimlist' => array("title" => "Claim List", "url" => "#ajax/claim-list.php"),
            'reportclaim' => array("title" => "Claim Report", "url" => "#ajax/report.php?r=claim"),
            'claimlimit' => array("title" => "Add/Update Claim Limit", "url" => "#ajax/claim-limit-form.php"),
        )
    ),
);

$naviga = 'Navigation';

// if (!isset($_SESSION['form_access'])) {
//     $_SESSION['form_access'] = ['Dashboard', 'Navigation'];
// }

// if (isSuperAdmin()) {
//     $page_nav["widgetcontrol"=> array(
//         "title" => "Widget Control",
//         "icon" => "fa-lg fa-fw fa-list-alt",
//         "sub" => array(
//             "widget2" => array(
//                 "title" => "Widget Control SmartUI",
//                 "url" => "#ajax/widget-control2.php",
//             ),
//             "widget3" => array(
//                 "title" => "Widget Control Nestable",
//                 "url" => "#ajax/widget-control.php",
//             ),
//         ),
//     );
// }

$page_nav["mail"] = array(
    "title" => "Message Center",
    "icon" => "fa-envelope-o",
    'sub' => array(
        'compose' => array("title" => "Mail Compose", "url" => "#ajax/mail-compose.php"),
        'inbox' => array(
            "title" => "Mail Inbox",
            "url" => "#ajax/mail.php",

        ),
        'sent' => array("title" => "Mail Sent", "url" => "#ajax/mail-sent.php"),
        'drafts' => array("title" => "Mail Drafts", "url" => "#ajax/mail-drafts.php"),
        'sms_compose' => array("title" => "SMS Compose", "url" => "#ajax/sms-compose.php"),
        'sms_inbox' => array("title" => "SMS Inbox", "url" => "#ajax/sms-inbox.php"),
        'sms_sent' => array("title" => "SMS Sent", "url" => "#ajax/sms-sent.php"),
    )
);

$page_nav['task'] = array(
    'title' => 'Task',
    'icon' => 'fa-tasks',
    'sub' => array(
        'addtask' => array('title' => 'Add Task', 'url' => '#ajax/task.php'),
        'tasklist' => array('title' => 'Task List', 'url' => '#ajax/task-list.php'),
        // 'reporttask' => array('title' => 'Report Task', 'url' => '#ajax/report.php?r=task')
    )
);

$page_nav["help"] = array(
    "title" => "Help Desk",
    "icon" => "fa-comments-o",
    "sub" => array(
        'help_page' => array(
            "title" => 'Help Content',
            'sub'=> array()
        ),
        'helpfiles' => array(
            "title" => 'Help Files',
            "url" => '#ajax/help-file-list.php'
        ),
        "helpcreatecontent" =>  array(
            "title" => "Create Content",
            "url" => "#ajax/help-file.php"
        ),
        'issueticket' => array(
            'title' => 'Issue Ticket',
            'url' => '#ajax/help-desk.php'
        ),
        'ticketlist' => array(
            'title' => 'Ticket List',
            // 'class' => (isAdmin() ? '' : 'hidden'),
            'url' => '#ajax/help-ticket-list.php'
        ),
        // 'completeticketlist' => array(
        //     'title' => 'Complete Ticket',
        //     'url' => '#ajax/ticket-list.php?r=true'
        // ),
    )
);

if (isset($page_nav['task'])) {
    $page_nav['task']['sub']['tasktemplate'] = array('title' => 'Task Template', 'url' => '#ajax/task-template.php');
}
/*
try {
    if (hasPermission($naviga, 'help_page', 'show')) {
        $extend_long = 8;
        $help_extend = json_decode(file_get_contents(ASSETS_URL . '/data/help-extend.json'));
        if (sizeof($help_extend) > 0) {
            $page_nav['help']['sub']['help_page'] = array(
                "title" => 'Help Content',
            );
            usort($help_extend, function ($item1, $item2) {
                return $item2->index <=> $item1->index;
            });
            $hidden = '';
            $count = 0;
            foreach ($help_extend as $subhelp) {
                if ($count == $extend_long) {
                    $hidden = 'hidden';
                    $page_nav['help']['sub']['help_page']['sub']['advanced_content'] = array(
                        'title' => 'Advanced',
                        'class' => 'advance_content" data-extend="help_page" data-index="' . $count,
                        'icon' => 'fa-plus-square-o'
                    );
                }

                if (isset($subhelp->title) && isset($subhelp->url) && isset($subhelp->id)) {
                    $page_nav['help']['sub']['help_page']['sub'][$subhelp->id] = array(
                        'title' => $subhelp->title,
                        'class' => $hidden,
                        'url' =>  '#ajax/help/' . $subhelp->url
                    );
                }
                $count++;
            }
            if ($count > $extend_long) {
                $page_nav['help']['sub']['help_page']['sub']['collapse_content'] = array(
                    'title' => 'Collapse',
                    'class' => 'collapse_content" data-extend="help_page" data-index="' . $count,
                    'icon' => 'fa-minus-square-o'
                );
            }
        }
    }
} catch (Exception $e) { }

*/
require_once 'php/write-navigation.php';
if (hasPermission($naviga, 'help_page', 'show')) {
    // $page_nav['help']['sub']['help_page']['sub'] = (object) json_decode(file_get_contents('data/help/help-navigation.json'));
    $page_nav['help']['sub']['help_page']['sub'] = MakeNavigation::writeNavigation((array) json_decode(file_get_contents('data/help/help-file.json')));
}


if (hasPermission($naviga, 'listwarranty', 'show')) {
    $page_nav['warranty']['sub']['editwarranty'] = array("title" => "Add/Edit Warranty", "url" => "#ajax/warranty-form.php");
}

$page_nav["import"] = array(
    "title" => "Import",
    "icon" => "fa-file-code-o",
    "sub" => array(
        'importproduct' => array('title' => 'Import Product', "url" => "#ajax/import-product.php"),
        'importcontact' => array('title' => 'Import Contact', "url" => "#ajax/import-contact.php"),
    )
);

if (!isSuperAdmin()) {
    foreach ($page_nav as $ul => $value) {
        if (hasPermission($naviga, $ul, 'show')) {
            if (isset($page_nav[$ul]['sub'])) {
                foreach ($page_nav[$ul]['sub'] as $li => $a) {
                    if (hasPermission($naviga, $li, 'show')) {
                        if (isset($page_nav[$ul]['sub'][$li]['sub'])) {
                            foreach ($page_nav[$ul]['sub'][$li]['sub'] as $li2 => $a2) {
                                if (!hasPermission($naviga, $li2, 'show')) {
                                    unset($page_nav[$ul]['sub'][$li]['sub'][$li2]);
                                }
                            }
                        }
                    } else if (!isAdmin()) {
                        unset($page_nav[$ul]['sub'][$li]);
                    }
                }
            }
        } else  if (!isAdmin()) {
            unset($page_nav[$ul]);
        }
    }
}

if(isset($page_nav['help']['sub']['ticketlist'])){
    $page_nav['help']['sub']['ticketedit'] = array('title' => 'Ticket Edit', "class"=>"hidden", "url" => "#ajax/help-desk-edit.php");
}

$_SESSION['page_navigation'] = $page_nav;

/**
 *
 * dashboard,
 * rules,
 * contact,->sub {addcontact, listcontact, reportcontact}
 * company,->sub {addcompany}
 * product,->sub {addproduct, listproduct, reportproducts}
 * order, ->sub {addorder, listorder, reportorder}
 * warranty, -> {addwarranty, listwarranty}
 * invoice, ->{addinvoice, listinvoice}
 * claim, -> {addclaim, claimlimit, claimlist, claimtransaction, claimtransactionlist}
 * widgetcontrol, {widget2, widget3}
 * import -> {importproduct}
 */
//configuration variables
if (!isset($page_title)) $page_title = "";
if (!isset($page_css)) $page_css = array();
if (!isset($no_main_header)) $no_main_header = false; //set true for lock.php and login.php
if (!isset($page_body_prop)) $page_body_prop = array(); //optional properties for <body>
if (!isset($page_html_prop)) $page_html_prop = array(); //optional properties for <html>
