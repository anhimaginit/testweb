var host, host2;

String.prototype.includes = function (string) {
    return this.indexOf(string) >= 0;
}

String.prototype.upperCaseFirst = function () {
    if(!this.split('')[0]) return '';
    return this.split('')[0].toUpperCase() + this.substring(1);
}

Storage.prototype.setItemValue = function (key, value) {
    value = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    });
    localStorage.setItem(btoa(key), btoa(value));
}


Storage.prototype.getItemValue = function (key) {
    if (localStorage.getItem(btoa(key))) {
        return atob(localStorage.getItem(btoa(key)));
    } else {
        return null;
    }
}

if (document.location.href.includes('localhost/')) {
    // host = 'https://api.salescontrolcenter.com/';
    host = 'https://api.warrantyproject.com/';
    host2 = 'http://localhost/crm/';
    // debugState = true;
} else if (document.location.href.includes('salescontrolcenter')) {
    host = 'https://api.salescontrolcenter.com/';
    host2 = 'https://salescontrolcenter.com/';
}else if (document.location.href.includes('blair.trainingaccountadmin.com')) {
    host = 'https://api.trainingaccountadmin.com/';
    host2 = 'https://blair.trainingaccountadmin.com/';
}
 else if (document.location.href.includes('warrantyproject')) {
    host = 'https://api.warrantyproject.com/';
    host2 = 'https://warrantyproject.com/';
}

var urlPhoto = {
    itemProduct: host2 + 'img/images.png',
    logo: host2 + 'img/logo.png'
}
var link = {
    /**-----------FIREBASE ---------------------------- */
    _firebase_sendPasswordResetEmail: host + '_firebase_sendPasswordResetEmail.php',
    /*------------CONTACT---------------------*/
    _isCheckEmailExisting: host + '_isCheckEmailExisting.php',
    _contactAddNew: host + '_contactAddNew.php',
    _contactAddNewNotLogin: host + '_contactAddNewNotLogin.php',
    _contactEdit: host + '_contactEdit.php',
    _contactGetById: host + '_contactGetById.php',
    _contactFilterList: host + '_contactFilterList.php',
    _noteAddNew: host + '_noteAddNew.php',
    _note_AddNew: host + '_note_AddNew.php',
    _contactGetEmail_ID: host + '_contactGetEmail_ID.php',
    _getTag: host + '_getTag.php',
    _emailResend: host + '_emailResend.php',
    _phoneExisting: host + '_phoneExisting.php',
    _contactGetList: host + '_contactGetList.php',

    _order_contact: host + '_order_contact.php',
    _warranty_contact: host + '_warranty_contact.php',
    _claims_contact: host + '_claims_contact.php',

    _contactAddress_id: host + '_contactAddress_id.php',
    _contactID_AID: host + '_contactID_AID.php',
    _contactDeleteMailPhone_ID: host + '_contactDeleteMailPhone_ID.php',


    /**------------  USER  ------------------------------ */
    _userCheckOldPass: host + '_userCheckOldPass.php',
    _userResetPass: host + '_userResetPass.php',
    _userUpdate: host + '_userUpdate.php',
    _salesmanList_state: host + '_salesmanList_state.php',
    _salesmanList_corporate: host + '_salesmanList_corporate.php',
    _userCheckUserPass: host + '_userCheckUserPass.php',
    _userExisting: host + '_userExisting.php',

    /**------------PRODUCT-------------------------  */

    _getProductClass: host + '_getProductClass.php',
    _getProductType: host + '_getProductType.php',
    _productsAddNew: host + '_productsAddNew.php',
    _isSKUExisting: host + '_isSKUExisting.php',
    _productFilterList: host + '_productFilterList.php',
    _productGetById: host + '_productGetById.php',
    _productEdit: host + '_productEdit.php',
    _productsForOrder: host + '_productsForOrder.php',
    _prodForOrderByName: host + '_prodForOrderByName.php',

    _productClssWarranty: host + '_productClssWarranty.php',
    _productClssALaCarte: host + '_productClssALaCarte.php',
    _productsAlacarteForOrder: host + '_productsAlacarteForOrder.php',

    /**------------WARRANTY-------------------------- */

    _warrantyAddNew: host + '_warrantyAddNew.php',
    _wanrantyFilterList: host + '_wanrantyFilterList.php',
    _warrantyEdit: host + '_warrantyEdit.php',
    _warrantyGetById: host + '_warrantyGetById.php',
    _warranty_num_existing: host + '_warranty_num_existing.php',

    _charityofchoiceList: host + '_charityofchoiceList.php',
    _salesmanDetailByID: host + '_salesmanDetailByID.php',
    _salesmanList: host + '_salesmanList.php',
    _salesmanEmployeeList: host + '_salesmanAndEmployeeList.php',



    /**-----------ORDER---------------------------- */
    _orderGetById: host + '_orderGetById.php',
    _orderAddNew: host + '_orderAddNew.php',
    _orderEdit: host + '_orderEdit.php',
    _orderFilterList: host + '_orderFilterList.php',
    _orderGetByIdForWarranty: host + '_orderGetByIdForWarranty.php',
    _orderGetByIdForInvoice: host + '_orderGetByIdForInvoice.php',
    _orderIDByBillTo: host + '_orderIDByBillTo.php',
    _orderIDByShipTo: host + '_orderIDByShipTo.php',
    _orderIDByShipToWarranty: host + '_orderIDByShipToWarranty.php',
    _orderProdClssWarranty: host + '_orderProdClssWarranty.php',

    /**-----------AFFILIATE------------------------------ */
    _affiliateList: host + '_affiliateList.php',
    _affilTitleList: host + '_affilTitleList.php',
    _affilMortgageList: host + '_affilMortgageList.php',
    _affilAgentList: host + '_affilAgentList.php',
    _employeeList: host + '_employeeList.php',
    _affiliateSearchByName: host + '_affiliateSearchByName.php',


    /**-----------INVOICE---------------------------------- */
    _invoiceGetByID: host + '_invoiceGetByID.php',
    _invoiceAddNew: host + '_invoiceAddNew.php',
    _invoiceEdit: host + '_invoiceEdit.php',
    _invoiceNumExisting: host + '_invoiceNumExisting.php',
    _invoiceFilterList: host + '_invoiceFilterList.php',


    /** ---------CLAIM----------------------------- */

    _claimLimitSave: host + '_claimLimitSave.php',
    _claimLimitProductList: host + '_claimLimitProductList.php',
    _claimLimitProductID: host + '_claimLimitProductID.php',
    _wanranties_for_claim: host + '_wanranties_for_claim.php',
    _warrantyForClaim: host + '_warrantyForClaim.php',

    _claimGetById: host + '_claimGetById.php',
    _claimlimitGetByClaimId: host + '_claimlimitGetByClaimId.php',
    _claimGetClaimsCreateBy: host + '_claimGetClaimsCreateBy.php',
    _claimsByWarrantyID: host + '_claimsByWarrantyID.php',
    _claimUpdate: host + '_claimUpdate.php',
    _claimAddNew: host + '_claimAddNew.php',
    _warrantyLitmit_WarrantyID: host + '_warrantyLitmit_WarrantyID.php',
    _wanrantysbyBillToID: host + '_wanrantysbyBillToID.php',
    _wanranties_BillToID: host + '_wanranties_BillToID.php',
    _claimFilterList: host + '_claimFilterList.php',


    /**--------CLAIM TRANSACTION ----------------------------------- */
    _claimTransactionAddNew: host + '_claimTransactionAddNew.php',
    _claimTransactionUpdate: host + '_claimTransactionUpdate.php',
    _claimTransactionByID: host + '_claimTransactionByID.php',
    _claimTransactionFilterList: host + '_claimTransactionFilterList.php',
    _claimVendors: host + '_claimVendors.php',
    _claimEmployee: host + '_claimEmployee.php',
    _claimGetTransByClaimID: host + '_claimGetTransByClaimID.php',
    _claimCreateLimitByClaimId: host + '_claimCreateLimitByClaimId.php',
    _claimGetCLLimitByClaimId: host + '_claimGetCLLimitByClaimId.php', //replace for _claimCreateLimitByClaimId

    /**---------EMAIL----------------------------------- */
    /**
     * 'token','create_by','claim_assign','warranty_ID','claim_ID',
        'subject','body','UID','invoice_amount','invoice_date',
        'warranty_total','vendor_invoice_number'
     */
    _mailOwnerSendDeny: host + '_mailOwnerSendDeny.php',
    /**
     * 'token','create_by','claim_assign','warranty_ID','claim_ID',
       'subject','body','UID','invoice_amount','invoice_date',
       'warranty_total','vendor_invoice_number'
     */
    _mailAcctantSendDeny: host + '_mailAcctantSendDeny.php',

    //Accept
    _mailAcctantApprove: host + '_mailAcctantApprove.php',
    _mailOwnerApprove: host + '_mailOwnerApprove.php',


    /**--------DASHBOARD-------------------------------------- */
    _dashBoardWanrantyList: host + '_dashBoardWanrantyList.php',
    _dashboardOrderPaidOpen: host + '_dashboardOrderPaidOpen.php',
    _dashboardContactList: host + '_dashboardContactList.php',
    _dashboardOrderList: host + '_dashboardOrderList.php',
    _dashboardInvoiceList: host + '_dashboardInvoiceList.php',
    _dashboardClaimList: host + '_dashboardClaimList.php',
    _dashboard_grp: host + '_dashboard_grp.php',
    _dashboard_grptasks: host + '_dashboard_grptasks.php',
    _dashboardListGrps: host + '_dashboardListGrps.php',
    _dashboardListGrps_Individual: host + '_dashboardListGrps_Individual.php',
    _contactName: host + '_contactName.php',

    /**---------RULE (ACL)------------------------------------- */

    _aclRuleUpdate: host + '_aclRuleUpdate.php',
    _aclRules_Unit_Level: host + '_aclRules_Unit_Level.php',
    _aclRulesGroupID: host + '_aclRulesGroupID.php',
    _aclChangeDefault: host + '_aclChangeDefault.php',



    /**---------COMPANY------------------------- */
    _companyList: host + '_companyList.php',
    _companyUpdate: host + '_companyUpdate.php',
    _compAddNew: host + '_compAddNew.php',
    _companiesByName: host + '_companiesByName.php',
    _company_ID: host + '_company_ID.php',

    /**--------  LOGIN  ----------------------------------- */
    _login: host + '_login.php',
    _login_firebase_auth: host + '_login_firebase_auth.php',
    _logout: host2 + 'logout.php',
    _saveSession: host2 + 'php/request.setSession.php',

    /**--------  GROUP  ------------------------------------- */
    _groupList: host + '_groupList.php',
    _groupNew: host + '_groupNew.php',
    _groupUpdate: host + '_groupUpdate.php',
    _groupGetByID: host + '_groupGetByID.php',
    _groupsByUnit: host + '_groupsByUnit.php',
    _gounpUsersInGrp: host + '_gounpUsersInGrp.php',
    _groupDelete: host + '_groupDelete.php',
    _groupsUsersByUnit: host + '_groupsUsersByUnit.php',

    _roles: host + '_roles.php',
    /**----------  REPORT  ----------------------------   */

    _reportClaim: host + '_reportClaim.php',
    _reportDownloadCsvClaim: host + '_reportDownloadCsvClaim.php',

    _reportInvoice: host + '_reportInvoice.php',
    _reportDownloadCsvInvoice: host + '_reportDownloadCsvInvoice.php',

    _reportWarranty: host + '_reportWarranty.php',
    _reportDownloadCsvWarranty: host + '_reportDownloadCsvWarranty.php',

    _reportCompany: host + '_reportCompany.php',
    _reportDownloadCsvCompany: host + '_reportDownloadCsvCompany.php',

    _reportProducts: host + '_reportProducts.php',
    _reportDownloadCsvProducts: host + '_reportDownloadCsvProducts.php',

    _reportOrder: host + '_reportOrder.php',
    _reportDownloadCsvOrder: host + '_reportDownloadCsvOrder.php',

    _reportContact: host + '_reportContact.php',
    _reportDownloadCsvContact: host + '_reportDownloadCsvContact.php',

    _reportLoadOld: host + '_reportLoadOld.php',
    _reportSave: host + '_reportSave.php',

    _postalCodeList: host + '_postalCodeList.php',
    _reportDiscount: host + '_reportDiscount.php',
    _reportPayment: host + '_reportPayment.php',
    _getPaymentType: host + '_getPaymentType.php',
    _getInvoiceIDs: host + '_getInvoiceIDs.php',
    _getOrderOrderIDs: host + '_getOrderOrderIDs.php',
    _getInvoiceNumbers: host + '_getInvoiceNumbers.php',
    _getOrderTitle_title: host + '_getOrderTitle_title.php',
    /**---------  BILLING  ------------------------ */
    _subName: host + '_subName.php',
    _subTemplate: host + '_subTemplate.php',
    _subAddNew: host + '_subAddNew.php',
    _subUpdate: host + '_subUpdate.php',
    _subcriptions: host + '_subcriptions.php',
    _subGetNunOfPayment: host + '_subGetNunOfPayment.php',


    /** MAIL */
    _mailToCutomer: host + '_mailToCutomer.php',

    /**------  ADDRESS  --------------------------- */
    _getCities: host + '_getCities.php',
    _getStateList: host + '_getStateList.php',
    _getCityListByState: host + '_getCityListByState.php',
    _getZipcodeByCity: host + '_getZipcodeByCity.php',
    _checkZipcode: host + '_checkZipcode.php',
    _getSatesZipByCity: host + '_getSatesZipByCity.php',
    _getListcity: host + '_getListcity.php',
    _stateCityStateZip: host + '_stateCityStateZip.php',
    _stateAddNew: host + '_stateAddNew.php',

    /**------------  REGISTER ------------------------------ */
    _register: host + '_register.php',
    _emailRegister: host + 'emailRegister.php',



    /**----------  DISCOUNT  --------------------------------- */
    _discountAddNew: host + '_discountAddNew.php',
    _discountUpdate: host + '_discountUpdate.php',
    _discountGetByID: host + '_discountGetByID.php',
    _discountGetByDiscountCode: host + '_discountGetByDiscountCode.php',
    _productClssWarrAlacate: host + '_productClssWarrAlacate.php',
    _discountListAct: host + '_discountListAct.php',
    _discountList: host + '_discountList.php',
    _discountGetByDiscountCodeByName: host + '_discountGetByDiscountCodeByName.php',



    /**-----------  PURCHASE HOME WARRANTY  -------------------------------------- */
    _homeOrderAddNew: host + '_homeOrderAddNew.php',
    _homeWarrantyAddNew: host + '_homeWarrantyAddNew.php',
    _homeWarrantyEdit: host + '_homeWarrantyEdit.php',
    _homeOrderEdit: host + '_homeOrderEdit.php',
    _orderAddNewNotLogin: host + '_orderAddNewNotLogin.php',
    _warrantyAddNewNotLogin: host + '_warrantyAddNewNotLogin.php',


    /*--------------  CONTROL SELECT2  -------------------------------- */
    _contactGetList: host + '_contactGetList.php',
    _affilAgentList: host + '_affilAgentList.php',
    _affilMortgageList: host + '_affilMortgageList.php',
    _affilTitleList: host + '_affilTitleList.php',
    _contacListSearch: host + '_contacListSearch.php',
    _salesmanListSearch: host + '_salesmanListSearch.php',
    _contacListSearchForGrp: host + '_contacListSearchForGrp.php',

    /**--------------  WARRANTY PAID - TYPE  --------------------------------------- */
    _getStateList: host + '_getStateList.php',

    /**-------------  TASK  ---------------------------------------------- */
    _claimTaskUpdate: host + '_claimTaskUpdate.php',
    _taskAddNew: host + '_taskAddNew.php',
    _taskUpdate: host + '_taskUpdate.php',
    _taskList: host + '_taskList.php',
    _taskTemplate: host + '_taskTemplate.php',
    _taskTemplateUpdate: host + '_taskTemplateUpdate.php',
    _taskNewTotal: host + '_taskNew_Total.php',
    _actionset_list: host + '_actionset_list.php',

    /****-------------  EMAIL  --------------------------------------- */
    _emailComposer: host + '_emailComposer.php',
    _emails_draft: host + '_emails_draft.php',
    _emails_Inbox: host + '_emails_Inbox.php',
    _emails_sent: host + '_emails_sent.php',
    _emails_open: host + '_emails_open.php',
    _emails_deleted: host + '_emails_deleted.php',
    _emails_inbox_total_new: host + '_emails_Inbox_New_Total.php',

    /****-------------  SMS  --------------------------------------- */
    _smsComposer: host + '_smSendSMS.php',
    _sms_dedicated_number_list: host + '_smDedicateNumberList.php',
    _sms_update_as_read: host + '_smsUpdateReadSMS.php',
    _sms_new_message: host + '_smsNewInbox_phone.php',
    _sms_Inbox: host + '_smsInbox_phone.php',
    _sms_Sent: host + '_smsgetSentSMS.php',
    _sms_getPhone_byID: host + '_smsGetPhoneByID.php',
    _sms_total_new_msg: host + '_smsGetTotalnewMsg.php',
    _sms_getAPIkey: host + '_smsGetAPI_key.php',
    _smsForward: host + '_smsForward.php',
    _smsTemplate: host + '_smGetTemplate.php',
    _sms_get_area_by_phone: host + '_smsGetAreabyphone.php',
    _sms_insert_phone_area: host + '_smsInsertPhoneArea.php',
    _sms_get_text: host + '_smsGetSends_phone.php',


    _task_getNew: host + '_taskGetNew.php',

    /**--------  IMPORT  ------------------------------- */
    _import_fileCSV: host + '_import_fileCSV.php',
    _import_file_contactCSV: host + '_import_file_contactCSV.php',

    /**---------  PAYMENT  ----------------------------------- */
    _sandBoxPayment: host + '_sandBoxPayment.php',
    _warrantyPayee: host + '_warrantyPayee.php',

    /**---------  invoice button  -------------------------------------- */
    _invoice_pdf: host + '_invoice_pdf.php',
    _invoice_mailto: host + '_invoice_mailto.php',
    _contactUpdateW9: host + '_contactUpdateW9.php',
    _companyUpdateW9: host + '_companyUpdateW9.php',

    /**---------  payment acct   -------------------------------------- */
    _payAcctAddNew: host + '_payAcctAddNew.php',
    _payAcctAddNewUpdateINV: host + '_payAcctAddNewUpdateINV.php',

    /**=----------  HELP DESK  ----------------------------------------- */
    _heldDeskAddNew: host + '_heldDeskAddNew.php',
    _heldDeskGet_ID: host + 'https://api.salescontrolcenter.com/_heldDeskGet_ID.php',
    // _heldDeskList: host + 'https://api.salescontrolcenter.com/_heldDeskList.php',
    // _heldDeskEdit: host + 'https://api.salescontrolcenter.com/_heldDeskEdit.php',

    _heldDeskList: host + '_heldDeskList.php',
    _heldDeskEdit: host + '_heldDeskEdit.php',

    /************   GENERAL   *********************** */
    _btnPrvOrNxt: host + '_btnPrvOrNxt.php',
    /**----------  SEARCH ALL  -------------------------- */
    _contactAndCompFilterList: host + '_contactAndCompFilterList.php',
};

var _linkSelect = {
    // order form
    bill_to: { url: link._contacListSearch, id: 'ID' },
    salesperson: { url: link._salesmanListSearch, id: 'SID' },
    //invoice form
    customer: { url: link._contacListSearch, id: 'ID' },
    //warranty form
    warranty_buyer_id: { url: link._contacListSearch, id: 'ID' },
    warranty_seller_agent_id: { url: link._affilAgentList, id: 'AID' },
    warranty_buyer_agent_id: { url: link._affilAgentList, id: 'AID' },
    warranty_mortgage_id: { url: link._affilMortgageList, id: 'AID' },
    warranty_escrow_id: { url: link._affilTitleList, id: 'AID' },
    //claim form
    UID: { url: link._claimVendors, id: 'ID' },//vendor
    claim_assign: { url: link._claimEmployee, id: 'ID' },
    group_users: { url: link._contacListSearchForGrp, id: 'ID' }
}

var roleScore = {
    SuperAdmin: 1,
    Admin: 2,
    Manager: 3,
    Leader: 4,
    User: 5,
}

Array.prototype.different = function (a) {
    return this.filter(function (i) { return a.indexOf(i) < 0; });
};


$(function () {
    $('.text-input').blur(function () {
        var s = $(this).val();
        var regex = new RegExp('[!@#$%^&*(),.?":{}|<>]');
        if (s != '' && regex.test(s)) {
            $(this).addClass('state-error');
            if (!$(this).parent().children('p').is('.error'))
                $(this).parent().append('<p class="error">This field is include [a-z], [A-Z], [0-9] and [_]</p>')
        }
    });

    /**carousel */

    $(document).unbind('click', '.carousel-control-next').on('click', '.carousel-control-next', function () {
        let carousel = $(this).closest('.carousel');
        length = carousel.find('ol.carousel-indicators li').length;
        let active = carousel.find('.carousel-inner .carousel-item.active').index() + 1;
        if (!active || active < 0 || active >= length) active = 0;
        carousel.find('.carousel-inner .carousel-item').removeClass('active');
        carousel.find('.carousel-inner .carousel-item:eq(' + active + ')').addClass('active');
    });

    $(document).unbind('click', '.carousel-control-prev').on('click', '.carousel-control-prev', function () {
        let carousel = $(this).closest('.carousel');
        length = carousel.find('ol.carousel-indicators li').length;
        let active = carousel.find('.carousel-inner .carousel-item.active').index() - 1;
        if (!active || active < 0 || active >= length) active = length - 1;
        carousel.find('.carousel-inner .carousel-item').removeClass('active');
        carousel.find('.carousel-inner .carousel-item:eq(' + active + ')').addClass('active');
    });

    $(document).unbind('click', '.carousel-indicators li').on('click', '.carousel-indicators li', function () {
        let carousel = $(this).closest('.carousel');
        let active = $(this).data('slide-to');
        carousel.find('.carousel-inner .carousel-item').removeClass('active');
        carousel.find('.carousel-inner .carousel-item:eq(' + active + ')').addClass('active');
    })

    $('input').on('focusin', function () {
        $(this).data('val', $(this).val());
    });
    $('#left-panel>nav>ul .collapse_content').parent().addClass('hidden');
    $('#left-panel>nav>ul .collapse_content').on('click', function () {
        let $ul = $(this).closest('ul');
        let $advance = $ul.find('.advance_content').parent();
        let $index = $advance.index() + 1;
        $ul.find('li:nth-child(n+' + $index + ')').addClass('hidden');
        $advance.removeClass('hidden');

    })
    $('#left-panel>nav>ul .advance_content').on('click', function () {
        $ul = $(this).closest('ul');
        $ul.find('.hidden').removeClass('hidden').show(100);
        $(this).parent().addClass('hidden');
    });


    // document.addEventListener('contextmenu', function (e) {
    //     e.preventDefault();
    //  }, false);

    $(document).mouseup(function (e) {
        var container = $(".popover");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }

        var help = $('.help');
        if ((!help.is(e.target) && help.has(e.target).length === 0)) {
            help.hide();
        }
    });

    $(document).ready(function () {
        $(window).keydown(function (event) {
            if (event.keyCode == 13 && $('#search_top').val() == '') {
                $(this).next('input').focus();
                event.preventDefault();
                return false;
            }
        });
        $('[data-toggle="popover"]').popover();
        setTimeout(function () {
            $("input.input-currency").focusout();
        }, 2000);

    });

    $(document).on('focusin submit', 'input.input-currency', function () {
        $(this).prop('type', 'text');
        if (this.value && this.value != '') {
            var value = numeral(this.value).value();
            $(this).prop('type', 'number');
            $(this).val(value);
        }
    }).on('focusout', '.input-currency, .currency', function () {
        if (this.value && this.value != '') {
            var value = numeral(this.value).format('$ 0,0.00');
            $(this).prop('type', 'text');
            $(this).val(value);
        }
    }).on();

    $('button[type=submit]').click(function () {
        $('.input-currency').focusin();
        setTimeout(function () {
            $('.input-currency').focusout();
        }, 200);
    });

    $(document).on('click', '[data-toggle="help"]', function () {
        if ($(this).data('target') != undefined) {
            $($(this).data('target')).show();
        } else if ($(this).data('dismiss') != undefined) {
            $($(this).data('dismiss')).hide();
        }
    });

    // $.fn.select2.defaults.set("theme", "");
});

/**
 * @param {String} mes : message show in div.alert
 * @param {String/Boolean} status : true/false/ alert class (warning, success, danger, purple, info, primary or your custome alert class). default danger
 * @param {String} elem target of message text. default #message_form
 */

function messageForm(mes, status, elem) {
    if (!elem) elem = '#message_form:first';
    $(elem).html('<i class="fa fa-times pointer pull-right p-r-10" onclick="$(\'' + elem + '\').hide(100)"></i>' + mes);
    $(elem).change();
    $(elem).removeClass('alert alert-danger alert-success alert-warning alert-info alert-primary');
    if (status == true) {
        $(elem).addClass('alert alert-success');
    } else if (status == false || status == undefined) {
        $(elem).addClass('alert alert-danger');
    } else {
        $(elem).addClass('alert alert-' + status);
    }
    $('.popover').hide();
    $(elem).show();
    if (!($(elem).closest('.modal')[0])) {
        $('.modal').modal('hide');
        $([document.documentElement, document.body]).animate({
            scrollTop: $(elem).offset().top
        }, 500);
    } else {
        $($('.modal.in')[0]).animate({
            scrollTop: $(elem).offset().top
        }, 500);
    }
    // console.log($(elem).offset().top);
    // console.log($(elem)[0].parentNode.offsetParent.offsetTop);
    // topFunction($(elem)[0].parentNode.offsetParent.offsetTop);
};
var _token = btoa('214a2036199e47ede48b7e468c796db5-us19');
localStorage.setItemValue('token', _token);

template_data = {
    token: localStorage.getItemValue('token'),
    jwt: localStorage.getItemValue('jwt'),
    private_key: localStorage.getItemValue('userID'),
    role: JSON.parse(localStorage.getItemValue('int_acl_short')),
    login_id: localStorage.getItemValue('userID')
};

function topFunction(index = 0) {
    document.body.scrollTop = index; // For Safari
    document.documentElement.scrollTop = index; // For Chrome, Firefox, IE and Opera
};

function getUrlParameter(sParam) {
    var sPageURL = document.location.href.substring(document.location.href.indexOf('?') + 1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            var tmp = sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            if (tmp == '0' || tmp == '' || tmp == 'undefined') return undefined;
            else return tmp;
        }
    }
};

function getDateTime(_date) {
    if (_date == undefined) _date = new Date();
    if (isNaN(_date.getFullYear())) {
        return '';
    }
    return _date.getFullYear() +
        '-' + (_date.getMonth() < 9 ? '0' + (_date.getMonth() + 1) : (_date.getMonth() + 1)) +
        '-' + (_date.getDate() <= 9 ? '0' + _date.getDate() : _date.getDate()) +
        ' ' + (_date.getHours() <= 9 ? '0' + _date.getHours() : _date.getHours()) +
        ':' + (_date.getMinutes() <= 9 ? '0' + _date.getMinutes() : _date.getMinutes()) +
        ':' + (_date.getSeconds() <= 9 ? '0' + _date.getSeconds() : _date.getSeconds());
}

function getDayOfMonth(date) {
    if (!date) date = new Date();
    if (typeof date == 'string') {
        date = new Date(date);
    }
    var month = date.getMonth();
    var year = date.getFullYear();
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        return 31;
    } else if ([4, 6, 9, 11].includes(month)) {
        return 30;
    } else {
        if (year % 4 == 0) return 29;
        else return 28;
    }
}

function parseDateTime(date) {
    var tmp = decodeURIComponent(date).split(' ').join(',').split('-').join(',').split(':').join(',').split(',');
    var date2 = new Date();
    date2.setFullYear(parseInt(tmp[0]));
    date2.setMonth(parseInt(tmp[1]) - 1);
    date2.setDate(parseInt(tmp[2]));
    date2.setHours(parseInt(tmp[3]));
    date2.setMinutes(parseInt(tmp[4]));
    date2.setSeconds(parseInt(tmp[5]));

    return date2;

}

function isAdmin() {
    var level = localStorage.getItemValue('level');
    if (!level) return false;
    var isAdminField = ['SuperAdmin', 'SystemAdmin', 'Admin'];
    return isAdminField.includes(level);
}

function isSystemAdmin() {
    var level = localStorage.getItemValue('level');
    if (!level) return false;
    var isAdminField = ['SuperAdmin', 'SystemAdmin', 'Admin'];
    var actorField = ['SuperAdmin', 'SystemAdmin'];
    return isAdminField.includes(level) && actorField.includes(localStorage.getItemValue('actor'));
}

function isUser() {
    var level = localStorage.getItemValue('level');
    if (!level) return false;
    return level == 'User'
}

var readURLValue;

function readURL(input, item) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (item) {
                $('#image-preview').attr('src', e.target.result);
            }
            readURLValue = e.target.result
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function getContactName(idUser) {
    return new Promise(function (resolve, reject) {
        var _data = $.extend({}, template_data);
        _data.IDs = idUser;
        $.ajax({
            url: link._contactName,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
                if (res.ERROR == '')
                    resolve(res.list)
                else reject(res.ERROR)
            },
            error: function (e) {
                reject(e);
            }
        })
    });
}

function getFilterList(array, item, start, end, attr, result, cb) {
    item = item.toLowerCase();
    if (start > end) return cb(result);
    var mid = Math.floor((start + end) / 2);
    var value = '';
    if (attr && attr != undefined && attr != null && attr != '') value = array[mid][attr];
    else value = array[mid];
    if (value.toLowerCase().startsWith(item.toLowerCase())) {
        result.push(array[mid]);
        for (var index = mid + 1; index <= end; index++) {
            var valueSearch;
            if (attr) {
                valueSearch = array[index][attr];
            } else {
                valueSearch = array[index];
            }
            if (valueSearch.toLowerCase().startsWith(item.toLowerCase())) {
                result.push(array[index]);
            } else {
                break;
            }
        }
        for (var index = mid - 1; index >= start; index--) {
            var valueSearch;
            if (attr) {
                valueSearch = array[index][attr];
            } else {
                valueSearch = array[index];
            }
            if (valueSearch.toLowerCase().startsWith(item.toLowerCase())) {
                result.push(array[index]);
            } else {
                break;
            }
        }
        if (cb)
            cb(result);

    } else {
        var tmp = [value.toLowerCase(), item.toLowerCase()];
        tmp.sort();
        // search after
        if (tmp.indexOf(value.toLowerCase()) == 0) {
            getFilterList(array, item, mid + 1, end, attr, result, cb);
        } else { //search before
            getFilterList(array, item, start, mid - 1, attr, result, cb);
        }
    }
}


/**
 * @param {String} mes : message show in div.alert
 * @param {String/Bool} status : true/false/ alert class (warning, success, danger, purple, info, primary or your custome alert class)
 * @param {String} elem target of message text. default #message_form
 * @param {String} link link to change href;
 * @param {String} btnText : button text of a tag
 */
function responseSuccessForward(text, status, elem, link, btnText = 'Go to edit') {
    let _html = text;
    _html += `<a href="${link}" class="btn btn-sm btn-default pull-right">${btnText}</a>`;
    messageForm(_html, status, elem);
}

function makeTooltip(text, elem) {
    $(elem).data('toggle', 'tooltip');
    $(elem).data('placement', 'top');
    $(elem).data('rel', 'tooltip');
    $(elem).data('title', text);
}

function tooltipInputError(text, elem) {
    $(elem).parent().addClass('tooltip-error')
    $(elem).data('toggle', 'tooltip');
    $(elem).data('placement', 'top');
    $(elem).data('rel', 'tooltip');
    $(elem).data('title', text);
    $(elem).tooltip('show');

    $(elem).change(function () {
        $(elem).tooltip('hide');
        $(elem).tooltip('destroy');
    })
}
