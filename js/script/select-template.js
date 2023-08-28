function SelectLoader() { }

SelectLoader.prototype.constructor = SelectLoader;
SelectLoader.prototype = {
    loadDataSelectContact: function (_url, selectElement, id, selected, callback) {
        $.ajax({
            url: _url,
            type: 'post',
            data: $.extend({}, template_data),
            dataType: 'json'
        }).done(function (_list) {
            if (_list != '') {
                if (_list.list != undefined) {
                    _list = _list.list;
                }
                if (typeof selectElement == 'string') {
                    var select = $('select[name="' + selectElement + '"]');
                    var options = select.prop('options');
                    if (!options) return;
                    $('option', select).remove();
                    options[0] = new Option('Select Item', '', false, false);
                    _list.forEach(function (item) {
                        var text = (item.first_name ? item.first_name + ' ' : '') +
                            (item.middle_name ? item.middle_name + ' ' : '') +
                            (item.last_name ? item.last_name : '') +
                            (item.primary_state ? ' - ' + item.primary_state : '') +
                            (item.primary_city ? ' - ' + item.primary_city : '')
                        options[options.length] = new Option(text, (typeof id == 'string') ? item[id] : item[id[0]] + '|' + item[id[1]]);
                    });
                    if (selected) {
                        select.val(selected).trigger('change');;
                    }
                    if (callback) callback(_list);

                } else if (selectElement instanceof Array) {
                    selectElement.forEach(function (elem) {
                        var select = $('select[name="' + elem + '"]');
                        var options = select.prop('options');
                        $('option', select).remove();
                        options[0] = new Option('Select Item', '', false, false);
                        _list.forEach(function (item) {
                            var text = (item.first_name ? item.first_name + ' ' : '') +
                                (item.middle_name ? item.middle_name + ' ' : '') +
                                (item.last_name ? item.last_name : '') +
                                (item.primary_state ? ' - ' + item.primary_state : '') +
                                (item.primary_city ? ' - ' + item.primary_city : '')
                            options[options.length] = new Option(text, (typeof id == 'string') ? item[id] : item[id[0]] + '|' + item[id[1]]);
                        });
                        if (selected && selected !== '') {
                            select.val(selected).trigger('change');
                        }
                        if (callback) callback(_list);
                    })
                }
            }
        });
    },
    loadSalesmanListState: function (selectElement, id, state, selected, callback) {
        var data = { token: localStorage.getItemValue('token') };
        data.state = state;
        var corporate = '';
        if ($('#warranty_form #sales_corporate').is(":checked")) {
            corporate = 1;
        }

        data.corporate = corporate;

        $.ajax({
            url: link._salesmanList_state,
            type: 'post',
            data: data,
            dataType: 'json',
        }).done(function (res) {
            if (typeof selectElement == 'string') {
                var select = $('select[name="' + selectElement + '"]');
                var options = select.prop('options');
                if (!options) return;
                $('option', select).remove();
                options[0] = new Option('Select Item', '', false, false);
                res.forEach(function (item) {
                    var text = (item.first_name ? item.first_name + ' ' : '') +
                        (item.middle_name ? item.middle_name + ' ' : '') +
                        (item.last_name ? item.last_name : '')
                    options[options.length] = new Option(text, (typeof id == 'string') ? item[id] : item[id[0]] + '|' + item[id[1]]);
                });
                if (selected) {
                    select.val(selected).trigger('change');;
                } else {
                    select.val(null);
                }
                if (callback) callback(res);

            } else if (selectElement instanceof Array) {
                selectElement.forEach(function (elem) {
                    var select = $('select[name="' + elem + '"]')
                    var options = select.prop('options');
                    if (!options) return;
                    $('option', select).remove();
                    options[0] = new Option('Select Item', '', false, false);
                    res.forEach(function (item) {
                        var text = (item.first_name ? item.first_name + ' ' : '') +
                            (item.middle_name ? item.middle_name + ' ' : '') +
                            (item.last_name ? item.last_name : '')
                        options[options.length] = new Option(text, (typeof id == 'string') ? item[id] : item[id[0]] + '|' + item[id[1]]);
                    });
                    if (selected) {
                        select.val(selected).trigger('change');;
                    } else {
                        select.val(null);
                    }
                    if (callback) callback(res);
                })
            };
        });
    },
    loadCharityChoiceList: function (element) {
        return $.ajax({
            url: link._charityofchoiceList,
            type: 'post',
            data: $.extend({}, template_data),
            success: function (res) {
                if (res.startsWith('{"list')) {
                    var _data = JSON.parse(res).list;
                    var _html = '<option value="">Select Item</option>';
                    _data.forEach(function (elem) {
                        _html += '<option value="' + elem.ID + '">' + elem.name + '</option>';;
                    });
                    $('select[name="' + element + '"]').html(_html);
                    $('select[name="' + element + '"]').val(2).trigger('change')
                } else {
                    $('select[name="' + element + '"]').html('');
                };
            }
        });
    },
    loadWarrantyProductList: function (element, callback) {
        var _data = $.extend({}, template_data);
        _data.warrantyID = getUrlParameter('id');
        $.ajax({
            //url: link._orderProdClssWarranty,
            url: link._productClssWarranty,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
                if (res) {
                    if (res.list) {
                        res.list.forEach(function (item, index) {
                            res.list[index].id = item.ID;
                            res.list[index].text = (item.prod_name ? item.prod_name : 'Warranty - ' + item.ID);
                        });
                    }
                    res.list.splice(0, 0, { id: '', text: 'Select product' });
                    if (!$('select[name=' + element + ']').hasClass('select2'))
                        $('select[name=' + element + ']').select2({ placeholder: 'Select product', data: res.list });
                    if (callback) callback(res.list);
                } else {
                    $('select[name="' + element + '"]').empty();
                };
            }
        })
    },
    loadALaCartrProductList: function (element) {
        var _data = $.extend({}, template_data);
        _data.warrantyID = getUrlParameter('id');
        $.ajax({
            url: link._productClssALaCarte,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
                if (res.list) {
                    var _html = '';
                    // if (res.warrantyClass) {
                    //    //_html += '<optgroup label="Has Warranty">';
                    //    res.warrantyClass.forEach(function(item) {
                    //       _html += '<option value="' + item.order_id + '">' + (item.order_title ? item.order_title : 'Warranty - ' + item.order_id) + '</option>';
                    //    });
                    //    //_html += '</optgroup>';
                    // }
                    if (res.list) {
                        // _html += '<optgroup label="Has A La Carte">';
                        res.list.forEach(function (item) {
                            _html += '<option value="' + item.ID + '">' + (item.prod_name ? item.prod_name : 'Warranty - ' + item.ID) + '</option>';;
                        });
                        // _html += '</optgroup>';
                    }
                    if (_html == '') {
                        _html = '<option value="">Empty data</option>';
                    } else {
                        _html = '<option value="">Select Item</option>' + _html;
                    }
                    $('select[name="' + element + '"]').html(_html).trigger('change');
                } else {
                    $('select[name="' + element + '"]').empty();
                };
            }
        })
    },
    loadOrderList: function (element, callback) {
        var _data = $.extend({}, template_data);
        _data.warrantyID = getUrlParameter('id');
        $.ajax({
            url: link._orderProdClssWarranty,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
                if (res) {
                    var _html = '';
                    if (res.warrantyClass) {
                        _html += '<optgroup label="Has Warranty">';
                        res.warrantyClass.forEach(function (item) {
                            _html += '<option value="' + item.order_id + '">' + (item.order_title ? item.order_title : 'Warranty - ' + item.order_id) + '</option>';;
                        });
                        _html += '</optgroup>';
                    }
                    if (res.aLaCartrClass) {
                        _html += '<optgroup label="Has A La Carte">';
                        res.aLaCartrClass.forEach(function (item) {
                            _html += '<option value="' + item.order_id + '">' + (item.order_title ? item.order_title : 'Warranty - ' + item.order_id) + '</option>';;
                        });
                        _html += '</optgroup>';
                    }
                    if (_html == '') {
                        _html = '<option value="">Empty data</option>';
                    } else {
                        _html = '<option value="">Select Item</option>' + _html;
                    }
                    $('select[name="' + element + '"]').html(_html).trigger('change');
                    if (callback) callback(true)
                } else {
                    $('select[name="' + element + '"]').empty();
                    if (callback) callback(false);
                };
            }
        })
    },
    loadOrderByCustomer: function (customer, element, order_id, balance, callback) {
        var _data = $.extend({}, template_data);
        _data.bill_to = customer;
        _data.order_id = order_id;
        if (document.location.href.indexOf('invoice-form') > 0 && getUrlParameter('id') && balance) {
            _data.balance = balance
        }
        $.ajax({
            url: link._orderIDByBillTo,
            type: 'post',
            data: _data,
            success: function (res) {
                if (res != '' && !res.startsWith('<')) {
                    var _data = JSON.parse(res);
                    var select = $('select[name="' + element + '"]');
                    var options = select.prop('options');
                    $('option', select).remove();
                    options[0] = new Option('Select Order');

                    _data.forEach(function (elem) {
                        options[options.length] = new Option(elem.order_title ? elem.order_title : 'Warranty - ' + elem.order_id, elem.order_id);;
                    });
                    if (order_id) {
                        select.val(order_id);
                    }
                    if (callback) callback(true)
                } else {
                    $('select[name="' + element + '"]').empty();
                    if (callback) callback(false)
                };
            }
        })
    },
    loadOrderByWarrantyHolder: function (holder, element, order_id) {
        return new Promise(function (resolve, reject) {
            var _data = $.extend({}, template_data);
            _data.ship_to = holder;
            $.ajax({
                url: link._orderIDByShipToWarranty,
                type: 'post',
                data: _data,
                success: function (res) {
                    if (res != '' && !res.startsWith('<')) {
                        var _data = JSON.parse(res);
                        var _html = '';
                        _data.forEach(function (elem) {
                            if (elem.warranty == 0 || elem.warranty == '0' || elem.warranty == '' || elem.warranty == getUrlParameter('id')) {
                                _html += '<option value="' + elem.order_id + '">' + elem.order_id + '</option>';
                            };
                        });
                        if (_html == '') {
                            _html = '<option value="">Empty data</option>';
                        } else {
                            _html = '<option value="">Select Item</option>' + _html;
                        }
                        $('select[name="' + element + '"]').html(_html);
                        resolve(true);
                    } else {
                        $('select[name="' + element + '"]').empty();
                        reject(res);
                    };
                }
            })
        });
    },

    compareSelect: function (elem1, elem2, isDisplay) {
        if (elem1 == elem2) return false;
        var value1 = $('select[name="' + elem1 + '"]').val();
        if (value1 == '' || value1 == undefined) return false;
        var value2 = $('select[name="' + elem2 + '"]').val();
        if (value2 == '' || value2 == undefined) return false;
        if (value1.indexOf('|') >= 0) { value1 = value1.split('|')[1]; }
        if (value2.indexOf('|') >= 0) { value2 = value2.split('|')[1]; }
        if (isDisplay) {
            if (value1 == value2) {
                $('select[name="' + elem1 + '"]').addClass('error');
                $('select[name="' + elem1 + '"]').closest('section').children('p').html('<p class="error">' + $('select[name="' + elem1 + '"]').closest('section').find('label.input').text() + ' and ' + $('select[name="' + elem2 + '"]').closest('section').find('label.input').text() + ' must be different</p>');
                return true;
            } else {
                $('select[name="' + elem1 + '"]').removeClass('error');
                $('select[name="' + elem1 + '"]').closest('section').children('p').html('');
                return false;
            }
        } else {
            if (value1 == value2) {
                return true
            } else {
                return false
            }
        }
    }
}
