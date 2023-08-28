/** read more in
 * https://gojs.net/latest/samples/regroupingTreeView.html */
function DiagramGoJS(idElem) {
  // if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
  var goGraph = go.GraphObject.make;

  this.myDiagram =
    goGraph(go.Diagram, idElem, {
      initialAutoScale: go.Diagram.UniformToFill,
      contentAlignment: go.Spot.Center,
      // what to do when a drag-drop occurs in the Diagram's background
      mouseDrop: function (e) { finishDrop(e, null); },
      layout:  // Diagram has simple horizontal layout
        goGraph(go.TreeLayout,
          {
            alternateAlignment: go.TreeLayout.AlignmentBus,
            alternateNodeSpacing: 20,
            angle: 90,
            layerSpacing: 35
          }),
      "commandHandler.archetypeGroupData": { isGroup: true, category: "OfNodes" },
      "undoManager.isEnabled": false,
      "ChangedSelection": function (e) {
      }
    });

  // There are two templates for Groups, "OfGroups" and "OfNodes".

  // this function is used to highlight a Group that the selection may be dropped into
  function highlightGroup(e, grp, show) {
    if (!grp) return;
    e.handled = true;
    if (show) {
      // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
      // instead depend on the DraggingTool.draggedParts or .copiedParts
      var tool = grp.diagram.toolManager.draggingTool;
      var map = tool.draggedParts || tool.copiedParts;  // this is a Map
      // now we can check to see if the Group will accept membership of the dragged Parts
      if (grp.canAddMembers(map.toKeySet())) {
        grp.isHighlighted = true;
        return;
      }
    }
    grp.isHighlighted = false;
  }

  // Upon a drop onto a Group, we try to add the selection as members of the Group.
  // Upon a drop onto the background, or onto a top-level Node, make selection top-level.
  // If this is OK, we're done; otherwise we cancel the operation to rollback everything.
  function finishDrop(e, grp) {
    var ok = (grp !== null
      ? grp.addMembers(grp.diagram.selection, true)
      : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
    if (!ok) e.diagram.currentTool.doCancel();
  }

  this.myDiagram.groupTemplateMap.add("OfGroups",
    goGraph(go.Group, go.Panel.Auto,
      {
        background: "transparent",
        // highlight when dragging into the Group
        mouseDragEnter: function (e, grp, prev) { highlightGroup(e, grp, true); },
        mouseDragLeave: function (e, grp, next) { highlightGroup(e, grp, false); },
        computesBoundsAfterDrag: true,
        // when the selection is dropped into a Group, add the selected Parts into that Group;
        // if it fails, cancel the tool, rolling back any changes
        mouseDrop: finishDrop,
        handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
        // Groups containing Groups lay out their members horizontally
        layout: goGraph(go.LayeredDigraphLayout)
        // layout: goGraph(go.CircularLayout)
        // goGraph(go.GridLayout,
        //   {
        //     wrappingWidth: Infinity, alignment: go.GridLayout.Position,
        //     cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
        //   })
      },
      new go.Binding("background", "isHighlighted", function (h) { return h ? "rgba(255,0,0,0.2)" : "transparent"; }).ofObject(),
      goGraph(go.Shape, "Rectangle",
        { fill: null, stroke: "#E69900", strokeWidth: 2 }),
      goGraph(go.Panel, go.Panel.Vertical,  // title above Placeholder
        goGraph(go.Panel, go.Panel.Horizontal,  // button next to TextBlock
          { stretch: go.GraphObject.Horizontal, background: "#FFDD33", margin: 1 },
          goGraph("SubGraphExpanderButton",
            { alignment: go.Spot.Right, margin: 5 }),
          goGraph(go.TextBlock,
            {
              alignment: go.Spot.Left,
              editable: true,
              margin: 5,
              font: "bold 18px sans-serif",
              stroke: "#9A6600"
            },
            new go.Binding("text", "text").makeTwoWay())
        ),  // end Horizontal Panel
        goGraph(go.Placeholder,
          { padding: 5, alignment: go.Spot.TopLeft })
      )  // end Vertical Panel
    ));  // end Group and call to add to template Map

  this.myDiagram.groupTemplateMap.add("OfNodes",
    goGraph(go.Group, go.Panel.Auto,
      {
        background: "transparent",
        ungroupable: true,
        // highlight when dragging into the Group
        mouseDragEnter: function (e, grp, prev) { highlightGroup(e, grp, true); },
        mouseDragLeave: function (e, grp, next) { highlightGroup(e, grp, false); },
        computesBoundsAfterDrag: true,
        // when the selection is dropped into a Group, add the selected Parts into that Group;
        // if it fails, cancel the tool, rolling back any changes
        mouseDrop: finishDrop,
        handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
        // Groups containing Nodes lay out their members vertically
        layout:
          goGraph(go.GridLayout,
            {
              wrappingColumn: 1, alignment: go.GridLayout.Position,
              cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
            })
      },
      new go.Binding("background", "color", function (h) { return h ? "rgba(255,0,0,0.2)" : "transparent"; }).ofObject(),
      goGraph(go.Shape, "Rectangle",
        { fill: null, stroke: "#0099CC", strokeWidth: 2 }),
      goGraph(go.Panel, go.Panel.Vertical,  // title above Placeholder
        goGraph(go.Panel, go.Panel.Horizontal,  // button next to TextBlock
          { stretch: go.GraphObject.Horizontal, background: "#33D3E5", margin: 1 },
          goGraph("SubGraphExpanderButton",
            { alignment: go.Spot.Right, margin: 5 }),
          goGraph(go.TextBlock,
            {
              alignment: go.Spot.Left,
              editable: true,
              margin: 5,
              font: "bold 16px sans-serif",
              stroke: "#006080"
            },
            new go.Binding("text", "text").makeTwoWay()),
          new go.Binding("background", "color"),
        ),  // end Horizontal Panel
        goGraph(go.Placeholder,
          { padding: 5, alignment: go.Spot.TopLeft })
      )  // end Vertical Panel
    ));  // end Group and call to add to template Map

  // Nodes have a trivial definition
  this.myDiagram.nodeTemplate =
    goGraph(go.Node, go.Panel.Auto,
      { // dropping on a Node is the same as dropping on its containing Group, even if it's top-level
        mouseDrop: function (e, nod) { finishDrop(e, nod.containingGroup); }
      },
      goGraph(go.Shape, "Rectangle",
        {
          fill: "#ACE600",
          stroke: "#558000",
          strokeWidth: 1,
        },
        new go.Binding("fill", "color")),
      goGraph(go.TextBlock,
        {
          margin: 5,
          editable: true,
          font: "bold 13px sans-serif",
          stroke: "#446700"
        },
        new go.Binding("text", "text").makeTwoWay())
    );

  this.myDiagram.linkTemplate =
    goGraph(go.Link,
      goGraph(go.Shape),
      goGraph(go.Shape, { toArrow: "Standard", }),
      goGraph(go.TextBlock,
        new go.Binding("text", "text"))
    );

  this.id = idElem;

  var _self = this;

  jQuery('.export-' + idElem).click(function () {
    _self.exportToImage();
  });

  // get department
  this.departmentGroup = []
  window.department.forEach(function (item) {
    _self.departmentGroup.push({ key: item.value.replace(' ', ''), text: item.display, isGroup: true, category: 'OfGroups' });
  });

}
DiagramGoJS.prototype = {
  constructor: DiagramGoJS,
  setData: function (data) {
    this.myDiagram.model = go.Model.fromJson(data);
  },
  drawDiagram: function (list, filterDepartment) {
    var nodeData = []
    var mapKey = {};
    var nodeLink = [];
    if (isSystemAdmin() && !filterDepartment) {
      nodeData = this.departmentGroup;
    }
    list.forEach(function (group) {
      if (!filterDepartment || group.department == filterDepartment) {

        var node = { key: group.ID, text: group.group_name + ' (' + group.role + ')', group: group.department, isGroup: true, category: 'OfNodes' };
        switch (group.role) {
          case 'Admin': node.color = '#ff8133'; break;
          case 'Manager': node.color = '#66ff33'; break;
          case 'Leader': node.color = '#2baaff'; break;
          case 'User': node.color = '#ea94ff'; break;
        }
        if (group.parent_group && ![0, '0'].includes(group.parent_group)) {
          // node.group = group.parent_group;
          // nodeData[mapKey[group.parent_group]].category = 'OfNodes';

          var manager = [];
          group.parent_name.forEach(function (item, index) {
            if (nodeData[mapKey[item.ID + '_' + group.parent_group]]) {
              nodeData[mapKey[item.ID + '_' + group.parent_group]].color = '#ffcc40';
              manager.push(item.name);
            };
          });

          var _link = { from: group.parent_group, to: group.ID, text: manager.join(', ') };
          if (!nodeLink.includes(_link)) {
            nodeLink.push(_link);
          }
        }

        if (!nodeData.includes(node)) {
          mapKey[group.ID] = nodeData.length;
          nodeData.push(node);
        }

        group.userName.forEach(function (user, index) {
          mapKey[user.ID + '_' + group.ID] = nodeData.length;
          var nodeUser = { key: user.ID + '_' + group.ID, text: user.name, group: group.ID };
          nodeData.push(nodeUser);
        });
      };
    });

    this.setData({
      class: "go.GraphLinksModel",
      nodeDataArray: nodeData,
      linkDataArray: nodeLink
    });
  },
  exportToImage: function () {
    this.myDiagram.scale = 5;
    this.myDiagram.zoomToFit();
    var imgBlob = this.myDiagram.makeImageData({
      background: 'rgba(255,255,255,1)',
      maxSize: new go.Size(Infinity, Infinity),
      padding: 20,
      scale: 5,
      type: 'image/jpeg',
    });

    download(imgBlob, "group-list-diagram-" + getDateTime() + ".png", "image/image/jpeg");
  }
}