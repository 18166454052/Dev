<template>
<div>
  <v-header  v-on:arduinoCreate='arduinoCreate'  ref="Header" :cepDetail="detail"></v-header>
  <div id="box" :style="{height:boxHeight}"  >
    <div id="top">
      <div style="width: 100%;height:100%;overflow:hidden;border:none">
        <div id="myPaletteDiv" class="text-center" style="background: whitesmoke;width: 100px;border-right:1px solid #ccc;float:left;margin-bottom:-1000px;padding-bottom:1000px;"></div>
        <div id="myDiagramDiv" style="margin-bottom:-1000px;padding-bottom:1000px;margin-left:100px;"></div>
      </div>
    </div>
    <div id="bottom" :style="{top:bottomTop}" :class="{topAnimation:hasTopAnimation}" style="overflow-y:auto">
       <v-bottom ref="bottom" v-on:type="switchType" v-on:format="switchFormat"></v-bottom>
    </div>
    <div id="line" :style="{top:bottomTop}" :class="{topAnimation:hasTopAnimation}">
        <span><img :src="dragImg"></span>
    </div>
  </div>
	<!-- <button id="SaveButton" @click="save">Save</button>
  <button @click="load">Load</button>
  <button @click="layout">Layout</button> -->
  
  <!-- <transition name='fixed'> -->
    <div class="fixed"  id="Fixed" style="overflow:auto" :style="{width:fixWidth}" :class="{widthAnimation:hasWidthAnimation}">
        <div class="closeFixed"  id="dragLeft" style="z-index:1">
          <!-- <i class="el-icon-d-arrow-right" style="position:relative;left:-15px;top:8px"></i> -->
         <img :src="dragLeft">
        </div>
        <div class="m-t" style="z-index:2">
            <v-job v-show="type=='Job'" ref='job'
             v-on:changeName="changeNameFromForm"
             v-on:cepUpdate="cepUpdate"
             ></v-job>
            <v-source v-show="type=='Source'" ref='source' :hasStream="hasStream" 
            v-on:changeName="changeNameFromForm"
             v-on:cepUpdate="cepUpdate"
            ></v-source>
            <v-sink v-show="type=='Sink'" ref='sink' 
            v-on:changeName="changeNameFromForm"
             v-on:cepUpdate="cepUpdate"
            ></v-sink>
            <v-stream v-show="type=='Stream'" ref='stream' 
             v-on:changeName="changeNameFromForm"
             v-on:cepUpdate="cepUpdate"
            ></v-stream>
             <v-store v-show="type=='Store'" ref='store' 
             v-on:changeName="changeNameFromForm"
             :storeHasStream="storeHasStream"
             v-on:cepUpdate="cepUpdate"
            ></v-store>
            <v-alert v-show="type=='Alert'" ref='alert'
              :alertHasStream="alertHasStream"
               v-on:changeName="changeNameFromForm"
             v-on:cepUpdate="cepUpdate"
            ></v-alert>
             <v-table v-show="type=='Table'" ref='table'
               v-on:changeName="changeNameFromForm"
               v-on:cepUpdate="cepUpdate"
            ></v-table>
            <v-spc  v-show="type=='Spc'" ref='spc'
              v-on:changeName="changeNameFromForm"
              v-on:cepUpdate="cepUpdate"
            >
            </v-spc>
             <v-js  v-show="type=='Js'" ref='js'
              v-on:changeName="changeNameFromForm"
               v-on:cepUpdate="cepUpdate"
            >
            </v-js>
        </div>
    </div>
  <!-- </transition> -->
</div>
</template>

<script>
require("gojs");
import Bus from "@/utils/bus";
import dragImg from "@/img/drag_hand.png";
import dragLeft from "@/img/gesture_drag.png";
import JOB from "./components/job";
import Source from "./components/source";
import Sink from "./components/sink";
import Store from "./components/store";
import Alert from "./components/alert";
import Table from "./components/table";
import Streams from "./components/stream";
import Header from "./components/header";
import Bottom from "./components/bottom";
import Spc from "./components/spc";
import Js from "./components/js";
import {
  cepSourceCreate,
  cepSourceDelete,
  cepSourceDetail
} from "@/api/piping/source";
import { cepStreamCreate, cepStreamDelete } from "@/api/piping/stream";
import { cepUpdate, cepDetail, cepArduinoCreate } from "@/api/piping/cep";
import { cepSinkCreate, cepSinkDelete, cepSinkDetail } from "@/api/piping/sink";
import { cepJobCreate, cepJobDelete } from "@/api/piping/job";
import { cepStoreCreate, cepStoreDelete } from "@/api/piping/store";
import { cepAlertCreate, cepAlertDelete } from "@/api/piping/alert";
import { cepTableCreate, cepTableDelete } from "@/api/piping/table";
import { cepSpcCreate, cepSpcDelete } from "@/api/piping/spc";
import { cepJsCreate, cepJsDelete } from "@/api/piping/js"
import {firstBy} from "thenby";
export default {
  components: {
    "v-job": JOB,
    "v-source": Source,
    "v-sink": Sink,
    "v-stream": Streams,
    "v-header": Header,
    "v-bottom": Bottom,
    "v-store": Store,
    "v-alert": Alert,
    "v-table": Table,
    "v-spc": Spc,
    'v-js':Js
  },
  data() {
    return {
      project_id: "",
      TYPE: "type", // 'type'/'format' 判断高亮显示
      selectNode: "",
      timer: null,
      bottomOpen: "close",
      fixOpen: "close", //判断fixed是否打开
      fixWidth: "0px",
      hasWidthAnimation: true,
      hideFixFlag: true, //判断点击 node/box
      hideBottomFlag: true,
      hasTopAnimation: true,
      bottomTop: "100%",
      node: "", //当前点击的node
      dragLeft: dragLeft,
      dragImg: dragImg,
      boxHeight: " ",
      hasStream: 0,
      storeHasStream: 0,
      alertHasStream: 0,
      spcHasStream: 0,
      stream_id: "",
      source_id: "",
      sink_id: "",
      job_id: "",
      cepProgramId: "",
      type: "Job",
      showFixed: false,
      GraphObject: "",
      myDiagram: "",
      data: {},
      cxElement: "",
      //myContextMenu:'',
      showContext: false,
      left: "",
      top: "",
      program_name: "",
      detail:{
        runningStatus:0,
        deployStatus:0
      }
    };
  },
  methods: {
    init() {
      //	if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
      //var $ = go.GraphObject.make;  // for conciseness in defining templates
      let $ = this.GraphObject;
      let myDiagram = this.myDiagram;
      let cxElement = this.cxElement;
      //let myContextMenu = this.myContextMenu;
      let self = this;
      //定义左边填充的样式
      var yellowgrad = $(go.Brush, "Linear", {
        0: "rgb(254, 201, 0)",
        1: "rgb(254, 162, 0)"
      });
      var greengrad = $(go.Brush, "Linear", { 0: "#98FB98", 1: "#9ACD32" });
      var bluegrad = $(go.Brush, "Linear", { 0: "#B0E0E6", 1: "#87CEEB" });
      var redgrad = $(go.Brush, "Linear", { 0: "#C45245", 1: "#871E1B" });
      var whitegrad = $(go.Brush, "Linear", { 0: "#F0F8FF", 1: "#E6E6FA" });
      var pinkgrad = $(go.Brush, "Linear", { 0: "#FA8072", 1: "#CD5C5C" });
      var storegrad = $(go.Brush, "Linear", { 0: "#48D1CC", 1: "#20B2AA" });
      var alertgrad = $(go.Brush, "Linear", { 0: "#DDA0DD", 1: "#EE82EE" });
      var tablegrad = $(go.Brush, "Linear", { 0: "#97169F", 1: "#97169F" });
      var spcgrad = $(go.Brush, "Linear", { 0: "#FF7993", 1: "#FF7993" });
      var jsgrad = $(go.Brush, "Linear", { 0: "#BAD7C2", 1: "#BAD7C2" });
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
          font: bigfont
          // stroke: "#eee"
        };
      }
      //右键菜单
      // var myContextMenu = $(go.HTMLInfo, {
      //   show: self.showContextMenu,
      //   mainElement: cxElement
      // });

      // myDiagram.contextMenu = myContextMenu;
      // cxElement.addEventListener(
      //   "contextmenu",
      //   function(e) {
      //     e.preventDefault();
      //     return false;
      //   },
      //   false
      // );
      //node的单击事件
      myDiagram.addDiagramListener("ObjectSingleClicked", function(e) {
        console.log(e.subject.part);
        if(['Spc','Js','ML','Store'].indexOf(e.subject.part.data.category)>=0 ){
           self.bottomTop = "100%"; //底部
          self.bottomOpen = "close";
          self.hideBottomFlag = true;
            return ;
        }
        if (Object.keys(e.subject.part.data).indexOf("from") !== -1) {
          //点击连线
          self.bottomTop = "100%";
          self.hideBottomFlag = true;
        } else {
          //点击节点
          self.timer = setTimeout(function() {
            console.log("bottomClose*******************" + self.bottomOpen);
            if (self.bottomOpen == "close") {
              self.bottomTop = "60%";
              self.singleClick(e.subject.part.data);
              self.hideFixFlag = false;
              self.fixWidth = "0px";
              self.fixOpen = "close";
              self.hideBottomFlag = true;
              self.bottomOpen = "open";
            } else if (self.bottomOpen == "open") {
              self.singleClick(e.subject.part.data);
              self.hideFixFlag = false;
              self.hideBottomFlag = true;
              self.fixWidth = "0px";
              self.fixOpen = "close";
            }
          }, 400);
          self.hideFixFlag = true;
        }
        /*
        if (self.fixOpen == "close") {

          self.hideFixFlag = true;
        } else {
          self.hideFixFlag = false;
        }
        self.hideBottomFlag = false;
        */

        // self.timer = setTimeout(function() {
        //   self.bottomTop = "60%";
        //   self.singleClick(e.subject.part.data);
        //   self.hideFixFlag = true;
        // }, 400);
        // self.hideBottomFlag = false;
        /////
      });
      //node双击事件a
      myDiagram.addDiagramListener("ObjectDoubleClicked", function(e) {
        console.log("DoubleClicked");
        console.log(e.subject.part);
        console.log(e.subject.part.linksConnected.count);
        clearTimeout(self.timer);
        self.timer = null;
        self.buttomOpen == "close";
        self.bottomTop = "100%"; //底部
        self.hideBottomFlag = true;
        // if (e.subject.part.linksConnected.count == 1) {
        //   //
        //   self.hasStream = e.subject.part.linksConnected.Ac.n[0].toNode.data.id;
        //   console.log(e.subject.part.data);
        //     if(e.subject.part.data.category=='Store'){

        //          self.storeHasStream=1;
        //     }
        // } else {
        //   self.hasStream = 0;
        //   if(e.subject.part.data.category=='Store'){
        //          self.storeHasStream=0;
        //     }
        // }
        let key = e.subject.part.data.key,
          category = e.subject.part.data.category,
          flagSource = false,
          flagStore = false,
          flagSpc=false;
        let linkDataArray = JSON.parse(self.data)["linkDataArray"];
        let nodeDataArray = JSON.parse(self.data)["nodeDataArray"];
        linkDataArray.forEach(function(item) {
          if (category == "Source") {
            if (item.from == key) {
               let to = item.to;
              for (let item1 of nodeDataArray) {
                if (item1.key == to) {
                  //from---stream
                  self.hasStream = item1.id;
                  flagSource = true;
                }
              }
            }
          }
          if (category == "Store") {
            if (item.to == key) {
              //key
              //获取和Store相连的Stream 的info
            
               let  from = item.from;
              console.log(nodeDataArray);
              for (let item1 of nodeDataArray) {
                if (item1.key == from) {
                  //from---stream
                  self.storeHasStream = item1.id;
                  flagStore = true;
                }
              }
            }
          }

          if (category == "Alert") {
            if (item.to == key) {
              //key
              //获取和Store相连的Stream 的info
            
              let   from = item.from;
              console.log(nodeDataArray);
              for (let item1 of nodeDataArray) {
                if (item1.key == from) {
                  //from---stream
                  self.alertHasStream = item1.id;
                  flagStore = true;
                }
              }
            }
          }
           if (category == "Spc") {
            if (item.to == key) {
              //key
              //获取和Spc相连的Stream 的info
            
              let   from = item.from;
              for (let item1 of nodeDataArray) {
                if (item1.key == from) {
                  //from---stream
                  self.spcHasStream = item1.id;
                  flagSpc= true;
                }
              }
            }
          }
        });
        if (!flagSource) {
          self.hasStream = 0;
        }
        if (!flagStore) {
          self.storeHasStream = 0;
        }
         if (!flagSpc) {
          self.spcHasStream = 0;
        }

        self.nodeDbClick(e.subject.part.data); //自定义事件
      });
      //非节点---单击事件
      myDiagram.addDiagramListener("BackgroundSingleClicked", function() {
        console.log("BackgroundSingleClicked");
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmm");
        //  if (!self.hideBottomFlag) {
        //         self.hideBottomFlag = true;
        //   } else {
        self.bottomTop = "100%"; //底部
        self.bottomOpen = "close";
        self.hideBottomFlag = true;
        self.myDiagram.nodes.each(function(node) {
          node.highlight = 0;
        });
        if (self.selectNode) {
          self.setHighLight(self.selectNode, 0, false);
        }

        //this.selectNode=null;
        // }

        console.log("fixed-----bg");
        self.fixWidth = "0px";
        self.fixOpen = "close";
        self.hideFixFlag = true;
        console.log("*******" + self.fixWidth);
        //}
      });
      //监听连接成功事件
      myDiagram.addDiagramListener("LinkDrawn", function(e) {
        console.log("linkDrawn-------------------");
        console.log(e.subject.fromNode.position.x);
        console.log(e.subject.toNode.position.x);
        let fromPos = e.subject.fromNode.position;
        let toPos = e.subject.toNode.position;
        let from = e.subject.fromNode.data;
        let to = e.subject.toNode.data;
        let flag = true;
        // console.log(e.subject.fromNode);
        // console.log(e.subject.fromNode.linkConnected);
        // console.log(e.subject.fromNode.linksConnected.count);

        //from  to 如果已经连线，不能叠加
        let node_order = JSON.parse(self.data);
        node_order.linkDataArray.forEach(function(item) {
          if (item.from == from.key && item.to == to.key) {
            myDiagram.commandHandler.deleteSelection();
            self.save();
            self.layout();
            return;
          } else if (item.from == to.key && item.to == from.key) {
            myDiagram.commandHandler.deleteSelection();
            self.save();
            self.layout();
            return;
          }
        });

        if (to.category == "Js") {
            self.$message.warning('Js是独立的节点，不能和其他节点连接');
           myDiagram.commandHandler.deleteSelection();
           flag = false;
        }
       /*
        if(from.category == "Job"){//Job后面只能有一个节点
            node_order.linkDataArray.forEach(function(item) {
              
              if (item.from == from.key) {
                
                self.$message.warning('一个Job节点后面只能连接一个节点');
                myDiagram.commandHandler.deleteSelection();
                flag = false;
              }
            });
        }
         */
        if (from.category == "Source") {
          if (to.category !== "Stream") {
            //只能  Source-->Stream
            self.$message.warning('Source节点后面只能连接Stream节点  Source-->Stream');
            myDiagram.commandHandler.deleteSelection();
            flag = false;
            //return false;
          } else {
            //判断连接数量
            if (e.subject.fromNode.linksConnected.count > 1) {
              self.$message.warning('Source节点只能连接一个节点');
              myDiagram.commandHandler.deleteSelection();
              flag = false;
              //return false;
            }
          }
          //
        }
        if (to.category == "Sink" || to.category == "Alert") {
          if (from.category !== "Stream") {
            //只能  Stream--->Sink   Stram--->Store   Stream--->Alert
            myDiagram.commandHandler.deleteSelection();
            flag = false;
            // return false;
          }
          if (e.subject.toNode.linksConnected.count > 1) {
            myDiagram.commandHandler.deleteSelection();
            flag = false;
          }
          //
        }

        if (to.category == "Stream") {
          if (from.category == "Stream") {
            myDiagram.commandHandler.deleteSelection();
            flag = false;
            // return false;
          } else if (from.category == "Job") {
            //同一个Stream Job  会有多条重叠的连线  判断删除
            node_order.linkDataArray.forEach(function(item) {
              //  if(item.to==to.key && item.from==from.key){
              //       myDiagram.commandHandler.deleteSelection();
              //       flag = false;
              //  }
              //  else
              if (item.from == to.key && item.to == from.key) {
                myDiagram.commandHandler.deleteSelection();
                flag = false;
              }
            });
            //Job->Stream    Stream 已经有连线  判断位置
            node_order.linkDataArray.forEach(function(item1) {
              if (item1.to == to.key || item1.from == to.key) {
                //Stream已经有连线

              if (fromPos.x > toPos.x && fromPos.y == toPos.y) {
                  //stream在job左边
                  myDiagram.commandHandler.deleteSelection();
                  flag = false;
                }
              }
            });
          }
        }
        if (to.category == "Job") {
          if (from.category == "Job") {
            //不能 Job-->Job
            myDiagram.commandHandler.deleteSelection();
            flag = false;
            //return false;
          } else if (from.category == "Stream") {
            //同一个Stream Job  会有多条重叠的连线  判断删除
            node_order.linkDataArray.forEach(function(item) {
              //  if(item.to==to.key && item.from==from.key){
              //       myDiagram.commandHandler.deleteSelection();
              //       flag = false;
              //  }
              //  else
              if (item.from == to.key && item.to == from.key) {
                myDiagram.commandHandler.deleteSelection();
                flag = false;
              }
            });
            // Stream---Job
            node_order.linkDataArray.forEach(function(item1) {
              if (item1.from == to.key || item1.to == to.key) {
                //job有连线
                if (fromPos.x > toPos.x && fromPos.y == toPos.y) {
                  //job在stream左边
                  myDiagram.commandHandler.deleteSelection();
                  flag = false;
                }
              }
            });
          } else if (from.category == "Table") {
            //Job<--Table  最多有两条
            let count = 0;
            node_order.linkDataArray.forEach(function(item) {
              if ((item.from = from.key && item.to == to.key)) {
                count++;
                if (count > 2) {
                  myDiagram.commandHandler.deleteSelection();
                  flag = false;
                }
              }
            });
          }
        }

        if (to.category == "Table") {
          if (from.category !== "Job") {
            //只能 Job-->Table
            self.$message.warning('Table之前只能是Job节点 Job-->Table');
            myDiagram.commandHandler.deleteSelection();
            flag = false;
            //return false;
          }
        }

        if (to.category == "Store") {
          if (from.category !== "Table") {
            //只能 Table-->Store
            self.$message.warning('Store的唯一连接方式是 Table-->Store');
            myDiagram.commandHandler.deleteSelection();
            flag = false;
            //return false;
          } else {
            //如果 Store  已经连接  不能在连接
            let node_order = JSON.parse(self.data);
            node_order.linkDataArray.forEach(function(item) {
              if (item.to == to.key) {
                  self.$message.warning('一个Store节点只能连接一个Table节点');
                //Store  已经
                  myDiagram.commandHandler.deleteSelection();
                  flag = false;
              }
              if(item.from == from.key){ //table  只能连接一个Store
                   self.$message.warning('一个Table只能连接一个Store节点');
                  myDiagram.commandHandler.deleteSelection();
                  flag = false;
              }

            });
          }
        }
        console.log("conect");
        if (flag) {
          self.cepUpdate();
          self.save();
          self.layout();
        } else {
          flag = true;
        }
        self.save();
        self.layout();
        //  self.cepUpdate();
        //  self.save();
        // self.layout();
      });
      //监听 拖入一个新的节点
      myDiagram.addDiagramListener("ExternalObjectsDropped", function(e) {
         console.log('--------ExternalObjectsDropped-----');
        e.subject.each(function(part) {
          self.createNode(part.data);
        });
      });
      //选中一个节点的时候,根据相关规则去高亮显示其他node
      myDiagram.addDiagramListener("ChangedSelection", function() {
        console.log("ChangedSelection");
        console.log(self.selectNode);
        /*取消高亮显示*/
        let pro = null;
        if (self.selectNode) {
          pro = new Promise(function(resolve, reject) {
            self.updateHighlights(self.selectNode, 0, false);
            resolve();
          });
        }
        /** */
        if (pro) {
          pro.then(function() {
            initial();
          });
        } else {
          initial();
        }
        function initial() {
          self.TYPE = "type";
          let select = myDiagram.selection.first();

          if (select) {
            self.selectNode = Object.assign({}, select.data);
            if (select.data.category == "Source") {
              self.updateHighlights(select.data, 1, true, self.TYPE);
            } else if (select.data.category == "Sink") {
              self.updateHighlights(select.data, 1, true, self.TYPE);
            }
          } else {
            self.updateHighlights(self.selectNode, 0, true);
            //self.selectNode = null;
          }
        }
      });

      // myDiagram.addEventListener("dragend", function(event) {
      //   console.log('*********dragend***********');
      // // reset the border of the dragged element
      // event.target.style.border = "";
      //   // highlight(null);
      //  }, false);

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
          $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4 }),
          $(go.Placeholder)
        ),
        // the button to create a "next" node, at the top-right corner
        $(
          "Button",
          {
            alignment: go.Spot.BottomRight,
            click: this.deleteNode
          }, // this function is defined below
          new go.Binding("visible", "", function(a) {
            return !a.diagram.isReadOnly;
          }).ofObject(),
          $(go.Shape, "xLine", { desiredSize: new go.Size(6, 6) })
        )
      );
      function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;

        node.ports.each(function(port) {
          port.stroke = show ? "white" : null;
        });
        if (self.selectNode) {
          // console.log("mouseleave");
          // console.log(self.selectNode);
          // if (self.selectNode.category == "Source") {
          // self.setHighLight("Source", 1);
          self.setHighLight(self.selectNode, 1, true, self.TYPE);
        }
        // if(node.highlight=='1'){

        // }
      }
      function nodeStyle() {
        return [
          //new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            mouseEnter: function(e, obj) {
              showPorts(obj.part, true);
            },
            mouseLeave: function(e, obj) {
              showPorts(obj.part, false);
            }
          }
        ];
      }

      var nodeHoverAdornment = $( //鼠标移上去显示
        go.Adornment,
        "Spot",
        {
          background: "transparent",
          // hide the Adornment when the mouse leaves it
          mouseLeave: function(e, obj) {
            var ad = obj.part;
            ad.adornedPart.removeAdornment("mouseHover");
          }
        },
        $(go.Placeholder, {
          background: "transparent", // to allow this Placeholder to be "seen" by mouse events
          isActionable: true, // needed because this is in a temporary Layer
          click: function(e, obj) {
            var node = obj.part.adornedPart;
            node.diagram.select(node);
          }
        }),
        $(
          "Button",
          { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right },
          {
            click: function(e, obj) {
              alert("Hi!");
            }
          },
          $(go.TextBlock, "Hi!")
        ),
        $(
          "Button",
          { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left },
          {
            click: function(e, obj) {
              alert("Bye");
            }
          },
          $(go.TextBlock, "Bye")
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Job", //
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          // { contextMenu: myContextMenu },
          { selectionAdornmentTemplate: defaultAdornment },
          //new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            //修改现有的连接关系
            // linkConnected: function(node, link, port) {
            //    let from=link.fromNode.data;
            //     if (from.category!=='Stream') {
            //          myDiagram.commandHandler.deleteSelection();//不合法连接  删除
            //      }
            // },
            // linkDisconnected: function(node, link, port) {
            //   myDiagram.commandHandler.deleteSelection(); //不合法连接  删除
            //   self.cepUpdate();
            //   self.save();
            //   self.layout();
            // }
          },
          $(go.Shape, "RoundedRectangle", {
            name: "Job",
            fill: redgrad,
            minSize: new go.Size(87, NaN),
            portId: "",
            //fromLinkable: true,
            toLinkable: true,
            fromEndSegmentLength: 20,
            toEndSegmentLength: 20
            // cursor: "crosshair"
          }),
          $(
            go.Panel,
            "Table",
            // { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              /*"Success!"*/ "Job",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          ),
          // { // show the Adornment when a mouseHover event occurs
          //   mouseHover: function(e, obj) {
          //     var node = obj.part;
          //     nodeHoverAdornment.adornedObject = node;
          //     node.addAdornment("mouseHover", nodeHoverAdornment);
          //   }
          // },
          self.makePort("T", go.Spot.Top, true, true), //拉，连
          self.makePort("L", go.Spot.Left, true, true),
          self.makePort("R", go.Spot.Right, true, true),
          self.makePort("B", go.Spot.Bottom, true, true)
        )
      );
      myDiagram.nodeTemplateMap.add(
        "Source", //
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          { selectionAdornmentTemplate: defaultAdornment },
          // {
          //   mouseEnter:function(){
          //     console.log('mouseEnter');
          //   }
          // },
          // new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle", {
            name: "Source",
            fill: bluegrad,
            portId: "",
            //fromLinkable: true,
            fromEndSegmentLength: 20
            // cursor: "crosshair"
          }),
          $(
            go.Panel,
            "Table",
            //  { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              /*"Success!"*/ "Source",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          ),
          self.makePort("T", go.Spot.Top, true, false), //拉，连
          self.makePort("L", go.Spot.Left, true, false),
          self.makePort("R", go.Spot.Right, true, false),
          self.makePort("B", go.Spot.Bottom, true, false)
        )
      );
      myDiagram.nodeTemplateMap.add(
        "Sink", //只能被连接  不能拉出线
        $(
          go.Node,
          "Auto",
          { selectionAdornmentTemplate: defaultAdornment },
          {
            //修改现有的连接关系
            linkDisconnected: function(node, link, port) {
              myDiagram.commandHandler.deleteSelection(); //不合法连接  删除
              self.cepUpdate();
              self.save();
              self.layout();
            }
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          $(go.Shape, "RoundedRectangle", {
            name: "Sink",
            fill: greengrad,
            minSize: new go.Size(87, NaN),
            portId: "",
            toLinkable: true,
            toEndSegmentLength: 20
          }),
          $(
            go.Panel,
            "Table",
            // { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              "Sink",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "name",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          )
        )
      );
      myDiagram.nodeTemplateMap.add(
        "Stream", //只能被连接  不能拉出线
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          { selectionAdornmentTemplate: defaultAdornment },
          {
            //修改现有的连接关系
            // linkConnected: function(node, link, port) {
            //    let from=link.fromNode.data;
            //     if (from.category=='Stream') {
            //          myDiagram.commandHandler.deleteSelection();//不合法连接  删除
            //      }
            // },
            linkDisconnected: function(node, link, port) {
              myDiagram.commandHandler.deleteSelection(); //不合法连接  删除
              self.cepUpdate();
              self.save();
              self.layout();
            }
          },

          //new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle", {
            name: "Stream",
            fill: yellowgrad,
            portId: "",
            toLinkable: true,
            // fromLinkable: true,
            toEndSegmentLength: 20,
            fromEndSegmentLength: 20
            //cursor: "crosshair"
          }),
          $(
            go.Panel,
            "Table",
            // { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              "Stream",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "name",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          ),
          self.makePort("T", go.Spot.Top, true, true), //拉，连
          self.makePort("L", go.Spot.Left, true, true),
          self.makePort("R", go.Spot.Right, true, true),
          self.makePort("B", go.Spot.Bottom, true, true)
        )
      );
      myDiagram.nodeTemplateMap.add(
        "ML", //机器学习
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          { selectionAdornmentTemplate: defaultAdornment },
          {
            //修改现有的连接关系
            // linkConnected: function(node, link, port) {
            //    let from=link.fromNode.data;
            //     if (from.category=='Stream') {
            //          myDiagram.commandHandler.deleteSelection();//不合法连接  删除
            //      }
            // },
            linkDisconnected: function(node, link, port) {
              myDiagram.commandHandler.deleteSelection(); //不合法连接  删除
              self.cepUpdate();
              self.save();
              self.layout();
            }
          },

          //new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle", {
            name: "ML",
            fill: pinkgrad, //yellowgrad,
            minSize: new go.Size(87, NaN),
            portId: "",
            toLinkable: true,
            //fromLinkable: true,
            toEndSegmentLength: 20,
            fromEndSegmentLength: 20
            //cursor: "crosshair"
          }),
          $(
            go.Panel,
            "Table",
            // { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              "机器学习",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "name",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          ),
          self.makePort("T", go.Spot.Top, true, true), //拉，连
          self.makePort("L", go.Spot.Left, true, true),
          self.makePort("R", go.Spot.Right, true, true),
          self.makePort("B", go.Spot.Bottom, true, true)
        )
      );
      myDiagram.nodeTemplateMap.add(
        "Store", //存储
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          { selectionAdornmentTemplate: defaultAdornment },
          {
            //修改现有的连接关系
            // linkConnected: function(node, link, port) {
            //    let from=link.fromNode.data;
            //     if (from.category=='Stream') {
            //          myDiagram.commandHandler.deleteSelection();//不合法连接  删除
            //      }
            // },
            linkDisconnected: function(node, link, port) {
              console.log("linkDisconnected------store");
              self.storeHasStream = 0;
              myDiagram.commandHandler.deleteSelection(); //不合法连接  删除
              self.cepUpdate();
              self.save();
              self.layout();
              console.log(self.data);
              // self.load();
              // self.layout();
              // self.save();
              // self.cepUpdate();
            }
          },

          //new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle", {
            name: "Store",
            fill: storegrad,
            minSize: new go.Size(87, NaN),
            portId: "",
            toLinkable: true,
            //fromLinkable: true,
            toEndSegmentLength: 20,
            fromEndSegmentLength: 20
            //cursor: "crosshair"
          }),
          $(
            go.Panel,
            "Table",
            // { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              "Store",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "name",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          )
          // self.makePort("T", go.Spot.Top, true, true), //拉，连
          // self.makePort("L", go.Spot.Left, true, true),
          // self.makePort("R", go.Spot.Right, true, true),
          // self.makePort("B", go.Spot.Bottom, true, true)
        )
      );
      myDiagram.nodeTemplateMap.add(
        "Table", //
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          { selectionAdornmentTemplate: defaultAdornment },
          {
            //修改现有的连接关系
            // linkConnected: function(node, link, port) {
            //    let from=link.fromNode.data;
            //     if (from.category=='Stream') {
            //          myDiagram.commandHandler.deleteSelection();//不合法连接  删除
            //      }
            // },
            linkDisconnected: function(node, link, port) {
              self.storeHasStream = 0;
              myDiagram.commandHandler.deleteSelection(); //不合法连接  删除
              self.cepUpdate();
              self.save();
              self.layout();
              console.log(self.data);
              // self.load();
              // self.layout();
              // self.save();
              // self.cepUpdate();
            }
          },

          //new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle", {
            name: "Table",
            fill: tablegrad,
            minSize: new go.Size(87, NaN),
            portId: "",
            toLinkable: true,
            //fromLinkable: true,
            toEndSegmentLength: 20,
            fromEndSegmentLength: 20
            //cursor: "crosshair"
          }),
          $(
            go.Panel,
            "Table",
            // { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              "Table",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "name",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          ),
          self.makePort("T", go.Spot.Top, true, true), //拉，连
          self.makePort("L", go.Spot.Left, true, true),
          self.makePort("R", go.Spot.Right, true, true),
          self.makePort("B", go.Spot.Bottom, true, true)
        )
      );
      myDiagram.nodeTemplateMap.add(
        "Spc", //存储
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          { selectionAdornmentTemplate: defaultAdornment },
          {
            //修改现有的连接关系
            // linkConnected: function(node, link, port) {
            //    let from=link.fromNode.data;
            //     if (from.category=='Stream') {
            //          myDiagram.commandHandler.deleteSelection();//不合法连接  删除
            //      }
            // },
            linkDisconnected: function(node, link, port) {
              console.log("linkDisconnected------store");
              self.storeHasStream = 0;
              myDiagram.commandHandler.deleteSelection(); //不合法连接  删除
              self.cepUpdate();
              self.save();
              self.layout();
              console.log(self.data);
              // self.load();
              // self.layout();
              // self.save();
              // self.cepUpdate();
            }
          },

          //new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle", {
            name: "SPC",
            fill: spcgrad,
            minSize: new go.Size(87, NaN),
            portId: "",
            toLinkable: true,
            //fromLinkable: true,
            toEndSegmentLength: 20,
            fromEndSegmentLength: 20
            //cursor: "crosshair"
          }),
          $(
            go.Panel,
            "Table",
            // { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              "SPC",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "name",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          )
          // self.makePort("T", go.Spot.Top, true, true), //拉，连
          // self.makePort("L", go.Spot.Left, true, true),
          // self.makePort("R", go.Spot.Right, true, true),
          // self.makePort("B", go.Spot.Bottom, true, true)
        )
      );
      myDiagram.nodeTemplateMap.add(
        "Js", //存储
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          { selectionAdornmentTemplate: defaultAdornment },
          {
            //修改现有的连接关系
            // linkConnected: function(node, link, port) {
            //    let from=link.fromNode.data;
            //     if (from.category=='Stream') {
            //          myDiagram.commandHandler.deleteSelection();//不合法连接  删除
            //      }
            // },
            linkDisconnected: function(node, link, port) {
             
              myDiagram.commandHandler.deleteSelection(); //不合法连接  删除
              self.cepUpdate();
              self.save();
              self.layout();
              // self.load();
              // self.layout();
              // self.save();
              // self.cepUpdate();
            }
          },

          //new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle", {
            name: "JS",
            fill: jsgrad,
            minSize: new go.Size(87, NaN),
            portId: "",
            toLinkable: true,
            //fromLinkable: true,
            toEndSegmentLength: 20,
            fromEndSegmentLength: 20
            //cursor: "crosshair"
          }),
          $(
            go.Panel,
            "Table",
            // { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.RowColumnDefinition, { column: 1, width: 4 }),
            $(
              go.TextBlock,
              "JS",
              textStyle(),
              new go.Binding("text", "text").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "name",
              { row: 1, column: 0 },
              new go.Binding("text", "NAME"),
              new go.Binding("visible", "", function(a) {
                return !a.diagram.isReadOnly;
              }).ofObject()
            )
          )
          // self.makePort("T", go.Spot.Top, true, true), //拉，连
          // self.makePort("L", go.Spot.Left, true, true),
          // self.makePort("R", go.Spot.Right, true, true),
          // self.makePort("B", go.Spot.Bottom, true, true)
        )
      );

      // clicking the button on an UndesiredEvent node inserts a new text object into the panel
      //节点鼠标右键事件
      //myDiagram.nodeTemplate.contextMenu =
      // $(go.Adornment, "Vertical",
      // 	$("ContextMenuButton",
      //     $(go.TextBlock, "123456789"),
      //     {
      //       click: function(e, obj) {
      //         // remove the whole subtree, including the node itself
      //         // var node = obj.part.adornedPart;
      //         // if (node !== null) {
      //         //   myDiagram.startTransaction("remove dept");
      //         //   myDiagram.removeParts(node.findTreeParts());
      //         //   myDiagram.commitTransaction("remove dept");
      //         // }
      //       }
      //     }
      // 	)
      //);

      // replace the default Link template in the linkTemplateMap
      //连接线的样式定义
      myDiagram.linkTemplate = $(
        go.Link, // the whole link panel
        { curve: go.Link.Bezier, toShortLength: 15, selectable: true },
        new go.Binding("curviness", "curviness"),
        {
          // relinkableFrom: true,
          relinkableTo: true
        },
        $(
          go.Shape, // the link shape
          { stroke: "#2F4F4F", strokeWidth: 2 }
        ),
        $(
          go.Shape, // the arrowhead
          { toArrow: "kite", fill: "#2F4F4F", stroke: null, scale: 2 }
        )
      );
      var palette = $(
        go.Palette,
        "myPaletteDiv", // must name or refer to the DIV HTML element
        {
          scrollsPageOnFocus: false,
          nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
          model: new go.GraphLinksModel([
            // specify the contents of the Palette
            { category: "Stream", text: "Stream" },
            { category: "Source", text: "Source" },
            { category: "Sink", text: "Sink" },
            { category: "Job", text: "Job" },
            //{ category: "ML", text: "ML" },
            { category: "Store", text: "Store" },
            { category: "Table", text: "Table" },
            //{ category: "Spc", text: "Spc" },
            { category: "Js", text: "Js" }
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
    addNodeAndLink(e, obj) {
      //自身添加下一个节点
      var adorn = obj.part;
      if (adorn === null) return;
      e.handled = true;
      var diagram = adorn.diagram;
      diagram.startTransaction("Add State");
      // get the node data for which the user clicked the button
      var fromNode = adorn.adornedPart;
      var fromData = fromNode.data;
      // create a new "State" data object, positioned off to the right of the adorned Node
      var toData = { text: "new" };
      var p = fromNode.location;
      toData.loc = p.x + 200 + " " + p.y; // the "loc" property is a string, not a Point object
      // add the new node data to the model
      var model = diagram.model;
      model.addNodeData(toData);
      // create a link data from the old node data to the new node data
      var linkdata = {};
      linkdata[model.linkFromKeyProperty] = model.getKeyForNodeData(fromData);
      linkdata[model.linkToKeyProperty] = model.getKeyForNodeData(toData);
      // and add the link data to the model
      model.addLinkData(linkdata);
      // select the new Node
      var newnode = diagram.findNodeForData(toData);
      diagram.select(newnode);
      diagram.commitTransaction("Add State");
    },
    deleteNode: function(e, obj) {//从数据库删除一个节点
      let self = this;
      self.hideBottomFlag = true;
      let info = obj.part.adornedPart.data;
      var node = obj.part.adornedPart;
      if (node !== null) {
        // this.myDiagram.startTransaction("remove dept");
        // this.myDiagram.removeParts(node.findTreeParts());
        // this.myDiagram.commitTransaction("remove dept");
        this.myDiagram.commandHandler.deleteSelection();
        if (info.category == "Source") {
          let data = {};
          data.cepSourceId = info.id;
          cepSourceDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
        if (info.category == "Stream") {
          let data = {};
          data.cepStreamId = info.id;
          cepStreamDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
        if (info.category == "Sink") {
          let data = {};
          data.cepSinkId = info.id;
          cepSinkDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
        if (info.category == "Job") {
          let data = {};
          data.cepJobId = info.id;
          cepJobDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
        if (info.category == "Store") {
          let data = {};
          data.cepStoreId = info.id;
          cepStoreDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
        if (info.category == "Alert") {
          let data = {};
          data.cepAlertId = info.id;
          cepAlertDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
        if (info.category == "Table") {
          let data = {};
          data.cepTableId = info.id;
          cepTableDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
        if (info.category == "Spc") {
          let data = {};
          data.cepSpcId = info.id;
          cepSpcDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
          if (info.category == "Js") {
          let data = {};
          data.cepJsId = info.id;
          cepJsDelete(data).then(function(res) {
            if (res.code == 200) {
              self.$message({
                message: res.message,
                type: "success"
              });
              //提交 node_order
              self.cepUpdate();
              self.layout();
            } else {
              self.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
      }
    },
    deleteNodeFromNodeOrder:function(){ 
      // 数据库创建节点失败,从 node_order 中删除已经存在但是数据库中不存在的节点
      // 只存在本地的关系中
      let nodeDataArray = JSON.parse(this.data)["nodeDataArray"];
      // 失败的节点没有id
      let filterNode=[];
      filterNode=nodeDataArray.filter(item=>item.id);
      //更新数据
      JSON.parse(this.data)["nodeDataArray"]=filterNode;
      
      

    },
    nodeDbClick: function(info) {
      //显示表单
      console.log("nodeDbclick***************");
      console.log(info);
      console.log(this.fixOpen);
      let self = this;
      self.node = info;
      self.hideFixFlag = false; //node

      if (info.category == "Store") {
        if (self.storeHasStream == 0 ) {
          if (self.fixOpen == "open") {
            self.fixWidth = "0px";
            self.fixOpen = "close";
          }
           self.$message.warning("请先创建一个该Store和Table的连接  Table->Store");
          
          return;
        } else {
          self.fixOpen = "open";
          self.fixWidth = "500px";
        }
      } 
      else  if (info.category == "Spc") {
        if (self.spcHasStream == 0 ) {
          if (self.fixOpen == "open") {
            self.fixWidth = "0px";
            self.fixOpen = "close";
          }
           self.$message.warning("请先创建一个该Spc和Stream的连接  Stream->Spc");
          
          return;
        } else {
          self.fixOpen = "open";
          self.fixWidth = "500px";
        }
      } 
      else {
        self.fixOpen = "open";
        self.fixWidth = "500px";
      }
      /*
      if(info.category=='Alert'){
          if(self.alertHasStream==0){
              if (self.fixOpen == "open") {
                  self.fixWidth = "0px";
                  self.fixOpen = "close";
              }
            self.$message({
                  message:'请先创建一个该Alert和Stream的连接',
                  type:'error'
            });
            return ;
          }
          else{
              self.fixOpen = "open";
              self.fixWidth = "500px";
          }

      }
     else{
           self.fixOpen = "open";
           self.fixWidth = "500px";
     }*/
      // self.changeWidth();
      if (info.category) {
        this.type = info.category;
        console.log(info);
        let category = info.category;
        if (info.category == "Source") {
          self.$refs.source.$emit("source", {
            source: info.id,
            stream: self.hasStream
          });
        } else if (info.category == "Store") {
          console.log(self.storeHasStream);
          self.$refs.store.$emit("store", {
            storeId: info.id,
            streamId: self.storeHasStream
          });
        } else if (info.category == "Alert") {
          console.log("Alert****************");
          console.log(self.alertHasStream);
          self.$refs.alert.$emit("alert", {
            alertId: info.id,
            streamId: self.alertHasStream
          });
        }else if (info.category == "Spc") {
          console.log(self.storeHasStream);
          self.$refs.spc.$emit("spc", {
            spcId: info.id,
            streamId: self.spcHasStream
          });
        }  else { //Table  js
          //  else if(info.category == "Table"){
          //   console.log('table****************');
          //     self.$refs.alert.$emit("table", {
          //       tableId: info.id,
          //       streamId: self.alertHasStream
          //   });
          // }
          console.log("222222222");
          Emit(category);//
        }
        function Emit(category) {
          console.log(category);
          self.$refs[category.toLowerCase()].$emit(
            category.toLowerCase(),
            info.id
          );
        }
      }
    },
    changeNodeName: function(node, name) {
      this.myDiagram.model.startTransaction("increment");
      // get the first node data
      this.myDiagram.model.setDataProperty(node, "NAME", name);
      this.myDiagram.model.commitTransaction("increment");
    },
    showSmallPorts: function(node, show) {
      node.ports.each(function(port) {
        if (port.portId !== "") {
          // don't change the default port, which is the big shape
          port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
      });
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
    createNode: function(info) {
      // console.log(data);
      let data = {},
        self = this;
      // 获取当前项目下的不同分类的数量，实现 Store1/Store2的命名
     
      let nodeDataArray = JSON.parse(self.data)["nodeDataArray"],
        num = 0,
        arr = [];  
       
      nodeDataArray.forEach(function(item) {
        if (item.category == info.category) {
          arr.push(item);
        }
      });
      if(arr.length==0){ // 
        num=1;
      }
      else{
        let newArr=arr.sort(
              firstBy(function (v1) { return v1.id})
           ).slice(-1)   // 获取最后一个查看编号
           
        num = Number(newArr[0].NAME.slice(info.category.length))+1;
      }
      data["cep" + info.category + "Name"] = info.category + num;
      data.cepProgramId = self.cepProgramId;
      if (info.category == "Source") {
        cepSourceCreate(data).then(function(res) {
         
          if (res.code == 200) {
            self.$message.success(res.message);
            info.id = res.data.cepSourceId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepSourceName);
            self.cepUpdate();
          } else {
            self.deleteNodeFromNodeOrder();
            self.$message.error(res.message);
          }
        });
      }
      if (info.category == "Stream") {
        cepStreamCreate(data).then(function(res) {
           console.log(res);
          if (res.code == 200) {
            self.$message.success(res.message);
            info.id = res.data.cepStreamId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepStreamName);
            self.cepUpdate();
          } else {
            self.deleteNodeFromNodeOrder();
            self.$message.error(res.message);
          }
        });
      }
      if (info.category == "Sink") {
        cepSinkCreate(data).then(function(res) {
          if (res.code == 200) {
           self.$message.success(res.message);
            // console.log(res);
            info.id = res.data.cepSinkId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepSinkName);
            self.cepUpdate();
          } else {
            self.deleteNodeFromNodeOrder();
            self.$message.error(res.message);
          }
        });
      }
      if (info.category == "Job") {
        cepJobCreate(data).then(function(res) {
          if (res.code == 200) {
            // console.log(res);
           self.$message.success(res.message);
            info.id = res.data.cepJobId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepJobName);
            self.cepUpdate();
          } else {
            self.deleteNodeFromNodeOrder();
            self.$message.error(res.message);
          }
        });
      }
      if (info.category == "Store") {
        cepStoreCreate(data).then(function(res) {
          if (res.code == 200) {
            self.$message.success(res.message);
            console.log("****create store*****");
            console.log(res);
            info.id = res.data.cepStoreId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepStoreName);
            self.cepUpdate();
          } else {
            self.deleteNodeFromNodeOrder();
           self.$message.error(res.message);
          }
        });
      }
      if (info.category == "Alert") {
        cepAlertCreate(data).then(function(res) {
          if (res.code == 200) {
           self.$message.success(res.message);
            console.log(res);
            info.id = res.data.cepAlertId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepAlertName);
            self.cepUpdate();
          } else {
            self.deleteNodeFromNodeOrder();
           self.$message.error(res.message);
          }
        });
      }
      if (info.category == "Table") {
        cepTableCreate(data).then(function(res) {
          if (res.code == 200) {
           self.$message.success(res.message);
            console.log(res);
            info.id = res.data.cepTableId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepTableName);
            self.cepUpdate();
          } else {
            self.deleteNodeFromNodeOrder();
            self.$message.error(res.message);
          }
        });
      }
      if (info.category == "Spc") {
        cepSpcCreate(data).then(function(res) {
          if (res.code == 200) {
           
            self.$message.success(res.message);
            console.log(res);
            info.id = res.data.cepSpcId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepSpcName);
            self.cepUpdate();
           
          } else {
            self.deleteNodeFromNodeOrder();
            self.$message.error(res.message);
          }
        });
      }
       if (info.category == "Js") {
        cepJsCreate(data).then(function(res) {
          if (res.code == 200) {
            // console.log(res);
           self.$message.success(res.message);
            info.id = res.data.cepJsId;
            //info.key=info.category + res.data.cepSourceId;
            self.changeNodeName(info, res.data.cepJsName);
            self.cepUpdate();
          } else {
            self.deleteNodeFromNodeOrder();
            self.$message.error(res.message);
          }
        });
      }
    },
    // getNodeName:function(){//source1---source2

    // },
    cepUpdate: function() {
      let data = {},
        self = this;
      data.cepProgramId = self.cepProgramId;
      data.nodeOrder = self.myDiagram.model.toJson();
      cepUpdate(data).then(function(res) {
        if (res.code !== 200) {
          self.$message.error(res.message);
        } else {
          self.save();
        }
      });
    },
    cepDetail: function(obj) {
      let data = {},
      self = this;
      data.cepProgramId = self.cepProgramId;
      cepDetail(data).then(function(res) {
        if (res.code == 200) {
          self.detail=res.data;
          if (res.data.nodeOrder) {
            let data=JSON.parse(res.data.nodeOrder);
            // let index=self.getEmptyNodeIndex(data.nodeDataArray);
            // if(index!==-1){
            //   data.nodeDataArray.splice(index,1);
            // }
            self.data =JSON.stringify(data);
          } else {
            self.data =
              '{"class": "go.GraphLinksModel","nodeDataArray":[],"linkDataArray":[]}';
          }
          if (obj) {
            //    if(!res.data){
            //       self.data={"class":"go.GraphLinksModel","nodeDataArray":[],"linkDataArray":[]};
            //     }
            //  else{

            //    }
            console.log(obj);
            // if(!res.data){
            //   self.data={"class": "go.GraphLinksModel","nodeDataArray":[],"linkDataArray":[]};
            // }
            // else{
            //   self.data=res.data;
            // }
            self.data = JSON.parse(self.data);
            let str = obj.streamAndClumn,
              sou = obj.sourceAndHttp,
              stream = {
                category: "Stream",
                text: "Stream",
                key: str.cepStreamId + "s",
                id: str.cepStreamId,
                NAME: str.cepStreamName
              },
              source = {
                category: "Source",
                text: "Source",
                key: sou.cepSourceId + "o",
                id: sou.cepSourceId,
                NAME: sou.cepSourceName
              };

            self.data.nodeDataArray.push(stream);
            self.data.nodeDataArray.push(source);
            self.data.linkDataArray.push({
              from: sou.cepSourceId + "o",
              to: str.cepStreamId + "s"
            });
            self.load();
            self.layout();
            self.save();
            self.cepUpdate();
            self.$refs.Header.$emit("showDeviceList");
          } else {
            self.init();
          }
        } else {
          self.$message.error(res.message);
        }
      });
    },
    showContextMenu: function(obj, diagram, tool) {
      // Show only the relevant buttons given the current state.
      var cmd = diagram.commandHandler;
      //document.getElementById("delete").style.display = cmd.canDeleteSelection() ? "block" : "none";

      // Now show the whole context menu element
      this.showContext = true;
      // we don't bother overriding positionContextMenu, we just do it here:
      var mousePt = diagram.lastInput.viewPoint;
      this.left = mousePt.x + "px";
      this.top = mousePt.y + "px";
    },
    cxcommand: function(event, val) {
      if (val === undefined) val = event.currentTarget.id;
      var diagram = this.myDiagram;
      switch (val) {
        case "delete":
          diagram.commandHandler.deleteSelection();
          break;
      }
      diagram.currentTool.stopTool();
    },
    changeHeight: function() {
      function $(id) {
        return document.getElementById(id);
      }
      let self = this;
      let winHeight = self.ClientHeight();
      self.boxHeight = winHeight -47 + "px";
      /*** */
      var oBox = $("box"),
        oBottom = $("bottom"),
        oLine = $("line");
      oLine.onmousedown = function(e) {
        self.hasTopAnimation = false;
        var disY = (e || event).clientY;
        oLine.top = oLine.offsetTop;
        document.onmousemove = function(e) {
          var iT = oLine.top + ((e || event).clientY - disY);
          var maxT = oBox.clientHeight - oLine.offsetHeight;
          oLine.style.margin = 0;
          iT < 0 && (iT = 0);
          iT > maxT && (iT = maxT);
          oLine.style.top = oBottom.style.top = iT + "px";
          return false;
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
          self.hasTopAnimation = true;
          self.bottomTop = oBottom.style.top / (winHeight - 120) * 100 + "%";
          oLine.releaseCapture && oLine.releaseCapture();
        };
        oLine.setCapture && oLine.setCapture();
        return false;
      };
      ///////touch
       oLine.ontouchstart = function(e) {
        self.hasTopAnimation = false;
        var disY = (e || event).clientY;
        oLine.top = oLine.offsetTop;
        document.ontouchmove = function(e) {
          var iT = oLine.top + ((e || event).clientY - disY);
          var maxT = oBox.clientHeight - oLine.offsetHeight;
          oLine.style.margin = 0;
          iT < 0 && (iT = 0);
          iT > maxT && (iT = maxT);
          oLine.style.top = oBottom.style.top = iT + "px";
          return false;
        };
        document.ontouchend = function() {
          document.onmousemove = null;
          document.onmouseup = null;
          self.hasTopAnimation = true;
          self.bottomTop = oBottom.style.top / (winHeight - 120) * 100 + "%";
          oLine.releaseCapture && oLine.releaseCapture();
        };
        oLine.setCapture && oLine.setCapture();
        return false;
      };
    },
    changeWidth: function() {
      function $(id) {
        return document.getElementById(id);
      }
      let self = this;
      var oBox = $("Fixed");
      var Icon = $("dragLeft");
      var b = "left"; //声明两个空变量a，b；
      var a = "";
      var winWidth = self.clientWidth();
      Icon.onmousedown = function(ev) {
        self.hasWidthAnimation = false;
        var iEvent = ev || event;
        var dx = iEvent.clientX; //当你第一次单击的时候，存储x轴的坐标。
        var dy = iEvent.clientY; //当你第一次单击的时候，储存Y轴的坐标。
        var dw = oBox.offsetWidth; //存储默认的div的宽度。
        var dh = oBox.offsetHeight; //存储默认的div的高度。
        var disright = oBox.offsetLeft + oBox.offsetWidth; //存储默认div右边距离屏幕左边的距离。
        var distop = oBox.offsetHeight + oBox.offsetTop; //存储默认div上边距离屏幕左边的距离。
        document.onmousemove = function(ev) {
          var iEvent = ev || event;
          if (b == "left") {
            // Icon.style.left=disright+oBox.offsetWidth+'px';
            oBox.style.width = dw - (iEvent.clientX - dx) + "px"; //iEvent.clientX-dx表示第二次鼠标的X坐标减去第一次鼠标的X坐标，得到绿色移动的距离（为负数），再加上原本的div宽度，就得到新的宽度。 图3
            if (oBox.offsetWidth <= 10) {
              oBox.style.width = "10px";
              oBox.style.left = disright - oBox.offsetWidth + "px"; //防止抖动
            }
          }
          return false;
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
          self.fixWidth = dw - (iEvent.clientX - dx) + "px";
          // self.fixLeft=disright-oBox.offsetWidth+'px';
          self.hasWidthAnimation = true;
          Icon.releaseCapture && Icon.releaseCapture();
        };
        Icon.setCapture && Icon.setCapture();
        return false;
      };
    },
    ClientHeight: function() {
      let winHeight;
      /*获取窗口高度 */
      if (window.innerHeight) winHeight = window.innerHeight;
      else if (document.body && document.body.clientHeight)
        winHeight = document.body.clientHeight;
      //通过深入Document内部对body进行检测，获取窗口大小
      if (document.documentElement && document.documentElement.clientHeight) {
        winHeight = document.documentElement.clientHeight;
      }
      return winHeight;
    },
    clientWidth: function() {
      let winWidth;
      /*获取窗口宽度 */
      if (window.innerWidth) winWidth = window.innerWidth;
      else if (document.body && document.body.clientWidth)
        winWidth = document.body.clientWidth;
      //通过深入Document内部对body进行检测，获取窗口大小
      if (document.documentElement && document.documentElement.clientWidth) {
        winWidth = document.documentElement.clientWidth;
      }
      return winWidth;
    },
    changeNameFromForm: function(name) {
      this.changeNodeName(this.node, name);
    },
    // hideBottom: function() {
    //   //console.log('****hideBottom*********');
    //   if (!this.hideBottomFlag) {
    //     //点击node
    //     this.hideBottomFlag = true;
    //   } else {
    //     this.bottomTop = "100%"; //底部
    //     this.bottomOpen='close'
    //     this.myDiagram.nodes.each(function(node) {
    //       node.highlight = 0;

    //     });

    //     if(this.selectNode){
    //        this.setHighLight(this.selectNode,0,false);
    //     }

    //     //this.selectNode=null;
    //   }
    //     console.log('*-*-*-*-*-*-*-*-'+this.hideFixFlag )
    //   if (!this.hideFixFlag) {
    //     //点击node
    //      this.hideFixFlag = true;
    //   }
    //   else {
    //     console.log('*-*-*-*-*-*-*-*-')
    //     this.fixWidth = "0px";
    //     this.fixOpen = "close";
    //   }
    // },
    updateHighlights: function(NODE, x, cancel, type) {
      this.myDiagram.nodes.each(function(node) {
        node.highlight = 0;
      });
      this.myDiagram.links.each(function(link) {
        link.highlight = 0;
      });
      this.setHighLight(NODE, x, cancel, type);
    },
    // nodesTo:function(x, i) {
    //   var nodesToList = new go.List("string");
    //       console.log('nodesToList');
    //         console.log(nodesToList);
    //   if (x instanceof go.Link) {
    //     x.fromNode.highlight = i;
    //     nodesToList.add(x.data.from);
    //   } else {
    //     x.findNodesInto().each(function(node) {
    //       node.highlight = i;
    //       console.log(node);
    //       nodesToList.add(node.data.key);
    //     });
    //   }
    //   return nodesToList;
    // },
    setHighLight: function(NODE, x, cancel, type) {
      let self = this;
      if (NODE.category == "Source") {
        //获取所有连接在同一个Stream上的Source
        // console.log('*****************************');
        var fromKey = NODE.key; //点击的node key
        var tokey = ""; //连接的stream key (source/job)
        var keyArr = [];
        // console.log(NODE);
        if (self.data) {
          let data = JSON.parse(self.data);
          if (data.linkDataArray.length > 0) {
            //(data.linkDataArray);
            data.linkDataArray.forEach(function(item) {
              if (item.from == fromKey) {
                tokey = item.to;
              }
            });
            if (tokey.toString().length > 0) {
              console.log(data.linkDataArray);
              data.linkDataArray.forEach(function(item1) {
                if (tokey == item1.to && item1.from !== fromKey) {
                  keyArr.push(item1.from);
                }
              });
            }
          }
          // console.log('keyArr');
          //    console.log(keyArr);
          //data.linkDataArray.length>0
          if (keyArr.length > 0) {
            cepSourceDetail({
              cepSourceId: NODE.id
            }).then(function(res) {
              if (res.code == 0) {
                if (type == "type") {
                  // http  mqtt
                  console.log("************type*******************");

                  if (res.data.cepSourceType) {
                    self.myDiagram.nodes.each(function(node, index) {
                      if (
                        node.data.category == NODE.category &&
                        keyArr.indexOf(node.data.key, 0) !== -1
                      ) {
                        console.log(node.data);
                        var shp = node.findObject(NODE.category);
                        cepSourceDetail({ cepSourceId: node.data.id }).then(
                          function(response) {
                            if (response.code == 200) {
                              if (
                                res.data.cepSourceType ==
                                response.data.cepSourceType
                              ) {
                                var hl = (node.highlight = x);
                                self.highlight(shp, hl);
                              }
                            }
                          }
                        );
                      }
                    });
                  }
                } else if (type == "format") {
                  console.log("************format*******************");
                  console.log(res.data);
                  // text
                  if (res.data.message_format) {
                    self.myDiagram.nodes.each(function(node, index) {
                      if (
                        node.data.category == NODE.category &&
                        keyArr.indexOf(node.data.key, 0) !== -1
                      ) {
                        var shp = node.findObject(NODE.category);
                        cepSourceDetail({ cepSourceId: node.data.id }).then(
                          function(response) {
                            if (response.code == 200) {
                              if (
                                response.data.cepSourceType ==
                                res.data.cepSourceType
                              ) {
                                console.log("sam type");
                                if (
                                  res.data.message_format ==
                                  response.data.message_format
                                ) {
                                  var hl = (node.highlight = x);
                                  self.highlight(shp, hl);
                                }
                              } else {
                                var hl = (node.highlight = 0);
                                self.highlight(shp, hl);
                              }
                            }
                          }
                        );
                      }
                    });
                  }
                } else {
                  //取消高亮显示效果
                  console.log("取消高亮显示");
                  self.myDiagram.nodes.each(function(node, index) {
                    if (
                      node.data.category == NODE.category &&
                      keyArr.indexOf(node.data.key, 0) !== -1
                    ) {
                      var shp = node.findObject(NODE.category);
                      var hl = (node.highlight = x);
                      self.highlight(shp, hl);
                    }
                    if (cancel) {
                      self.selectNode = null;
                    }
                  });
                }
              }
            });
          }
        }
        /* */
      } else if (NODE.category == "Sink") {
        var toKey1 = NODE.key; //sink
        var fromKey1 = ""; // 与sink相连的stream
        var keyArr1 = []; //连接同一个stream的所有sink
        let self = this;
        if (self.data) {
          let data = JSON.parse(self.data);
          if (data.linkDataArray.length > 0) {
            //(data.linkDataArray);
            data.linkDataArray.forEach(function(item) {
              if (item.to == toKey1) {
                fromKey1 = item.from;
              }
            });
            if (fromKey1.toString().length > 0) {
              data.linkDataArray.forEach(function(item1) {
                if (item1.from == fromKey1 && item1.to !== toKey1) {
                  keyArr1.push(item1.to);
                }
              });
            }
          }
          console.log("sink---keyArr");
          console.log(keyArr1);
          if (keyArr1.length > 0) {
            cepSinkDetail({
              cepSinkId: NODE.id
            }).then(function(res) {
              if (res.code == 0) {
                if (type == "type") {
                  // http  mqtt
                  console.log("************type-sink*******************");

                  if (res.data.cep_sink_type) {
                    self.myDiagram.nodes.each(function(node, index) {
                      if (
                        node.data.category == NODE.category &&
                        keyArr1.indexOf(node.data.key, 0) !== -1
                      ) {
                        console.log(node.data);
                        var shp = node.findObject(NODE.category);
                        cepSinkDetail({ cepSinkId: node.data.id }).then(
                          function(response) {
                            if (response.code == 0) {
                              if (
                                res.data.cep_sink_type ==
                                response.data.cep_sink_type
                              ) {
                                var hl = (node.highlight = x);
                                self.highlight(shp, hl);
                              }
                            }
                          }
                        );
                      }
                    });
                  }
                } else if (type == "format") {
                  console.log("************format*******************");
                  console.log(res.data);
                  // text
                  if (res.data.message_format) {
                    self.myDiagram.nodes.each(function(node, index) {
                      if (node.data.category == NODE.category) {
                        console.log(node);
                      }
                      if (
                        node.data.category == NODE.category &&
                        keyArr1.indexOf(node.data.key, 0) !== -1
                      ) {
                        var shp = node.findObject(NODE.category);
                        console.log(node);
                        cepSinkDetail({ cepSinkId: node.data.id }).then(
                          function(response) {
                            if (response.code == 0) {
                              if (
                                response.data.cep_sink_type ==
                                res.data.cep_sink_type
                              ) {
                                console.log("sam format");
                                if (
                                  res.data.message_format ==
                                  response.data.message_format
                                ) {
                                  var hl = (node.highlight = x);
                                  self.highlight(shp, hl);
                                }
                              } else {
                                var hl = (node.highlight = 0);
                                self.highlight(shp, hl);
                              }
                            }
                          }
                        );
                      }
                    });
                  }
                } else {
                  //取消高亮显示效果
                  console.log("取消高亮显示");
                  self.myDiagram.nodes.each(function(node, index) {
                    if (
                      node.data.category == NODE.category &&
                      keyArr1.indexOf(node.data.key, 0) !== -1
                    ) {
                      var shp = node.findObject(NODE.category);
                      var hl = (node.highlight = x);
                      self.highlight(shp, hl);
                    }
                    if (cancel) {
                      self.selectNode = null;
                    }
                  });
                }
              }
            });
          }
        }
      }
      /*************************************/
      /* if (type == "type") {// http  mqtt
        if(category=='Source'){


        }
        else if(category=='Sink'){


        }
        
      } else if (type == "format") {
          if(category=='Source'){


          }
          else if(category=='Sink'){
            
          }
      } else {
        // 取消所有高亮显示
      }*/
      /*
      self.myDiagram.nodes.each(function(node, index) {
        if (node.category ==NODE.category) {
          var shp = node.findObject(category);
          /* 
              此处调接口判断mqtt是否相同，===> id:[]
              if(id.indexof(node.data.id,0)!==-1){
                var hl = node.highlight=x;
                self.highlight(shp,hl);
              }
            */
      /*
          if (node.data.id == "1120") {
            var hl = (node.highlight = x);
            self.highlight(shp, hl);
          }
        }
      });*/
    },
    highlight: function(shp, hl) {
      var color;
      var width = 4;
      if (hl == 0) {
        color = "black";
        width = 1;
      } else if (hl == 1) {
        color = "#1E90FF";
      } else if (hl == 2) {
        color = "green";
      } else if (hl == 3) {
        color = "orange";
      } else if (hl == 4) {
        color = "red";
      } else {
        color = "purple";
      }
      if (shp) {
        shp.stroke = color;
        shp.strokeWidth = width;
      }
    },
    singleClick: function(val) {
      this.$refs.bottom.$emit("Stats", val);
    },
    judgeType: function() {},
    switchType: function() {
      console.log("switchType");
      console.log(this.selectNode);
      this.TYPE = "type";
      // this.setHighLight(this.selectNode,0);
      // this.setHighLight(this.selectNode,1,'type');
      let self = this;
      let SWITCT = async function() {
        await self.setHighLight(self.selectNode, 0, false);
        await self.setHighLight(self.selectNode, 1, false, "type");
      };
      SWITCT();
    },
    switchFormat: function() {
      console.log("switchFormat");
      console.log(this.selectNode);
      this.TYPE = "format";
      let self = this;
      let SWITCT = async function() {
        await self.setHighLight(self.selectNode, 0, false);
        await self.setHighLight(self.selectNode, 1, false, "format");
      };
      SWITCT();
      //this.setHighLight(this.selectNode,0);
      // this.setHighLight(this.selectNode,1,'format');
    },
    arduinoCreate: function(scope) {
      let self = this;
      console.log(scope);
      if (self.data && Object.keys(self.data).length > 0) {
        console.log("********************" + self.data);
        let data = JSON.parse(self.data);
        let sourceNameArr = [];
        let streamNameArr = [];
        data.nodeDataArray.forEach(function(item) {
          if (item.category == "Source") {
            sourceNameArr.push(item.NAME);
          }
          if (item.category == "Stream") {
            streamNameArr.push(item.NAME);
          }
        });
        //判断device_name 和 source_name 是否重复
        if (
          sourceNameArr.length > 0 &&
          sourceNameArr.indexOf(scope.row.device_name) !== -1
        ) {
          self.$message({
            message: "sourceName: " + scope.row.device_name + " 重复，请修改",
            type: "error"
          });
          return;
        } else if (
          streamNameArr.length > 0 &&
          streamNameArr.indexOf(scope.row.stream_name) !== -1
        ) {
          //判断stream_name 和 stream_name 是否重复
          self.$message({
            message: "streamName: " + scope.row.stream_name + " 重复，请修改",
            type: "error"
          });
          return;
        } else {
          //不重复   请求接口
          cepArduinoCreate({
            cepProgramId: self.cepProgramId,
            device_id: scope.row.device_id
          }).then(function(res) {
            if (res.code == 200) {
              self.cepDetail(res.data);
            } else {
              self.$message.error(res.message);
            }
          });
        }
      }

      //判断   和   node--stream
      //self.cepDetail({a:'123'});
    },
    getEmptyNodeIndex:function(nodeDataArray){
      
       let Index;
       if(nodeDataArray.length>0){
           nodeDataArray.forEach(function(item,index){
                   if(!item.id){
                       Index=index;
                   }
           });
       }
       return Index;

    }
  },
  mounted() {
    let self = this;
    // Bus.$on('HIDE',function(){
    //   console.log('navbar*****');
    //     self.hideBottom();
    // });
   
  
    this.changeHeight();
    this.changeWidth();
  
    // this.cxElement = this.$refs.contextMenu;
    this.cepProgramId = this.$route.params.cep_id;
    var $ = go.GraphObject.make;
    var myDiagram = $(go.Diagram, "myDiagramDiv", {
      // have mouse wheel events zoom in and out instead of scroll up and down
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      allowDrop: true, // support drag-and-drop from the Palette
      initialAutoScale: go.Diagram.Uniform,
      "linkingTool.direction": go.LinkingTool.ForwardsOnly,
      initialContentAlignment: go.Spot.Top, //go.Spot.Center,
      layout: $(go.LayeredDigraphLayout, {
        isInitial: false,
        isOngoing: false,
        layerSpacing: 60 /*水平间距*/,
        columnSpacing: 20 /*垂直间距 */
      }),
      "undoManager.isEnabled": true,
      maxSelectionCount: 1,
      /* */
      "draggingTool.dragsLink": true
      //"draggingTool.isGridSnapEnabled": true,
      //a"linkingTool.isUnconnectedLinkValid": true,
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
    this.cepDetail();
  },
  beforeRouteLeave:function(to,from,next){
      this.$refs.bottom.$emit('clearTimer');
      next();   
  }
};
</script>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  /* //width: 1000px; */
  background: #fff;
  z-index: 999;
  overflow: auto;
  box-shadow: -4px 0 5px -3px #aaa;
}
.closeFixed {
  position: absolute;
  top: 50%;
  left: 0px;
  margin-top: -30px;
  width: 60px;
  height: 60px;
  background: transparent;
  cursor: w-resize;
}
/* .fixed-enter-active,
.fixed-leave-active {
  transition: width 1s;
}
.fixed-enter-to {
  width: 1000px;
}
.fixed-leave-to,
.fixed-enter {
  width: 0px;
} */
.closeIcon {
  display: inline-block;
  width: 11px;
  height: 14px;
  border-top: 8px double #999;
  border-bottom: 3px solid #999;
  position: relative;
  left: -13px;
  top: 9px;
}
.closeFixed:hover .closeIcon {
  border-color: #666;
}
/********/
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
</style>

