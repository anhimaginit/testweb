function RegisterState(option) {
    if (!option) option = { element: '' };
    this.option = option;
    this.init(option.element);
}
RegisterState.prototype.constructor = RegisterState;
var cities = [];
var states = [];
var zips = {};
RegisterState.prototype = {
    init: function (el, status) {
        this.loadCityList();
        if (!el) el = this.option.element;
        else this.option.element = el;
        // this.loadState(el + " select.state");
        _tmp_state = '';
        _tmp_city = '';

        this.bindAction(el);

        $(el + ' .select2.state').select2({
            placeholder: 'Select State'

        });

        $(el + ' .select2.city').select2({
            placeholder: 'Select City',
            allowClear: true,
            tags: true,
            language: {
                noResults: function () { return ''; }
            },
            createTag: function (newTag) {
                return { id: newTag.term, text: newTag.term, isNew: true };
            }
        });

        $(el + ' .select2.postal_code').select2({
            placeholder: 'Select Postal code'

        });
    },


    bindAction: function (elem) {
        if (!elem) elem = this.option.element;
        var _self = this;
        $(elem + ' .select2.city').change(function () {
            var _data = $(this).select2('data')[0];
            if (_data && _data.isNew == true) {
                var filter = this.value.toUpperCase();
                _self.selectCity(elem, filter);
            }
            _self.selectState(elem, this.value, $(elem + ' .select2.state').val());
        });

        $(elem + ' .select2.state').change(function () {
            _self.selectPortalCodeByState(elem, this.value);
        })
    },

    setValue: function (elem, city, state, zipcode) {
        if (!elem) elem = this.option.element;
        var _self = this;
        _self.selectCity(elem, city, function (data) {
            _self.selectState(elem, city, state, function (data) {
                _self.selectPortalCodeByState(elem, state, zipcode);
            })
        });
    },

    selectCity: function (elem, city, cb) {
        if (!elem) elem = this.option.element;
        var emptyArray = [];
        if (cities.length == 0) {
            this.loadCityList(function (data) {
                getFilterList(data, city, 0, data.length - 1, 'city', emptyArray, function (data) {
                    if (data && data.length > 0) {
                        var options = $(elem + ' .select2.city').prop('options');
                        $(elem + ' .select2.city').empty();
                        $('option', $(elem + ' .select2.city')).remove();
                        options[0] = new Option('Select city', '')
                        data.forEach(function (item) {
                            if (item.city) item = item.city;
                            options[options.length] = new Option(item, item);
                        });
                        var value = (data.includes(city) ? city : data[0]);
                        $(elem + ' .select2.city').val(value).trigger('change');
                    }
                    if (cb) cb(data);
                });

            })
        } else {
            getFilterList(cities, city, 0, cities.length - 1, 'city', emptyArray, function (data) {
                if (data && data.length > 0) {
                    var options = $(elem + ' .select2.city').prop('options');
                    $(elem + ' .select2.city').empty();
                    $('option', $(elem + ' .select2.city')).remove();
                    options[0] = new Option('Select city', '')
                    data.forEach(function (item) {
                        if (item.city) item = item.city;
                        options[options.length] = new Option(item, item);
                    });
                    var value = (data.includes(city) ? city : data[0]);
                    $(elem + ' .select2.city').val(value).trigger('change');
                }
                if (cb) cb(data);
            });
        }
    },

    selectState: function (elem, city, state, cb) {
        if (!elem) elem = this.option.element;
        var _data = {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            city: city
        }
        var _self = this;
        $.ajax({
            url: link._getSatesZipByCity,
            type: 'post',
            dataType: 'json',
            data: _data,
            success: function (res) {
                var options = $(elem + ' .select2.state').prop('options');
                $(elem + ' .select2.state').empty();
                $('option', $(this)).remove();
                options[0] = new Option('Select state', '');
                res.forEach(function (item) {
                    options[options.length] = new Option(item.state, item.state);
                    if (!zips[item.state]) zips[item.state] = [];
                    if (item.zip) {
                        item.zip.forEach(function (zip) {
                            if (!zips[item.state].includes(zip))
                                zips[item.state].push(zip);;
                        })
                    }
                });
                if (state) {
                    $(elem + ' .select2.state').val(state).trigger('change');
                } else if (res.length == 1) {
                    $(elem + ' .select2.state').val(res[0].state).trigger('change');
                }
                if (cb) cb(res);
            },
        })
    },

    selectPortalCodeByState: function (elem, state, zipcode) {
        if (!elem) elem = this.option.element;
        var listZip = zips[state] || [];
        var options = $(elem + ' .select2.postal_code').prop('options');
        $(elem + ' .select2.postal_code').empty();
        options[0] = new Option('Select postal code', '')
        listZip.forEach(function (item) {
            options[options.length] = new Option(item, item);;
        });
        if (zipcode) {
            $(elem + ' .select2.postal_code').val(zipcode).trigger('change');
        } else if (listZip.length == 1) {
            $(elem + ' .select2.postal_code').val(listZip[0]).trigger('change');

        }
    },

    loadCityList: function (cb) {
        var _data = {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            city: ''
        }
        $.ajax({
            url: link._getCities,
            type: 'post',
            dataType: 'json',
            data: _data,
            success: function (res) {
                // res.sort();
                cities = res;
                if (cb) cb(res);
            },
        });
    }
}

