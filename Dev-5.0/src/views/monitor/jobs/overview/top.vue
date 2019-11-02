<template>
<div>
  <div id="Box" :style="{height:$Height()-170+'px'}"> 
     
            <div id="Top" >
             <div id="box" :style="{height:$Height()-170+'px'}">
                <div id="top">
                  <div style="width: 100%;height:100%;border:none">
                    <div id="myPaletteDiv" class="text-center" style="width:0px;overflow:hidden"></div>
                    <div id="myDiagramDiv" style="
                    margin-bottom:-3000px;padding-bottom:3000px;
                    margin-right:-4000px;padding-right:3000px;
                    margin-top:-2800px;padding-top:3000px;
                    margin-left:-3000px;padding-left:3000px;
                    "></div>
                  </div>
                </div>
              
              </div>
               
            </div>  
            <div id="Bottom">
           
              <slot name="bottom"></slot>
            </div>  
            <div id="Line">
             
            </div>
        </div> 
  

  
</div>
</template>

<script>
require("gojs");

export default {
 
  data() {
    return {
     
      GraphObject: "",
      myDiagram: "",
     // data:this.datas
     
      data:{ 
        "class": "go.GraphLinksModel",
        "nodeDataArray": [ 
         // {"category":"Source", "text":"Stream", "key":-1, "id":6, "NAME":"Stream1"},
         /*
          {category: "Source",
            id: "dfe082f54f7fa07e24d53b2008423f8e",
            key: "dfe082f54f7fa07e24d53b2008423f8e",
            operator:"operator",
            text: "RangePartition: PreparePartition",
            parallelism:"parallelism :"+1,
            operator_strategy: "operator_strategy",
                          
          },
          {
            category: "Source",
            id: "e8eaa0bd2c6ca8c4e937452a81511e67",
            key: "e8eaa0bd2c6ca8c4e937452a81511e67",
            operator: "MapPartition",
            text: "RangePartition: LocalSample",
            parallelism:"parallelism :"+1,
            operator_strategy: "operator_strategy",

           
            
          }
         */
        ],
        "linkDataArray": [ 
         // {"from":-2, "to":-1},
         //{"from":'dfe082f54f7fa07e24d53b2008423f8e', "to":'e8eaa0bd2c6ca8c4e937452a81511e67'}
          ]
      },
    
      
    };
  },
  methods: {
    $:function(id){
            return document.getElementById(id) 
    },
    drag:function(){  
        let oBox = this.$("Box"), oBottom = this.$("Bottom"), oLine = this.$("Line");  
        oLine.onmousedown = function(e) {  
        var disY = (e || event).clientY;  
        oLine.top = oLine.offsetTop;  
        document.onmousemove = function(e) {  
        var iT = oLine.top + ((e || event).clientY - disY);  
        var maxT = oBox.clientHeight - oLine.offsetHeight;  
        oLine.style.margin = 0;  
        iT < 0 && (iT = 0);  
        iT > maxT && (iT = maxT);  
        oLine.style.top = oBottom.style.top = iT + "px";  
        return false  
        };  
        document.onmouseup = function() {  
        document.onmousemove = null;  
        document.onmouseup = null;  
        oLine.releaseCapture && oLine.releaseCapture()  
        };  
        oLine.setCapture && oLine.setCapture();  
        return false  
        }; 
    },
    init() {
     
      let $ = this.GraphObject;
      let myDiagram = this.myDiagram;
      let cxElement = this.cxElement;
      //let myContextMenu = this.myContextMenu;
      let self = this;
     // var bluegrad = $(go.Brush, "Linear", { 0: "#B0E0E6", 1: "#87CEEB" });
     var bluegrad = $(go.Brush, "Linear", { 0: "#fff", 1: "#fff" });
      //
      var bigfont = "bold 13pt Helvetica, Arial, sans-serif";
      var smallfont = "bold 11pt Helvetica, Arial, sans-serif";
      // Common text样式
      function textStyle() {
        return {
          margin: 8,
          wrap: go.TextBlock.WrapFit,
          textAlign: "center",
          editable: false,
          font: smallfont
          // stroke: "#eee"
        };
      }
      myDiagram.addDiagramListener("Modified", function(e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });
      var defaultAdornment = $(
        go.Adornment,
        "Spot",
        $(
          go.Panel,
          "Auto",
          $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth:0 }),
          $(go.Placeholder)
        ),
        // the button to create a "next" node, at the top-right corner
       
      );
      myDiagram.nodeTemplateMap.add(
        "Source", //
        $(
          go.Node,
          "Auto",
         
          { selectionAdornmentTemplate: defaultAdornment },
         
          $(go.Shape, "RoundedRectangle", {
            name: "Source",
            fill: bluegrad,
            portId: "",
            //fromLinkable: true,
            fromEndSegmentLength: 20
            // cursor: "crosshair"
          },
          {stroke: "rgb(63,182,216)", strokeWidth: 2 }  //节点边框颜色
          ),
          $(
            go.Panel,
            "Table",
            //  { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 4, width: 4 }),
             $(

              go.TextBlock,
              {font:"12px",stroke:"#666"},
              { row: 1, column: 0 },
              new go.Binding("text", "operator"),
             
            ),
            $(
              go.TextBlock,
              /*"Success!"*/ "Source",
              textStyle(),
               { row: 2, column:0,  },
               { desiredSize: new go.Size(400,'auto') },
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(

              go.TextBlock,
              {font:"10px",stroke:"#ddd"},
              { row:3, column: 0 },
              new go.Binding("text", "parallelism"),
              
            ),
            $(

              go.TextBlock,
               {font:"10px",stroke:"#ddd"},
              { row:4, column: 0 },
              new go.Binding("text", "operator_strategy"),
              
            ),
           
          ),
         
        )
      );
     

    

      // replace the default Link template in the linkTemplateMap
      //连接线的样式定义
      myDiagram.linkTemplate = $(
        go.Link, // the whole link panel
        { curve: go.Link.Bezier, toShortLength: 5, selectable: false },
        new go.Binding("curviness", "curviness"),
        {
          // relinkableFrom: true,
          relinkableTo: false
        },
        $(
          go.Shape, // the link shape
          { stroke: "#333", strokeWidth: 1 }
        ),
        $(
          go.Shape, // the arrowhead
          { toArrow: "kite", fill: "#333", stroke: null, scale: 1 }
        ),
        $(go.TextBlock,new go.Binding('text', 'text'))
      );
      var palette = $(
        go.Palette,
        "myPaletteDiv", // must name or refer to the DIV HTML element
        {
          scrollsPageOnFocus: false,
          nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
          model: new go.GraphLinksModel([
            // specify the contents of the Palette
          
            { category: "Source", text: "Source" },
            
          ])
        }
      );
      this.load();
      this.layout();
    },
    load() {
      
      this.myDiagram.model = go.Model.fromJson(
        this.data /*document.getElementById("mySavedModel").value*/
      );
      // }
    },
    save() {
      // console.log(this.myDiagram.model.toJson());
      this.data = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
    },
    layout() {
      this.myDiagram.layoutDiagram(true);
    },
    makePort: function(name, spot, output, input) {
      // the port is basically just a small transparent square
      return this.GraphObject(go.Shape, "Circle", {
        fill: "transparent", // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(9, 9),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot, // declare where links may connect at this port
        fromLinkable: output,
        toLinkable: input, // declare whether the user may draw links to/from here
        cursor: "pointer" // show a different cursor to indicate potential link point
      });
    },
   },
   mounted() {
    let self = this;
    var $ = go.GraphObject.make;
    var myDiagram = $(go.Diagram, "myDiagramDiv", {
      // have mouse wheel events zoom in and out instead of scroll up and down
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      allowDrop: false, // support drag-and-drop from the Palette
      initialAutoScale: go.Diagram.Uniform,
      "linkingTool.direction": go.LinkingTool.ForwardsOnly,
      initialContentAlignment: go.Spot.Center, //go.Spot.Center, TopLeft

      layout: $(go.LayeredDigraphLayout, {
        isInitial: false,
        isOngoing: false,
        layerSpacing: 100 /*水平间距*/,
        columnSpacing: 40 /*垂直间距 */
      }),
      isReadOnly: true,//禁止节点的拖动
      "undoManager.isEnabled": true,
      maxSelectionCount: 1,
      /* */
      "draggingTool.dragsLink": false
      //"draggingTool.isGridSnapEnabled": true,
      //"linkingTool.isUnconnectedLinkValid": true,
      //"linkingTool.portGravity": 20,
      //"relinkingTool.isUnconnectedLinkValid": true,
      //"relinkingTool.portGravity": 20,
      //"relinkingTool.fromHandleArchetype":
      //  $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
      //"relinkingTool.toHandleArchetype":
      // $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
      //"linkReshapingTool.handleArchetype":
      //  $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
      /** */
    });

    this.GraphObject = $;
    this.myDiagram = myDiagram;
    this.init();
    this.drag();
    this.$on('data',data=>{
      this.data=data;
      this.load();
      this.layout();
      //console.log(data);
    })
   
  },
  beforeDestroy:function(){
    this.$off();
  }
  
 
};
</script>

<style scoped>

#box {
  position: relative;
  width: 100%;
  overflow: hidden;
}
#box #bottom,
#box #top,
#box #line {
  position: absolute;
}
#top,
#bottom {
  color: #fff;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
#bottom {
  background: #fff;
  z-index: 10;
  color: #000;
}
#line {
  z-index: 999;
  width: 100%;
  height: 4px;
  margin-top: -2px;
  background: whitesmoke;
  cursor: n-resize;
  text-align: center;
}
.topAnimation {
  transition: top 0.6s;
}
.widthAnimation {
  transition: width 0.6s;
}
/********************************************/
#Box{position:relative;height:400px;margin:10px auto;overflow:hidden;}  

#Box div{position:absolute;width:100%;}  
#Top,#Bottom{color:#ccc;height:100%;overflow:hidden;border:1px solid #ddd;}  
#Bottom{background-color:#fff;top:50%;margin-top:10px;overflow-y: auto;z-index: 99;}  
#Line{border-top:1px solid #ddd;top:50%;height:10px;
overflow:hidden;background:#fff;cursor:n-resize;
position:relative;
z-index:999;
}
#Line .svg{
  position:absolute;
  left:50%;
  top:0;
  width:300px;
}
</style>

