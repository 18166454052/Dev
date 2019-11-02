<template>
    <div class="app-container">
        <div class="Box">
            <div class="title">工作总数</div>
            <el-table
            size="mini"
            :show-header="false"
            :data="overviewList"
            style="width: 100%">
            <el-table-column
            prop="type"
            label="运行状态"
            align="left"
            >
            </el-table-column>
            <el-table-column
            prop="value"
            label="数量"
            align="right"
            width="180">
            <template slot-scope="scope">
                <el-button size="mini" :type="scope.row.color"  circle>{{scope.row.value}}</el-button>
            </template>
            </el-table-column>
            
           </el-table>
        </div>
        
         <div class="Box m-t Jobs">
            <div class="title">运行工作</div>
            <el-table
            size="mini"
            :data="RUNNING"
            style="width: 100%">
            <el-table-column
            prop="start-time"
            label="开始时间"
            align="left"
            width="200px"
            >
            <template slot-scope="scope">
                {{scope.row['start-time'] | unixTime(true)}}
            </template>
            </el-table-column>
            <el-table-column
            prop="end-time"
            label="结束时间"
            align="left"
            width="200px"
            >
            <template slot-scope="scope">
                {{scope.row['end-time'] | unixTime(true)}}
            </template>
            </el-table-column>
            <el-table-column
            prop="duration"
            label="持续时间"
            align="left"
            width="200px"
            >
             <template slot-scope="scope">
                {{scope.row['duration']/1000 +'s' }}
            </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="项目名称"
                align="left"
            >
            </el-table-column>
            <el-table-column
            prop="jid"
            label="项目ID"
            align="left"
            >
            </el-table-column>
            <el-table-column
            prop="tasks"
            label="任务"
            align="left"
            >
            <template slot-scope="scope">
                <v-task :tasks="scope.row['status-counts']"></v-task>
            </template>
            </el-table-column>
            <el-table-column
            prop="state"
            label="状态"
            align="left"
            width="100px"
            >
            <template slot-scope="scope">
                <el-button size="mini" type="primary" v-show="scope.row.state=='RUNNING'">{{scope.row.state}}</el-button>
                <el-button size="mini" type="danger" v-show="scope.row.state=='FAILED'">{{scope.row.state}}</el-button>
                <el-button size="mini" type="warning" v-show="scope.row.state=='CANCELLED'">{{scope.row.state}}</el-button>
                <el-button size="mini" type="success" v-show="scope.row.state=='FINISHED'">{{scope.row.state}}</el-button>
            </template>
            </el-table-column>
         </el-table>
        </div>
        <div class="Box m-t Jobs">
            <div class="title">完成工作</div>
            <el-table
            size="mini"
            :data="FINISHED"
            @row-click="toDetail"
            style="width: 100%">
            <el-table-column
            prop="start-time"
            label="开始时间"
            align="left"
            width="200px"
            >
            <template slot-scope="scope">
                {{scope.row['start-time'] | unixTime(true)}}
            </template>
            </el-table-column>
            <el-table-column
            prop="end-time"
            label="结束时间"
            align="left"
            width="200px"
            >
            <template slot-scope="scope">
                {{scope.row['end-time'] | unixTime(true)}}
            </template>
            </el-table-column>
            <el-table-column
            prop="duration"
            label="持续时间"
            align="left"
            width="200px"
            >
             <template slot-scope="scope">
                {{scope.row['duration']/1000 +'s' }}
            </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="项目名称"
            align="left"
            >
            </el-table-column>
            <el-table-column
            prop="jid"
            label="项目ID"
            align="left"
            >
            </el-table-column>
            <el-table-column
            prop="tasks"
            label="任务"
            align="left"
            >
            <template slot-scope="scope">
                <v-task :tasks="scope.row['status-counts']"></v-task>
                
            </template>
            </el-table-column>
            <el-table-column
            prop="state"
            label="状态"
            align="left"
            width="100px"
            >
             <template slot-scope="scope">
                <el-button size="mini" type="primary" v-show="scope.row.state=='RUNNING'">{{scope.row.state}}</el-button>
                <el-button size="mini" type="danger" v-show="scope.row.state=='FAILED'">{{scope.row.state}}</el-button>
                <el-button size="mini" type="warning" v-show="scope.row.state=='CANCELLED'">{{scope.row.state}}</el-button>
                <el-button size="mini" type="success" v-show="scope.row.state=='FINISHED'">{{scope.row.state}}</el-button>
            </template>
            </el-table-column>
         </el-table>
        </div>
    </div>
</template>
<script>
import {overview , jobs, jobById} from "@/api/monitor/index.js"
import TasksList from "./jobs/tasksList";
export default {
    components:{
        'v-task':TasksList
    },
    data(){
        return {
            overviewList:[
                {type:'运行中',value:0,color:'primary'},
                {type:'结束',value:0,color:'success'},
                {type:'取消',value:0,color:'warning'},
                {type:'失败',value:0,color:'danger'}

            ],
            RUNNING:[
                // {
                //     start_time:'2018-09-12',
                //     end_time:'2018-09-13',
                //     duration:'4m 3s',
                //     job_name:'name1',
                //     job_id:'123456789',
                //     tasks:'801659296',
                //     status:'RUNNING'
                // }
            ],
            FINISHED:[],
            interval:null
           

        }
    },
    methods:{
        getOverview:function(){
            overview().then(res=>{
                /*
                  { jobs-cancelled: 0
                    jobs-failed: 0
                    jobs-finished: 1
                    jobs-running: 0
                  }
                */
                this.overviewList[0].value=res['jobs-running'];
                this.overviewList[1].value=res['jobs-finished'];
                this.overviewList[2].value=res['jobs-cancelled'];
                this.overviewList[3].value=res['jobs-failed'];
            })
        },
        getJob:function(){
            jobs().then(res=>{
               if(res['jobs'].length>0){
                   res['jobs'].forEach(job=>{
                        this.getJobById(job.id);
                   });
                  
               }
            });
        },
        getJobById:function(id){
            jobById({jid:id}).then(res=>{
                if(res.state=="RUNNING"){
                    this["RUNNING"].push(res);
                }
                else{
                   this["FINISHED"].push(res);  
                }
                
            })
        },
        toDetail:function(row, event, column){
            this.$router.push("/jobs/"+row.jid);
        },
        Interval:function(){
            this.interval=setInterval(()=>{
                this.getOverview();
                this.getJob(); 
            },2000);
        }
    },
    created:function(){
        this.getOverview();
        this.getJob();
        //this.Interval();
    },
    beforeDestroy:function(){
        clearInterval(this.interval);
        this.interval=null;
    }
}
</script>
<style scoped>
.Box{
    border:1px solid #EBEEF5;
    border-bottom:none;
    border-radius:3px;
}
.Box .title{
    background:rgb(245,245,245);
    text-indent: 10px;
    border-bottom:1px solid #DCDFE6;
}
</style>



