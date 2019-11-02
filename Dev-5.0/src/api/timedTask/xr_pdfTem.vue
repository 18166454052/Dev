<template>
    <div>
        <el-button type="primary" size="mini"  @click="convertCanvasToImage('p')">打印PDF</el-button>
        <el-button type="primary" size="mini"  @click="convertCanvasToImage('d')">下载PDF</el-button>
        <div >
            <div id="head">
                <div class="spc-header stats_top m-t" >
                <el-row > 
                    <el-col :span="3">
                            <ul >
                                <li class="spc-bg">&nbsp;</li>
                                <li>&nbsp;</li>
                                <li class="spc-bg">小数位数</li>
                                <li>&nbsp;{{ configData.decimal_digits }}</li>
                            </ul>
                        </el-col>
                        <el-col :span="3">
                            <ul  class="spc-li-bg">
                                <li>规格</li>
                                <li>上限USL</li>
                                <li>目标值</li>
                                <li>下限LSL</li>
                            </ul>
                        </el-col>
                        <el-col :span="3">
                            <ul>
                                <li>标准</li>
                                <li>&nbsp;{{ configData.config_info.vusl }}</li>
                                <li>&nbsp;{{ configData.config_info.target_value }}</li>
                                <li>&nbsp;{{ configData.config_info.lsl }}</li>
                            </ul>
                        </el-col>
                        <el-col :span="3">
                            <ul>
                                <li>子组容量</li>
                                <li style="height:31px;overflow-y:hidden">
                                <el-input  type="munber" min="0" v-model="newGroupNum" disabled> 
                                    <el-button type="info" slot="append"  size='mini' >编辑</el-button>
                                </el-input>
                                </li>
                                <li class="spc-bg">总组数</li>
                                <li>&nbsp;{{variableStats.numGroup}}</li>
                            </ul>
                    </el-col>
                    <el-col :span="4">
                            <ul  class="spc-li-bg">
                                <li>管制</li>
                                <li>上限UCL</li>
                                <li>中心 CL</li>
                                <li>下限LCL</li>
                            </ul>
                        </el-col>
                        <el-col :span="4">
                            <ul>
                                <li>{{XR[0]}}图</li>
                                <li>&nbsp;{{variableStats.ucl_first | effectiveDigits(configData.decimal_digits)}}</li>
                                <li>&nbsp;{{variableStats.averageFirst | effectiveDigits(configData.decimal_digits)}}</li>
                                <li>&nbsp;{{variableStats.lcl_first | effectiveDigits(configData.decimal_digits)}}</li>
                            </ul>
                        </el-col>
                        <el-col :span="4">
                            <ul>
                                <li>{{XR[1]}}图</li>
                                <li>&nbsp;{{variableStats.ucl_second | effectiveDigits(configData.decimal_digits)}}</li>
                                <li>&nbsp;{{variableStats.averageSecond | effectiveDigits(configData.decimal_digits)}}</li>
                                <li>&nbsp;{{variableStats.lcl_second | effectiveDigits(configData.decimal_digits)}}</li>
                            </ul>
                        </el-col>
                        
                    </el-row>
                </div>
                <div class="spc-content  m-t">
                    <el-row>
                        <el-col :span="12">
                                <div class="stats_top" style="border-right:1px solid rgb(159,159,159);
                                        border-bottom:1px solid rgb(159,159,159)">
                                <div>
                                    <p>合计</p>
                                    <el-row>
                                        <el-col :span="8">
                                            <ul>
                                                <li>{{XR[0]}} 平均值 = </li>
                                                <li>{{XR[1]}} 平均值 = </li>
                                            </ul>
                                        </el-col>
                                        <el-col :span="16">
                                            <ul class="noBorder">
                                                <li>&nbsp;{{variableStats.averageFirst | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.averageSecond | effectiveDigits(configData.decimal_digits)}}</li>
                                            </ul>
                                        </el-col> 
                                    </el-row>
                                </div>
                                <div>
                                    <p>制程能力分析</p>
                                    <!-- <el-row>
                                    <el-col :span="12">
                                        <p class="spc-bg-content">CA</p>
                                    </el-col>
                                    <el-col :span="12">
                                        <ul>
                                            <li>&nbsp;{{variableStats.ca | effectiveDigits(configData.decimal_digits)}}</li>
                                        </ul>
                                    </el-col>
                                    </el-row>   -->
                                    <el-row>
                                    <el-col :span="12">
                                        <p class="spc-bg">短期</p>
                                    </el-col>
                                    <el-col :span="12">
                                        <p class="spc-bg">长期</p>
                                    </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="6">
                                            <ul>
                                                <li  class="spc-bg-content">标准差</li>
                                                <li  class="spc-bg-content">CP</li>
                                                <li  class="spc-bg-content">CPK</li>
                                                <li  class="spc-bg-content">CPM</li>
                                                <li  class="spc-bg-content">CPMK</li>
                                                <li  class="spc-bg-content">dpmo</li>
                                                <li  class="spc-bg-content">zBench</li>
                                                <li  class="spc-bg-content">Sigma</li>
                                            </ul>
                                        </el-col>
                                        <el-col :span="6">
                                            <ul>
                                                <li>&nbsp;{{variableStats.stdDevShort | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.cp | effectiveDigits(configData.decimal_digits) }}</li>
                                                <li>&nbsp;{{variableStats.cpk | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.cpm | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.cpmk | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.dpmoShort | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.zBenchShort | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.sigmaShort | effectiveDigits(configData.decimal_digits)}}</li>
                                            
                                            </ul>
                                        </el-col> 
                                        <el-col :span="6">
                                            <ul>
                                                <li  class="spc-bg-content">标准差</li>
                                                <li  class="spc-bg-content">PP</li>
                                                <li  class="spc-bg-content">PPK</li>
                                                <li  class="spc-bg-content">PPM</li>
                                                <li  class="spc-bg-content">PPMK</li>
                                                <li  class="spc-bg-content">dpmo</li>
                                                <li  class="spc-bg-content">zBench</li>
                                                <li  class="spc-bg-content">Sigma</li>
                                            </ul>
                                        </el-col>
                                        <el-col :span="6">
                                            <ul>
                                                <li>&nbsp;{{variableStats.stdDevLong | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.pp | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.ppk | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.ppm | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.ppmk | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.dpmoLong | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.zBenchLong | effectiveDigits(configData.decimal_digits)}}</li>
                                                <li>&nbsp;{{variableStats.sigmaLong | effectiveDigits(configData.decimal_digits)}}</li>
                                            </ul>
                                        </el-col> 
                                    </el-row>
                                </div>
                                <el-row>
                                    <el-col :span="12">
                                        <ul>
                                            <li  class="spc-bg-content">组间标准差</li>
                                            <li  class="spc-bg-content">CA</li>
                                        
                                        </ul>
                                    </el-col>
                                    <el-col :span="12" >
                                        <ul>
                                            <li>&nbsp;{{variableStats.sigma | effectiveDigits(configData.decimal_digits)}}</li>
                                            <li>&nbsp;{{variableStats.ca | effectiveDigits(configData.decimal_digits)}}</li>
                                        </ul>
                                    </el-col>
                                    </el-row> 
                                <!-- <div>
                                    <p>预估不良率(PPM)</p>
                                    <ul>
                                        <li>&nbsp;{{variableStats.ppm | effectiveDigits(configData.decimal_digits)}}</li>
                                    </ul>
                                </div> -->

                            </div>

                        </el-col>

                        <el-col :span="11" :offset="1">
                        <div>
                    
                        <!---->
                        <div class="py" style="border-right:1px solid rgb(159,159,159);
                                    border-bottom:1px solid rgb(159,159,159)">
                            <p>判异规则</p>
                            <ul>
                            <li v-for="(py,index) in pyData" :key="py.rule">
                                <el-row>
                                <el-col :span="2">
                                        <el-checkbox v-model="pyNum[index].checked" disabled></el-checkbox>
                                </el-col>
                                <el-col :span="22">
                                    {{py.rule}}
                                </el-col>
                                </el-row>
                                
                            </li>
                            </ul>
                        </div>
                        </div>
                        </el-col>
                    
                    </el-row>
                </div>
            </div>
            <div >
                <el-row id="img1">
                    <el-col :span="24" style="margin-top:20px"> 
                        <div class="pdfTitle" >{{XR[0]}}管制图</div>
                        <el-col  style="height:400px;width:100%;margin-top:-30px;">
                            <v-lineX 
                            :chart-data="XcharData" 
                            :MAX="max_x" 
                            :MIN="min_x"
                        ></v-lineX>
                        </el-col>   
                        
                    </el-col> 
                    
                </el-row>  
                <el-row> 
                    <el-col  :span="24"  id="img2">
                        <div class="pdfTitle">{{XR[1]}}管制图</div>
                        <el-col   style="height:400px;width:100%;margin-top:-30px;">
                            <v-lineR 
                            :chart-data="RcharData"
                            :min="min_r"
                            :max="max_r"
                        ></v-lineR>
                        </el-col>
                        
                    </el-col>
                </el-row> 
                <el-row>    
                
                    <el-col  :span="24" id="img3" >
                        <div class="pdfTitle">控制能力图</div>
                        <el-col style="height:400px;width:100%;margin-top:-30px;">
                            <v-bar 
                                :count="countDatas" 
                                :distData="distData" 
                                :MIN="minZF" 
                                :MAX="maxZF"
                                :sigma="sigma"
                                :usl="usl"
                                :lsl="lsl"
                                :sigma1="sigma1"
                                :sigma2="sigma2"
                                :sigma3="sigma3"
                                :sigma_1="sigma_1"
                                :sigma_2="sigma_2"
                                :sigma_3="sigma_3"
                                ></v-bar>
                        </el-col>
                    
                    </el-col>
                </el-row>   
                            
            </div> 
        </div>
    </div>
    
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";
import LineX from "@/views/spc/component/x_r/lineX.vue";
import LineR from "@/views/spc/component/x_r/lineR.vue";
import Bar from "@/views/spc/component/x_r/bar1.vue";
import { parseTime } from '@/utils'
export default {
  components: {
    "v-lineX": LineX,
    "v-lineR": LineR,
    "v-bar": Bar
  },
  props: [
    "errorDatax",
    "errorDatar",
    "configData",
    "XR",
    "variableStats",
    "newGroupNum",
    "pyData",
    "pyNum",
    "bar",
    "countDatas",
    "distData",
    "minZF" ,
    "maxZF",
    "sigma",
    "usl",
    "lsl",
    "sigma1",
    "sigma2",
    "sigma3",
    "sigma_1",
    "sigma_2",
    "sigma_3",
    "XcharData",
    "min_x",
    "max_x",
    "RcharData",
    "min_r",
    "max_r",
    "errorDatar",
    "errorDatax",
    "title"

  ],
  data() {
    return {
        activeName:'',
        fonts:{
             
	    msyh: {
	        normal: 'msyh.ttf',
	        bold: 'msyh.ttf',
	        italics: 'msyh.ttf',
	        bolditalics: 'msyh.ttf',
	    
	}
        }
    };
  },
  methods: {
    convertCanvasToImage: function(type) {
      let self = this,imgArr=[];
       let base=['head','img1','img2','img3'];
       for(let i=0;i<base.length;i++){
            html2canvas(document.getElementById(base[i]), {
                allowTaint: true, //允许污染
                taintTest: true, //在渲染前测试图片(没整明白有啥用)
                useCORS: true, //使用跨域(当allowTaint为true时这段代码没什么用,下面解释)
                background: "#fff"
            }).then(function(canvas) {
                let imgBlob = canvas.toDataURL(); // base64
                //self.$set(self.imgBase64,title,imgBlob);
                imgArr.push(imgBlob);
                toPdf();
            });
       }
     

      function toPdf(){
        if(imgArr.length==base.length){
            self.PDF(imgArr,type);
        }
      }
    },
    PDF: function(imgBlob,type) {
       // console.log(imgBlob)
      this.CONTENT = {
        pageSize: 'A4',      //A1 1600  A4 520
        //header: 'simple text',
       footer: function(currentPage, pageCount) {
            return { text:currentPage.toString() + ' / ' + pageCount,
                    alignment:'center',
                    color:'#ccc'
                    }},
        content: [
          {
            //图表
            width: 520,
            image: "data:img/png;base64," + imgBlob[0] + ""
          },
          {
            //图表
            width: 520,
            image: "data:img/png;base64," + imgBlob[1] + ""
          },
          {
            //图表
            width: 520,
            image: "data:img/png;base64," + imgBlob[2] + ""
          },
          {
            //图表
            width: 520,
            image: "data:img/png;base64," + imgBlob[3] + ""
          }
        ],
        defaultStyle: {
          font: "msyh"
        }
      };
      pdfMake.fonts = this.fonts;
      if(type=='d'){
            pdfMake.createPdf(this.CONTENT).download(this.title+'_'+parseTime(new Date()));
      }
       if(type=='p'){
           pdfMake.createPdf(this.CONTENT).print();
      }
     
    }
  },
  mounted: function() {

  }
};
</script>
<style scoped>
/*
#ebeef5
*/
.pdfTitle{
display:inline-block;
margin-top:20px;
padding: 5px 20px;
border-radius:8px;
color:#000;
background-color: rgb(227, 227, 227);
}
.border {
  border: 1px solid rgb(159, 159, 159);
}
.spc-header {
  border-right: 1px solid rgb(159, 159, 159);
  border-bottom: 1px solid rgb(159, 159, 159);
}
p {
  line-height: 30px;
  text-align: center;
  border-left: 1px solid rgb(159, 159, 159);
  border-top: 1px solid rgb(159, 159, 159);
  background-color: rgb(227, 227, 227);
}
.stats_top ul li {
  line-height: 30px;
  text-align: center;
  border-top: 1px solid rgb(159, 159, 159);
  border-left: 1px solid rgb(159, 159, 159);
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
ul.noBorder li {
  border-left: none;
}
.spc-header ul li:first-child {
  background-color: rgb(227, 227, 227);
}
ul.spc-li-bg li {
  background-color: rgb(227, 227, 227);
}
.spc-bg {
  background-color: rgb(227, 227, 227);
}
.spc-bg-content {
  background-color: rgb(245, 247, 250);
  /* background-color: rgb(227, 227, 227); */
}
.py ul li {
  text-align: left;
  line-height: 15px;
  font-size: 12px;
  padding: 5px 5px;
  border-top: 1px solid rgb(159, 159, 159);
  border-left: 1px solid rgb(159, 159, 159);
  width: 100%;
}
.back {
  line-height: 50px;
  height: 50px;
  background: #d9dee4;
  position: relative;
  top: 0px;
  left: 0px;
  font-size: 30px;
}
.back .el-icon-arrow-left {
  font-weight: bold;
  font-size: 30px;
  padding: 1px 30px;
  position: relative;
  /* top: -2px; */
}
</style>
