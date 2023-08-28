function DashBoardChart() {
   $('.datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      showButtonPanel: true,
      changeMonth: true,
      changeYear: true,
      maxDate: '0'
   })
}

DashBoardChart.prototype.constructor = DashBoardChart;
DashBoardChart.prototype = {
   init: function () {
      this.createChart();
   },
   createChart: function () {
      var _data = $.extend({}, template_data);
      _data.limitDay = $('.date_length').val();

      var _link = link._dashboardOrderPaidOpen;

      if (_data.limitDay == 'custom') {
         delete _data.limitDay;
         _data.start_date = $('input[name=start_date]').val();
         _data.end_date = $('input[name=end_date]').val();
      }
      _data.login_id = localStorage.getItemValue('userID');

      $.ajax({
         url: _link,
         type: 'post',
         data: _data,
         dataType: 'json',
         success: function (res) {
            var list = res.list;
            $('#chart_total_Open').text(list.orderOpen);
            $('#chart_total_Close').text('' + list.orderClose);
            $('#chart_total_Total').text('' + list.orderTotal);
         }
      })
   },
}
var _dashBoardChart = new DashBoardChart();
_dashBoardChart.init();