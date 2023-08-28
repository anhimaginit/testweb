function State(option) {
    if (!option) option = { element: '' };
    this.option = option;
    this.init(option.element);
}
State.prototype.constructor = State;
var cities = [];
var states = [];
var zips = {};
State.prototype = {
    init: function (el) {
        var _self = this;
        // window.isLoadCities = true;
        if (!el) el = this.option.element;
        else this.option.element = el;
        _tmp_state = '';
        _tmp_city = '';
        this.bindAction(el);

        $(el + ' select.state').select2({
            // placeholder: 'Select State',
        }).on('change', function () {
            _self.selectPortalCodeByState(el, this.value);
        });

        $(el + ' select.city').select2({
            placeholder: 'Select City',
            allowClear: true,
            minimumInputLength: 1,
            language: {
                inputTooShort: function () {
                    return 'Enter city';
                },
            },
            ajax: {
                url: link._getListcity,
                type: 'post',
                delay: 300,
                data: function (params) {
                    var query = {
                        token: localStorage.getItemValue('token'),
                        city: params.term || 'a'
                    }
                    return query;
                },
                dataType: 'json',
                processResults: function (data, params) {
                    var tmp = [];
                    data.forEach(function (item) {
                        tmp.push({ id: item, text: item });;
                    })
                    return {
                        results: tmp
                    };
                },
                escapeMarkup: function (markup) { return markup; },
                templateResult: function (repo) {
                    if (repo.loading) {
                        return repo.text;
                    }
                    var markup = "<div>" + repo.text + "</div>";

                    return markup;
                },
                templateSelection: function formatRepoSelection(repo) {
                    return repo.text;
                }
            },
        }).on('change', function () {
            if (this.value && this.value.length > 0) {

                _self.selectState(el, this.value, null, function () {
                    _self.selectPortalCodeByState(el, $(el + ' select.state').val());
                });
            }
        });
        $(el + ' select.postal_code').select2({
            // placeholder: 'Select Postal code',
        });
    },


    bindAction: function (elem) {
        // if (!elem) elem = this.option.element;
        // var _self = this;
        // $(elem + ' select.city').on('select2:select', function () {
        //     if (this.value && this.value.length > 0) {
        //         _self.selectState(elem, this.value, $(elem + ' select.state').val());
        //     }
        // });
        // $(elem + ' select.state').on('select2:select', function () {
        //     _self.selectPortalCodeByState(elem, this.value);
        // })
    },

    setValue2: function (elem, city, state, zipcode, callback) {
        if (!elem) elem = this.option.element;
        var _self = this;
        _self.selectCity2(elem, city, function (data) {
            _self.selectState(elem, city, state, function (data) {
                _self.selectPortalCodeByState(elem, state, zipcode, callback);
                if (callback) callback(true);
            })
        });
    },

    setValue: function (elem, city, state, zipcode, callback) {
        if (!elem) elem = this.option.element;
        $(elem + ' select.city').empty();
        $(elem + ' select.state').empty();
        $(elem + ' select.postal_code').empty();
        $(elem + ' select.city').append('<option value="' + city + '" selected>' + city + '</option>').trigger('change');
        $(elem + ' select.state').append('<option value="' + state + '" selected>' + state + '</option>').trigger('change');
        $(elem + ' select.postal_code').append('<option value="' + zipcode + '" selected>' + zipcode + '</option>').trigger('change');
        if (callback) callback();

    },

    selectCity2: function (elem, city, cb) {
        var _self = this;
        $.ajax({
            url: link._getListcity,
            type: 'post',
            data: { token: localStorage.getItemValue('token'), city: city },
            dataType: 'json',
            success: function (res) {
                _self.displayCity(city, res, elem);
                if (cb) cb(res);
            },
            error: function (e) {
            }
        })
    },

    displayCity: function (city, data, elem) {
        if (city) {
            if (data && data.length > 0) {
                var options = $(elem + ' select.city').prop('options');
                if (!options) return;
                $(elem + ' select.city').empty();
                options[0] = new Option('Select city', '')
                data.forEach(function (item) {
                    if (item.city) item = item.city;
                    options[options.length] = new Option(item, item);
                });
                var value = (data.includes(city) ? city : data[0].city ? data[0].city : data[0]);
                $(elem + ' select.city').val(value).trigger('change');
                $(elem + ' select.state').empty().trigger('change');
            }
        }
    },

    selectState: function (elem, city, state, cb) {
        if (!elem) elem = this.option.element;
        if (!city || city == '') return;
        var _data = {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            city: city
        }
        $(elem + ' select.postal_code').empty();
        $(elem + ' select.state').empty();
        $.ajax({
            url: link._getSatesZipByCity,
            type: 'post',
            dataType: 'json',
            data: _data,
            success: function (res) {
                if (!$(elem + ' select.state').prop('type') || !$(elem + ' select.state').prop('type').includes('select')) return;
                var tmp = [];
                res.forEach(function (item) {
                    tmp.push({ id: item.state, text: item.state_name });

                    if (!zips[item.state]) zips[item.state] = [];
                    if (item.zip) {
                        if (!zips[item.state].includes(item.zip)){
                            item.zip.forEach(function(i){
                                zips[item.state].push(i);
                            })
                        }

                    }
                });
                $(elem + ' select.state').select2({ data: tmp });
                if (state) {
                    $(elem + ' select.state').val(state).trigger('change');
                } else if (res.length == 1) {
                    $(elem + ' select.state').trigger('change');
                }
                if (cb) cb(res);
            },
            error: function (e) {
            }
        })
    },

    selectPortalCodeByState: function (elem, state, zipcode, callback) {
        if (!elem) elem = this.option.element;
        $(elem + ' select.postal_code').empty();
        if (!zips || !zips[state]) {
            var _data = $.extend({}, template_data);
            _data.city = $(elem + ' select.city').val();
            $.ajax({
                url: link._getZipcodeByCity,
                type: 'post',
                dataType: 'json',
                data: _data,
                success: function (res) {
                    if (zips[state]) {
                        res = zips[state];
                    }
                    if (res instanceof Array) {
                        res.forEach(function (item) {
                            if (item.zip) item = item.zip;
                            $(elem + ' select.postal_code').append('<option value="' + item + '">' + item + '</option>');
                        });
                        if (state) {
                            $(elem + ' select.postal_code').val(zipcode).trigger('change');

                        } else {
                            $(elem + ' select.postal_code').trigger('change');

                        }
                    }
                    if (callback) callback();
                }
            })
        } else {
            if (!$(elem + ' select.postal_code').prop('options')) return;
            $(elem + ' select.postal_code').select2({ data: zips[state] });
            if (zipcode) {
                $(elem + ' select.postal_code').val(zipcode).trigger('change');
            } else if (zips[state].length == 1) {
                $(elem + ' select.postal_code').trigger('change');

            }
        }
    },

    // loadCityList: function (cb) {
    //     if (cities && cities.length > 0) { cb(cities) }
    //     var _data = {
    //         token: localStorage.getItemValue('token'),
    //         jwt: localStorage.getItemValue('jwt'),
    //         private_key: localStorage.getItemValue('userID'),
    //         city: ''
    //     }
    //     if (window.isLoadCities) return;
    //     $.ajax({
    //         url: link._getCities,
    //         type: 'post',
    //         dataType: 'json',
    //         data: _data,
    //         success: function (res) {
    //             res.sort();
    //             cities = res;
    //             if (cb) cb(res);
    //         },
    //         error: function (e) {
    //         }
    //     });
    // },
}