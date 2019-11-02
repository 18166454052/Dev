<template>
<div class="app-container">
    <el-form size="mini" :inline="true" label-width="40">
        <el-col :span="24">
            <el-form-item label="时间 :">
                <el-date-picker
                    
                    v-model="beginTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选则开始日期" 
                >  
                </el-date-picker> 
            </el-form-item>
            <el-form-item label="至">
                <el-date-picker
                    
                    v-model="endTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选则结束日期" 
                >  
                </el-date-picker> 
            </el-form-item>
            
            <!-- <el-form-item label="用户 :">
                <el-select v-model="userId"
                >
                </el-select>
            </el-form-item> -->
            
            <el-form-item >
                <el-button @click="getLoglist" type="primary" size="mini" :disabled="(!beginTime && !endTime)">查询</el-button>
            </el-form-item>
        </el-col>
    </el-form>

 <div class="Table">
 <el-table
    :data="logList"
    border
    stripe
    
    style="width: 100%">
    <el-table-column
      prop="userId"
      label="用户"
      align="center"
    >
    <template slot-scope="scope">
        {{scope.row.tbUser.username}}
    </template>
    </el-table-column>
    <el-table-column
      prop="methodName"
      label="接口"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="operationType"
      label="操作类型"
      align="center"
      width="100"
    >
     <template slot-scope="scope">
         {{['增','删','改','查',][scope.row.operationType-1]}}
     </template>
    </el-table-column>
    <el-table-column
      prop="visitDate"
      label="访问时间"
      align="center"
      width="200"
    >
     <template slot-scope="scope">
        {{scope.row.visitDate | unixTime("1")}}
    </template>
    </el-table-column>
    <el-table-column
      prop="respDate"
      label="响应时间"
      align="center"
    >
   </el-table-column>
    <el-table-column
      prop="params"
      label="参数"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="errorMsg"
      label="错误信息"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="results"
      label="返回值"
      align="center"
    >
    </el-table-column>
   
  
   
   
  </el-table>
  </div>   
    <div class="m-t text-center" v-show="total>0">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="size"
            :page-sizes="[5,10,20,30]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>



</div>
</template>
<script>
//import {} from "@/api/user/login"
import {logList} from "@/api/logger"
export default {
    data(){
        return {
          beginTime:'',
          endTime:'',
          userId:'',
          total:0,
          page:1,
          size:20,
          userList:[
            {

            }
          ],
          logList:[
             
          ],
          fullLoading: null,
          LOADING: {
            lock: true,
            text: '数据加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.6)'
          },
        }
    },
    methods:{
        getLoglist:function(){
            let data={
                beginTime:this.beginTime,
                endTime:this.endTime,
                page:this.page,
                size:this.size
            };
            this.fullLoading=this.$loading(this.LOADING);
            logList(data).then(res=>{
                this.fullLoading.close();
                if(res.code==200){
                    this.total=res.data.length;
                    this.logList=res.data;
                }
                else{
                    this.$message.error(res.message);
                }
            });

        },
        handleSizeChange: function(val) {
            this.size = Number(val);
            this.page = 1;
            this.getLoglist();

        },
        handleCurrentChange: function(val) {
        
            this.page = Number(val);
            this.getLoglist();
        },
    },
    created:function(){
        this.getLoglist();
    },
    beforeDestroy:function(){
        if(this.fullLoading){
            this.fullLoading.close();
        }
    }
}
</script>
