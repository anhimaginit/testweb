/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../release/go", "./LocalStorageCommandHandler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var go = require("../release/go");
    var LocalStorageCommandHandler_1 = require("./LocalStorageCommandHandler");
    function init() {
        if (window.goSamples)
            window.goSamples(); // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make; // for conciseness in defining templates
        var myDiagram = $(go.Diagram, 'myDiagramDiv', // create a Diagram for the DIV HTML element
        {
            commandHandler: new LocalStorageCommandHandler_1.LocalStorageCommandHandler(),
            'undoManager.isEnabled': true // enable undo & redo
        });
        var myDiagram2 = $(go.Diagram, 'myDiagramDiv2', // create a Diagram for the DIV HTML element
        {
            commandHandler: new LocalStorageCommandHandler_1.LocalStorageCommandHandler(),
            'undoManager.isEnabled': true // enable undo & redo
        });
        // define a simple Node template
        myDiagram.nodeTemplate =
            $(go.Node, 'Auto', // the Shape will go around the TextBlock
            $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 }, 
            // Shape.fill is bound to Node.data.color
            new go.Binding('fill', 'color')), $(go.TextBlock, { margin: 8 }, // some room around the text
            // TextBlock.text is bound to Node.data.key
            new go.Binding('text', 'key')));
        myDiagram2.nodeTemplate = myDiagram.nodeTemplate;
        // create the model data that will be represented by Nodes and Links
        myDiagram.model = new go.GraphLinksModel([
            { key: 'Alpha', color: 'lightblue' },
            { key: 'Beta', color: 'orange' },
            { key: 'Gamma', color: 'lightgreen' },
            { key: 'Delta', color: 'pink' }
        ], [
            { from: 'Alpha', to: 'Beta' },
            { from: 'Alpha', to: 'Gamma' },
            { from: 'Beta', to: 'Beta' },
            { from: 'Gamma', to: 'Delta' },
            { from: 'Delta', to: 'Alpha' }
        ]);
        myDiagram2.model = new go.GraphLinksModel([
            { key: 'Alpha', color: 'lightblue' },
            { key: 'Beta', color: 'orange' },
            { key: 'Gamma', color: 'lightgreen' },
            { key: 'Delta', color: 'pink' }
        ], [
            { from: 'Alpha', to: 'Beta' },
            { from: 'Alpha', to: 'Gamma' },
            { from: 'Beta', to: 'Beta' },
            { from: 'Gamma', to: 'Delta' },
            { from: 'Delta', to: 'Alpha' }
        ]);
        // Attach to the window for console manipulation
        window.myDiagram = myDiagram;
        window.myDiagram2 = myDiagram2;
    }
    exports.init = init;
});
