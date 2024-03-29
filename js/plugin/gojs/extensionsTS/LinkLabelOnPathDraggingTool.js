/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../release/go"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var go = require("../release/go");
    /**
     * The LinkLabelOnPathDraggingTool class lets the user move a label on a {@link Link} while keeping the label on the link's path.
     * This tool only works when the Link has a label marked by the "_isLinkLabel" property.
     *
     * If you want to experiment with this extension, try the <a href="../../extensionsTS/LinkLabelOnPathDragging.html">Link Label On Path Dragging</a> sample.
     * @category Tool Extension
     */
    var LinkLabelOnPathDraggingTool = /** @class */ (function (_super) {
        __extends(LinkLabelOnPathDraggingTool, _super);
        /**
         * Constructs a LinkLabelOnPathDraggingTool and sets the name for the tool.
         */
        function LinkLabelOnPathDraggingTool() {
            var _this = _super.call(this) || this;
            /**
             * The label being dragged.
             */
            _this.label = null;
            _this._originalIndex = 0;
            _this._originalFraction = 0.0;
            _this.name = 'LinkLabelOnPathDragging';
            return _this;
        }
        /**
         * From the GraphObject at the mouse point, search up the visual tree until we get to
         * an object that has the "_isLinkLabel" property set to true and that is an immediate child of a Link Panel.
         * @return {GraphObject} This returns null if no such label is at the mouse down point.
         */
        LinkLabelOnPathDraggingTool.prototype.findLabel = function () {
            var diagram = this.diagram;
            var e = diagram.lastInput;
            var elt = diagram.findObjectAt(e.documentPoint, null, null);
            if (elt === null || !(elt.part instanceof go.Link))
                return null;
            while (elt !== null && elt.panel !== elt.part) {
                elt = elt.panel;
            }
            // If it's not marked as "_isLinkLabel", don't consider it a label:
            if (!elt['_isLinkLabel'])
                return null;
            return elt;
        };
        /**
         * This tool can only start if the mouse has moved enough so that it is not a click,
         * and if the mouse down point is on a GraphObject "label" in a Link Panel,
         * as determined by {@link #findLabel}.
         */
        LinkLabelOnPathDraggingTool.prototype.canStart = function () {
            if (!_super.prototype.canStart.call(this))
                return false;
            var diagram = this.diagram;
            // require left button & that it has moved far enough away from the mouse down point, so it isn't a click
            var e = diagram.lastInput;
            if (!e.left)
                return false;
            if (!this.isBeyondDragSize())
                return false;
            return this.findLabel() !== null;
        };
        /**
         * Start a transaction, call findLabel and remember it as the "label" property,
         * and remember the original values for the label's segment properties.
         */
        LinkLabelOnPathDraggingTool.prototype.doActivate = function () {
            this.startTransaction('Shifted Label');
            this.label = this.findLabel();
            if (this.label !== null) {
                this._originalIndex = this.label.segmentIndex;
                this._originalFraction = this.label.segmentFraction;
            }
            _super.prototype.doActivate.call(this);
        };
        /**
         * Stop any ongoing transaction.
         */
        LinkLabelOnPathDraggingTool.prototype.doDeactivate = function () {
            _super.prototype.doDeactivate.call(this);
            this.stopTransaction();
        };
        /**
         * Clear any reference to a label element.
         */
        LinkLabelOnPathDraggingTool.prototype.doStop = function () {
            this.label = null;
            _super.prototype.doStop.call(this);
        };
        /**
         * Restore the label's original value for GraphObject.segment... properties.
         */
        LinkLabelOnPathDraggingTool.prototype.doCancel = function () {
            if (this.label !== null) {
                this.label.segmentIndex = this._originalIndex;
                this.label.segmentFraction = this._originalFraction;
            }
            _super.prototype.doCancel.call(this);
        };
        /**
         * During the drag, call {@link #updateSegmentOffset} in order to set the segment... properties of the label.
         */
        LinkLabelOnPathDraggingTool.prototype.doMouseMove = function () {
            if (!this.isActive)
                return;
            this.updateSegmentOffset();
        };
        /**
         * At the end of the drag, update the segment properties of the label and finish the tool,
         * completing a transaction.
         */
        LinkLabelOnPathDraggingTool.prototype.doMouseUp = function () {
            if (!this.isActive)
                return;
            this.updateSegmentOffset();
            this.transactionResult = 'Shifted Label';
            this.stopTool();
        };
        /**
         * Save the label's {@link GraphObject#segmentIndex} and {@link GraphObject#segmentFraction}
         * at the closest point to the mouse.
         */
        LinkLabelOnPathDraggingTool.prototype.updateSegmentOffset = function () {
            var lab = this.label;
            if (lab === null)
                return;
            var link = lab.part;
            if (!(link instanceof go.Link))
                return;
            var last = this.diagram.lastInput.documentPoint;
            var idx = link.findClosestSegment(last);
            idx = Math.min(Math.max(link.firstPickIndex, idx), link.lastPickIndex - 1);
            var p1 = link.getPoint(idx);
            var p2 = link.getPoint(idx + 1);
            var total = Math.sqrt(p1.distanceSquaredPoint(p2));
            var p = last.copy().projectOntoLineSegmentPoint(p1, p2);
            var frac = Math.sqrt(p1.distanceSquaredPoint(p)) / total;
            lab.segmentIndex = idx;
            lab.segmentFraction = frac;
        };
        return LinkLabelOnPathDraggingTool;
    }(go.Tool));
    exports.LinkLabelOnPathDraggingTool = LinkLabelOnPathDraggingTool;
});
