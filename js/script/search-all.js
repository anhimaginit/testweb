function SearchAll() {
   search_top_value = '';
   search_top_type = 'contact';
}
SearchAll.prototype.constructor = SearchAll;
var searchFormLink = {
   undefined: 'contact-list',
   contact: 'contact-list',
   claim: 'claim-list',
   product: 'product-list',
   order: 'order-list',
   warranty: 'warranty-list',
   invoice: 'invoice-list',
   company: 'company-list',
   task: 'task-list'
}
SearchAll.prototype = {
   init: function () {
      searchType = this.searchType;
      refreshSearch = function () {
         if (search_top_value && search_top_value != '') {
            search_top_value = '';
            $('#search_top').val('');
            $('#panel_search_all').hide();
            $.removeCookie('search_all_claim', { path: '/' });
            $.removeCookie('search_all_contact', { path: '/' });
            $.removeCookie('search_all_product', { path: '/' });
            $.removeCookie('search_all_order', { path: '/' });
            $.removeCookie('search_all_warranty', { path: '/' });
            $.removeCookie('search_all_invoice', { path: '/' });
            $.removeCookie('search_all_company', { path: '/' });
            $.removeCookie('search_all_task', { path: '/' });
            if (document.location.href.indexOf(searchFormLink[search_top_type]) >= 0) {
               $('input[name="search_all"]').val('');
               search();
            }
         }
      }

      if (['contact'].includes(search_top_type)) {
         SearchAll.prototype.searchKeypress();
      } else if (search_top_type == 'all') {
         $('input[name="search_all"]').unbind('change').bind('change', function () {
            _searchAll.forwardPage(search_top_value);
         });
      }
   },
   removeTypeahead: function () {
      if ($(document).has('#search_top.typeahead')) {
         $('#search_top').typeahead('destroy');
      }
   },
   searchKeypress: function () {
      var _self = this;
      var sources = new Bloodhound({
         datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
         queryTokenizer: Bloodhound.tokenizers.whitespace,
         remote: {
            url: link._contactFilterList,
            // cache: true,
            prepare: function (query, settings) {
               settings.type = "POST";
               settings.data = $.extend({
                  search_all: query,
               }, template_data);
               return settings;
            },
            transform: function (res) {
               return res.list;
            }
         },
      });
      sources.initialize();

      $('#search_top').typeahead({
         hint: true,
         highlight: true,
         minLength: 1,
      }, {
         name: 'contact_value',
         display: 'name',
         limit: Infinity,
         templates: {
            empty: '<div>Not found contact</div>',
            pending: '<div>Loading...</div>',
            suggestion: function (item) {
               var temp = '';
               temp += '<div>';
               temp += '<div class="search-all-name">' + item.f_m_lname + '</div>'
               temp += '<div class="pull-right search-all-add">' + item.primary_state + ' ' + item.primary_city + '</div>'
               temp += '<div class="search-all-mail">' + item.primary_email + '</div>'
               temp += '<small class="search-all-type">' + item.contact_type + '</small>'
               temp += '</div>';
               return temp;
            }
         },
         source: sources.ttAdapter()
      }).on('typeahead:selected', function (e, selected) {
         e.preventDefault();
         search_top_value = '';
         $('#search_top').val('');
         document.location.href = host2 + '#ajax/contact-form?id=' + selected.ID;
      }).on('typeahead:close', function (e) {
         $('#search_top').val('');
         $(this).typeahead('val', '');
         $('.tt-dataset.tt-dataset-contact_value').empty();

      });
      $('#search_top').on('keyup', function (e) {
         if (e.keyCode !== 13) {
            search_top_value = this.value;
         } else if (e.keyCode == 13) {
            if (search_top_value && search_top_value != '') {
               // var type = $('#_search_type .active a').text().toLowerCase();
               // if (!type || type == '') type = 'contact';
               // search_top_type = type;
               $(this).typeahead('val', '');
               $('#search_top').val('');
               _self.forwardPage(search_top_value);
               $('#search_top').focusout();
            }
         }
      })

   },
   searchKeyPressAll: function () {
      var _self = this;
      var sources = new Bloodhound({
         datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
         queryTokenizer: Bloodhound.tokenizers.whitespace,
         remote: {
            url: link._contactAndCompFilterList,
            // cache: true,
            prepare: function (query, settings) {
               settings.type = "POST";
               settings.data = $.extend({
                  search_all: query,
                  idlogin: localStorage.getItemValue('userID')
               }, template_data);
               return settings;
            },
            transform: function (res) {
               return res.list;
            }
         },
      });
      sources.initialize();

      $('#search_top').typeahead({
         hint: true,
         highlight: true,
         minLength: 1,
      }, {
         name: 'contact_value',
         display: 'name',
         limit: Infinity,
         templates: {
            empty: '<div>Not found contact</div>',
            pending: '<div>Loading...</div>',
            suggestion: function (item) {
               var temp = '';
               temp += '<div class="search-all ' + (item.company == 1 ? 'search-company' : 'search-contact') + '">';
               temp += '<div class="search-all-name">' + (item.company == 1 ? '[Company] ' : item.company == '0' ? '[Contact] ' : '') + item.name + '</div>'
               temp += '<div class="pull-right search-all-add">' + item.address1 + '</div>'
               temp += '<div class="search-all-mail">' + item.email + '</div>'
               temp += '<small class="search-all-type">' + (typeof item.type == 'string' ? item.type : typeof item.type instanceof Array ? item.type.join(', ') : '') + '</small>'
               temp += '</div>';
               return temp;
            }
         },
         source: sources.ttAdapter()
      }).on('typeahead:selected', function (e, selected) {
         e.preventDefault();
         search_top_value = '';
         $('#search_top').val('');
         if (selected.company == 1) {
            document.location.href = host2 + '#ajax/company-form?id=' + selected.ID;
         } else {
            document.location.href = host2 + '#ajax/contact-form?id=' + selected.ID;
         }
      }).on('typeahead:close', function (e) {
         $('#search_top').val('');
         $(this).typeahead('val', '');
         $('.tt-dataset.tt-dataset-contact_value').empty();

      });
      $('#search_top').on('keyup', function (e) {
         if (e.keyCode !== 13) {
            search_top_value = this.value;
         } else if (e.keyCode == 13) {
            if (search_top_value && search_top_value != '') {
               // var type = $('#_search_type .active a').text().toLowerCase();
               // if (!type || type == '') type = 'contact';
               // search_top_type = type;
               $(this).typeahead('val', '');
               $('#search_top').val('');
               _self.forwardPage(search_top_value);
               $('#search_top').focusout();
            }
         }
      })
   },
   searchType: function (type, elem) {
      search_top_type = type;
      search_top_value = '';
      $('#search_top').attr('placeholder', 'Search ' + search_top_type);
      $('#_search_type li').removeClass('active');
      $(elem).closest('li').addClass('active');
      SearchAll.prototype.removeTypeahead();
      if (['contact'].includes(search_top_type)) {
         SearchAll.prototype.searchKeypress();
      } else if (search_top_type == 'all') {
         SearchAll.prototype.searchKeyPressAll();
      } else {
         $('#search_top').unbind('change').on('change', function () {
            _searchAll.forwardPage(search_top_value, search_top_type);
         });
      }
   },
   search: function (value, type) {
      _searchAll.forwardPage(value, type);
   },
   forwardPage: function (value, type) {
      if (type) search_top_type = type;
      if (value) search_top_value = value;
      $('#search_top').val('');
      if (search_top_value != undefined && search_top_value != '') {
         if (type == undefined) type = 'contact';
         if (document.location.href.indexOf(searchFormLink[search_top_type]) >= 0) {
            $('input[name="search_all"]').val(search_top_value)
            $('#_keyword').text(search_top_value);
            $('#type_keyword').text(search_top_type);
            $('#panel_search_all').show();
            search_top_value = '';
            search();
         } else {
            var _date = new Date();
            _date.setTime(_date.getTime() + (5 * 1000));
            $.cookie('search_all_' + search_top_type, search_top_value, { path: '/', expires: _date });
            var _url = searchFormLink[search_top_type];
            if (_url != undefined) {
               search_top_value = '';
               window.location.replace(host2 + '#ajax/' + _url);
            }
         }
      }
   }
}

var _searchAll = new SearchAll();
_searchAll.init();
