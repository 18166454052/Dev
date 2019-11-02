<template>
    <div>
        <!--database  列表-->
        <el-row v-show="!showAdd" >
            <el-col :span="12">
                <el-input
                    placeholder="使用网关名称搜索"
                    prefix-icon="el-icon-search"
                    @input="filterGateway"
                    v-model="searchGateway">
                </el-input>
            </el-col>
            <el-col :span="12" class="text-right">
                <el-button type="primary" size="small"  @click="showCreate">
                        <i class="el-icon-plus m-r-5"></i>创建
                </el-button>
            </el-col>
            <el-col :span="24">
                <div class="m-t-10 CardList">
                                <el-row class="m-t ConfigListTitle">
                                    <el-col :span="7" style="padding-left:26px">网关名称</el-col>
                                    <el-col :span="6">网关描述</el-col>
                                    <el-col :span="7">创建时间</el-col>
                                    <el-col :span="4" class="text-right" style="padding-right:20px">操作</el-col>
                                </el-row>
                                <el-card class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                      v-for="(gate,index) in filterGatewayList" :key="gate.gatewayId">
                                   <el-row>
                                       <el-col :span="7" style="line-height:28px;padding-left:20px">
                                         
                                           &nbsp;<span>{{gate.gatewayName}}</span>
                                       </el-col>
                                        <el-col :span="6" style="line-height:28px">
                                          
                                            &nbsp;<span>{{gate.gatewayComment}}</span>
                                       </el-col>
                                       <el-col :span="7" style="line-height:28px">
                                          
                                            &nbsp;<span>{{gate.createTime | unixTime}}</span>
                                       </el-col>
                                       
                                       <el-col :span="4" class="text-right">
                                           <el-button @click="showUpdate(gate,index)" type="primary" size="mini"><i class="el-icon-edit"></i></el-button>
                                           <el-button @click="deleteDatabase(gate,index)" type="warning" size="mini"><i class="el-icon-close"></i></el-button>
                                       </el-col>
                                   </el-row>
                                   
                                  
                                </el-card> 
                                 <div class="Empty text-center" v-show="filterGatewayList.length==0">
                                        没有查询到网关数据
                                 </div>

                            </div>
            </el-col>
        </el-row>
        <!--网关创建-->
         <el-form v-show="showAdd"  class="small-space Form setting-form FormError"  ref="gatewayForm" size="mini" :model="gateway" 
         :rules="gatewayRules" label-position="right" label-width="120px"
              >
        <el-form-item label="网关名称 :"   size="mini" prop="gatewayName">
          <el-col :span="22"><el-input type="text" v-model="gateway.gatewayName"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="网关描述 :"   size="mini">
          <el-col :span="22"><el-input type="text" v-model="gateway.gatewayComment"> </el-input></el-col>
        </el-form-item>
        <el-form-item class="text-center">
            <el-button  type="primary" @click="createGateway" size="mini" :laoding="createLoading">保存</el-button>
             <el-button  @click="back" size="mini">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
import {gatewayUpdate, gatewayCreate, gatewayList, gatewayDelete} from "@/api/piping/gateway"
import { getUserId, removeSessionId } from '@/utils/auth'
export default {
    data(){
        return {
            type:'',
            createLoading:false,
            showAdd:false,
            searchGateway:'',
            gateway:{
               gatewayName:'',
               gatewayComment:'',

            },
            gatewayRules:{
                gatewayName:[
                    { required:true,message:"请填写网关名称",trigger:'change,blur' }
                ],
                
            },
            filterGatewayList:[],
            gatewayList:[
            
            ]
        }
    },
    methods:{
        deleteDatabase:function(gate,index){
            this.$confirm('确定删除网关'+ gate.gatewayName+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                   gatewayDelete({gatewayId:gate.gatewayId}).then(res=>{
                 if(res.code==200){
                     this.$message.success('删除网关成功');
                     this.gatewayList.splice(index,1);
                      this.filterGatewayList.splice(index,1);
                 }
                 else{
                      this.$message.error(res.message);
                 }
                  });
            }).catch(()=>{}) 
        },
        back:function(){
            this.gateway={
                gatewayName:'',
                gatewayComment:'',
            },
            
            this.createLoading=false;
            this.showAdd=false;
        },
        createGateway:function(){
            this.$refs.gatewayForm.validate(res=>{
                if(res){
                    this.createLoading=true;
                    if(this.type=='create'){
                        this.gateway.createByUserId=getUserId();
                        gatewayCreate(this.gateway).then(res=>{
                         this.createLoading=false;
                       if(res.code==200){
                           this.$message.success("创建网关成功");
                           this.getGatewayList();
                           this.back();
                       }
                       else{
                           this.$message.error(res.message);
                       }
                       })
                    }
                    if(this.type=='update'){
                        gatewayUpdate(this.gateway).then(res=>{
                       this.createLoading=false;
                       if(res.code==200){
                           this.back();
                         //  this.gatewayList.splice(index,1,res.data);
                           this.$message.success("修改网关成功");
                           this.getGatewayList();
                          
                           
                       }
                       else{
                           this.$message.error(res.message);
                       }
                       })
                    }
                   
                }
            });
        },
        getGatewayList:function(){
            gatewayList().then(res=>{
                console.log(res);
                if(res.code==200){
                    this.gatewayList=res.data.list.slice();
                    this.filterGatewayList=res.data.list.slice();
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        filterGateway:function(){
            if(this.searchGateway){
                if(this.gatewayList.length>0){
                    let reg=new RegExp(this.searchGateway ,"i");
                    this.filterGatewayList=this.gatewayList.filter(gate=>reg.test(gate.gatewayName));
                }
                else{
                     this.filterGatewayList=this.gatewayList.slice(); 
                }
            }
            else{
               this.filterGatewayList=this.gatewayList.slice();  
            }
           
          
        },
        showUpdate:function(gate,index){
            this.gateway=Object.assign({},gate);
            this.showAdd=true;
            this.type="update";

        },
        showCreate:function(){
            this.showAdd=true;
            this.type='create';
            this.$nextTick(()=>{
                this.$refs.gatewayForm.resetFields();
            });
        }
    },
    created:function(){
        this.getGatewayList();
        this.$on('init',()=>{
            this.showAdd=false;
            this.searchGateway="";
            this.filterGateway();
        })
    }
}
</script>



