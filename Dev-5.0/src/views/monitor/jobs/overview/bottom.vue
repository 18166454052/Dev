<template>
<div>
   <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="子任务" name="subtasks">
      
       
           
        <el-table
            size="mini"
            :data="vertices"
           
            style="width: 100%">
            <el-table-column
            prop="start-time"
            label="开始时间"
            align="left"
            width="150px"
            >
            <template slot-scope="scope">
                {{scope.row['start-time'] | unixTime(true)}}
            </template>
            </el-table-column>
            <el-table-column
            prop="end-time"
            label="结束时间"
            align="left"
            width="150px"
            >
            <template slot-scope="scope">
                {{scope.row['end-time'] | unixTime(true)}}
            </template>
            </el-table-column>
            <el-table-column
            prop="duration"
            label="持续时间"
            align="left"
            width="100px"
            >
             <template slot-scope="scope">
                {{scope.row['duration']>1000?scope.row['duration']/1000 +'s':scope.row['duration'] +"ms"}}
            </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="项目名称"
            align="left"
            >
            </el-table-column>
            <el-table-column
            label="接收字节"
            align="left"
            width="100px"
            >
            <template slot-scope="scope">
                {{scope.row.metrics['read-bytes'] |countBytes}}
            </template>
            </el-table-column>
            <el-table-column
            label="接收纪录"
            align="left"
            width="100px"
            >
            <template slot-scope="scope">
                {{scope.row.metrics['read-records'] |countBytes}}
            </template>
            </el-table-column>
            <el-table-column
            label="发送字节"
            align="left"
            width="100px"
            >
            <template slot-scope="scope">
                {{scope.row.metrics['write-bytes'] |countBytes}}
            </template>
            </el-table-column>
            <el-table-column
            label="发送纪录"
            align="left"
            width="100px"
            >
            <template slot-scope="scope">
                {{scope.row.metrics['write-records'] |countBytes }}
            </template>
            </el-table-column>
            >
            <el-table-column
            prop="parallelism"
            label="排比"
            align="left"
            width="50px"
            >
           
            </el-table-column>
            <el-table-column
            prop="tasks"
            label="任务"
            align="left"
             width="220px"
            >
            <template slot-scope="scope">
               <v-task :tasks="scope.row.tasks"></v-task>
            </template>
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态"
            align="left"
            width="100px"
            >
            <template slot-scope="scope">
                <el-button size="mini" type="primary" v-show="scope.row.status=='RUNNING'">{{scope.row.status}}</el-button>
                <el-button size="mini" type="danger" v-show="scope.row.status=='FAILED'">{{scope.row.status}}</el-button>
                <el-button size="mini" type="warning" v-show="scope.row.status=='CANCELED'">{{scope.row.status}}</el-button>
                <el-button size="mini" type="success" v-show="scope.row.status=='FINISHED'">{{scope.row.status}}</el-button>
            </template>
            </el-table-column>
        </el-table>
        
    </el-tab-pane>
    <!-- <el-tab-pane label="任务指标" name="metrics">任务指标</el-tab-pane>
    <el-tab-pane label="水印" name="watermarks">水印</el-tab-pane>
    <el-tab-pane label="蓄电池" name="accumulators">
        <el-table
            size="mini"
            :data="vertices"
           style="width: 100%">
            <el-table-column
            prop="name"
            label="项目名称"
            align="left"
            >
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态"
            align="left"
            width="100px"
            >
            <template slot-scope="scope">
                <el-button size="mini" type="success">{{scope.row.status}}</el-button>
            </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
    <el-tab-pane label="检查点" name="checkpoints">检查点</el-tab-pane> -->
  </el-tabs>
</div>
</template>
<script>
import TasksList from "../tasksList";
export default {
    components:{
        'v-task':TasksList
    },
    props:["vertices"],
    data(){
        return {
            activeName:"subtasks",
            subtasks:[
                {
                    id: "e07449b3aa6dd35a8f8d3c2695dce33e",
                    name: "CHAIN DataSource (at createInput(ExecutionEnvironment.java:548) (org.apache.flink.api.java.io.jdbc.JDBCInputFormat)) -> Filter (Filter at main(Apptest.java:41))",
                    parallelism: 1,
                    status: "FINISHED",
                    'start-time': 1544507888316,
                    'end-time': 1544507896777,
                    duration: 8461,
                    tasks: {
                        FAILED: 0,
                        SCHEDULED: 0,
                        CREATED: 0,
                        CANCELING: 0,
                        CANCELED: 0,
                        FINISHED: 1,
                        RECONCILING: 0,
                        RUNNING: 0,
                        DEPLOYING: 0
                    },
                    metrics: {
                        'read-bytes': 0,
                        'read-bytes-complete': true,
                        'write-bytes': 7602176,
                        'write-bytes-complete': true,
                        'read-records': 293760,
                        'read-records-complete': true,
                        'write-records': 587520,
                        'write-records-complete': true
                    }
                }
            ],
        }
       
    }
}
</script>
