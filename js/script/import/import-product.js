
function ImportProduct() {
    this.import_arr = [];
    this.removeSelected = '';
}
ImportProduct.NAME = "ImportProduct";
ImportProduct.VERSION = "1.2";
ImportProduct.DESCRIPTION = "Class ImportProduct";

ImportProduct.prototype.constructor = ImportProduct;
ImportProduct.prototype = {
    init: function () {
        $('#import_product_form #import-next').unbind('click').bind('click', function (e) {
            var data = $("#prod_import")[0].files[0];
            if (typeof data !== "undefined") {
                var tempCSV = data.name.split(".");
                if (tempCSV[1] == "csv" || tempCSV[1] == "CSV") {
                    $('#import_product_form .prod-import').css({ "display": 'none' });
                    imp.processfile(data);
                    $('#import_product_form #process-prods').css({ "display": '' });
                }

            }

        });

        $('#import_product_form #prods-submit').unbind('click').bind('click', function (e) {
            imp.createDataImp();
        });

        $('#import_product_form .prods-back').unbind('click').bind('click', function (e) {
            location.reload();
        });

        $('#import_product_form .prods-previous').unbind('click').bind('click', function (e) {
            $('#import_product_form  .prod-errs').css({ "display": "none" });
            $('#import_product_form  #process-prods').css({ "display": "" });
        });
    },

    processfile: function (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            var csv = event.target.result;
            var data = $.csv.toArrays(csv);
            var html = '';
            var thead = '';
            var tr = '';
            var ths = '';
            var th = '';
            var listSelected = [];
            var listSelectedString = '';

            var ID_style = '';
            var SKU_style = '';
            var prod_name_style = '';
            var prod_desc_style = '';
            var prod_desc_short_style = '';
            var prod_type_style = '';
            var prod_class_style = '';
            var prod_cost_style = '';
            var prod_price_style = '';
            var product_taxable_style = '';
            var prod_weight_style = '';
            var prod_length_style = '';
            var prod_width_style = '';
            var prod_height_style = '';
            var product_tags_style = '';
            var product_notes_style = '';
            var prod_internal_visible_style = '';
            var prod_inactive_style = '';
            var product_added_style = '';
            var product_updated_by_style = '';
            var product_updated_style = '';
            var prod_photo_style = '';
            var prod_visible_style = '';

            for (var row = 0; row < data.length; row++) {

                if (row == 0) {
                    //create header column name
                    for (var item = 0; item < data[row].length; item++) {
                        th += '<th>' + data[row][item] + '</th>';
                    }
                } else {
                    if (row == 1) {
                        var k = 0;
                        var td_arr = [];
                        //tr in tbody
                        tr += '<tr>\r\n';
                        for (var item = 0; item < data[row].length; item++) {
                            td_arr[k] = data[row][item];
                            tr += '<td>' + data[row][item] + '</td>\r\n';

                            k++;
                        }
                        tr += '</tr>\r\n';

                        //
                        imp.import_arr.push(td_arr);

                        //create listSelected and listSelectedString keep fields to map to every column
                        var ID_flag = false;
                        var SKU_flag = false;
                        var prod_name_flag = false;
                        var prod_desc_flag = false;
                        var prod_desc_short_flag = false;
                        var prod_type_flag = false;
                        var prod_class_flag = false;
                        var prod_cost_flag = false;
                        var prod_price_flag = false;
                        var product_taxable_flag = false;
                        var prod_weight_flag = false;
                        var prod_length_flag = false;
                        var prod_width_flag = false;
                        var prod_height_flag = false;
                        var product_tag_flag = false;
                        var product_notes_flag = false;
                        var prod_internal_visible_flag = false;
                        var prod_inactive_flag = false;
                        var product_added_flag = false;
                        var product_updated_by_flag = false;
                        var product_updated_flag = false;
                        var prod_photo_flag = false;
                        var prod_visible_flag = false;

                        var ii = 0;
                        for (var item = 0; item < data[row].length; item++) {
                            listSelected[ii] = "";
                            //console.log(data[row][item]+"--")
                            var isNum = 0;
                            var n = 0;
                            /*var n = data[row][item].indexOf("$");

                            var isNum='';
                            if(n!=0){
                                isNum =parseFloat(data[row][item]);
                            }else{
                                var tempNum = data[row][item].split("$");
                                isNum = parseFloat(tempNum[1]);
                            }*/

                            var breakFlag = false;

                            if (!ID_flag && !breakFlag) {
                                if (Number.isInteger(isNum) && isNum != 0 || data[0][item].includes('#')||data[0][item].toLowerCase().includes('id')) {
                                    ID_flag = true;
                                    ID_style = 'style="display:none"';
                                    breakFlag = true;
                                    listSelected[ii] = "ID";

                                }
                            }

                            if (!SKU_flag && !breakFlag) {
                                if (isNaN(data[row][item]) && data[0][item].toLowerCase().includes('sku')) {
                                    prod_name_flag = true;
                                    prod_name_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "SKU";

                                }
                            }

                            if (!prod_name_flag && !breakFlag) {
                                if (isNaN(data[row][item]) || data[0][item].toLowerCase().includes('name')) {
                                    prod_name_flag = true;
                                    prod_name_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_name";

                                }
                            }

                            if (!prod_type_flag && !breakFlag) {
                                if (['Digital', 'Physical'].includes(data[row][item])) {
                                    prod_type_flag = true;
                                    prod_type_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_type";

                                }
                            }

                            if (!prod_class_flag && !breakFlag) {
                                if (['A La Carte','Discount','Marketing','Warranty'].includes(data[row][item])) {
                                    prod_class_flag = true;
                                    prod_class_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_class";
                                }
                            }

                            if (!prod_cost_flag && !breakFlag) {
                                if (n == 0 && typeof isNum == 'number' && !isNaN(isNum)) {
                                    prod_cost_flag = true;
                                    prod_cost_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_cost";
                                }
                            }

                            if (!prod_price_flag && !breakFlag) {
                                if (n == 0 && typeof isNum == 'number' && !isNaN(isNum)) {
                                    prod_price_flag = true;
                                    prod_price_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_price";

                                }
                            }

                            if (!product_taxable_flag && !breakFlag) {
                                if (isNum == 0 || isNum == 1) {
                                    product_taxable_flag = true;
                                    product_taxable_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "product_taxable";

                                }
                            }

                            if (!prod_weight_flag && !breakFlag) {
                                if ((n != 0) && (typeof isNum == 'number') && (isNum > 0)) {
                                    prod_weight_flag = true;
                                    prod_weight_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_weight";

                                }
                            }

                            if (!prod_length_flag && !breakFlag) {
                                if ((n != 0) && (typeof isNum == 'number') && (isNum > 0)) {
                                    prod_length_flag = true;
                                    prod_length_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_length";

                                }
                            }

                            if (!prod_width_flag && !breakFlag) {
                                if ((n != 0) && (typeof isNum == 'number') && (isNum > 0)) {
                                    prod_width_flag = true;
                                    prod_width_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_width";

                                }
                            }

                            if (!prod_height_flag && !breakFlag) {
                                if ((n != 0) && (typeof isNum == 'number') && (isNum > 0)) {
                                    prod_height_flag = true;
                                    prod_height_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_height";

                                }
                            }

                            if (!prod_internal_visible_flag && !breakFlag) {
                                if (isNum == 0 || isNum == 1) {
                                    prod_internal_visible_flag = true;
                                    prod_internal_visible_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_internal_visible";

                                }
                            }

                            if (!prod_inactive_flag && !breakFlag) {
                                if (data[row][item] == 'Active') {
                                    prod_inactive_flag = true;
                                    prod_inactive_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_inactive";

                                }
                            }


                            if (!product_updated_by_flag && !breakFlag) {
                                if (Number.isInteger(isNum) && isNum != 0) {
                                    product_updated_by_flag = true;
                                    product_updated_by_style = 'style="display:none"';
                                    breakFlag = true;
                                    listSelected[ii] = "product_updated_by";

                                }
                            }

                            if (!prod_visible_flag && !breakFlag) {
                                if (isNum == 0 || isNum == 1) {
                                    prod_visible_flag = true;
                                    prod_visible_style = 'style="display:none"';
                                    breakFlag = true;

                                    listSelected[ii] = "prod_visible";

                                }
                            }
                            ii = ii + 1;
                        }

                    } else {
                        var td_arr = [];
                        var k = 0
                        tr += '<tr>\r\n';
                        for (var item = 0; item < data[row].length; item++) {
                            td_arr[k] = data[row][item];
                            tr += '<td>' + data[row][item] + '</td>\r\n';
                            k++;
                        }

                        tr += '</tr>\r\n';
                        //
                        imp.import_arr.push(td_arr);
                    }
                }
            }

            ////------------map fields to columns
            if (listSelected.length > 0) {
                var jj = 0;
                listSelected.forEach(function (item) {
                    var ID_style_c = ID_style;
                    var SKU_style_c = SKU_style;
                    var prod_name_style_c = prod_name_style;
                    var prod_desc_style_c = prod_desc_style;
                    var prod_desc_short_style_c = prod_desc_short_style;
                    var prod_type_style_c = prod_type_style;
                    var prod_class_style_c = prod_class_style;
                    var prod_cost_style_c = prod_cost_style;
                    var prod_price_style_c = prod_price_style;
                    var product_taxable_style_c = product_taxable_style;
                    var prod_weight_style_c = prod_weight_style;
                    var prod_length_style_c = prod_length_style;
                    var prod_width_style_c = prod_width_style;
                    var prod_height_style_c = prod_height_style;
                    var product_tags_style_c = product_tags_style;
                    var product_notes_style_c = product_notes_style;
                    var prod_internal_visible_style_c = prod_internal_visible_style;
                    var prod_inactive_style_c = prod_inactive_style;
                    var product_added_style_c = product_added_style;
                    var product_updated_by_style_c = product_updated_by_style;
                    var product_updated_style_c = product_updated_style;
                    var prod_photo_style_c = prod_photo_style;
                    var prod_visible_style_c = prod_visible_style;

                    var fieldNameMap = '';
                    var class_map_deleted = 'map-deleted';
                    switch (item) {
                        case 'ID':
                            ID_style_c = 'selected="selected"';
                            fieldNameMap = 'ID';
                            class_map_deleted = '';
                            break;
                        case 'SKU':
                            SKU_style_c = 'selected="selected"';
                            fieldNameMap = 'SKU';
                            class_map_deleted = '';
                            break;
                        case 'prod_name':
                            prod_name_style_c = 'selected ="selected"';
                            fieldNameMap = 'prod_name';
                            class_map_deleted = '';
                            break;
                        case 'prod_desc':
                            prod_desc_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_desc';
                            class_map_deleted = '';
                            break;
                        case 'prod_desc_short':
                            prod_desc_short_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_desc_short';
                            class_map_deleted = '';
                            break;
                        case 'prod_type':
                            prod_type_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_type';
                            class_map_deleted = '';
                            break;
                        case 'prod_class':
                            prod_class_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_class';
                            class_map_deleted = '';
                            break;
                        case 'prod_cost':
                            prod_cost_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_cost';
                            class_map_deleted = '';
                            break;
                        case 'prod_price':
                            prod_price_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_price';
                            class_map_deleted = '';
                            break;
                        case 'product_taxable':
                            product_taxable_style_c = 'selected="selected"';
                            fieldNameMap = 'product_taxable';
                            class_map_deleted = '';
                            break;
                        case 'prod_weight':
                            prod_weight_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_weight';
                            class_map_deleted = '';
                            break;
                        case 'prod_length':
                            prod_length_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_length';
                            class_map_deleted = '';
                            break;
                        case 'prod_width':
                            prod_width_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_width';
                            class_map_deleted = '';
                            break;
                        case 'prod_height':
                            prod_height_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_height';
                            class_map_deleted = '';
                            break;
                        case 'product_tags':
                            product_tags_style_c = 'selected="selected"';
                            fieldNameMap = 'product_tags';
                            class_map_deleted = '';
                            break;
                        case 'product_notes':
                            product_notes_style_c = 'selected="selected"';
                            fieldNameMap = 'product_notes';
                            class_map_deleted = '';
                            break;
                        case 'prod_internal_visible':
                            prod_internal_visible_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_internal_visible';
                            class_map_deleted = '';
                            break;
                        case 'prod_inactive':
                            prod_inactive_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_inactive';
                            class_map_deleted = '';
                            break;
                        case 'product_added':
                            product_added_style_c = 'selected="selected"';
                            fieldNameMap = 'product_added';
                            class_map_deleted = '';
                            break;
                        case 'product_updated_by':
                            product_updated_by_style_c = 'selected="selected"';
                            fieldNameMap = 'product_updated_by';
                            class_map_deleted = '';
                            break;
                        case 'product_updated':
                            product_updated_style_c = 'selected="selected"';
                            fieldNameMap = 'product_updated';
                            class_map_deleted = '';
                            break;
                        case 'prod_photo':
                            prod_photo_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_photo';
                            class_map_deleted = '';
                            break;
                        case 'prod_visible':
                            prod_visible_style_c = 'selected="selected"';
                            fieldNameMap = 'prod_visible';
                            class_map_deleted = '';
                            break;
                        default:
                        // code block
                    }

                    var fields = '<div class="header-set">' +
                        '<strong class="header-name deleted">Will not be imported</strong> ' +
                        '<strong class="header-name not-deleted">' + fieldNameMap + '</strong> ' +
                        '<span class="field-type-label not-deleted">merge field</span>' +
                        '<div class="actions-importmap not-deleted"> ' +
                        '<a href="javascript:;" class="edit-importmap">Edit</a> • ' +
                        '<a href="javascript:;" class="delete-importmap">Skip</a> </div>' +
                        '<div class="actions-importmap-deleted deleted"> ' +
                        '<a href="javascript:;" class="edit-importmap">Edit</a> ' +
                        '</div>' +
                        '</div>' +
                        '<div class="header-form" style="display: none;">' +
                        '<label class="column-name">Column name</label>' +
                        '<label class="select">' +
                        '<select class="filed_change">' +
                        '<option value="">Make a Selection</option>' +
                        '<option value="ID" ' + ID_style_c + '>ID</option>' +
                        '<option value="SKU" ' + SKU_style_c + '>SKU</option>' +
                        '<option value="prod_name" ' + prod_name_style_c + '>prod_name</option>' +
                        '<option value="prod_desc" ' + prod_desc_style_c + '>prod_desc</option>' +
                        '<option value="prod_desc_short" ' + prod_desc_short_style_c + '>prod_desc_short</option>' +
                        '<option value="prod_type" ' + prod_type_style_c + '>prod_type</option>' +
                        '<option value="prod_class" ' + prod_class_style_c + '>prod_class</option>' +
                        '<option value="prod_cost" ' + prod_cost_style_c + '>prod_cost</option>' +
                        '<option value="prod_price" ' + prod_price_style_c + '>prod_price</option>' +
                        '<option value="product_taxable" ' + product_taxable_style_c + '>product_taxable</option>' +
                        '<option value="prod_weight" ' + prod_weight_style_c + '>prod_weight</option>' +
                        '<option value="prod_length" ' + prod_length_style_c + '>prod_length</option>' +
                        '<option value="prod_width" ' + prod_width_style_c + '>prod_width</option>' +
                        '<option value="prod_height" ' + prod_height_style_c + '>prod_height</option>' +
                        '<option value="product_tags" ' + product_tags_style_c + '>product_tags</option>' +
                        '<option value="product_notes" ' + product_notes_style_c + '>product_notes</option>' +
                        '<option value="prod_internal_visible" ' + prod_internal_visible_style_c + '>prod_internal_visible</option>' +
                        '<option value="prod_inactive" ' + prod_inactive_style_c + '>prod_inactive</option>' +
                        '<option value="product_added" ' + product_added_style_c + '>product_added</option>' +
                        '<option value="product_updated" ' + product_updated_by_style_c + '>product_updated</option>' +
                        '<option value="product_updated_by" ' + product_updated_style_c + '>product_updated_by</option>' +
                        '<option value="prod_photo" ' + prod_photo_style_c + '>prod_photo</option>' +
                        '<option value="prod_visible" ' + prod_visible_style_c + '>prod_visible</option>' +
                        '</select><i></i> </label>' +
                        '<div class="form-actions-importmap">' +
                        '<a href="javascript:;" class="next-importmap btn bg-color-blueDark txt-color-white btn-sm">&nbsp;&nbsp;Save &nbsp;>&nbsp;&nbsp; </a> ' +
                        '<a href="javascript:;" class="delete-importmap">&nbsp;&nbsp;Skip&nbsp;&nbsp;</a> ' +
                        '</div>' +
                        '</div>'
                    '</div>';

                    ths += '<th class="header-cell ' + class_map_deleted + '">' + fields + '</th>';

                    jj = jj + 1;

                });

                //------------end map fields
            }
            var table = '<table id="tbl-import-product" class="table-import-data" style="width:100%"><thead>' +
                '<tr class="th-map">' + ths + '</tr>' +
                '<tr class="th-name">' + th + '</tr>' +
                '</thead>' +
                '<tbody>' + tr + '</tbody>' +
                '</table>';

            /*table +='<div class="row"><div class="col col-6">'+
                  '<button type="button" style="margin-top: 10px; margin-bottom: 10px" class="btn btn-sm btn-primary" id="prods-submit" >Import</button>'+
                '&nbsp;&nbsp;&nbsp;<button type="button" style="margin-top: 10px; margin-bottom: 10px" class="btn btn-sm btn-primary" id="prods-back" >Back</button>'+
                '</div></div>' */

            $('#prod-import-contents').html(table);

            //bind events
            $('#tbl-import-product .edit-importmap').unbind('click').bind('click', function () {
                //close all .header-form and open .header-set
                $('#tbl-import-product .header-set').css({ "display": "" });
                $('#tbl-import-product .header-form').css({ "display": "none" });
                //open and close only this
                $(this).closest('.header-set').css({ "display": "none" });
                $(this).closest('th').find('.header-form').css({ "display": "" });
                //get value
                imp.removeSelected = $(this).closest('th').find('.filed_change option:selected').val();

            });

            $('#tbl-import-product .delete-importmap').unbind('click').bind('click', function () {
                //get value
                var valSelected = $(this).closest('th').find('.filed_change option:selected').val();
                //close all .header-form and open .header-set
                $('#tbl-import-product .header-set').css({ "display": "" });
                $('#tbl-import-product .header-form').css({ "display": "none" });

                //display selected option in all select box
                $("th.header-cell  .filed_change option[value='" + valSelected + "']").css({ "display": '' });

                $(this).closest('th').find(".filed_change option[value='']").prop("selected", "selected");
                //add class map-deleted in th  next-importmap
                $(this).closest('th').addClass('map-deleted');
            });

            $('#tbl-import-product .next-importmap').unbind('click').bind('click', function () {
                //get value
                var valSelected = $(this).closest('th').find('.filed_change option:selected').val();

                //open and close only this
                $(this).closest('th').find('.header-set').css({ "display": "" });
                $(this).closest('th').find('.header-form').css({ "display": "none" });

                //not display selected option  header-name not-deleted
                if (valSelected != '') {
                    $(this).closest('th').removeClass('map-deleted');
                    $("th.header-cell  .filed_change option[value='" + valSelected + "']").css({ "display": 'none' });
                } else {
                    $(this).closest('th').addClass('map-deleted');
                    if (imp.removeSelected != '') {
                        $("th.header-cell  .filed_change option[value='" + imp.removeSelected + "']").css({ "display": '' });
                    }
                }

                $(this).closest('th').find(".filed_change option[value='" + valSelected + "']").css({ "display": '' });
                $(this).closest('th').find('.header-name.not-deleted').text(valSelected);

                //
                var thNext = $(this).closest('th').next();
                //thNext.find('.header-set').css({"display":"none"});
                //thNext.find('.header-form').css({"display":""});

            });
        }
    },

    createDataImp: function () {
        var i = 0;
        var head_arr = [];
        var data_pop = [];
        //get fields using import
        $('th.header-cell').each(function () {
            var val = $(this).find('.filed_change option:selected').val();
            head_arr[i] = val;
            i++;
        });
        // map key=>val

        imp.import_arr.forEach(function (item) {
            var tem = {};
            var j = 0;
            item.forEach(function (el) {
                if (head_arr[j] != '') {
                    tem[head_arr[j]] = el;
                }
                j++;
            });

            data_pop.push(tem);

        });

        if (data_pop.length > 0) {
            imp.prodImport(data_pop);
        }

    },

    prodImport: function (data1) {
        $.ajax({
            url: link._import_fileCSV,
            data: {
                token: localStorage.getItemValue('token'), jwt: localStorage.getItemValue('jwt'),
                private_key: localStorage.getItemValue('userID'), productFile: data1
            },
            type: 'POST',
            asyn: false,
            success: function (xhr) {
                var rsl = $.parseJSON(xhr);
                var err_add = rsl.ERROR_ADD;
                var err_up = rsl.ERROR_UP;

                var table_add = '';
                var tr_add = '';
                var err_th = '<th>id</th><th>SKU</th><th>prod_name</th><th>prod_class</th><th>err</th>';


                if (err_add.length > 0) {
                    err_add.forEach(function (item) {
                        tr_add += '<tr><td>' + item.id + '</td>' +
                            '<td>' + item.SKU + '</td>' +
                            '<td>' + item.prod_name + '</td>' +
                            '<td>' + item.prod_class + '</td>' +
                            '<td>' + item.err + '</td>' +
                            '</tr>'
                    });

                    table_add += '<table class="tbl-add-err"><thead>' + err_th + '</thead>' +
                        '<tbody>' + tr_add + '</tbody>' +
                        '</table>'
                }

                var table_up = '';
                var tr_up = '';

                if (err_up.length > 0) {
                    err_up.forEach(function (item) {
                        tr_up += '<tr><td>' + item.id + '</td>' +
                            '<td>' + item.SKU + '</td>' +
                            '<td>' + item.prod_name + '</td>' +
                            '<td>' + item.prod_class + '</td>' +
                            '<td>' + item.err + '</td>' +
                            '</tr>'
                    });

                    table_up += '<table class="tbl-add-err"><thead>' + err_th + '</thead>' +
                        '<tbody>' + tr_up + '</tbody>' +
                        '</table>'
                }

                $('#import_product_form #process-prods').css({ "display": "none" });

                $('#import_product_form #prod-import-errs-add').html(table_add);
                $('#import_product_form #prod-import-errs-up').html(table_up);

                $('#import_product_form .prod-errs').css({ "display": "" });

            }

        });
    }


    /////
}
var imp = new ImportProduct();
$(function () {
    imp.init();
});