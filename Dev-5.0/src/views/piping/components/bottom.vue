<template>
  <div  class="m-t" >
   
    <el-form ref="form" :inline="true" :label-position="'right'" class="Form" label-width="40px">
        <el-row>
            <el-col :xs="7" :sm="7"  :md="7" :lg="10" style="padding-left:20px">
                <el-form-item label="source" v-show="category=='Source'" >
                    <el-select v-model="noUsed" popper-append-to-body 
                    placeholder="Add Metric" size="mini" 
                    @change="AddMetric" 
                     >
                    <el-option v-for="source in sourceAttr" 
                        :value="source.value" 
                        :label="source.label"
                        :key="source.label"
                    ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="stream" v-show="category=='Stream'">
                    <el-select v-model="noUsed" placeholder="Add Metric" size="mini" @change="AddMetric">
                        <el-option v-for="source in streamAttr" 
                            :value="source.value" 
                            :label="source.label"
                            :key="source.label"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="job"  v-show="category=='Job'">
                    <el-select v-model="noUsed" placeholder="Add Metric" size="mini" @change="AddMetric">
                        <el-option v-for="source in jobAttr" 
                            :value="source.value" 
                            :label="source.label"
                            :key="source.label"
                        ></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="sink" v-show="category=='Sink'">
                    <el-select v-model="noUsed" placeholder="Add Metric" size="mini" @change="AddMetric">
                        <el-option v-for="source in sinkAttr" 
                            :value="source.value" 
                            :label="source.label"
                            :key="source.label"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="table" v-show="category=='Table'">
                    <el-select v-model="noUsed" placeholder="Add Metric" size="mini" @change="AddMetric">
                        <el-option v-for="table in tableAttr" 
                            :value="table.value" 
                            :label="table.label"
                            :key="table.label"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

           
              <el-col  :xs="7" :sm="7" :md="7"  :lg="6"  class="text-right">
                <el-form-item label="时间 ">
                    <el-select v-model="selectedCircle" popper-append-to-body 
                    placeholder="选择刷新时间" size="mini" 
                    @change="changeInterval"
                   >
                    <el-option v-for="circle in circleList" 
                        :value="circle.value" 
                        :label="circle.label"
                        :key="circle.label"
                    ></el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col  :xs="7" :sm="7" :md="7" :lg="6"  class="text-right">
                   <el-form-item label="范围 ">
                    <el-select v-model="selectedTimer" popper-append-to-body 
                    placeholder="选择时间范围" size="mini"
                    @change="refresh"
                    >
                    <el-option v-for="time in timeRange" 
                        :value="time.value" 
                        :label="time.label"
                        :key="time.label"
                    ></el-option>
                    </el-select>
                 </el-form-item>  
              </el-col>
              <el-col :xs="3"  :sm="3" :md="3"  :lg="2" class="text-center">
                 <el-button type="primary" size="mini" :loading="refreshLoading" 
                 icon="el-icon-refresh" circle
                 @click="refresh('loading')"
                 ></el-button>
              </el-col>
          </el-row>
        
    </el-form>             
    <div  v-show="category=='Source'" class="m-t" style="padding-right:20px">
        <!-- <el-tabs v-model="sourceType" type="card"  @tab-click="changeSourceType">
            <el-tab-pane label="source"  name="source"></el-tab-pane>
            <el-tab-pane label="sourceMapper" name="sourceMapper"></el-tab-pane>
        </el-tabs> -->
           

            <el-row :gutter="10">
                <el-col :span="8"  style="margin-bottom:20px"  v-for="(attr,index) in SourceSelectAttr" :key="attr" v-if="attr.split('/')[1]==''">
                    <el-card style="height:240px" :body-style="{padding:'0',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                     <span>{{attr.split('/')[0]}}</span> 
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="BigCharts(attr,index)">Big</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                        <v-line :chart-data="ALLATTR['Source_count']" v-if="attr.split('/')[0]=='Source_count'"></v-line>
                        <v-line :chart-data="ALLATTR['Source_rate']"  v-else-if="attr.split('/')[0]=='Source_rate'"></v-line>
                        <v-line :chart-data="ALLATTR['SourceMapper_count']"  v-else-if="attr.split('/')[0]=='SourceMapper_count'"></v-line>
                        <v-lineArea :chart-data="ALLATTR['SourceMapper_stability']"  v-else-if="attr.split('/')[0]=='SourceMapper_stability'"></v-lineArea>
                        <v-line :chart-data="ALLATTR['SourceMapper_rate']"  v-else-if="attr.split('/')[0]=='SourceMapper_rate'"></v-line>
                        <v-histogram  :chart-data="ALLATTR['SourceMapper_box']"  v-else-if="attr.split('/')[0]=='SourceMapper_box'"></v-histogram>
                    </el-card>
                </el-col>
                <el-col  v-else-if="attr.split('/')[1]=='BIG'"  :span="24"   style="margin-bottom:20px">
                    <el-card style="height:240px;" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                  <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="SmallCharts(index)">Small</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                        <v-line :chart-data="ALLATTR['Source_count']" v-if="attr.split('/')[0]=='Source_count'"></v-line>
                        <v-line :chart-data="ALLATTR['Source_rate']"  v-else-if="attr.split('/')[0]=='Source_rate'"></v-line>
                        <v-line :chart-data="ALLATTR['SourceMapper_count']"  v-else-if="attr.split('/')[0]=='SourceMapper_count'"></v-line>
                        <v-lineArea :chart-data="ALLATTR['SourceMapper_stability']"  v-else-if="attr.split('/')[0]=='SourceMapper_stability'"></v-lineArea>
                        <v-line :chart-data="ALLATTR['SourceMapper_rate']"  v-else-if="attr.split('/')[0]=='SourceMapper_rate'"></v-line>
                        <v-histogram  :chart-data="ALLATTR['SourceMapper_box']"  v-else-if="attr.split('/')[0]=='SourceMapper_box'"></v-histogram>
                    </el-card>
                </el-col>
            </el-row>
    </div>
    <div  v-show="category=='Stream'" class="m-t">
            <el-row :gutter="10">
                <el-col :span="8"  style="margin-bottom:20px" v-for="(attr,index) in StreamSelectAttr" :key="attr" v-if="attr.split('/')[1]==''">
                    <el-card style="height:240px" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="BigCharts(attr,index)">Big</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                         <v-line :chart-data="ALLATTR['Stream_count']" v-if="attr.split('/')[0]=='Stream_count'"></v-line>
                        <v-line :chart-data="ALLATTR['Stream_rate']"  v-else-if="attr.split('/')[0]=='Stream_rate'"></v-line>
                       
                      
                    </el-card>
                </el-col>
                <el-col  v-else-if="attr.split('/')[1]=='BIG'"  :span="24"  style="margin-bottom:20px">
                    <el-card style="height:240px" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                   <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="SmallCharts(index)">Small</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                        <v-line :chart-data="ALLATTR['Stream_count']" v-if="attr.split('/')[0]=='Stream_count'"></v-line>
                        <v-line :chart-data="ALLATTR['Stream_rate']"  v-else-if="attr.split('/')[0]=='Stream_rate'"></v-line>
                       
                    </el-card>
                </el-col>
            </el-row>
    </div>
    <div  v-show="category=='Job'"   class="m-t">
          
            <el-row :gutter="10">
                <el-col :span="8"  style="margin-bottom:20px"  v-for="(attr,index) in JobSelectAttr" :key="attr" v-if="attr.split('/')[1]==''">
                    <el-card style="height:240px" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                   <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="BigCharts(attr,index)">Big</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                         <v-line :chart-data="ALLATTR['Job_count']" v-if="attr.split('/')[0]=='Job_count'"></v-line>
                        <v-line :chart-data="ALLATTR['Job_rate']"  v-else-if="attr.split('/')[0]=='Job_rate'"></v-line>
                        <v-line :chart-data="ALLATTR['Job_value']"  v-else-if="attr.split('/')[0]=='Job_value'"></v-line>
                        <v-lineArea :chart-data="ALLATTR['Job_stability']"  v-else-if="attr.split('/')[0]=='Job_stability'"></v-lineArea>
                        <v-histogram  :chart-data="ALLATTR['Job_box']"  v-else-if="attr.split('/')[0]=='Job_box'"></v-histogram>
                       
                    </el-card>
                </el-col>
                <el-col  v-else-if="attr.split('/')[1]=='BIG'"  style="margin-bottom:20px"  :span="24">
                    <el-card style="height:240px" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                               <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="SmallCharts(index)">Small</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                        <v-line :chart-data="ALLATTR['Job_count']" v-if="attr.split('/')[0]=='Job_count'"></v-line>
                        <v-line :chart-data="ALLATTR['Job_rate']"  v-else-if="attr.split('/')[0]=='Job_rate'"></v-line>
                        <v-line :chart-data="ALLATTR['Job_value']"  v-else-if="attr.split('/')[0]=='Job_value'"></v-line>
                        <v-lineArea :chart-data="ALLATTR['Job_stability']"  v-else-if="attr.split('/')[0]=='Job_stability'"></v-lineArea>
                        <v-histogram  :chart-data="ALLATTR['Job_box']"  v-else-if="attr.split('/')[0]=='Job_box'"></v-histogram>
                    </el-card>
                </el-col>
            </el-row>
    </div>
    <div  v-show="category=='Sink'" class="m-t" >
            <el-row :gutter="10">
                <el-col :span="8"  style="margin-bottom:20px"  v-for="(attr,index) in SinkSelectAttr" :key="attr" v-if="attr.split('/')[1]==''">
                    <el-card style="height:240px" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                   <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="BigCharts(attr,index)">Big</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                        
                        <v-line :chart-data="ALLATTR['Sink_count']" v-if="attr.split('/')[0]=='Sink_count'"></v-line>
                        <v-line :chart-data="ALLATTR['Sink_rate']"  v-else-if="attr.split('/')[0]=='Sink_rate'"></v-line>
                        <v-line :chart-data="ALLATTR['SinkMapper_count']"  v-else-if="attr.split('/')[0]=='SinkMapper_count'"></v-line>
                        <v-lineArea :chart-data="ALLATTR['SinkMapper_stability']"  v-else-if="attr.split('/')[0]=='SinkMapper_stability'"></v-lineArea>
                        <v-line :chart-data="ALLATTR['SinkMapper_rate']"  v-else-if="attr.split('/')[0]=='SinkMapper_rate'"></v-line>
                        <v-histogram  :chart-data="ALLATTR['SinkMapper_box']"  v-else-if="attr.split('/')[0]=='SinkMapper_box'"></v-histogram>
                    </el-card>
                </el-col>
                <el-col  v-else-if="attr.split('/')[1]=='BIG'"  style="margin-bottom:20px"  :span="24">
                    <el-card style="height:240px" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                 <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="SmallCharts(index)">Small</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                        <v-line :chart-data="ALLATTR['Sink_count']" v-if="attr.split('/')[0]=='Sink_count'"></v-line>
                        <v-line :chart-data="ALLATTR['Sink_rate']"  v-else-if="attr.split('/')[0]=='Sink_rate'"></v-line>
                        <v-line :chart-data="ALLATTR['SinkMapper_count']"  v-else-if="attr.split('/')[0]=='SinkMapper_count'"></v-line>
                        <v-lineArea :chart-data="ALLATTR['SinkMapper_stability']"  v-else-if="attr.split('/')[0]=='SinkMapper_stability'"></v-lineArea>
                        <v-line :chart-data="ALLATTR['SinkMapper_rate']"  v-else-if="attr.split('/')[0]=='SinkMapper_rate'"></v-line>
                        <v-histogram  :chart-data="ALLATTR['SinkMapper_box']"  v-else-if="attr.split('/')[0]=='SinkMapper_box'"></v-histogram>
                    </el-card>
                </el-col>
            </el-row>
    </div>
    <div  v-show="category=='Table'" class="m-t">
            <el-row :gutter="10">
                <el-col :span="8"  style="margin-bottom:20px" v-for="(attr,index) in TableSelectAttr" :key="attr" v-if="attr.split('/')[1]==''">
                    <el-card style="height:240px" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="BigCharts(attr,index)">Big</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                          <v-linetype :chart-data="ALLATTR['Table_type']" v-if="attr.split('/')[0]=='Table_type'"></v-linetype>
                         <v-line :chart-data="ALLATTR['Table_count']" v-else-if="attr.split('/')[0]=='Table_count'"></v-line>
                         <v-line :chart-data="ALLATTR['Table_rate']"  v-else-if="attr.split('/')[0]=='Table_rate'"></v-line>
                         <v-line :chart-data="ALLATTR['Table_value']"  v-else-if="attr.split('/')[0]=='Table_memoryValue'"></v-line>
                         <v-line :chart-data="ALLATTR['Table_latencyCount']" v-if="attr.split('/')[0]=='Table_latencyCount'"></v-line>
                         <v-line :chart-data="ALLATTR['Table_latencyRate']"  v-else-if="attr.split('/')[0]=='Table_latencyRate'"></v-line>
                         <v-histogram :chart-data="ALLATTR['Table_box']" v-if="attr.split('/')[0]=='Table_box'"></v-histogram>
                         <v-lineArea :chart-data="ALLATTR['Table_stability']"  v-else-if="attr.split('/')[0]=='Table_stability'"></v-lineArea>
                       
            
                    </el-card>
                </el-col>
                <el-col  v-else-if="attr.split('/')[1]=='BIG'"  :span="24"  style="margin-bottom:20px">
                    <el-card style="height:240px" :body-style="{padding:'0px',position:'relative'}">
                        <div class="echartsButton">
                                <el-col :span="18" style="padding-left:20px">
                                   <span>{{attr.split('/')[0]}}</span>
                                </el-col>
                                <el-col :span="6"  class="text-right">
                                    <el-button size="boxi"  @click="SmallCharts(index)">Small</el-button>
                                    <el-button size="boxi" icon="el-icon-close" @click="DeleteCharts(attr,index)"></el-button>
                                </el-col>
                           
                        </div>
                         <v-linetype :chart-data="ALLATTR['Table_type']" v-if="attr.split('/')[0]=='Table_type'"></v-linetype>
                         <v-line :chart-data="ALLATTR['Table_count']" v-else-if="attr.split('/')[0]=='Table_count'"></v-line>
                         <v-line :chart-data="ALLATTR['Table_rate']"  v-else-if="attr.split('/')[0]=='Table_rate'"></v-line>
                         <v-line :chart-data="ALLATTR['Table_value']"  v-else-if="attr.split('/')[0]=='Table_memoryValue'"></v-line>
                         <v-line :chart-data="ALLATTR['Table_latencyCount']" v-if="attr.split('/')[0]=='Table_latencyCount'"></v-line>
                         <v-line :chart-data="ALLATTR['Table_latencyRate']"  v-else-if="attr.split('/')[0]=='Table_latencyRate'"></v-line>
                         <v-histogramline :chart-data="ALLATTR['Table_box']" v-if="attr.split('/')[0]=='Table_box'"></v-histogramline>
                         <v-lineArea :chart-data="ALLATTR['Table_stability']"  v-else-if="attr.split('/')[0]=='Table_stability'"></v-lineArea>
                       
                    </el-card>
                </el-col>
            </el-row>
    </div>

  </div>
</template>
<script>
import { cepSourceStats, cepSourceMapperStats } from "@/api/piping/source";
import { cepSinkStats, cepSinkMapperStats } from "@/api/piping/sink";
import { cepStreamStats } from "@/api/piping/stream";
import { cepJobStats } from "@/api/piping/job";
import { cepTableStats } from "@/api/piping/table";
import Line from "./echarts/line.vue";
import LineType from "./echarts/lineType.vue";
import Histogram from "./echarts/histogram.vue";
import LineArea from "./echarts/lineArea.vue";
export default {
  components: {
    "v-line": Line,
    "v-histogram": Histogram,
    "v-lineArea": LineArea,
    'v-linetype':LineType
  },
  data() {
    return {
      refreshLoading: false,
      selectedTimer: 1,
      circleList: [
        { label: "5秒", value: 5 },
        { label: "10秒", value: 10 },
        { label: "20秒", value: 20 },
        { label: "30秒", value: 30 },
        { label: "60秒", value: 60 }
      ],
      timeRange: [
        { label: " 1分钟", value: 1 },
        { label: " 10分钟", value: 2 },
        { label: " 30分钟", value: 3 },
        { label: " 1小时", value: 4 }
      ],
      count: 50, //x轴显示的数据量
      selectedCircle: 5, //轮询的时间  秒--》毫秒
      ALLTIMER: {}, //所有的定时器
      ALLATTR: {}, //Source_count
      noUsed: "", //语法规范
      node: "",
      category: "", //Stream Sink Source Job
      categoryType: "", //Stream Sink Source Job SourceMapper  SinkMapper
      Sink: [],
      sinkType: "",
      sinkMapper: [],
      Stream: [],
      Source: [
        "count",
        "meanRate",
        "oneMinuteRate",
        "fiveMinuteRate",
        "fifteenMinuteRate"
      ], //保存source/sourceMapper的所有属性
      sourceMapper: [
        "count",
        "meanRate",
        "oneMinuteRate",
        "fiveMinuteRate",
        "fifteenMinuteRate",
        "min",
        "max",
        "mean",
        "stdDev",
        "s50thPercentile",
        "s75thPercentile",
        "s95thPercentile",
        "s98thPercentile",
        "s99thPercentile",
        "s999thPercentile"
      ],
      job: [
        "count",
        "meanRate",
        "oneMinuteRate",
        "fiveMinuteRate",
        "fifteenMinuteRate",
        "min",
        "max",
        "mean",
        "stdDev",
        "s50thPercentile",
        "s75thPercentile",
        "s95thPercentile",
        "s98thPercentile",
        "s99thPercentile",
        "s999thPercentile",
        "value"
      ],
      Table: [
        "count",
        "mean_rate",
        "one_minute_rate",
        "five_minute_rate",
        "fifteen_minute_rate",
        "latency_count",
        "latency_mean_rate",
        "latency_one_minute_rate",
        "latency_five_minute_rate",
        "latency_fifteen_minute_rate",
        "latency_min",
        "latency_max",
        "latency_mean",
        "latency_stddev",
        "latency_50p",
        "latency_75p",
        "latency_95p",
        "latency_98p",
        "latency_99",
        "latency_999p",
        "memory_value"
      ],
      Job: [],
      sourceAttr: [], //下拉列表
      streamAttr: [],
      jobAttr: [],
      sinkAttr: [],
      tableAttr: [],
      sourceName: "",
      streamName: "",
      jobName: "",
      sinkName: "",
      tableName: "",
      StreamSelectAttr: [],
      SourceSelectAttr: [], //选中的source --addMetric  Source_count   Source_rate
      SourceMapperSelectAttr: [],
      JobSelectAttr: [],
      SinkSelectAttr: [],
      TableSelectAttr: []
    };
  },
  methods: {
    selectBlur: function(event) {
      console.log("selectBlur****************");
      console.log(event);
    },
    AddMetric: function(val) {
      console.log(val); //val  name_Source_attribute
      let self = this;
      let categoryType = val.split("_")[1];

      self.categoryType = categoryType;
      // if (self[self.category+'SelectAttr'].indexOf(val, 0) == -1) {
      //             //判断是否已经选择
      //     self[self.category+'SelectAttr'].push(val + "/");//xxxx/BIG  统一形式
      //    }

      let attr = val.split("_").pop();
      if (
        self.categoryType == "Source" ||
        self.categoryType == "Stream" ||
        self.categoryType == "Sink" 
      ) {
        if (attr == "count") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_count/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_count" + "/"
            ); //xxxx/BIG  统一形式
          }
        } else {
          //
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_rate/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            console.log("不存在");
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_rate" + "/"
            );
          } else {
            console.log("已经存在");
          }
        }
      }


      if (
        self.categoryType == "SourceMapper" ||
        self.categoryType == "SinkMapper" ||
        self.categoryType == "Job" 
      ) {
        if (attr == "count" || attr == "value") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_" + attr + "/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_" + attr + "/"
            ); //xxxx/BIG  统一形式
          }
        } else if (attr == "stability") {
          //else if(attr=='mean' || attr=='stdDev'){
          console.log("add*************11");
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_stability/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_stability" + "/"
            );
          }
        } else if (attr == "rate") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_rate/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_rate" + "/"
            );
          }
        } else {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_box/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_box" + "/"
            );
          }
        }
      }


    if (
           self.categoryType == "Table" 
      ) {
         if (attr == "count") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_count/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_count" + "/"
            ); //xxxx/BIG  统一形式
          }
        }
         if (attr == "type") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_type/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_type" + "/"
            ); //xxxx/BIG  统一形式
          }
        }
         else if(attr == "rate"){
          //
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_rate/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            console.log("不存在");
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_rate" + "/"
            );
          } else {
            console.log("已经存在");
          }
        }
        else  if (attr == "latencyCount") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_" + attr + "/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_" + attr + "/"
            ); //xxxx/BIG  统一形式
          }
        } else if (attr == "latencyRate") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_latencyRate/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_latencyRate" + "/"
            );
          }
        }
        else if (attr == "memoryValue") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_memoryValue/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_memoryValue" + "/"
            );
          }
        }
        else if (attr == "box") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_box/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_box" + "/"
            );
          }
        }
        else if (attr == "stability") {
          if (
            self[self.category + "SelectAttr"].indexOf(
              self.categoryType + "_stability/",
              0
            ) == -1
          ) {
            //判断是否已经选择
            self[self.category + "SelectAttr"].push(
              self.categoryType + "_stability" + "/"
            );
          }
        }
      }







      if (categoryType == "Source") {
        if (!self.ALLTIMER["Source_timer"]) {
          //是否已经轮询
          self.sourceStats();
          self.$set(
            self.ALLTIMER,
            "Source_timer",
            setInterval(function() {
              self.sourceStats();
            }, Number(self.selectedCircle) * 1000)
          );
          setTimeout(self.ALLTIMER.Source_timer, 5000);
        }
      }
      ////////
      if (categoryType == "SourceMapper") {
        if (!self.ALLTIMER["SourceMapper_timer"]) {
          //是否已经轮询
          self.sourceMapperStats();
          self.$set(
            self.ALLTIMER,
            "SourceMapper_timer",
            setInterval(function() {
              self.sourceMapperStats();
            }, Number(self.selectedCircle) * 1000)
          );
          setTimeout(self.ALLTIMER.SourceMapper_timer, 5000);
        }
      }
      if (categoryType == "Stream") {
        if (!self.ALLTIMER["Stream_timer"]) {
          //是否已经轮询
          self.streamStats();
          self.$set(
            self.ALLTIMER,
            "Stream_timer",
            setInterval(function() {
              self.streamStats();
            }, Number(self.selectedCircle) * 1000)
          );
          setTimeout(self.ALLTIMER.Stream_timer, 5000);
        }
      }
      if (categoryType == "Job") {
        if (!self.ALLTIMER["Job_timer"]) {
          //是否已经轮询
          self.jobStats();
          self.$set(
            self.ALLTIMER,
            "Job_timer",
            setInterval(function() {
              self.jobStats();
            }, Number(self.selectedCircle) * 1000)
          );
          setTimeout(self.ALLTIMER.Job_timer, 5000);
        }
      }
      if (categoryType == "Sink") {
        if (!self.ALLTIMER["Sink_timer"]) {
          //是否已经轮询
          self.sinkStats();
          self.$set(
            self.ALLTIMER,
            "Sink_timer",
            setInterval(function() {
              self.sinkStats();
            }, Number(self.selectedCircle) * 1000)
          );
          setTimeout(self.ALLTIMER.Sink_timer, 5000);
        }
      }
      if (categoryType == "Table") {
        if (!self.ALLTIMER["Table_timer"]) {
          //是否已经轮询
          self.tableStats();
          self.$set(
            self.ALLTIMER,
            "Table_timer",
            setInterval(function() {
              self.tableStats();
            }, Number(self.selectedCircle) * 1000)
          );
          setTimeout(self.ALLTIMER.Sink_timer, 5000);
        }
      }
      ////////
      if (val.split("_")[1] == "SinkMapper") {
        if (!self.ALLTIMER["SinkMapper_timer"]) {
          //是否已经轮询
          self.sinkMapperStats();
          self.$set(
            self.ALLTIMER,
            "SinkMapper_timer",
            setInterval(function() {
              self.sinkMapperStats();
            }, Number(self.selectedCircle) * 1000)
          );
          setTimeout(self.ALLTIMER.SinkMapper_timer, 5000);
        }
      }
    },
    BigCharts: function(attr, index) {
      //放大
      let nowAttr = this[this.category + "SelectAttr"][index];
      if (nowAttr.split("/")[1] == "") {
        this[this.category + "SelectAttr"].splice(index, 1); //删除
        this[this.category + "SelectAttr"].push(nowAttr + "BIG"); //添加
      }
    },
    DeleteCharts: function(attr, index) {
      //删除
      this[this.category + "SelectAttr"].splice(index, 1);
      this.noUsed = "";
      let self = this;
      //删除 charData--rows  数据
      console.log("deleteCharts=============");
      console.log(attr.slice(0, -1));
      //self.ALLATTR[attr.slice(0,-1).split('_').slice(1).join('_')].rows=[];
      //判断是否还有同类型的其他图表在展示，否则取消对应的定时器

      cancelTimer(self, self.categoryType);

      function cancelTimer(self, categoryType) {
        console.log("CancelTimer---------" + attr);
        let flag = false; //false  没有相同类型的图表展示
        if (categoryType == "Stream" || categoryType == "Job") {
          if (self[categoryType + "SelectAttr"].length == 0) {
            clearInterval(self.ALLTIMER[categoryType + "_timer"]);
            self.ALLTIMER[categoryType + "_timer"] = null;
            self.ALLATTR[attr.split("/")[0]].rows = [];
            console.log("取消定时器*******");
          }
        } else {
          self[self.category + "SelectAttr"].forEach(function(item) {
            //Source_count  Source_rate
            if (item.split("_")[0] == categoryType) {
              flag = true; //有存在
            }
          });
          if (!flag) {
            clearInterval(self.ALLTIMER[categoryType + "_timer"]);
            self.ALLTIMER[categoryType + "_timer"] = null;
            self.ALLATTR[attr.split("/")[0]].rows = [];
            console.log(self.ALLTIMER);
            console.log("取消定时器*******");
          }
        }
      }
    },
    SmallCharts: function(index) {
      //缩小
      let newAttr = this[this.category + "SelectAttr"][index].slice(0, -3),
        INDEX,
        ARR = this[this.category + "SelectAttr"];

      //遍历数组，在第一个'BIG'前插入
      for (let i = 0; i < ARR.length; i++) {
        if (ARR[i].split("/")[1] == "BIG") {
          INDEX = i;
          break;
        }
      }
      ARR.splice(INDEX, 0, newAttr);
      ARR.splice(index + 1, 1);
    },
    sourceStats: function() {
      let self = this;
      cepSourceStats({
        cep_source_id: self.node.id,
        time_range: self.selectedTimer
      }).then(function(res) {
        console.log(res);
        if (res.code== 200) {
          self.ALLATTR["Source_rate"].rows = [];
          self.ALLATTR["Source_count"].rows = [];
          if (res.data.length == 0) {
          } else {
            //判断数据重复,
            let data = res.data.reverse();
            data.forEach(function(item) {
              let source_rate_date = {};
              for (let key in item) {
                if (
                  key !== "cep_source_id" &&
                  key !== "time_range" &&
                  key !== "create_time"
                ) {
                  console.log(item["create_time"].slice(0, -2));
                  if (key == "count") {
                    source_rate_date["日期"] = item["create_time"].slice(0, -2);
                    let obj = {
                      count: item[key],
                      日期: item["create_time"].slice(0, -2)
                    };
                    self.ALLATTR["Source_" + key].rows.push(obj);
                  } else {
                    source_rate_date[key] = item[key];
                  }
                }
              }
              self.ALLATTR["Source_rate"].rows.push(source_rate_date);
            });
          }
        } else {
          self.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    sourceMapperStats: function() {
      let self = this;
      cepSourceMapperStats({
        cep_source_id: self.node.id,
        time_range: self.selectedTimer
      }).then(function(res) {
        
        console.log("sourceMapper****************************************");
        console.log(res);
        if (res.code== 200) {
          self.ALLATTR["SourceMapper_count"].rows = [];
          self.ALLATTR["SourceMapper_rate"].rows = [];
          self.ALLATTR["SourceMapper_stability"].rows = [];
          self.ALLATTR["SourceMapper_box"].rows = [];
          if (res.data.length == 0) {
          } else {
            let data = res.data.reverse();
            data.forEach(function(item) {
              let sourceMapper_rate_date = {},
                sourceMapper_stability_date = { add: "", reduce: "" },
                sourceMapper_box_date = {};
              for (let key in item) {
                if (
                  key !== "cep_source_id" &&
                  key !== "data_number" &&
                  key !== "create_time"
                ) {
                  if (key == "count") {
                    sourceMapper_rate_date["日期"] = item["create_time"].slice(
                      0,
                      -2
                    );
                    sourceMapper_stability_date["日期"] = item[
                      "create_time"
                    ].slice(0, -2);
                    sourceMapper_box_date["日期"] = item["create_time"].slice(
                      0,
                      -2
                    );
                    let obj = {
                      count: item[key],
                      日期: item["create_time"].slice(0, -2)
                    };
                    self.ALLATTR["SourceMapper_count"].rows.push(obj);
                  } else if (key == "mean" || key == "stdDev") {
                    sourceMapper_stability_date[key] = item[key];
                  } else if (key.indexOf("Rate") !== -1) {
                    sourceMapper_rate_date[key] = item[key];
                  } else {
                    //

                    sourceMapper_box_date[key] = item[key];
                  }
                }
              }

              self.ALLATTR["SourceMapper_rate"].rows.push(
                sourceMapper_rate_date
              );
              self.ALLATTR["SourceMapper_stability"].rows.push(
                sourceMapper_stability_date
              );
              self.ALLATTR["SourceMapper_box"].rows.push(sourceMapper_box_date);
            });
            console.log("get-----source");
            console.log(self.ALLATTR);
          }
        } else {
          self.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    streamStats: function() {
      let self = this;
      cepStreamStats({
        cep_stream_id: self.node.id,
        time_range: self.selectedTimer
      }).then(function(res) {
        if (res.code== 200) {
          self.ALLATTR["Stream_count"].rows = [];
          self.ALLATTR["Stream_rate"].rows = [];
          if (res.data.length == 0) {
          } else {
            let data = res.data.reverse();

            data.forEach(function(item) {
              let stream_rate_date = {};
              for (let key in item) {
                if (
                  key !== "cep_stream_id" &&
                  key !== "data_number" &&
                  key !== "create_time"
                ) {
                  console.log("****key******");
                  console.log(key);
                  if (key == "count") {
                    stream_rate_date["日期"] = item["create_time"].slice(0, -2);
                    let obj = {
                      count: item[key],
                      日期: item["create_time"].slice(0, -2)
                    };

                    self.ALLATTR["Stream_count"].rows.push(obj);
                  } else {
                    stream_rate_date[key] = item[key];
                  }
                }
              }
              self.ALLATTR["Stream_rate"].rows.push(stream_rate_date);
            });
          }
        } else {
          self.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    jobStats: function() {
      let self = this;
      cepJobStats({
        cep_job_id: self.node.id,
        time_range: self.selectedTimer
      }).then(function(res) {
        if (res.code== 200) {
          console.log(res);
          self.ALLATTR["Job_count"].rows = [];
          self.ALLATTR["Job_value"].rows = [];
          self.ALLATTR["Job_rate"].rows = [];
          self.ALLATTR["Job_stability"].rows = [];
          self.ALLATTR["Job_box"].rows = [];
          if (res.data.length == 0) {
          } else {
            let data = res.data.reverse();
            data.forEach(function(item) {
              let job_rate_date = {},
                job_stability_date = { add: "", reduce: "" },
                job_box_date = {};
              for (let key in item) {
                if (
                  key !== "cep_job_id" &&
                  key !== "data_number" &&
                  key !== "create_time"
                ) {
                
                  if (key == "count" || key == "value") {
                    job_rate_date["日期"] = item["create_time"].slice(0, -2);
                    job_stability_date["日期"] = item["create_time"].slice(
                      0,
                      -2
                    );
                    job_box_date["日期"] = item["create_time"].slice(0, -2);
                    let obj = {};
                    if (key == "count") {
                      obj = {
                        count: item[key],
                        日期: item["create_time"].slice(0, -2)
                      };
                    }
                    if (key == "value") {
                      obj = {
                        value: item[key],
                        日期: item["create_time"].slice(0, -2)
                      };
                    }

                    self.ALLATTR["Job_" + key].rows.push(obj);
                  } else if (key == "mean" || key == "stdDev") {
                    job_stability_date[key] = item[key];
                  } else if (key.indexOf("Rate") !== -1) {
                    job_rate_date[key] = item[key];
                  } else {
                    job_box_date[key] = item[key];
                  }
                }
              }
              self.ALLATTR["Job_rate"].rows.push(job_rate_date);
              self.ALLATTR["Job_stability"].rows.push(job_stability_date);
              self.ALLATTR["Job_box"].rows.push(job_box_date);
            });
          }
        } else {
          self.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    sinkStats: function() {
      let self = this;
      cepSinkStats({
        cep_sink_id: self.node.id,
        time_range: self.selectedTimer
      }).then(function(res) {
        console.log(res);
        if (res.code== 200) {
          self.ALLATTR["Sink_count"].rows = [];
          self.ALLATTR["Sink_rate"].rows = [];
          if (res.data.length == 0) {
          } else {
            let data = res.data.reverse();

            data.forEach(function(item) {
              let sink_rate_date = {};
              for (let key in item) {
                if (
                  key !== "cep_sink_id" &&
                  key !== "data_number" &&
                  key !== "create_time"
                ) {
                
                
                  if (key == "count") {
                    sink_rate_date["日期"] = item["create_time"].slice(0, -2);
                    let obj = {
                      count: item[key],
                      日期: item["create_time"].slice(0, -2)
                    };
                    self.ALLATTR["Sink_count"].rows.push(obj);
                  } else {
                    sink_rate_date[key] = item[key];
                  }
                }
              }
              self.ALLATTR["Sink_rate"].rows.push(sink_rate_date);
            });
          }
        } else {
          self.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    sinkMapperStats: function() {
      let self = this;
      cepSinkMapperStats({
        cep_sink_id: self.node.id,
        time_range: self.selectedTimer
      }).then(function(res) {
        if (res.code== 200) {
          self.ALLATTR["SinkMapper_count"].rows = [];
          self.ALLATTR["SinkMapper_rate"].rows = [];
          self.ALLATTR["SinkMapper_stability"].rows = [];
          self.ALLATTR["SinkMapper_box"].rows = [];
          if (res.data.length == 0) {
          } else {
            let data = res.data.reverse();
            data.forEach(function(item) {
              let sinkMapper_rate_date = {},
                sinkMapper_stability_date = { add: "", reduce: "" },
                sinkMapper_box_date = {};
              for (let key in item) {
                if (
                  key !== "cep_sink_id" &&
                  key !== "data_number" &&
                  key !== "create_time"
                ) {
                  console.log("****key******");
                  console.log(key);
                  if (key == "count") {
                    sinkMapper_rate_date["日期"] = item["create_time"].slice(
                      0,
                      -2
                    );
                    sinkMapper_stability_date["日期"] = item[
                      "create_time"
                    ].slice(0, -2);
                    sinkMapper_box_date["日期"] = item["create_time"].slice(
                      0,
                      -2
                    );
                    let obj = {
                      count: item[key],
                      日期: item["create_time"].slice(0, -2)
                    };
                    self.ALLATTR["SinkMapper_count"].rows.push(obj);
                  } else if (key == "mean" || key == "stdDev") {
                    sinkMapper_stability_date[key] = item[key];
                  } else if (key.indexOf("Rate") !== -1) {
                    sinkMapper_rate_date[key] = item[key];
                  } else {
                    sinkMapper_box_date[key] = item[key];
                  }
                }
              }
              self.ALLATTR["SinkMapper_rate"].rows.push(sinkMapper_rate_date);
              self.ALLATTR["SinkMapper_stability"].rows.push(
                sinkMapper_stability_date
              );
              self.ALLATTR["SinkMapper_box"].rows.push(sinkMapper_box_date);
            });
          }
        } else {
          self.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    tableStats: function() {
      let self = this;
      cepTableStats({
        cep_table_id: self.node.id,
        time_range: self.selectedTimer
      }).then(function(res) {
        console.log(res);
        if (res.code== 200) {
          
          self.ALLATTR["Table_rate"].rows = [];
          self.ALLATTR["Table_count"].rows = [];
          self.ALLATTR["Table_latencyCount"].rows = [];
          self.ALLATTR["Table_latencyRate"].rows = [];
          self.ALLATTR["Table_stability"].rows = [];
          self.ALLATTR["Table_box"].rows = [];
          self.ALLATTR["Table_type"].rows = [];
          self.ALLATTR["Table_value"].rows = [];
          if (res.data.length == 0) {
          } else {
            let data = res.data.reverse();
            //let data = res.data;
            data.forEach(function(item) {
              let table_rate_data = {},
                table_count_data = {},
                table_latency_count_data = {},
                table_latency_rate_data = {},
                table_stability_data = {add:'',reduce:''},
                table_value_data = {},
                table_type_data={},
                table_box_data = {};

              for (let key in item) {
                if (
                  key !== "cep_table_id" &&
                  key !== "data_number" &&
                  key !== "create_time"
                ) {
                   let date=new Date(item["create_time"]).toString().split(' ').slice(3,5).join(' ');
                  // console.log(new Date(item["create_time"]).toString().split(' ').slice(3,5).join(' '));
                  if (key.indexOf("latency") == -1) {

                    if (key == "count") {
                      
                      let obj = {
                        count: item[key],
                        日期: date
                      };
                      self.ALLATTR["Table_count"].rows.push(obj);
                    } 
                    else if(key == "memory_value"){
                       let obj = {
                        memory_value : item[key],
                        日期: date
                      };
                      self.ALLATTR["Table_value"].rows.push(obj);

                    }
                     else if(key == "statistic_type"){
                       table_type_data['type']=["insert","update","updateOrInsert","delete","find","contains"][Number(item[key])-1];
                     
                     }
                     else { 
                      table_rate_data["日期"] = date;
                      table_rate_data[key] = item[key];
                    }
                  } else {

                      table_latency_rate_data["日期"] = date;
                      table_box_data["日期"] = date;
                      table_stability_data["日期"] =date;
                    if (key == "latency_count") {
                      
                      let obj = {
                        latency_count: item[key],
                        日期: date
                      };
                      self.ALLATTR["Table_latencyCount"].rows.push(obj);
                    } else if (
                      key == "latency_mean" ||
                      key == "latency_stddev"
                    ) {
                      table_stability_data[key] = item[key];
                    } else if (key.indexOf("rate") !== -1 ) {
                      table_latency_rate_data[key] = item[key];
                    } else {
                      //
                      table_box_data[key] = item[key];
                    }
                  }
                }
              }
               self.ALLATTR["Table_type"].rows.push(table_type_data);
              self.ALLATTR["Table_rate"].rows.push(table_rate_data);
              self.ALLATTR["Table_stability"].rows.push(table_stability_data);
              self.ALLATTR["Table_box"].rows.push(table_box_data);
              self.ALLATTR["Table_latencyRate"].rows.push(
                table_latency_rate_data
              );
            });
          }
        } else {
          self.$message.error(res.message);
        }
      });
    },
    unique: function(arr) {
      let ARR = [],
        obj = {},
        arr1 = arr;
      for (let o of arr1) {
        if (!obj[o.value]) {
          obj[o.value] = o.value;
          ARR.push(o);
        }
      }
      return ARR;
    },
    compare: function(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
      };
    },
    changeTimerRange: function(range) {},
    changeInterval: function() {
      let self = this;
      //self.refresh();
      if (self.ALLTIMER["Source_timer"]) {
        clearInterval(self.ALLTIMER["Source_timer"]);
        self.ALLTIMER["Source_timer"] = null;
        self.ALLTIMER["Source_timer"] = setInterval(function() {
          self.sourceStats();
        }, Number(self.selectedCircle) * 1000);
      }

      if (self.ALLTIMER["SourceMapper_timer"]) {
        clearInterval(self.ALLTIMER["SourceMapper_timer"]);
        self.ALLTIMER["SourceMapper_timer"] = null;
        self.ALLTIMER["SourceMapper_timer"] = setInterval(function() {
          self.sourceMapperStats();
        }, Number(self.selectedCircle) * 1000);
      }

      if (self.ALLTIMER["Job_timer"]) {
        clearInterval(self.ALLTIMER["Job_timer"]);
        self.ALLTIMER["Job_timer"] = null;
        self.ALLTIMER["Job_timer"] = setInterval(function() {
          self.jobStats();
        }, Number(self.selectedCircle) * 1000);
      }
      if (self.ALLTIMER["Sink_timer"]) {
        clearInterval(self.ALLTIMER["Sink_timer"]);
        self.ALLTIMER["Sink_timer"] = null;
        self.ALLTIMER["Sink_timer"] = setInterval(function() {
          self.sinkStats();
        }, Number(self.selectedCircle) * 1000);
      }
      if (self.ALLTIMER["SinkMapper_timer"]) {
        clearInterval(self.ALLTIMER["SinkMapper_timer"]);
        self.ALLTIMER["SinkMapper_timer"] = null;
        self.ALLTIMER["SinkMapper_timer"] = setInterval(function() {
          self.sinkMapperStats();
        }, Number(self.selectedCircle) * 1000);
      }
      if (self.ALLTIMER["Table_timer"]) {
        clearInterval(self.ALLTIMER["Table_timer"]);
        self.ALLTIMER["Table_timer"] = null;
        self.ALLTIMER["Table_timer"] = setInterval(function() {
          self.tableStats();
        }, Number(self.selectedCircle) * 1000);
      }
    },
    refresh: function(loading) {
      console.log("refresh");
      console.log(loading);
      let self = this;
      if (loading) {
        console.log("loading---------------");
        self.refreshLoading = true;
      }
      if (self.ALLTIMER["Source_timer"]) {
        self.sourceStats();
      }
      if (self.ALLTIMER["SourceMapper_timer"]) {
        self.sourceMapperStats();
      }

      if (self.ALLTIMER["Job_timer"]) {
        self.jobStats();
      }
      if (self.ALLTIMER["Sink_timer"]) {
        self.sinkStats();
      }
      if (self.ALLTIMER["SinkMapper_timer"]) {
        self.sinkMapperStats();
      }
      if (self.ALLTIMER["Table_timer"]) {
        self.tableStats();
      }
      if (loading) {
        self.refreshLoading = false;
      }
    }
  },
  mounted() {
    let self = this;
    this.$on("clearTimer", function() {
      console.log("clearTimer");
      for (let timer in self.ALLTIMER) {
        clearInterval(self.ALLTIMER[timer]);
        self.ALLTIMER[timer] = null;
      }
    });
    this.$on("Stats", function(data) {
      //data---node info
      console.log("***********stats*------************");
      console.log(data);
      if (!self.node) {
        self.node = data;
      } else {
        if (self.node.category+self.node.id !== data.category+data.id) {
          //不是同一个node
          self.node = data;
        } else {
          //连续点击同一个node
          return false;
        }
      }
      self.category = data.category;
      self.noUsed = "";
      //取消所有定时器
      if (Object.keys(self.ALLTIMER).length > 0) {
        for (let timer in self.ALLTIMER) {
          if (self.ALLTIMER[timer]) {
            clearInterval(self.ALLTIMER[timer]);
            self.ALLTIMER[timer] = null;
          }
        }
      }

      //清空所有已经选中的属性
      self.StreamSelectAttr = [];
      self.SourceSelectAttr = []; //选中的source --addMetric   name_Source_count
      self.JobSelectAttr = [];
      self.SinkSelectAttr = [];
      self.TableSelectAttr=[];
      self.streamAttr = [];
      self.sourceAttr = [];
      self.sinkAttr = [];
      self.jobAttr = [];
      self.tableAttr = [];
      // self.tableAttr = [];
      //
     

      if (data.category == "Source") {
        /*配置 sourceAttr*/
        self.sourceName = data.NAME;
        self.sourceAttr = [];
        let Source_rate_column = ["日期"];
        self.Source.forEach(function(item) {
          let obj = {};
          if (item == "count") {
            obj = {
              value: self.sourceName + "_Source_count",
              label: self.sourceName + "_Source_count"
            };
            if (!self.ALLATTR.Source_count) {
              self.$set(self.ALLATTR, "Source_count", {
                columns: ["日期", "count"],
                rows: []
              });
            }
          } else {
            //其他所有属性显示在一个线性图中 Source_rate
            obj = {
              value: self.sourceName + "_Source_rate",
              label: self.sourceName + "_Source_rate"
            };
            Source_rate_column.push(item);
          }
          self.sourceAttr.push(obj); //下拉列表
        });
        if (!self.ALLATTR.Source_rate) {
          self.$set(self.ALLATTR, "Source_rate", {
            columns: Source_rate_column,
            rows: []
          });
        }
        /*** SourceMapper**/
        let SourceMapper_rate_column = ["日期"],
          SourceMapper_stability_column = ["日期", "add", "reduce"],
          SourceMapper_box_column = ["日期"];
        self.sourceMapper.forEach(function(item1) {
          let obj = {};

          if (item1 == "count") {
            obj = {
              value: self.sourceName + "_SourceMapper_count",
              label: self.sourceName + "_SourceMapper_count"
            };
            if (!self.ALLATTR.SourceMapper_count) {
              self.$set(self.ALLATTR, "SourceMapper_count", {
                columns: ["日期", "count"],
                rows: []
              });
            }
          } else if (item1 == "mean" || item1 == "stdDev") {
            //stability stdDev
            obj = {
              value: self.sourceName + "_SourceMapper_stability",
              label: self.sourceName + "_SourceMapper_stability"
            };
            SourceMapper_stability_column.push(item1);
          } else if (item1.indexOf("Rate") !== -1) {
            //rate
            obj = {
              value: self.sourceName + "_SourceMapper_rate",
              label: self.sourceName + "_SourceMapper_rate"
            };
            SourceMapper_rate_column.push(item1);
          } else {
            obj = {
              value: self.sourceName + "_SourceMapper_box",
              label: self.sourceName + "_SourceMapper_box"
            };
            SourceMapper_box_column.push(item1);
          }
          self.sourceAttr.push(obj);
        });
        if (!self.ALLATTR.SourceMapper_rate) {
          self.$set(self.ALLATTR, "SourceMapper_rate", {
            columns: SourceMapper_rate_column,
            rows: []
          });
        }
        if (!self.ALLATTR.SourceMapper_stability) {
          self.$set(self.ALLATTR, "SourceMapper_stability", {
            columns: SourceMapper_stability_column,
            rows: []
          });
        }
        if (!self.ALLATTR.SourceMapper_box) {
          self.$set(self.ALLATTR, "SourceMapper_box", {
            columns: SourceMapper_box_column,
            rows: []
          });
        }
        /****************/
      }
      self.sourceAttr = self.unique(self.sourceAttr);

      if (data.category == "Stream") {
        self.streamName = data.NAME;
        self.streamAttr = [];
        let Stream_rate_column = ["日期"];
        self.Source.forEach(function(item) {
          //      let obj = {
          //     value: self.jobName + "_Job_" + item,
          //     label: self.jobName + "_Job_" + item
          // };
          let obj = {};
          if (item == "count") {
            obj = {
              value: self.streamName + "_Stream_count",
              label: self.streamName + "_Stream_count"
            };
            if (!self.ALLATTR.Stream_count) {
              self.$set(self.ALLATTR, "Stream_count", {
                columns: ["日期", "count"],
                rows: []
              });
            }
          } else {
            //其他所有属性显示在一个线性图中 Stream_rate
            Stream_rate_column.push(item);
            obj = {
              value: self.streamName + "_Stream_rate",
              label: self.streamName + "_Stream_rate"
            };
          }
          self.streamAttr.push(obj); //下拉列表
        });
        if (!self.ALLATTR.Stream_rate) {
          self.$set(self.ALLATTR, "Stream_rate", {
            columns: Stream_rate_column,
            rows: []
          });
        }
      }
      self.streamAttr = self.unique(self.streamAttr);
      if (data.category == "Job") {
        self.jobName = data.NAME;
        self.jobAttr = [];
        let Job_rate_column = ["日期"],
          Job_stability_column = ["日期", "add", "reduce"],
          Job_box_column = ["日期"];
        self.job.forEach(function(item1) {
          let obj = {};

          if (item1 == "count") {
            obj = {
              value: self.jobName + "_Job_count",
              label: self.jobName + "_Job_count"
            };
            if (!self.ALLATTR.Job_count) {
              self.$set(self.ALLATTR, "Job_count", {
                columns: ["日期", "count"],
                rows: []
              });
            }
          } else if (item1 == "value") {
            obj = {
              value: self.jobName + "_Job_value",
              label: self.jobName + "_Job_value"
            };
            if (!self.ALLATTR.Job_value) {
              self.$set(self.ALLATTR, "Job_value", {
                columns: ["日期", "value"],
                rows: []
              });
            }
          } else if (item1 == "mean" || item1 == "stdDev") {
            //stability stdDev
            obj = {
              value: self.jobName + "_Job_stability",
              label: self.jobName + "_Job_stability"
            };
            Job_stability_column.push(item1);
          } else if (item1.indexOf("Rate") !== -1) {
            //rate
            obj = {
              value: self.jobName + "_Job_rate",
              label: self.jobName + "_Job_rate"
            };
            Job_rate_column.push(item1);
          } else {
            obj = {
              value: self.jobName + "_Job_box",
              label: self.jobName + "_Job_box"
            };
            Job_box_column.push(item1);
          }
          self.jobAttr.push(obj);
        });
        if (!self.ALLATTR.Job_rate) {
          self.$set(self.ALLATTR, "Job_rate", {
            columns: Job_rate_column,
            rows: []
          });
        }
        if (!self.ALLATTR.Job_stability) {
          self.$set(self.ALLATTR, "Job_stability", {
            columns: Job_stability_column,
            rows: []
          });
        }
        if (!self.ALLATTR.Job_box) {
          self.$set(self.ALLATTR, "Job_box", {
            columns: Job_box_column,
            rows: []
          });
        }
      }
      self.jobAttr = self.unique(self.jobAttr);
      if (data.category == "Sink") {
        self.sinkName = data.NAME;
        self.sinkAttr = [];
        let Sink_rate_column = ["日期"];
        self.Source.forEach(function(item) {
          let obj = {};
          //   if(!self.ALLATTR["Source_" + item]){//用来存储不同属性的值
          //         self.$set(self.ALLATTR, "Source_" + item, {
          //                     columns: ["日期"],
          //                     rows: []
          //         }); //用来存储属性的chartData
          //   }
          if (item == "count") {
            obj = {
              value: self.sinkName + "_Sink_count",
              label: self.sinkName + "_Sink_count"
            };
            if (!self.ALLATTR.Sink_count) {
              self.$set(self.ALLATTR, "Sink_count", {
                columns: ["日期", "count"],
                rows: []
              });
            }
          } else {
            //其他所有属性显示在一个线性图中 Source_rate
            obj = {
              value: self.sinkName + "_Sink_rate",
              label: self.sinkName + "_Sink_rate"
            };
            Sink_rate_column.push(item);
          }
          self.sinkAttr.push(obj); //下拉列表
        });
        if (!self.ALLATTR.Sink_rate) {
          self.$set(self.ALLATTR, "Sink_rate", {
            columns: Sink_rate_column,
            rows: []
          });
        }
        /*** SourceMapper**/
        let SinkMapper_rate_column = ["日期"],
          SinkMapper_stability_column = ["日期", "add", "reduce"],
          SinkMapper_box_column = ["日期"];
        self.sourceMapper.forEach(function(item1) {
          let obj = {};

          if (item1 == "count") {
            obj = {
              value: self.sinkName + "_SinkMapper_count",
              label: self.sinkName + "_SinkMapper_count"
            };
            if (!self.ALLATTR.SinkMapper_count) {
              self.$set(self.ALLATTR, "SinkMapper_count", {
                columns: ["日期", "count"],
                rows: []
              });
            }
          } else if (item1 == "mean" || item1 == "stdDev") {
            //stability stdDev
            obj = {
              value: self.sinkName + "_SinkMapper_stability",
              label: self.sinkName + "_SinkMapper_stability"
            };
            SinkMapper_stability_column.push(item1);
          } else if (item1.indexOf("Rate") !== -1) {
            //rate
            obj = {
              value: self.sinkName + "_SinkMapper_rate",
              label: self.sinkName + "_SinkMapper_rate"
            };
            SinkMapper_rate_column.push(item1);
          } else {
            obj = {
              value: self.sinkName + "_SinkMapper_box",
              label: self.sinkName + "_SinkMapper_box"
            };
            SinkMapper_box_column.push(item1);
          }
          self.sinkAttr.push(obj);
        });
        if (!self.ALLATTR.SinkMapper_rate) {
          self.$set(self.ALLATTR, "SinkMapper_rate", {
            columns: SinkMapper_rate_column,
            rows: []
          });
        }
        if (!self.ALLATTR.SinkMapper_stability) {
          self.$set(self.ALLATTR, "SinkMapper_stability", {
            columns: SinkMapper_stability_column,
            rows: []
          });
        }
        if (!self.ALLATTR.SinkMapper_box) {
          self.$set(self.ALLATTR, "SinkMapper_box", {
            columns: SinkMapper_box_column,
            rows: []
          });
        }
        /****************/
      }
      self.sinkAttr = self.unique(self.sinkAttr);
      if (data.category == "Table") {
        let self = this;
        self.tableName = data.NAME;
        self.tableAttr = [];
        let Table_rate_column = ["日期"],
          Table_latency_rate_column = ["日期"],
          Table_stability_column = ["日期",'add','reduce','latency_stddev','latency_mean'],
          Table_box_column = ["日期"];
        self.Table.forEach(function(item) {
          let obj = {};
          if (item.indexOf("latency") == -1) {
            //非  latency
            if (item == "count") {
              obj = {
                value: self.tableName + "_Table_count",
                label: self.tableName + "_Table_count"
              };
              if (!self.ALLATTR.Table_count) {
                self.$set(self.ALLATTR, "Table_count", {
                  columns: ["日期", "count"],
                  rows: []
                });
              }
            } else if (item == "memory_value") {
            obj = {
              value: self.tableName + "_Table_memoryValue",
              label: self.tableName + "_Table_memoryValue"
            };
            if (!self.ALLATTR.Table_value) {
              self.$set(self.ALLATTR, "Table_value", {
                columns: ["日期", "memory_value"],
                rows: []
              });
            }
          }else {
              //其他所有属性显示在一个线性图中 Source_rate
              obj = {
                value: self.tableName + "_Table_rate",
                label: self.tableName + "_Table_rate"
              };
              Table_rate_column.push(item);
            }
          } else {
            if (item.indexOf("count") !== -1) {
              obj = {
                value: self.tableName + "_Table_latencyCount",
                label: self.tableName + "_Table_latencyCount"
              };
              if (!self.ALLATTR.Table_latency_count) {
                self.$set(self.ALLATTR, "Table_latencyCount", {
                  columns: ["日期", "latency_count"],
                  rows: []
                });
              }
            } else if (item.indexOf("rate") !== -1) {
              //其他所有属性显示在一个线性图中 Source_rate
              obj = {
                value: self.tableName + "_Table_latencyRate",
                label: self.tableName + "_Table_latencyRate"
              };
              Table_latency_rate_column.push(item);
            } else if (
              item == 'latency_mean' ||
              item == "latency_stddev"
            ) {
              //stability stdDev
              obj = {
                value: self.tableName + "_Table_stability",
                label: self.tableName + "_Table_stability"
              };
              //Table_stability_column.push(item);
            } else {
              obj = {
                value: self.tableName + "_Table_box",
                label: self.tableName + "_Table_box"
              };
              Table_box_column.push(item);
            }
          }
          self.tableAttr.push(obj); //下拉列表
          //type  单独设置
          self.tableAttr.push({
            value: self.tableName + "_Table_type",
            label: self.tableName + "_Table_type"
          });

          self.tableAttr = self.unique(self.tableAttr);
          if (!self.ALLATTR.Table_type) {
            self.$set(self.ALLATTR, "Table_type", {
              columns: ["type"],
              rows: []
            });
          }
          if (!self.ALLATTR.Table_rate) {
            self.$set(self.ALLATTR, "Table_rate", {
              columns: Table_rate_column,
              rows: []
            });
          }

          if (!self.ALLATTR.Table_latency_rate) {
            self.$set(self.ALLATTR, "Table_latencyRate", {
              columns: Table_latency_rate_column,
              rows: []
            });
          }

          if (!self.ALLATTR.Table_stability) {
            self.$set(self.ALLATTR, "Table_stability", {
              columns: Table_stability_column,
              rows: []
            });
          }

          if (!self.ALLATTR.Table_box) {
            self.$set(self.ALLATTR, "Table_box", {
              columns: Table_box_column,
              rows: []
            });
          }
        });
      }
    });
  }
};
</script>
<style scoped>
.Table .el-table::before {
  height: 0px;
}
.echartsButton .el-button--boxi {
  padding: 2px 5px;
}
.echartsButton {
  z-index: 5;
  width: 100%;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px;
}
</style>
