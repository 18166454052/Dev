<template>
  <div class="app-container">
      <el-row>
          <el-col :span="24">
                <el-button type="primary" @click="showCreate" v-if="hasPerm('role:add')">添加角色</el-button>
          </el-col>
      </el-row>
       <div class="Table m-t">
               <el-table
            :data="roleLists"
            style="width: 100%"
            size="mini"
            border
           >
           <el-table-column
            prop="roleName"
            label="角色"
            align="center"
           >
          </el-table-column>
          <el-table-column
            label="菜单&权限"
            align="left"
           >
           <template slot-scope="scope">
                <!-- <el-tag v-if="scope.row.roleName==adminName" type="success">全部</el-tag> -->
                <div v-for="menu in scope.row.menus" :key="menu.menuName" style="margin-top:5px;">
                   <span>{{menu.menuName}} ：</span>
                      <el-tag v-for="per in menu.permissions" :key="per.permissionId" v-text="per.permissionName"
                      style="margin-right: 3px;"
                      type="primary"></el-tag>

                    <!-- <span class="role_per" v-for="per in menu.permissions" :key="per.permissionId">{{per.permissionName}}</span> -->
                </div>
           </template>
          </el-table-column>
          <el-table-column
            label="用户"
            align="center"
          >
           <template slot-scope="scope">
                <span class="user" v-for="user in scope.row.users" :key="user.userId">{{user.username}}</span>
           </template>
          </el-table-column>
          <el-table-column
             label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <div  v-if="scope.row.roleId==1">
                <!--超级管理员-->
              </div>
              <div v-else>
                 <el-button  class="button-link"  type="text"  @click="removeRole(scope.$index)" v-if="hasPerm('role:delete') && scope.row.roleId!==nowRoleId">删除</el-button>
                 <el-button  class="button-link"  @click="showUpdate(scope.$index)"  type="text" v-if="hasPerm('role:update') && scope.row.roleId!==nowRoleId">编辑</el-button>
              </div>
                
            </template>
          </el-table-column>
      </el-table>
    </div>
    <div class="m-t text-center" v-show="showPagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync=page
            :page-size=pageSize
            :page-sizes="[10,20,30]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
      <el-dialog :title="type=='create'?'创建角色':'编辑角色' "  :visible.sync="dialogFormVisible" width="500">
      <el-form class="small-space" :model="tempRole" :rules="roleRules" ref="roleForm" label-position="left" label-width="100px" size="mini">
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="text" v-model="tempRole.roleName">
          </el-input>
        </el-form-item>
        <el-form-item label="菜单&权限">
          <div v-for=" (menu,_index) in allPermission" :key="menu.menuName">
            <span style="width: 100px;display: inline-block;">
              <el-button :type="isMenuNone(_index)?'':(isMenuAll(_index)?'success':'primary')" size="mini"
                         style="width:100%"
                         @click="checkAll(_index)">{{menu.menuName}}</el-button>
            </span>
            <div style="display: inline-block;margin-left:20px;">
              <el-checkbox-group v-model="tempRole.permissions">
                <el-checkbox v-for="perm in menu.permissions" :label="perm.id" @change="checkRequired(perm,_index)"
                             :key="perm.id">
                  <span :class="{requiredPerm:perm.requiredPerm===1}">{{perm.permissionName}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <!-- <p style="color:#848484;">说明:红色权限为对应菜单内的必选权限</p> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center" style="margin-top:-50px;border-top:1px solid #ccc;padding-top:20px">
        <el-button @click="dialogFormVisible = false"  size="mini">取 消</el-button>
        <el-button  type="primary" v-show="type=='create'"  size="mini"   @click="createRole" :loading="createLoading">创 建</el-button>
        <el-button type="primary" v-show="type=='update'"  size="mini"   @click="updateRole" :loading="createLoading">修 改</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { roleList, permissionList, addRole, updateRole, deleteRole } from  "@/api/config/permission.js"
import {mapGetters} from 'vuex'

export default {
    data() {
        return {
          nowRoleId:'',
          userIdArr:[],
          pageSize:10,
          page:1,
          total:0,
          createLoading:false,
           roleLists:[],
           tempRole: {
                roleName: '',
                roleId: '',
                permissions: [],
          },
          roleRules:{
                roleName:[
                  {required:true,message:'请填写角色名称',trigger:'change,blur'}
                ],
          },
          allPermission: [],
          type:'create',
          dialogFormVisible:false
        }
    },
    methods:{
        createRole:function(){
            let self=this;
            self.$refs.roleForm.validate(res=>{
                if(res){
                    if(self.tempRole.permissions.length==0){
                        self.$message.warning('请最少选择一个权限');
                        return false;
                    }
                    self.createLoading=true;
                    addRole(self.tempRole).then(function(res){
                        self.createLoading=false;
                        if(res.resCode==0){
                            self.dialogFormVisible=false;
                          // self.roleLists.push(res.data);
                          self.getRoleList();
                        }
                        else{
                            self.$message.error(res.msg);
                        }
                    });
                        }
                    })
            
        },
        updateRole:function(){
            let self=this;
              self.$refs.roleForm.validate(res=>{
                if(self.tempRole.permissions.length==0){
                        self.$message.warning('请最少选择一个权限');
                        return false;
                 }
                  self.createLoading=true;
                  updateRole(self.tempRole).then(function(res){
                      self.createLoading=false;
                      if(res.resCode==0){
                          self.dialogFormVisible=false;
                          self.getRoleList();
                      }
                      else{
                          self.$message.error(res.msg);
                      }
                  });
              })
        },
        removeRole($index) {
        let self = this,$Index=$index;
        this.$confirm('确定删除此角色?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          let role = self.roleLists[$Index];
          deleteRole({roleId: role.roleId}).then((res) => {
               if(res.resCode==0){
                    self.$message.success(res.msg);
                    self.roleLists.splice($Index,1);
               }
               else{
                   self.$message.error(res.msg);
               }
          }).catch(e => {
          })
        })
        },
        getRoleList:function(){
            let self=this;
            roleList({page:self.page,page_size:self.pageSize}).then(function(res){
                if(res.resCode==0){
                    console.log(res);
                    self.roleLists=res.data.roleList;
                    self.total=res.data.roleCount;
                    //userIdArr
                    if(self.roleLists.length>0){
                         self.roleLists.forEach(role=>{
                             if(role.users && role.users.length>0){
                                 role.users.forEach(user=>{
                                        if(self.$store.state.user.userId==user.userId){
                                             self.nowRoleId=role.roleId;
                                        }
                                 })
                             }
                         });
                    }
                }
                else{
                    self.$message.error(res.msg);
                }
            });
        },
        getAllPermission:function(){
            let self=this;
            permissionList().then(function(res){
                 //console.log(res);
                if(res.resCode==0){
                    self.allPermission=res.data; 
                }
                else{
                    self.$message.error(res.msg);
                }
            });
        },
         checkAll(_index) {
            //点击菜单   相当于全选按钮
            let v = this;
            if (v.isMenuAll(_index)) {
            //如果已经全选了,则全部取消
            v.noPerm(_index);
            } else {
            //如果尚未全选,则全选
            v.allPerm(_index);
            }
        },
       showCreate() {
        //显示新增对话框
            this.tempRole.roleName = '';
            this.tempRole.roleId = '';
            this.tempRole.permissions = [];
            this.type = "create";
            this.dialogFormVisible = true;
            this.getAllPermission();
            let self=this;
            this.$nextTick(()=>{
              self.$refs.roleForm.resetFields()
            });
      },
     isMenuNone(_index) {
        //判断本级菜单内的权限是否一个都没选
        let menu = this.allPermission[_index].permissions;
        let result = true;
        for (let j = 0; j < menu.length; j++) {
          if (this.tempRole.permissions.indexOf(menu[j].id) > -1) {
            result = false;
            break;
          }
        }
        return result;
      },
      isMenuAll(_index) {
        //判断本级菜单内的权限是否全选了
        let menu = this.allPermission[_index].permissions;
        let result = true;
        for (let j = 0; j < menu.length; j++) {
          if (this.tempRole.permissions.indexOf(menu[j].id) < 0) {
            result = false;
            break;
          }
        }
        return result;
      },
      noPerm(_index) {
        //全部取消选中
        let menu = this.allPermission[_index].permissions;
        for (let j = 0; j < menu.length; j++) {
          let idIndex = this.tempRole.permissions.indexOf(menu[j].id);
          if (idIndex > -1) {
            this.tempRole.permissions.splice(idIndex, 1);
          }
        }
      },
      checkRequired(_perm, _index) {
        //本方法会在勾选状态改变之后触发
        let permId = _perm.id;
        if (this.tempRole.permissions.indexOf(permId) > -1) {
          //选中事件
          //如果之前未勾选本权限,现在勾选完之后,tempRole里就会包含本id
          //那么就要将必选的权限勾上
          this.makeReuqiredPermissionChecked(_index);
        } else {
          //取消选中事件
          if (_perm.requiredPerm === 1) {
            //如果是必勾权限,就把本菜单的权限全部移出
            //(其实也可以提示用户本权限是菜单里的必选,请先取消勾选另外几个权限,交互太麻烦,此处就直接全部取消选中了)
            this.noPerm(_index);
          }
        }
      },
      makeReuqiredPermissionChecked(_index) {
        //将本菜单必选的权限勾上
        let menu = this.allPermission[_index].permissions;
        for (let j = 0; j < menu.length; j++) {
          let perm = menu[j];
          if (perm.requiredPerm === 1) {
            //找到本菜单的必选权限,将其勾上
            this.addUnique(perm.id, this.tempRole.permissions)
          }
        }
      },
      addUnique(val, arr) {
        //数组内防重复地添加元素
        let _index = arr.indexOf(val);
        if (_index < 0) {
          arr.push(val);
        }
      },
      showUpdate($index) {
        let role = this.roleLists[$index];
        this.tempRole.roleName = role.roleName;
        this.tempRole.roleId = role.roleId;
        this.tempRole.permissions = [];
        for (let i = 0; i < role.menus.length; i++) {
          let perm = role.menus[i].permissions;
          for (let j = 0; j < perm.length; j++) {
               this.tempRole.permissions.push(perm[j].permissionId);
          }
        }
        this.type = "update"
        this.dialogFormVisible = true;
        this.getAllPermission();

      },
       handleSizeChange: function(val) {
      //this.$store.commit('SET_PAGESIZE',val);
      let self = this;
      this.pageSize = Number(val);
      this.page = 1;
      this.getRoleList();

    },
    handleCurrentChange: function(val) {
      let self = this;
      this.page = Number(val);
      this.getRoleList();
    }
    },
    computed:{
    ...mapGetters([
        'userId','roleId'
      ]),
      showPagination:function(){
         return this.total/this.pageSize>1?true:false;
      }
    },
    mounted:function(){
      if(this.hasPerm('role:list')){
        this.getRoleList();
      }
        
        //this.getAllPermission();
    }
}
</script>
<style scoped>
.role_per{
    padding:5px;
    margin-left:5px;
    border:1px solid #ccc;
}
.user{
    margin-left:10px;
}
</style>
