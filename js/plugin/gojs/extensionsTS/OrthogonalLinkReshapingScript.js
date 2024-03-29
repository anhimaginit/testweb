/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../release/go", "./OrthogonalLinkReshapingTool"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var go = require("../release/go");
    var OrthogonalLinkReshapingTool_1 = require("./OrthogonalLinkReshapingTool");
    var myDiagram;
    function init() {
        if (window.goSamples)
            window.goSamples(); // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make;
        myDiagram =
            $(go.Diagram, 'myDiagramDiv', {
                'undoManager.isEnabled': true,
                'linkReshapingTool': new OrthogonalLinkReshapingTool_1.OrthogonalLinkReshapingTool()
            });
        myDiagram.nodeTemplate =
            $(go.Node, 'Auto', {
                width: 80,
                height: 50,
                locationSpot: go.Spot.Center
            }, new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify), $(go.Shape, { fill: 'lightgray' }), $(go.TextBlock, { margin: 10 }, new go.Binding('text', 'key')));
        myDiagram.linkTemplate =
            $(go.Link, {
                routing: go.Link.AvoidsNodes,
                reshapable: true,
                resegmentable: true
            }, new go.Binding('points').makeTwoWay(), $(go.Shape, { strokeWidth: 2 }));
        myDiagram.model = new go.GraphLinksModel([
            { key: 'Alpha', location: '0 0' },
            { key: 'Beta', location: '200 0' },
            { key: 'Gamma', location: '100 0' }
        ], [
            { from: 'Alpha', to: 'Beta' }
        ]);
        myDiagram.addDiagramListener('InitialLayoutCompleted', function (e) {
            // select the Link in order to show its two additional Adornments, for shifting the ends
            var link = myDiagram.links.first();
            if (link !== null)
                link.isSelected = true;
        });
    }
    exports.init = init;
    function updateRouting() {
        var routing = getRadioValue('routing');
        var newRouting = (routing === 'orthogonal') ? go.Link.Orthogonal : go.Link.AvoidsNodes;
        myDiagram.startTransaction('update routing');
        myDiagram.linkTemplate.routing = newRouting;
        myDiagram.links.each(function (l) {
            l.routing = newRouting;
        });
        myDiagram.commitTransaction('update routing');
    }
    exports.updateRouting = updateRouting;
    function getRadioValue(name) {
        var radio = document.getElementsByName(name);
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked)
                return radio[i].value;
        }
    }
    exports.getRadioValue = getRadioValue;
});
