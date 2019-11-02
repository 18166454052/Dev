<template>
  <div class="app-container pt-none">
    <div class="m-t">
       <el-row>
        <el-col :span="24">
          <span  class="TITLE" >数据库列表</span>
        </el-col>
        
      </el-row>
      <el-row>
              <el-col :span="18">
                  &nbsp;
                <el-form ref="form" v-if="hasPerm('datasource:list')"
                :inline="true" :label-position="'right'" class="Form" label-width="120px" size="mini">
                    <el-form-item label="按数据库类型过滤 :">
                        <el-select v-model="forListGraph"  clearable>
                              <el-option v-for="graph in dataBase" 
                              v-show="graph.num<4"
                              :label="graph.value"  
                              :value='graph.num'
                              :key="graph.value"
                              ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                          <el-button  type="primary" size="mini" @click="filtersourceConfigList">确定</el-button>
                    </el-form-item>
                </el-form>
              </el-col>
             <el-col :span="6" class="text-right" v-if="hasPerm('datasource:add')"> 
                <el-button type="primary" size="mini"
                    @click="showCreate"
                    >创建数据库</el-button>
            </el-col>

            </el-row>    
    </div> 
    <div class="Table pointer" >
      <el-table 
          :data="dataSourceList"
          style="width: 100%"
          align="center"
          size="mini"
          border
          >
          <el-table-column
              prop="datasource_name"
              label="数据库名称"
              align="center"
              >
          </el-table-column>
           <el-table-column
              prop="source_type"
              label="数据库类型"
              align="center"
              >
              <template slot-scope="scope">
                  {{['oracle','sql_server','mysql'][scope.row.source_type-1]}}
              </template>
          </el-table-column>
          <el-table-column
              prop="create_time"
              label="创建时间"
                align="center"
              >
              <!-- <template slot-scope="scope">
                   {{scope.row.create_time | sliceTime}}
              </template> -->
          </el-table-column>
            <el-table-column
              label="操作"
                align="center"
              >
            <template slot-scope="scope">
              <el-button  class="button-link"  type="text" @click="showUpdate(scope)" v-if="hasPerm('datasource:update')">编辑</el-button>
              <el-button  class="button-link"  type="text" @click="delInfo(scope)" v-if="hasPerm('datasource:delete')">删除</el-button>
              
          </template>
          </el-table-column>
      </el-table>
    </div>
 <div class="m-t text-center" v-show="total>0">
        <el-pagination
           background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="pageSize"
            :page-sizes="[10,20,30]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
    <div>
    </div>
    <el-dialog
       
        :title="spcActionType=='create'?'创建数据库':'编辑数据库'"
        :close-on-click-modal='false'
        :visible.sync="showSettingForm"
        :show-close='false'
        class="dialog setting-form"
        width="700px">

        <el-form label-position="right" 
        ref="dataSourceForm"
        label-width="110px"  
        class="Form FormError" 
        size="mini"
        :model="dataSourceForm"
        :rules="rules" 
         
        >
            <el-row>
                <el-col>
                    <el-form-item  label="数据库名称 :"  required  prop="datasource_name">
                        <el-col :span="22"><el-input  v-model="dataSourceForm.datasource_name"> </el-input></el-col>
                    </el-form-item>
                    <el-form-item  label="数据库类型 :" required  prop="source_type">
                        <el-col :span="22">
                          <el-select v-model="dataSourceForm.source_type" clearable>
                              <el-option  v-for="db in dataBase" 
                              :label="db.value"  
                              :value='db.num' 
                              :key="db.value"></el-option>
                          </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item  label="数据库地址 :"  prop="address"  class="required">
                        <el-col :span="22"><el-input  v-model="dataSourceForm.address"> </el-input></el-col>
                    </el-form-item>
                    <el-form-item  label="数据库端口号 :"  prop="port">
                        <el-col :span="22"><el-input  v-model.number="dataSourceForm.port"> </el-input></el-col>
                    </el-form-item>
                    <el-form-item  label="数据库账号 :"  prop="username">
                        <el-col :span="22"><el-input  v-model="dataSourceForm.username" > </el-input></el-col>
                    </el-form-item>
                    <el-form-item  label="数据库密码 :"   prop="password">
                        <el-col :span="22"><el-input  v-model="dataSourceForm.password" type="password"> </el-input></el-col>
                    </el-form-item>
                    <el-form-item  label="库名称 :"   prop="database_name">
                        <el-col :span="22"><el-input  v-model="dataSourceForm.database_name" > </el-input></el-col>
                    </el-form-item> 
                     <el-form-item  label="描述 :" >
                        <el-col :span="22"><el-input  v-model="dataSourceForm.comment"> </el-input></el-col>
                    </el-form-item>   
                </el-col>  
            </el-row>        
        </el-form>
        <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">
            <span slot="footer" class="dialog-footer" >
                <!-- <el-button v-show="spcActionType=='update' && filedsForSearch.length>0"   type="primary"  size="mini" :loading="loadingSearch" @click="search">查询</el-button>
                 -->
                <el-button type="primary"  size="mini" :loading="loadingSave"  v-show="spcActionType=='create'"  @click="createSourceConfig">创建</el-button>
                 <el-button type="primary"  size="mini" :loading="loadingSave" v-show="spcActionType=='update'" @click="submit">保存</el-button>
                <el-button size="mini"  @click="cancel">取消</el-button>
            </span>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { 

    sourceConfigCreate,
    sourceConfigList,
    sourceConfigUpdate,
    sourceConfigDelete,
    sourceConfigDetail

} from "@/api/config/datasourceConfig"
export default { 
    data(){ 
        return {
        dataSourceForm: {
           datasource_name:'', 
            source_type: "",
            address:"",
            port:'',
            username:'',
            password:'',
            database_name:'',
            comment:''
        },
        dataSource: {
          datasource_name:'', 
            source_type: "",
            address:"",
            port:'',
            username:'',
            password:'',
            database_name:'',
            comment:''
        },
        rules:{
           datasource_name:[
              { required: true, message: '请填写数据库名称',trigger: 'change,blur'}
            ], 
            source_type:[
              { required: true, message: '请选择数据库类型',trigger: 'change'}
            ],
            address:[
              { required: true, message: '请填写数据库地址',trigger: 'change,blur'}
            ],
            port:[
              { required: true, message: '请填写数据库端口号',trigger: 'change,blur'},
              {  type:'number', message: '数据库端口号只能是数字',trigger: 'change,blur'}
            ],
            username:[
              { required: true, message: '请填写数据库账号',trigger: 'change,blur'}
            ],
            password:[
              { required: true, message: '请填写数据库密码',trigger: 'change,blur'}
            ],
            database_name:[
              { required: true, message: '请填写库名称',trigger: 'change,blur'}
            ],
        },
        dataBase:[
            {num:1,value:'oracle'},
            {num:2,value:'sql_server'},
            {num:3,value:'mysql'},
        ],
        dataSourceList:[
            // {
            //     datasource_name:'name',
            //     create_time:'2018-09-11'
            // }
        ],
        spcActionType:'',
        showSettingForm:false,
        pageSize:10,
        page:1,
        total:0,
        loadingSave:false,
        forListGraph:'', //按类型筛选
        INDEX:'',
      }
    },
    methods:{
        showCreate (){
            this.dataSourceForm=Object.assign({},this.dataSource);
            this.showSettingForm =true;
            this.spcActionType='create';
            let self=this;
            this.$nextTick(()=>{
                this.$refs.dataSourceForm.resetFields();
          });
        },
        showUpdate:function(scope){//列表编辑按钮
          //获取详细信息
            let self=this;
            self.INDEX=scope.$index;
            this.showSettingForm =true;
            this.spcActionType='update';
            self.dataSourceForm=Object.assign({},scope.row);
            /*
             sourceConfigDetail({spc_source_id:scope.row.spc_source_id}).then(function(res){
               if(res.resCode==0){
                  console.log(res)
                 let data=res.data;
                  self.$nextTick(function(){
                     self.dataSourceForm=data;
                  });
                  
               }
               else{
                    self.$message({
                      message:res.msg,
                      type:'error'
                    })
               }
           });
           */
         // console.log(scope);
           
        },
        filtersourceConfigList:function(){
              this.page=1;
              this.getsourceConfigList();
        },
        getsourceConfigList:function(){
            let data={
                page:this.page,
                page_size:this.pageSize
            }
            if(this.forListGraph){
                 data.source_type=this.forListGraph;
            }
             sourceConfigList(data).then((res)=>{
                if(res.resCode==0){
                    console.log(res);
                    this.dataSourceList=res.data.dataList;
                    this.total=res.data.dataCount;
                }
                else{
                    this.$message.error(res.msg);
                }

             })
        },
        createSourceConfig:function(){//创建
           
            this.$refs.dataSourceForm.validate(response=>{
                if(response){
                    this.loadingSave=true;
                    sourceConfigCreate(this.dataSourceForm).then((res)=>{
                        this.loadingSave=false;
                        if(res.resCode==0){
                            this.dataSourceList.unshift(res.data);
                            this.showSettingForm=false;
                            this.$message.success(res.msg);
                            this.total+=1;
                        }
                        else{
                            this.$message.error(res.msg)
                        }
                    })

                }
            })
           
        },
        delInfo:function(scope){
            let self=this;
            //  this.$store.commit('setDeleteDialog',true);
            //  this.dataSourceInfo=scope;
             self.$confirm('确定删除这条信息?', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'warning'
            }).then(() => {
                   sourceConfigDelete({data_datasource_id:scope.row.data_datasource_id}).then(res=>{
                         if(res.resCode==0){
                              this.$message.success(res.msg);
                              this.dataSourceList.splice(scope.$index,1);
                              this.total-=1;
                         }
                         else{
                             this.$message.error(res.msg);
                         }
                   });

            }).catch(()=>{

            })
        },
        cancel:function(){
              this.showSettingForm=false;
              this.dataSourceForm=Object.assign({},this.dataSource);
        },
        submit:function(scope){//编辑
              this.$refs.dataSourceForm.validate(response=>{
                   if(response){
                       this.loadingSave=true;
                       sourceConfigUpdate(this.dataSourceForm).then(res=>{
                            this.loadingSave=false;
                            if(res.resCode==0){
                                console.log(res);
                                this.dataSourceList.splice(this.INDEX,1,res.data);
                                this.showSettingForm=false;
                                this.$message.success(res.msg); 
                                this.dataSourceForm={
                                                   datasource_name:'', 
                                                    source_type: "",
                                                    address:"",
                                                    port:'',
                                                    username:'',
                                                    password:'',
                                                    database_name:'',
                                                    comment:''
                                                }
                            }
                            else{
                                this.$message.error(res.msg)
                            }
                       })
                   }
              });
        },
        handleSizeChange: function(val) {
          //this.$store.commit('SET_PAGESIZE',val);
          let self = this;
          this.pageSize = Number(val);
          this.page = 1;
          this.getsourceConfigList();

        },
        handleCurrentChange: function(val) {
          let self = this;
          this.page = Number(val);
          this.getsourceConfigList();
        },
    },
    created:function(){
        this.getsourceConfigList();
        
    }
}
</script>
