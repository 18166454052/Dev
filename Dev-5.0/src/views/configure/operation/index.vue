<template>
  <div  class="app-container">
      <el-row>
          <el-col :span="4">
                <el-button type="primary" @click="showCreate" v-if="hasPerm('menu:add')">添加功能菜单</el-button>
          </el-col>
      </el-row>
       <div class="Table m-t">
      <el-table
            :data="menuList"
            style="width: 100%"
            size="mini"
            border
      >
           <el-table-column
            prop="menuCode"
            label="菜单代号"
            align="center"
            width="150"
           >
          </el-table-column>
           <!-- <el-table-column
            prop="menuName"
            label="菜单名称"
            align="center"
           >
          </el-table-column> -->
          <el-table-column
            prop="permissionCode"
            label="权限代号"
            align="center"
           >
          </el-table-column>
          <!-- <el-table-column
            prop="permissionName"
            label="权限名称"
            align="center"
           >
          </el-table-column> -->

           <!-- <el-table-column
            prop="requiredPermission"
            label="必选"
            align="center"
           >
           <template slot-scope="scope">
                 {{scope.row.requiredPermission==1?'是':'否'}}
           </template>
          </el-table-column> -->
          <el-table-column
            label="API"
            prop="apiUrl"
            align="center"
          >

          </el-table-column>
           <el-table-column
            label="描述"
            prop="description"
            align="center"
          >
          </el-table-column>
           <el-table-column
            label="创建时间"
            prop="createTime"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
                {{scope.row.createTime | sliceTime}}
            </template>
          </el-table-column>
          <el-table-column
             label="操作"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
                 <el-button  class="button-link"  type="text" @click="deleteMenu(scope)" v-if="hasPerm('menu:delete')">删除</el-button>
                 <el-button  class="button-link"  type="text" @click="showUpdate(scope)" v-if="hasPerm('menu:update')">编辑</el-button>
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
     <el-dialog :title="type=='create'?'添加菜单':'修改菜单'" :visible.sync="dialogFormVisible" width="500px">
      <el-form class="small-space Form"  :model="menuForm" label-position="right" label-width="80px"
              >
        <el-form-item label="API URL" required >
          <el-col :span="22"><el-input type="text" v-model="menuForm.apiUrl"> </el-input></el-col>
        </el-form-item>
         <el-form-item label="description" >
          <el-col :span="22"><el-input type="text" v-model="menuForm.description"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="菜单代号" required >
          <el-col :span="22"><el-input type="text" v-model="menuForm.menuCode"> </el-input></el-col>
        </el-form-item>
         <el-form-item label="菜单名称" required >
          <el-col :span="22"><el-input type="text" v-model="menuForm.menuName"> </el-input></el-col>
        </el-form-item>
         <el-form-item label="权限代号" required >
          <el-col :span="22"><el-input type="text" v-model="menuForm.permissionCode"> </el-input></el-col>
        </el-form-item>
         <el-form-item label="权限名称" required >
          <el-col :span="22"><el-input type="text" v-model="menuForm.permissionName"> </el-input></el-col>
        </el-form-item>
        <el-form-item label="是否必选" required >
          <el-col :span="22">
               <el-radio  label="1" v-model="menuForm.requiredPermission">是</el-radio>
               <el-radio  label="2" v-model="menuForm.requiredPermission">否</el-radio>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button v-show="type=='create'" type="primary" @click="createMenu" size="mini" :laoding="createLoading">创 建</el-button>
        <el-button type="primary" v-show="type=='update'" @click="updateMenu" size="mini" :laoding="createLoading">修 改</el-button>
      </div>
    </el-dialog>    
  </div>
</template>
<script>
import { menuAdd, menuDelete, menuUpdate, menuDetail, menuList } from  "@/api/config/options"
export default {
    data() {
        return {
            page:1,
            pageSize:10,
            total:0,
            type:'create',
            dialogFormVisible:false,
            createLoading:false,
            index:'',
            menuList:[
            ],
            menuForm:{
                apiUrl:'',
                description:'',
                menuCode:'',
                menuName:'',
                permissionCode:'',
                permissionName:'',
                requiredPermission:''
            }
        }
    },
    methods:{
        createMenu:function(){
            let self=this;
            self.createLoading=true;
            menuAdd(self.menuForm).then(function(res){
                 self.createLoading=false;
                 if(res.resCode==0){
                    self.$message.success(res.msg);
                    self.menuList.unshift(res.data);
                    self.dialogFormVisible=false;
                 }
                 else{
                    self.$message.error(res.msg);
                 }
            });
        },
        updateMenu:function(){
            let self=this;
              self.createLoading=true;
            menuUpdate(self.menuForm).then(res=>{
                  self.createLoading=false;
                if(res.resCode==0){
                    self.$message.success(res.msg);
                    self.menuList.splice(self.index,1,res.data);
                    self.dialogFormVisible=false;
                 }
                 else{
                    self.$message.error(res.msg);
                 }
            });
        },
        showCreate:function(){
            this.dialogFormVisible=true;
            this.menuForm={
                menuCode:'',
                menuName:'',
                permissionCode:'',
                permissionName:'',
                requiredPermission:''
            }
        },
        showUpdate:function(scope){
            this.index=scope.$index;
            this.type='update';
            this.menuForm=Object.assign({},this.menuList[scope.$index]);
            this.menuForm.requiredPermission=this.menuForm.requiredPermission+'';
            this.dialogFormVisible=true;
            //this.menuForm.permissionId= this.menuForm.id;
            //this.menuForm.requiredPermission=Number(this.menuForm.requiredPermission)
        },
        getMenuList:function(){
            let self=this;
            menuList({page:self.page,page_size:self.pageSize}).then(res =>{
                 if(res.resCode==0){
                     self.menuList=res.data.menuList;
                     self.total=res.data.menuCount;
                 }
                 else{
                     self.$message.error(res.msg);
                 }
            })
        },
        deleteMenu:function(scope){
            let self=this;
             this.$confirm('确定删除此菜单?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
         
          menuDelete({permissionId: scope.row.permissionId}).then((res) => {
               if(res.resCode==0){
                    self.$message.success(res.msg);
                    self.menuList.splice(scope.$index,1);
               }
               else{
                   self.$message.error(res.msg);
               }
          }).catch(e => {
          })
        })
        },
         handleSizeChange: function(val) {
      //this.$store.commit('SET_PAGESIZE',val);
            let self = this;
            this.pageSize = Number(val);
            this.page = 1;
            this.getMenuList();

            },
            handleCurrentChange: function(val) {
            let self = this;
            this.page = Number(val);
            this.getMenuList();
            },
    },
    computed:{
        showPagination:function(){
          return this.total/this.pageSize>1?true:false;
        }
    },
    mounted:function(){
      this.getMenuList();
    }
}
</script>
<style></style>
