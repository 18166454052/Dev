<template>
<div>
    <el-card class="box-card" :body-style="{background:'rgb(245,245,245)',padding:0}">
         <el-row class="jobs">
            <el-col  :span="6">{{RUNNING.name}}</el-col>
            <el-col :span="4" >{{RUNNING.jid}}</el-col>
            <el-col :span="4" >
                {{RUNNING['start-time'] | unixTime(true)}}-{{RUNNING['end-time'] | unixTime(true)}} 
            </el-col>
            <el-col :span="2" >{{RUNNING.duration}}</el-col>
            <el-col :span="4" style="padding:0">
                <v-task :tasks="RUNNING.tasks"></v-task>
            </el-col>
         </el-row>
   </el-card>
   
  <div class="app-container" style="padding-bottom:0px">
        <el-tabs v-model="activeName"  class="m-t"  >
            <el-tab-pane label="概观" name="Overview"></el-tab-pane>
            <!-- <el-tab-pane label="时间线" name="Timeline"></el-tab-pane> -->
            <el-tab-pane label="错误" name="Exception"></el-tab-pane>
            <el-tab-pane label="配置" name="Configuration"></el-tab-pane>
        </el-tabs>
        <v-overview v-show="activeName=='Overview'"
                ref="overview"
            
        >
        <v-overview-bottom slot="bottom"
         :vertices="vertices"
        ></v-overview-bottom>
        </v-overview>
        <!-- <v-timeline v-show="activeName=='Timeline'"></v-timeline> -->
        <v-exception v-show="activeName=='Exception'"
        :exception="exception"
        ></v-exception>
        <v-configuration v-show="activeName=='Configuration'"
        :config="config"
        ></v-configuration>
  </div>     
</div>

</template>
<script>
import Overview from './jobs/overview/top'
import Timeline from './jobs/timeline'
import Exceptions from './jobs/exceptions'
import configuration from './jobs/configuration'
import OverviewBottom from "./jobs/overview/bottom";
import {jobById, jobExceptions, jobConfig} from "@/api/monitor/index.js"
import TasksList from "./jobs/tasksList";
export default {
    components:{
       'v-overview':Overview,
       'v-timeline':Timeline,
       'v-exception':Exceptions,
       'v-configuration':configuration,
       'v-overview-bottom':OverviewBottom,
       'v-task':TasksList
    },
    data(){
        return {
            activeName:'Overview',
            RUNNING:{
                    'start-time':'2018-09-12',
                    'end-time':'2018-09-13',
                    duration:'4m 3s',
                    'name':'name1',
                    jid:'123456789',
                    tasks:{},
                    status:'RUNNING'
            },
            data:{
                "class": "go.GraphLinksModel",
                "nodeDataArray": [ 
                //   {"category":"Source", "text":"Stream", "key":-1, "id":6, "NAME":"Stream1"},
                //   {"category":"Source", "text":"Source", "key":-2, "id":9, "NAME":"Source1"},
                //   {"category":"Source", "text":"Job", "key":-4, "id":3, "NAME":"Job1"}
                ],
                "linkDataArray": [ 
                //   {"from":-2, "to":-1},
                //   {"from":-1, "to":-4}
                ]
            },
            jId:'',
            vertices:[],
            exception:{},
            config:{}
        }
    },
     methods:{
       
        getJobDetail:function(){
            jobById({jid:this.jId}).then(res=>{
                //
                this.vertices=res.vertices;
                //
                this.RUNNING['start-time']=res['start-time'];
                this.RUNNING['end-time']=res['end-time'];
                this.RUNNING['duration']=res['duration'];
                this.RUNNING['name']=res['name'];
                this.RUNNING['jid']=res['jid'];
                this.RUNNING['status']=res['state'];
                this.RUNNING['tasks']=res['status-counts'];
                //
                let nodeData=[],linkData=[];
               if(res.plan.nodes.length>0){
                   res.plan.nodes.forEach(node=>{
                       //data
                        if (res.vertices && res.vertices.length) {
                            let detail = res.vertices.find(vertex => {
                                return vertex.id === node.id;
                            });
                            // node Data
                            /*
                            1 operator
                            2 text
                            3 parallelism
                            4 operator_strategy
                            */
                            nodeData.push({"category":"Source", "text":detail.name, "key":node.id, "id":node.id, 
                                    "parallelism":"parallelism :"+node.parallelism,"operator_strategy":"Operation :"+node.operator_strategy,
                                    "operator":node.operator});
                        }
                        //link
                        if (node.inputs && node.inputs.length) {
                            node.inputs.forEach(input => {
                                linkData.push({"from":input.id, "to":node.id,"text":input.ship_strategy});
                            });
                        }
                   });
                   this.data["nodeDataArray"]=nodeData;
                   this.data["linkDataArray"]=linkData;
                  this.$refs.overview.$emit('data',this.data);
               }
            })
        },
        getException:function(){
            jobExceptions({id:this.jId}).then(res=>{
                this.exception=res;
            });
        },
        getConfig:function(){
            jobConfig({id:this.jId}).then(res=>{
                this.config=res;
            });
        }
    },
    mounted:function(){
        this.jId=this.$route.params.id;
        this.getJobDetail();
        this.getException();
        this.getConfig()
       // this.init();
    }
}
</script>
<style scoped>
.jobs div{
    padding:20px ; 
    border-left:1px solid #ddd;
}
.jobs div:first-child{
    border-left:none;
}


</style>

