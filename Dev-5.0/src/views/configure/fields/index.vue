<template>
  <div class="app-container pt-none">
    <div class="m-t">
       <el-row>
        <el-col :span="12">
          <span class="TITLE">控制层级列表</span>
        </el-col>
        <el-col :span="12" class="text-right"  v-if="hasPerm('spclevel:add')"> 
          <el-button type="primary" size="mini"
             @click="showSettingForm =true;
                     spcActionType='create';
                    fieldsForm=Object.assign({},fields)"
            >创建控制层级</el-button>
       </el-col>
      </el-row> 
    </div> 
    <div class="Table pointer  m-t" >
      <el-table 
          :data="fieldsList"
          style="width: 100%"
          align="center"
          size="mini"
          border
          >
          <el-table-column
              prop="fields_name"
              label="控制层级名称"
              align="center"
              >
              <template slot-scope="scope">
                <el-button  class="button-link"  type="text" @click="toDetail(scope)">{{scope.row.fields_name}}</el-button>
              </template>
          </el-table-column>
          <!-- <el-table-column
              prop="create_time"
              label="创建时间"
                align="center"
              >
              <template slot-scope="scope">
                   {{scope.row.create_time | sliceTime}}
              </template>
          </el-table-column> -->
            <el-table-column
              label="操作"
                align="center"
              >
            <template slot-scope="scope">
              <el-button  class="button-link"  type="text" @click="delInfo(scope)" v-if="hasPerm('spclevel:delete')">删除</el-button>
              <el-button  class="button-link"  type="text" @click="fieldsUpdate(scope)"  v-if="hasPerm('spclevel:update')">编辑</el-button>
          </template>
          </el-table-column>
      </el-table>
    </div>
    <div class="m-t text-center" v-show="fieldsList.length>0">
        <el-pagination
             background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync=page
            :page-size=pageSize
            :page-sizes="[10,20,30]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
    <div>
    </div>

      <!-- <el-row>
        <el-col :span="12"> -->
          <el-dialog
              :close-on-click-modal='false'
              :visible.sync="showSettingForm"
              :show-close='false'
              class="dialog setting-form">

              <el-form label-position="right" label-width="110px"  class="hidden-sm-and-down Form" size="mini">
                  <el-row>
                      <el-col>
                          <el-form-item  label="控制层级名称 :" class="required">
                              <el-col :span="22"><el-input  v-model="fieldsForm.fields_name"> </el-input></el-col>
                          </el-form-item>
                      </el-col>  
                  </el-row>        
             </el-form >
             <el-form label-position="top"  label-width="110px"  class="hidden-md-and-up Form" size="mini">
                  <el-row>
                      <el-col>
                          <el-form-item  label="控制层级名称 :" class="required">
                              <el-col :span="24"><el-input  v-model="fieldsForm.fields_name"> </el-input></el-col>
                          </el-form-item>
                      </el-col>  
                  </el-row>        
             </el-form >
              <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">
                  <span slot="footer" class="dialog-footer" >
                      <el-button type="primary"  size="mini" :loading="loadingSave" @click="submit">保存</el-button>
                      <el-button size="mini"  @click="cancel">取消</el-button>
                  </span>
              </div>
          </el-dialog>
        <!-- </el-col>
      </el-row> -->
  </div>
</template>

<script>
 import {fieldsCreate, fieldsUpdate, fieldsDelete, fieldsList} from "@/api/config/fields.js"
  export default {
    data(){
      return { 
        pageSize:10,
        page:1,
        total:0,
        loadingSave:false,
        fieldsList:[  //fieldsList
      
       ],
       showSettingForm: false,
       fieldsForm: {
         fields_name:'', 
       
      },
      fields: { //用于重置
         fields_name:'', 
      },
       fieldsInfo:'' , //del-scope update-scope
       spcActionType:'', //create update
      }

    },
    methods: {
        toDetail:function(scope){
            //this.$router.push('/configure/fieldsOption/1');
             this.$router.push('/configure/fieldsOption/'+scope.row.spc_fields_id);
        },
        submit:function(){
          let self=this;
          self.loadingSave=true;
          if(self.spcActionType=='create'){
            fieldsCreate(self.fieldsForm).then(function(res){
              console.log(res);
                self.loadingSave=false;
                 if(res.resCode==0){
                    self.$message({
                      message:res.msg,
                      type:'success'
                    });
                    self.fieldsList.unshift(res.data);
                }
                else{
                  self.$message({
                    message:res.msg,
                    type:'error'
                  });
                }
            });
          }
          if(self.spcActionType=='update'){
                fieldsUpdate(self.fieldsForm).then(function(res){
                    self.loadingSave=false;
                 if(res.resCode==0){
                     console.log(res);
                    self.$message({
                      message:res.msg,
                      type:'success'
                    });
                     let data=res.data
                    self.fieldsList.splice(self.fieldsInfo.$index,1,data);
                }
                else{
                  self.$message({
                    message:res.msg,
                    type:'error'
                  });
                }
                });
          }
           self.showSettingForm=false;
        },
        cancel:function(){
          let self=this;
          self.showSettingForm=false;
          self.fieldsForm=Object.assign({},self.fields);
        },
        delInfo:function(scope){
          // console.log(scope);
          //    this.$store.commit('setDeleteDialog',true);
          //    this.fieldsInfo=scope;
          let self=this;
          self.$confirm('确定删除这条信息?', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'warning'
            }).then(function(){
                fieldsDelete({spc_fields_id:scope.row.spc_fields_id}).then(function(res){
                if(res.resCode==0){
                    self.$message.success(res.msg)
                   self.fieldsList.splice(scope.$index,1);

                }
                else{
                  self.$message.error(res.msg)
                }
                   
               });

            }).catch(()=>{})
        },
        fieldsUpdate:function(scope){
              this.fieldsInfo=scope;
              this.fieldsForm=Object.assign({},scope.row);
              this.showSettingForm=true;
              this.spcActionType='update'
        },
        getfieldsList:function(){
          let self=this;
          fieldsList({}).then(function(res){
              if(res.resCode==0){
                console.log(res);
                  self.fieldsList=res.data.list;
                  self.total=res.data.count;
              }else{
                self.$message({
                    message: res.msg,
                    type:'error'
                });
              }
          });
        },
        handleSizeChange: function(val) {
        //this.$store.commit('SET_PAGESIZE',val);
        let self = this;
        this.pageSize = Number(val);
        this.page = 1;
        console.log(this.$store);
        this.$store.commit('SET_PAGE',1);
        this.$store.commit('SET_PAGESIZE',this.pageSize);
        this.getfieldsList();

      },
      handleCurrentChange: function(val) {
        let self = this;
        this.page = Number(val);
         console.log(this.$store);
        this.$store.commit('SET_PAGE',this.page);
        this.$store.commit('SET_PAGESIZE',this.pageSize);
        this.getfieldsList();
      },
    },
    beforeRouteLeave:function(to,from,next){
        this.$store.commit('SET_PAGE',1);
        this.$store.commit('SET_PAGESIZE',10);
        next();
    },
    mounted:function(){
      if(this.hasPerm('spclevel:list')){
          this.getfieldsList();
      }
      //this.getfieldsList();
        
    }

  }
</script>
