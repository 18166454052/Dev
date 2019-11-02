<template>
  <div class="app-container">
     <el-row>
          <el-col :span="24">
                <el-button type="primary" @click="showCreate" v-if="hasPerm('user:add')">添加用户</el-button>
                <el-button type="primary" @click="showSpcCreate"  v-if="hasPerm('controlChart:add')" >添加控制图权限</el-button>
          </el-col>
      </el-row>
      
        <el-tabs v-model="activeName" type="card" class="m-t">
          <el-tab-pane label="功能权限" name="first">
              <div class="Table m-t">
                      <el-table
                          :data="userList"
                          style="width: 100%"
                          size="mini"
                          border
                      >
                        <el-table-column
                          prop="username"
                          label="用户名"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="nickname"
                          label="昵称"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="roleName"
                          label="角色名"
                          align="center"
                        >
                        <template slot-scope="scope"> 
                                  <el-tag v-for="info in scope.row.roleInfo" :key="info.roleName+'@'+info.roleId" v-text="info.roleName"
                                    style="margin-right: 3px;"
                                    type="primary"></el-tag>
                        </template>
                        </el-table-column>
                        <el-table-column
                          prop="createTime"
                          label="创建时间"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          align="center"
                        >
                          <template slot-scope="scope" >
                            <div v-if="scope.row.userId==userId">
                                  <el-button  class="button-link"  type="text" @click="showUpdate(scope.$index)" v-if="scope.row.username=='admin'">编辑</el-button>
                            </div>
                            <div v-else>
                              <el-button  class="button-link"  type="text"   @click="removeUser(scope.$index)" v-if="hasPerm('user:delete') && scope.row.username!=='admin'">删除</el-button>
                              <el-button  class="button-link"  type="text" @click="showUpdate(scope.$index)"   v-if="hasPerm('user:update') && scope.row.username!=='admin'">编辑</el-button>
                            </div>
                          </template>
                      
                        </el-table-column>
                    </el-table>
                  <div class="m-t text-center" v-show="total>0">
                      <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page.sync="page"
                          :page-size="pageSize"
                          :page-sizes="[10,20,30]"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="total">
                      </el-pagination>
                  </div>
              </div>
          </el-tab-pane>
          <el-tab-pane label="控制图权限" name="second"
           v-if="hasPerm('controlChart:list')"
          >
                  <div class="Table m-t">
                    <el-table
                          :data="userSpcList"
                          style="width: 100%"
                          size="mini"
                          border
                    >
                        <el-table-column
                          prop="username"
                          label="用户名"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="nickname"
                          label="昵称"
                          align="center"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="spcInfo"
                          label="控制图名称"
                          align="center"
                        >
                        <template slot-scope="scope" > 
                              <div v-if="scope.row.username !=='admin'">
                                  <el-tag   v-for="(info,index) in scope.row.spcInfo" 
                                    :key="info.config_name+'@'+info.control_graph+'_'+index"
                                    v-text="info.config_name"
                                    style="margin-right:3px;"
                                    type="primary">
                                  </el-tag>
                              </div>
                              <div v-else>
                                <el-tag>
                                  全部
                                </el-tag>   
                              </div>  
                                
                        </template>
                       
                        </el-table-column>
                        <el-table-column
                          prop="createTime"
                          label="创建时间"
                          align="center"
                        >
                        <template slot-scope="scope">
                           {{scope.row.spcInfo[0].create_time}}
                        </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          align="center"
                        >
                          <template slot-scope="scope" >
                            <div v-if="scope.row.userId==userId">
                                  <!-- <el-button  class="button-link"  type="text" @click="showUpdateSpc(scope)" v-if="scope.row.username =='admin'">编辑</el-button> -->
                            </div>
                            <div v-else>
                              <el-button  class="button-link"  type="text"   @click="removeUserSpc(scope)"  v-if="hasPerm('controlChart:delete') && scope.row.username!=='admin'">删除</el-button>
                              <el-button  class="button-link"  type="text" @click="showUpdateSpc(scope)"    v-if="hasPerm('controlChart:update') && scope.row.username!=='admin'">编辑</el-button>
                            </div>
                          </template>
                      
                        </el-table-column>
                    </el-table>
                  <div class="m-t text-center" v-show="total>0">
                      <el-pagination
                          @size-change="handleSizeChange1"
                          @current-change="handleCurrentChange1"
                          :current-page.sync="page1"
                          :page-size="pageSize1"
                          :page-sizes="[10,20,30]"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="total1">
                      </el-pagination>
                  </div>
              </div>

          </el-tab-pane>
      </el-tabs>

    
  
     <el-dialog :title="type=='create'?'添加用户':'编辑用户'" :visible.sync="dialogFormVisible" width="500px">
      <el-form class="small-space Form"  ref="userForm" size="mini" :model="tempUser" :rules="userRules" label-position="right" label-width="80px"
              >
        <el-form-item label="用户名 :" required v-if="type=='create'" size="mini" prop="username">
          <el-col :span="22"><el-input type="text" v-model="tempUser.username"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="密码 :" v-if="type=='create'"  required  size="mini" prop="password">
           <el-col :span="22"><el-input type="password" v-model="tempUser.password">
          </el-input></el-col>
        </el-form-item>
        <el-form-item label="新密码 :" v-else   size="mini">
           <el-col :span="22"><el-input type="password" v-model="tempUser.password" placeholder="不填则表示不修改">
          </el-input></el-col>
        </el-form-item>
        <el-form-item label="角色 :" required  size="mini" prop="roleInfo">
          <el-select v-model="tempUser.roleInfo" :disabled="tempUser.userId==1"  multiple  placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱 :">
           <el-col :span="22"><el-input type="text" v-model="tempUser.email_address">
          </el-input></el-col>
        </el-form-item>
        <el-form-item label="昵称 :">
           <el-col :span="22"><el-input type="text" v-model="tempUser.nickname">
          </el-input></el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center" style="margin-top:-30px">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button v-show="type=='create'" type="primary" @click="createUser" size="mini" :laoding="createLoading">创 建</el-button>
        <el-button type="primary" v-show="type=='update'" @click="updateUserInfo" size="mini" :laoding="createLoading">修 改</el-button>
      </div>
     </el-dialog> 

     <el-dialog   :title="userSpcType=='create'?'添加控制图权限':'编辑控制图权限'"  :visible.sync="userSpcVisible" width="400px">
          <el-form class="small-space Form" size="mini"  label-position="right" label-width="80px"
             ref="spcForm" :model="userSpc" :rules="spcRules"
              >
           <el-form-item label="用户 :" prop="userId">
            <el-select v-model="userSpc.userId"  placeholder="请选择"   size="mini" 
            :disabled="userSpcType=='update'">
              <el-option
                v-for="user in userAboutSpc"
                :key="user.username+'_'+user.id"
                :label="user.username"
                :value="user.id"
                :disabled="spcUserIdList.indexOf(user.id)>=0"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="控制图 :"   prop="spcConfigInfo">
            <el-select v-model="userSpc.spcConfigInfo"   multiple  placeholder="请选择"
                 size="mini"
            >
              <el-option
                v-for="spc in spcList"
                :key="spc.config_name+'_'+spc.spc_config_id"
                :label="spc.config_name"
                :value="spc.spc_config_id">
              </el-option>
            </el-select>
          </el-form-item>
     
      </el-form>
      <div slot="footer" class="dialog-footer text-center" style="margin-top:-30px">
        <el-button @click="userSpcVisible = false" size="mini">取 消</el-button>
        <el-button v-show="userSpcType=='create'" type="primary" @click="createUserSpc" size="mini" :laoding="createLoading">创 建</el-button>
        <el-button type="primary" v-show="userSpcType=='update'" @click="updateUserSpc" size="mini" :laoding="createLoading">修 改</el-button>
      </div>
     </el-dialog>    
  </div>
</template>
<script>
import { userList, addUser, updateUser,getAllRoles, deleteUser,
   addSpc, updateSpc , deleteSpc , getSpc,  userSpcList
}  from "@/api/config/user.js"
import {mapGetters} from 'vuex'
import { spcList } from "@/api/spc";
export default {
  data() {
    return {
      pageSize:10,
      page:1,
      total:0,
      pageSize1:10,
      page1:1,
      total1:0,
      createLoading:false,
      dialogFormVisible:false,
      userSpcVisible:false,
      userSpcType:'create',
      type:'create',
      Index:'',//userSpc 编辑 index
      userList:[

      ],
      roles: [],//角色列表
      tempUser: {
        username: '',
        password: '',
        nickname: '',
        roleInfo: [] ,
        userId: '',
        email_address:''
      },
      userRules:{
        username:[
          {required:true,message:'请填写用户名',trigger:'change,blur'}
        ],
        password: [
          {required:true,message:'请填写密码',trigger:'change,blur'}
        ],
        roleInfo:[
          {required:true,type:'array',message:'请最少选择一个角色',trigger:'change,blur'}
        ]
      },
      activeName:'first',
      spcList:[],//spc_config_list
      userAboutSpc:[],  //添加控制图权限的userlist  去掉了 admin
      userSpcList:[
        // {
        // username:'1111',
        // nickname:'2222',
        // create_time:'333' ,
        // spcInfo:[{"config_name":'config_name',"control_graph":'x'}]
        // }
      ],
      spcRules:{
        userId:[
          {required:true,message:'请选择一个用户',trigger:'change,blur'}
        ],
        spcConfigInfo:[
           {required:true,type:'array',message:'请最少选择一个控制图',trigger:'change,blur'}
        ]
      },
      userSpc:{//form
        userId:'',
        spcConfigInfo:[]
      }

    };
  },
  methods:{
    createUser:function(){
      let self=this;
      self.$refs.userForm.validate(res=>{
            if(res){
                  self.createLoading=true;
                  addUser(self.tempUser).then(function(res){
                    self.createLoading=false;
                      if(res.resCode==0){
                        self.dialogFormVisible = false;
                        self.$message.success(res.msg);
                        self.total+=1;
                        self.getUserList();
                      }
                      else{
                        self.$message.error(res.msg);
                      }
                  });
          }
      });
    },
    updateUserInfo:function(){
        let self=this;
         self.createLoading=true;
        updateUser(self.tempUser).then(function(res){
            self.createLoading=false;
            console.log(res);
            if(res.resCode==0){
                self.dialogFormVisible = false;
                self.$message.success(res.msg);
                self.getUserList();
            }
            else{
               self.$message.error(res.msg);
            }
        });
    },
    getUserList:function(){
      let self=this;
      userList({page:self.page,page_size:self.pageSize}).then(function(res){
        console.log('**********user-list********');
        console.log(res);
        self.userList=res.data.userList;
        self.total=res.data.userCount;
      });
    },
    getSpcList:function(){
      let self=this;
      spcList({}).then(function(res){
          if(res.resCode==0){
               self.spcList=res.data.spcList;
          }
          else{
            self.$message.error(res.msg);
          }
      })
     },
    getRoleList:function(){
      let self=this;
      getAllRoles({}).then(function(res){
          if(res.resCode==0){
            console.log('roleList');
            console.log(res)
           self.roles = res.data;
          }
          else{
            self.$message.error(res.msg);
          }
      });
    },
    getUserAboutSpc:function(){
      let self=this
      userSpcList().then(function(res){
         console.log('llllllllllllllllllllllllllll');
        console.log(res);
           if(res.resCode==0){
             self.userAboutSpc=res.data;
           }
           else{
             self.$message.error(res.msg);
           }
      });
    },
    showCreate() {
        //显示新增对话框 
       
        this.tempUser.username = "";
        this.tempUser.password = "";
        this.tempUser.nickname = "";
        this.tempUser.roleInfo = [];
        this.tempUser.userId = "";
        this.type = "create"
        this.dialogFormVisible = true;
        this.getRoleList(); 
        let self=this;
        this.$nextTick(()=>{
            self.$refs.userForm.resetFields()
        });
    },
    showUpdate($index) {
       // this.$refs.userForm.resetFields()
        let user = this.userList[$index];
        this.tempUser = Object.assign({},user);
        let arr=[];
        if(this.tempUser.roleInfo.length>0){
          this.tempUser.roleInfo.forEach(item=>{
               arr.push(item.roleId);
          });
        }
        this.$set(this.tempUser,'roleInfo',arr.slice());
        this.tempUser.deleteStatus = '1';// 1  代表编辑
        this.tempUser.password = '';
        this.type = "update"
        this.dialogFormVisible = true  ;
        this.getRoleList();
    },
    removeUser($index) {
      let self = this;
      self.$confirm('确定删除此用户?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        
        let user =self.userList[$index];
          //user.deleteStatus = '2';  //  2    代表删除
          console.log(user);
          deleteUser({userId:user.userId}).then(function(res){
              if(res.resCode==0){
                  self.$message.success(res.msg)
                  self.userList.splice($index,1);
                  self.total-=1;
              }
              else{
                self.$message.error(res.msg)
              }
          });
      })
    },
    handleSizeChange: function(val) {
      //this.$store.commit('SET_PAGESIZE',val);
      let self = this;
      this.pageSize = Number(val);
      this.page = 1;
      this.getUserList();

    },
    handleCurrentChange: function(val) {
      let self = this;
      this.page = Number(val);
      this.getUserList();
    },
    handleSizeChange1: function(val) {
      //this.$store.commit('SET_PAGESIZE',val);
      let self = this;
      this.pageSize1 = Number(val);
      this.page1 = 1;
      this.getUserSpcList();

    },
    handleCurrentChange1: function(val) {
      let self = this;
      this.page1 = Number(val);
      this.getUserSpcList();
    },
    showSpcCreate:function(){
       
        this.userSpcVisible = true;
        this.userSpcType='create'
        this.userSpc={//form
          userId:'',
          spcConfigInfo:[]
        }
        let self=this;
        this.$nextTick(()=>{
          self.$refs.spcForm.resetFields()
        });
    },
    getUserSpcList:function(){
       let self=this;
       getSpc({page:self.page1,page_size:self.pageSize1}).then(function(res){
         console.log(res);
             if(res.resCode==0){
                  self.userSpcList=res.data.spcUserList;
                  self.total1=res.data.spcUserCount;
             }
             else{
               self.$message.error(res.msg);
             }
       });
    },
    createUserSpc:function(){
         let self=this;
         self.$refs.spcForm.validate(res=>{
           if(res){
                self.userSpcType='create'
                self.createLoading=true;
                addSpc(self.userSpc).then(function(res){
                  self.createLoading=false;
                    if(res.resCode==0){
                      // console.log(res);
                      self.userSpcVisible = false;
                      self.userSpcList.push(res.data);
                      self.$message.success(res.msg);
                      self.total1+=1;
                    }
                    else{
                      self.$message.error(res.msg);
                    }
                });
             
           }
         });
    },
    updateUserSpc:function(){
      let self=this;
       self.$refs.spcForm.validate(res=>{
          updateSpc(self.userSpc).then(function(res){
                  console.log(res)
                if(res.resCode==0){
                  self.userSpcList.splice(self.Index,1,res.data);
                  self.$message.success(res.msg);
                  self.userSpcVisible = false;
                }
                else{
                  self.$message.error(res.msg);
                }
            });

       });
     
    },
    removeUserSpc:function(scope){
         let self = this;
      self.$confirm('确定删除控制图权限?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        
      
          deleteSpc({userId:scope.row.userId}).then(function(res){
              if(res.resCode==0){
                  self.$message.success(res.msg)
                  self.userSpcList.splice(scope.$index,1);
                  self.total1-=1;
              }
              else{
                self.$message.error(res.msg)
              }
          });
      })
    },
    showUpdateSpc:function(scope){
      console.log(scope)
      this.userSpc={//form
          userId:scope.row.userId,
          spcConfigInfo:scope.row.spcInfo.map(item=> item.spc_config_id)
      }
      this.userSpcVisible = true;
      this.userSpcType='update';
      this.Index=scope.$index;
    }
 
    
  },
  computed:{
    ...mapGetters([
        'userId'
      ]),
    spcUserIdList:function(){
         return this.userSpcList.map(item=>{ return item.userId});
    }
  },
  mounted:function(){
    if(this.hasPerm('user:list')){
        this.getUserList();
    }
     
      this.getSpcList();
      this.getUserSpcList();
      this.getUserAboutSpc()
      //this.getRoleList();

  }
};
</script>
<style>

</style>
