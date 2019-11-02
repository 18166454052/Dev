<template>
    <div>
        <!--database  列表-->
        <el-row v-show="!showAdd" >
            <el-col :span="12">
                <el-input
                    placeholder="使用网关名称搜索"
                    prefix-icon="el-icon-search"
                    @input="filterDepartment"
                    v-model="searchDepartment">
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
                                    <el-col :span="4" style="padding-left:26px">部门名称</el-col>
                                    <el-col :span="4">部门级别</el-col>
                                    <el-col :span="4">父级部门</el-col>
                                    <el-col :span="4">排序号</el-col>
                                    <el-col :span="4">创建时间</el-col>
                                    <el-col :span="4" class="text-right" style="padding-right:20px">操作</el-col>
                                </el-row>
                                <el-card class="box-card m-t-5"  :body-style="{padding: '6px' }" 
                                      v-for="(depart,index) in filterDepartmentList" :key="depart.id+'_depart_'+index">
                                   <el-row>
                                       <el-col :span="4" style="line-height:28px;padding-left:20px">
                                         
                                           &nbsp;<span>{{depart.name}}</span>
                                       </el-col>
                                        <el-col :span="4" style="line-height:28px">
                                          &nbsp;<span>{{depart.level}}</span>
                                       </el-col>
                                        <el-col :span="4" style="line-height:28px">
                                          &nbsp;<span>{{depart.parentName.name==depart.name?'无':depart.parentName.name}}</span>
                                       </el-col>
                                        <el-col :span="4" style="line-height:28px">
                                          &nbsp;<span>{{depart.seq}}</span>
                                       </el-col>
                                       <el-col :span="4" style="line-height:28px">
                                          
                                            &nbsp;<span>{{depart.createAt | unixTime(true)}}</span>
                                       </el-col>
                                       
                                       <el-col :span="4" class="text-right">
                                           <el-button @click="showUpdate(depart,index)" type="primary" size="mini"><i class="el-icon-edit"></i></el-button>
                                           <el-button @click="deleteDepartment(depart,index)" type="warning" size="mini"><i class="el-icon-close"></i></el-button>
                                       </el-col>
                                   </el-row>
                                   
                                  
                                </el-card> 
                                 <div class="Empty text-center" v-show="filterDepartmentList.length==0">
                                        没有查询到组织管理数据
                                 </div>

                            </div>
            </el-col>
        </el-row>
        <!--网关创建-->
         <el-form v-show="showAdd"  class="small-space Form setting-form FormError"  ref="DepartmentForm" size="mini" :model="Department" 
         :rules="DepartmentRules" label-position="right" label-width="120px"
              >
        <el-form-item label="部门名称 :"   size="mini" prop="name">
          <el-col :span="22"><el-input type="text" v-model="Department.name"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="部门级别 :"   size="mini">
          <el-col :span="22"><el-input type="text" v-model="Department.level"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="父级部门 :"   size="mini">
          <el-col :span="22"  v-show="type=='create'">
             <el-select v-model="Department.parentId">
                 
                 <el-option v-for="child in tree"  
                    :key="child.id"
                    :label="child.name"
                    :value="child.id"
                 >
                  <span>{{"----".repeat(child.index) + child.name }}</span>
                 </el-option>
             </el-select>
          </el-col>
          <el-col :span="22"  v-show="type=='update'">
             <el-select v-model="Department.parentId">
                 <!--编辑筛选--->
                 <el-option v-for="child in tree"  v-show="!childrenIdArr.includes(child.id)"
                    :key="child.id"
                    :label="child.name"
                    :value="child.id"
                 >
                  <span>{{"----".repeat(child.index) + child.name }}</span>
                 </el-option>
             </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="排序号 :"   size="mini">
          <el-col :span="22"><el-input type="text" v-model="Department.seq"> </el-input></el-col>
        </el-form-item>
        <el-form-item class="text-center">
            <el-button  type="primary" @click="createDepartment" size="mini" :laoding="createLoading">保存</el-button>
            <el-button  @click="back" size="mini">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
import {del, add,update, list, getChildren} from "@/api/config/department"

export default {
    data(){
        return {
            type:'',
            createLoading:false,
            showAdd:false,
            searchDepartment:'',
            Department:{
               name:'',
               level:'',
               parentId:'',
               seq:""

            },
            DepartmentRules:{
                name:[
                    { required:true,message:"请填写部门名称",trigger:'change,blur' }
                ],
                
            },
            filterDepartmentList:[],
            DepartmentList:[
            
            ],

            tree:[],
             selectParams: {
                'multiple': false,
                'clearable': false,
                'placeholder': '请选择父级'
            },
            defaultProps: {
                children: 'childrenList',
                label: 'name'
            },
            childrenIdArr:[]

        }
    },
    methods:{
        deleteDepartment:function(depart,index){
            this.$confirm('确定删除部门 - '+ depart.name+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{ 
                del({id:depart.id}).then(res=>{
                 if(res.code==200){
                     this.getDepartmentList();
                     this.$message.success(res.message);
                     
                 }
                 else{
                      this.$message.error(res.message);
                 }
                  });
            }).catch(()=>{}) 
        },
        back:function(){
            this.Department={
                DepartmentName:'',
                DepartmentComment:'',
            },
            
            this.createLoading=false;
            this.showAdd=false;
        },
        createDepartment:function(){
            this.$refs.DepartmentForm.validate(res=>{
                if(res){
                    this.createLoading=true;
                    if(this.type=='create'){
                        //this.Department.createByUserId=getUserId();
                        add(this.Department).then(res=>{
                        this.createLoading=false;
                       if(res.code==200){
                           this.$message.success(res.message);
                           this.getDepartmentList();
                           this.back();
                       }
                       else{
                           this.$message.error(res.message);
                       }
                       })
                    }
                    if(this.type=='update'){
                        update(this.Department).then(res=>{
                       this.createLoading=false;
                       if(res.code==200){
                           this.back();
                         //  this.DepartmentList.splice(index,1,res.data);
                           this.$message.success(res.message);
                           this.getDepartmentList();
                          
                           
                       }
                       else{
                           this.$message.error(res.message);
                       }
                       })
                    }
                   
                }
            });
        },
        getDepartmentList:function(){
            list().then(res=>{  
                //debugger
                if(res.code==200){
             
                    this.DepartmentList=res.data.list.slice();
                    this.filterDepartmentList=res.data.list.slice();
                   // this.tree=res.data.tree;
                   // this.defaultTree=res.data.tree;
                   this.getTreeArr()(res.data.tree);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        filterDepartment:function(){
            if(this.searchDepartment){
                if(this.DepartmentList.length>0){
                    let reg=new RegExp(this.searchDepartment ,"i");
                    this.filterDepartmentList=this.DepartmentList.filter(depart=>reg.test(depart.name));
                }
                else{
                     this.filterDepartmentList=this.DepartmentList.slice(); 
                }
            }
            else{
               this.filterDepartmentList=this.DepartmentList.slice();  
            }
           
          
        },
        showUpdate:function(depart,index){
            getChildren({id:depart.id}).then(res=>{
                if(res.code==200){
                    this.childrenIdArr=res.data;
                }
                else{
                    this.$message.error(res.message);
                }
            });
            this.Department=Object.assign({},depart);
            this.showAdd=true;
            this.type="update";

        },
        showCreate:function(){
            this.showAdd=true;
            this.type='create';
            this.$nextTick(()=>{
                this.$refs.DepartmentForm.resetFields();
            });
        },
        getTreeArr:function (){
           let treeArr=this.tree,index=0;

          return function getTree (arr){
                if(arr.length>0){
                  arr.forEach(item=>{
                    item.index=index; 
                    treeArr.push(item);
                    if(!item.childrenList){
                        index=0;
                    }
                    if(item.childrenList){
                        index++;
                        getTree(item.childrenList);
                    }
                 });
            }
          }
           
        } 
    },
   
    created:function(){
        this.getDepartmentList();
        this.$on('init',()=>{
            this.showAdd=false;
            this.searchDepartment="";
            this.filterDepartment();
        })
    }
}
</script>


