function WidgetControl() { }
WidgetControl.prototype.constructor = WidgetControl;

WidgetControl.prototype = {
   init: function () {
      file_widget.sort();
      countNameTitle = 1;
      startWidget = '';
      indexStart = -1;
      stopWidget = '';
      indexStop = -1;
      itemText = '';
      optionNestable = this.optionNestable;
      resetWidgetOptions = this.resetWidgetOptions;
      removeItem = this.removeItem;
      removeWidget = this.removeWidget;
      addWidget = this.addWidget;
      ddWidgetMouse3 = this.ddWidgetMouse3;
      bindEventDD = this.bindEventDD;
      listDD = [];

      this.bindEvent();
      this.initPage();
      this.bindEventDD();
      this.setDisplay();

   },

   setDisplay: function () {
      $('.sub-widget .widget-body').remove();
      $('.sub-widget div').remove();
      $('.sub-widget header h2').css('font-size', '12px');
      $('.sub-widget header h2').css('letter-spacing', -1);
      $('.sub-widget').css('margin', '0 0 5px');
      $('.dd').css('max-width', 'unset');
      $('.dd-handle').css('font-family', '"Open Sans",Arial,Helvetica,Sans-Serif');
      $('.dd-handle').css('font-size', '12px');
      $('.dd-handle').css('font-weight', '400');
   },

   initPage: function () {
      var options = optionNestable;
      var list = [[], [], [], []];
      var count = 0;
      for (var j = 0; j <= file_widget.length / 4; j++) {
         for (var i = 0; i < 4; i++) {
            if (count < file_widget.length) {
               list[i].push(file_widget[count]);
               count++;
            }
         }
      }
      for (var i = 1; i <= 4; i++) {
         options.json = list[i - 1];
         $('#dd_' + i).nestable(options);
      }

      widget_json.forEach(function (elem) {
         $('#dd_widget_items .widget-body').append('<div class="col col-sm-3 col-xs-6"><div class="dd" id="_' + elem.id.split('<')[0] + '"></div></div>');
         options.json = [elem];
         listDD.push('_' + elem.id);
         $('#_' + elem.id).nestable(options);
      });
      $('.dd-expand').hide();
   },

   bindEvent: function () {
      $('#search_widget').keyup(function () {
         var value = $(this).val().toLowerCase();
         $("#widget_list_file li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
         })
      });

      $('#btnAddNewWidget').bind('click', function () {
         addWidget();
      });

      $('#widget_name').change(function () {
         $('#widget_name_error').empty();
      });
   },

   bindEventDD: function () {
      $('.dd-expand').click(function () {
         $(this).closest('li').find('.dd-collapse').show();
         $(this).hide();
      });
      $('.dd-collapse').click(function () {
         $(this).closest('li').find('.dd-expand').show();
         $(this).hide();
      });
      $('.dd-expand').hide();
   },
   /** Insert new widget when click button [Add] */
   addWidget: function () {
      var _name = $('#widget_name').val() != '' ? $('#widget_name').val() : 'Untitle' + countNameTitle;
      countNameTitle++;
      $('#dd_widget_items .widget-body').append('<div class="col col-sm-3 col-xs-6"><div class="dd" id="_' + _name + '"></div></div>');
      $('#_' + _name).nestable({ json: [{ "id": _name, children: [] }] });
      listDD.push('_' + _name);
      bindEventDD();
   },

   /**remove li from list in widget */
   removeItem: function (item) {
      $.SmartMessageBox({
         title: '<i class="fa fa-trash txt-color-orangeDark"></i> Remove the item',
         content: 'Are you really want to remove item ' + $(this).parent().text() + '?',
         buttons: "[Yes][Cancel]"

      }, function (ButtonPressed) {
         if (ButtonPressed == 'Yes') {
            widget_json[item.closest('.col-sm-6.col-lg-4').index() - 1].splice(item.closest('li').index() - 1);
            item.closest('li').remove();
         }
      });
   },
   /**remove widget */
   removeWidget: function (item) {
      $.SmartMessageBox({
         title: '<i class="fa fa-trash txt-color-orangeDark"></i> Remove the widget',
         content: 'Are you really want to remove widget ' + $(this).parent().text() + '?',
         buttons: "[Yes][Cancel]"

      }, function (ButtonPressed) {
         if (ButtonPressed == 'Yes') {
            widget_json.splice([item.closest('.col-sm-6.col-lg-4').index() - 1]);
            item.closest('.col-sm-6.col-lg-4').remove();
         }
      });
   },
   optionNestable: {
      onDragStart: function (l, e) {
         startWidget = l.prop('id');
         indexStart = e.index();
         itemText = e.data('id');
      },
      beforeDragStop: function (l, e, p) {
         $('.dd-empty').closest('.col-sm-3.col-xs-6').remove();
      },
      callback: function (l, e) {
         /**
          * when user drag some item, 1 item may be have on many widget
          * but in nestable.js, when drag stop, the src item will move to des.
          */
         stopWidget = l.prop('id');
         indexStop = e.index();
         var options = optionNestable;

         if (startWidget.startsWith('dd_') && stopWidget.startsWith('_')) {
            console.log(startWidget + ' to ' + stopWidget);
            var list = $('#' + startWidget).nestable('serialize');
            list.splice(indexStart, 0, { id: itemText });
            options.json = list;
            $('#' + startWidget).nestable(options);
            resetWidgetOptions();
            return;

         } else if (startWidget.startsWith('_') && stopWidget.startsWith('dd_')) {
            console.log(startWidget + ' to--- ' + stopWidget);

            var list = $('#' + stopWidget).nestable('serialize');
            list.splice(indexStop, 1);
            options.json = list;
            $('#' + stopWidget).nestable(options);
            resetWidgetOptions();
            return;
         } else {
            resetWidgetOptions();
            return;
         }
      }
   },
   resetWidgetOptions: function () {
      startWidget = '';
      indexStart = -1;
      stopWidget = '';
      indexStop = -1;
      itemText = '';
      $('.dd-empty').closest('.col-sm-3.col-xs-6').remove();
      bindEventDD();
      var __data = []
      listDD.forEach(function (e) {
         var lst = $('#' + e).nestable('serialize');
         if (lst.length > 0) {
            __data.push(lst[0]);
         }
      });
      $.ajax({
         url: host2 + 'php/write-file.php',
         type: 'post',
         data: { data: JSON.stringify(__data) }
      });
   }
}

var _widgetControl = new WidgetControl();
_widgetControl.init();
