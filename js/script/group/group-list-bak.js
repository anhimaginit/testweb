function GroupList() {
   this.createDiagram();
}

GroupList.prototype.constructor = GroupList;
var myDiagram;
var contactList = {};
GroupList.prototype = {
   init: function () {
      removeGroup = this.removeGroup;
      this.loadTable();
   },
   loadTable: function () {
      var _mydata = $.extend({}, template_data);
      var _data = decodeURIComponent($("#form_search").serialize()).split('&');
      _data.forEach(function (elem) {
         _mydata[elem.split("=")[0]] = elem.split("=")[1];
      });
      var _self = this;
      $.ajax({
         url: link._groupList,
         type: 'POST',
         data: _mydata,
         dataType: 'json',
         success: function (res) {
            var _data = res.list;
            window.group_list_table = res.list;
            window.tb_data = $('#table_group').DataTable({
               "sDom": "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                  "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
               buttons: [
                  { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Group List - ' + getDateTime(), className: 'btn btn-default' },
                  { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Group List - ' + getDateTime(), className: 'btn btn-default' },
                  { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Group List - ' + getDateTime(), className: 'btn btn-default' },
                  {
                     extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Group List - ' + getDateTime(), className: 'btn btn-default',
                     action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                           event.preventDefault();
                           alert('You haven\'t permission to download group list');
                           return false;
                        } else {
                           $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                     }
                  },
                  { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Group List - ' + getDateTime(), className: 'btn btn-default' },
                  {
                     text: '<i class="fa fa-image"></i> Export Diagram', title: 'Group Diagram' + getDateTime(), className: 'btn btn-default export-hierachy_pane'
                  }
               ],
               data: _data,
               destroy: true,
               columns: [
                  { data: 'ID', searchable: true },
                  { data: 'department', "searchable": true },
                  { data: 'group_name', "searchable": true },
                  { data: 'role', "searchable": true },
                  {
                     data: function (data) {
                        if (data.userName) {
                           var _html = [];
                           data.userName.forEach(function (u) {
                              _html.push('<a href="./#ajax/contact-form.php?id=' + u.ID + '" class="userName" target="_blank">' + u.name + '</a>');;
                           })
                           return _html.join(', ');
                        }
                     }, "searchable": true
                  },
                  {
                     data: function (data) {
                        return data.parent_group != '0' ? '<a href="./#ajax/group.php?id=' + data.parent_group + '" target="_blank">' + data.parent_gr_name + '</a>' : 'root';
                     }, "searchable": true
                  },
                  {
                     data: function (data) {
                        if (data.parent_id && data.parent_id != '0' && data.parent_id != 0) {
                           var _html = [];
                           data.parent_name.forEach(function (parent) {
                              _html.push('<a href="./#ajax/contact-form.php?id=' + parent.ID + '" class="userName" target="_blank">' + parent.name + '</a>');;
                           })
                           return _html.join(', ');
                        } else {
                           return '';
                        }
                     }, "searchable": true
                  },
                  {
                     mRender: function (data, type, row) {
                        var elem = '<a href="./#ajax/group.php?id=' + row.ID + '" class="btn btn-default label"><i class="fa fa-edit text-primary"></i></a>';

                        elem += '<a href="javascript:" class="btn btn-default label" title="Remove group" onclick="removeGroup(' + row.ID + ', this)"><i class="fa fa-times text-danger"></i></a>';
                        return elem;
                     }
                  }
               ],
               order: [[1, 2, 3, 'asc']],
               createdRow: function (row, data, dataIndex) {
                  var color = '';
                  color = data.role == 'Admin' ? 'success' : data.role == 'Manager' ? 'warning' : data.role == 'Leader' ? 'info' : data.role == 'User' ? '' : 'danger';
                  $(row).addClass(color);
               }
            });

            $("#table_group thead th input").on('keyup change', function () {
               window.tb_data
                  .column($(this).parent().index() + ':visible')
                  .search(this.value)
                  .draw();
            });

            $('#table_group a').hover(function () {
               var href = $(this).attr('href');
               $('#table_group a.userName[href="' + href + '"]').css({ 'background': 'black', color: 'white' });
            }, function () {
               var href = $(this).attr('href');
               $('#table_group a.userName[href="' + href + '"]').css({ 'background': 'unset', color: '#3276b1' });
            });

            // _self.drawGroupDiagram(res.list);
            new DiagramGoJS('hierachy_pane').drawDiagram(res.list);
         }
      })
   },
   setDataTable: function (list) {
      if (list && window.tb_data) {
         window.tb_data.clear();
         window.tb_data.rows.add(list);
         window.tb_data.draw();
      }
   },
   createDiagram: function () {
      var $ = go.GraphObject.make;
      myDiagram =
         $(go.Diagram, 'hierachy_pane',
            {
               initialAutoScale: go.Diagram.UniformToFill,
               contentAlignment: go.Spot.Center,
               "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
               "animationManager.isEnabled": false,
               layout: $(go.TreeLayout, // specify a Diagram.layout that arranges trees
                  {
                     alternateAlignment: go.TreeLayout.AlignmentBus,
                     alternateNodeSpacing: 20,
                     angle: 90,
                     layerSpacing: 35
                  }),
            });

      // the template we defined earlier
      myDiagram.nodeTemplate =
         $(go.Node, "Spot",
            {
               background: "#44CCFF",
               locationSpot: go.Spot.Center
            },
            // $(go.Picture,
            //    { margin: 10, width: 50, height: 50, background: "red" },
            //    new go.Binding("source")),
            $(go.TextBlock, "Default Text",
               { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
               new go.Binding("text", "name"))
         );

      // define a Link template that routes orthogonally, with no arrowhead
      myDiagram.linkTemplate =
         $(go.Link,
            { routing: go.Link.Orthogonal, corner: 5 },
            $(go.Shape, { strokeWidth: 5, stroke: "#555" })); // the link shape

      {
         var myLinkTemplate =
            $(go.Link,
               { routing: go.Link.Normal, selectable: false },
               $(go.Shape,
                  { strokeWidth: 1 })
            );
         myDiagram.linkTemplate = myLinkTemplate;
      }
   },
   /**
    * 
    * @param {JSON} data 
    * set data for diagram
    */
   setData: function (data) {
      var $ = go.GraphObject.make;
      var model = $(go.TreeModel);
      model.nodeDataArray = data;
      myDiagram.model = model;
   },
   drawGroupDiagram: function (list) {
      if (!list) {
         list = this.getGroupList();
      }
      var modelList = [], units = {};
      list.forEach(function (group) {
         if (group.userName) {
            group.userName.forEach(function (user) {
               units[group.department] = group.department;
               var key = group.ID + '_' + user.ID;
               var name = group.group_name + ' ' + group.role + ' (' + user.name + ')';
               if (group.parent_group == 0 || group.parent_group == '0') {
                  modelList.push({ key: key, name: name, parent: group.department });
               } else {
                  group.parent_id.split(',').forEach(function (p_id) {
                     var parent = group.parent_group + '_' + p_id;
                     modelList.push({ key: key, name: name, parent: parent });
                  })
               }
            });
         };
      });
      for (var key in units) {
         modelList.push({ key: key, name: key });
      }
      this.setData(modelList);
   },
   removeGroup: function (id, elem) {
      var tds = $(elem).closest('tr').find('td');
      var _cf = window.confirm('Deleting group ' + tds.eq(2).text() + ' (' + tds.eq(3).text() + ')' + ' in ' + tds.eq(1).text() + '?');
      var _data = $.extend({}, template_data);
      _data.ID = id;
      if (_cf == true) {
         $.ajax({
            url: link._groupDelete,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
               if (res.ERROR == '' && res.SUCCESS == true) {
                  window.group_list_table.forEach(function (group, index) {
                     if (group.ID == id) {
                        window.group_list_table.splice(index, 1);
                        GroupList.prototype.setDataTable(window.group_list_table);
                        GroupList.prototype.drawGroupDiagram(window.group_list_table);
                        return;
                     };
                  });
               } else {
                  alert('Error! An error occurred. ' + res.ERROR);
               }
            },
         });
      }
   },

   exportToImage: function () {
      myDiagram.scale = 5;
      myDiagram.zoomToFit();
      var imgBlob = myDiagram.makeImageData({
         background: 'white',
         maxSize: new go.Size(Infinity, Infinity),
         padding: 20,
         scale: 10,
         type: 'image/jpeg',
      });

      download(imgBlob, "group-list-diagram-" + getDateTime() + ".png", "image/image/jpeg");
   }
}

var _groupList = new GroupList();
_groupList.init();