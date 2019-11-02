<template>
    <div>
        <!--database  列表-->
        <el-row v-show="!showAdd" >
            <el-col :span="12">
                <el-input
                    placeholder="使用数据源名称搜索"
                    prefix-icon="el-icon-search"
                    @input="filterDatabase"
                    v-model="searchDatabase">
                </el-input>
            </el-col>
            <el-col :span="12" class="text-right">
                <el-button type="primary" size="small"  @click="showAdd=true;type='create'">
                        <i class="el-icon-plus m-r-5"></i>创建
                </el-button>
            </el-col>
            <el-col :span="24">
                <div class="m-t-10 CardList">
                                <el-row class="m-t ConfigListTitle">
                                    <el-col :span="7" style="padding-left:26px">数据源名称</el-col>
                                    <el-col :span="6">数据源类型</el-col>
                                    <el-col :span="7">创建时间</el-col>
                                    <el-col :span="4" class="text-right" style="padding-right:20px">操作</el-col>
                                </el-row>
                                <el-card class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                      v-for="(db,index) in filterDatabaseList" :key="db.configDatasourceId+'_db_'">
                                   <el-row>
                                       <el-col :span="7" style="line-height:28px;padding-left:20px">
                                         
                                           &nbsp;<span>{{db.configDatasourceName}}</span>
                                       </el-col>
                                       <el-col :span="6" style="line-height:28px">
                                          
                                            &nbsp;<span>{{['orcal','sql_server','mysql'][db.databaseType-1]}}</span>
                                       </el-col>
                                       <el-col :span="7" style="line-height:28px">
                                          
                                            &nbsp;<span>{{db.createTime | unixTime}}</span>
                                       </el-col>
                                       
                                       <el-col :span="4" class="text-right">
                                           <el-button @click="showUpdate(db,index)" type="primary" size="mini"><i class="el-icon-edit"></i></el-button>
                                           <el-button @click="deleteDatabase(db,index)" type="warning" size="mini"><i class="el-icon-close"></i></el-button>
                                       </el-col>
                                   </el-row>
                                   
                                  
                                </el-card> 
                                 <div class="Empty text-center" v-show="filterDatabaseList.length==0">
                                        没有查询到数据源数据
                                 </div>

                            </div>
            </el-col>
        </el-row>
        <!--数据库创建-->
         <el-form v-show="showAdd"  class="small-space Form setting-form FormError"  ref="databaseForm" size="mini" :model="database" 
         :rules="databaseRules" label-position="right" label-width="120px"
              >
        <el-form-item label="数据源名称 :"   size="mini" prop="configDatasourceName">
          <el-col :span="22"><el-input type="text" v-model="database.configDatasourceName"> </el-input></el-col>
        </el-form-item>
       
        <!-- <el-form-item label="数据库驱动名称 :"   size="mini">
          <el-col :span="22"><el-input type="text" v-model="database.driverName"> </el-input></el-col>
        </el-form-item> -->
      
        
        <el-form-item label="数据库地址 :"   size="mini" prop="address">
          <el-col :span="22"><el-input type="text" v-model="database.address"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="数据库端口号 :"   size="mini" prop="port">
          <el-col :span="22"><el-input type="text" v-model="database.port"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="数据库账号 :"   size="mini" prop="username">
          <el-col :span="22"><el-input type="text" v-model="database.username"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="数据库密码 :"   size="mini" prop="password">
          <el-col :span="22"><el-input type="password" v-model="database.password"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="数据库 :"   size="mini" prop="databaseName">
          <el-col :span="22"><el-input type="text" v-model="database.databaseName"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="数据库类型 :"   size="mini"  prop="databaseType">
          <el-col :span="22">
          <el-select v-model="database.databaseType"  placeholder="请选择数据库类型">
            <el-option
              v-for="item in databaseType"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="描述 :"   size="mini">
          <el-col :span="22"><el-input type="text" v-model="database.comment"> </el-input></el-col>
        </el-form-item>
        <el-form-item class="text-center">
            <el-button  type="success" @click="createDatabase" size="mini" :laoding="createLoading">保存</el-button>
             <el-button  @click="back" size="mini">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
import {dbUpdate, dbCreate, dbList, dbDelete} from "@/api/config/datasourceConfig"
export default {
    props:["activename"],
    data(){
        return {
            type:'',
            createLoading:false,
            showAdd:false,
            searchDatabase:'',
            databaseType:[
                {
                    id:1,
                    name:'oracle'
                },
                {
                    id:2,
                    name:'sql_server'
                },
                {
                    id:3,
                    name:'mysql'
                }
            ],
            database:{
                configDatasourceName:'',
                databaseType:'',
                address:"",
                port:'',
                username:'',
                password:'',
                databaseName:'',
                comment:'',
                createTime:''
            },
            databaseRules:{
                configDatasourceName:[
                    { required:true,message:"请填写数据源名称",trigger:'change,blur' }
                ],
                databaseType:[
                    { required:true,message:"请选择数据库类型",trigger:'change,blur' }
                ],
                address:[
                    { required:true,message:"请填写数据库地址",trigger:'change,blur' }
                ],
                port:[
                    { required:true,message:"请填写数据库端口号",trigger:'change,blur' }
                ],
                username:[
                    { required:true,message:"请填写数据库账号",trigger:'change,blur' }
                ],
                password:[
                    { required:true,message:"请填写数据库密码",trigger:'change,blur' }
                ],
                databaseName:[
                    { required:true,message:"请填写数据库",trigger:'change,blur' }
                ],
            },
            filterDatabaseList:[],
            databaseList:[
            // {
            //     configDatasourceId:'11111',
            //     configDatasourceName:'22',
            //     databaseType:'1',
            //     driverName: "123",
            //     address:"123456",
            //     port:'3306',
            //     username:'name',
            //     password:'12345',
            //     databaseName:'db_name',
            //     comment:'comment',
            //     createTime:'222222'
            // }
            ]
        }
    },
    methods:{
        deleteDatabase:function(db,index){
            this.$confirm('确定删除数据库'+ db.configDatasourceName+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                   dbDelete({configDatasourceId:db.configDatasourceId}).then(res=>{
                 if(res.code==200){
                     this.$message.success('删除数据库成功');
                     this.databaseList.splice(index,1);
                      this.filterDatabaseList.splice(index,1);
                 }
                 else{
                      this.$message.error(res.message);
                 }
                  });
            }).catch(()=>{}) 
        },
        back:function(){
            this.database={
                configDatasourceName:'',
                databaseType:'',
                address:"",
                port:'',
                username:'',
                password:'',
                databaseName:'',
                comment:'',
                createTime:''
            },
            this.createLoading=false;
            this.showAdd=false;
        },
        createDatabase:function(){
            this.$refs.databaseForm.validate(res=>{
                if(res){
                    this.createLoading=true;
                    if(this.type=='create'){
                        dbCreate(this.database).then(res=>{
                         this.createLoading=false;
                       if(res.code==200){
                           this.$message.success("创建数据库成功");
                           this.getDblist();
                           //this.databaseList.unshift(res.data);

                           this.back();
                       }
                       else{
                           this.$message.error(res.message);
                       }
                       })
                    }
                    if(this.type=='update'){
                        dbUpdate(this.database).then(res=>{
                       this.createLoading=false;
                       if(res.code==200){
                           this.back();
                         //  this.databaseList.splice(index,1,res.data);
                           this.$message.success("修改数据库成功");
                            this.getDblist();
                          
                           
                       }
                       else{
                           this.$message.error(res.message);
                       }
                       })
                    }
                   
                }
            });
        },
        getDblist:function(){
            dbList().then(res=>{
                console.log(res);
                if(res.code==200){
                    this.databaseList=res.data.list.slice();
                    this.filterDatabaseList=res.data.list.slice();
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        filterDatabase:function(){
            if(this.searchDatabase){
                if(this.databaseList.length>0){
                    let reg=new RegExp(this.searchDatabase ,"i");
                    this.filterDatabaseList=this.databaseList.filter(db=>reg.test(db.configDatasourceName));
                }
                else{
                     this.filterDatabaseList=this.databaseList.slice(); 
                }
            }
            else{
               this.filterDatabaseList=this.databaseList.slice();  
            }
           
          
        },
        showUpdate:function(db,index){
            this.database=Object.assign({},db);
            this.showAdd=true;
            this.type="update"
            console.log(db);

        }
    },
    created:function(){
        this.getDblist();
        this.$on('init',()=>{
            this.showAdd=false;
            this.searchDatabase="";
            this.filterDatabase();
        })
    },
}
</script>

