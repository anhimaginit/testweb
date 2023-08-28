/**
 * 
 * @param {Array} fields : multiple fields select2
 * @param {Object} link : link for fields
 */
function ControlSelect2(fields, link, callback) {
  var myLink = {};
  if (link) {
    myLink = link;
  } else {
    myLink = _linkSelect;
  }
  if (!fields) return;
  if (typeof fields == 'string') fields = [fields];
  fields.forEach(function (field) {
    var name = $(field).prop('name');
    if (!name || !$(field).prop('type')) {

    } else if (!$(field).prop('type').includes('select')) {
      return;
      // alert('The field ' + field + ' link is not a select');
    } else if (!myLink[name]) {
      if(_linkSelect[name]) myLink[name] = _linkSelect[name];
      else{
        $(field).select2({});
        return;
      }
      // alert('The field ' + name + ' link is not defined');
    } else
      $(field).select2({
        placeholder: 'Search Item',
        minimumInputLength: 2,
        language: {
          inputTooShort: function () {
            return 'Enter name';
          },
        },
        allowClear: true,
        multiple: $(field).prop('multiple'),
        ajax: {
          url: myLink[name].url,
          type: 'post',
          dataType: 'json',
          delay: 300,
          data: function (params) {
            var _data = { token: localStorage.getItemValue('token'), contact_name: params.term }
            if (document.location.href.includes('group.php')) {
              _data.unit = $('[name="department"]').val();
            }
            return _data;
          },
          processResults: function (data, params) {
            if (data && data.list) {
              data = data.list;
            }
            return { results: data }
          },
          cache: true
        },
        escapeMarkup: function (markup) { return markup; }, // var our custom formatter work
        templateResult: function (repo) {
          if (repo.loading) {
            return repo.text;
          }

          var markup =
            "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__meta'>" +
            "<div class='select2-result-repository__title'>" + repo.text + "</div>" +
            "</div>" +
            "</div>";

          return markup;
        },
        templateSelection: function (repo) {
          if (!repo.text) return repo.id;
          return repo.text;
        }
      });
    if (callback) callback();
  })
}

ControlSelect2.prototype.constructor = ControlSelect2;
