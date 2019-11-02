<template>
  <div class="app-container pt-none">
    <div class="m-t">
       <el-row>
        <el-col :span="12">
          <span class="TITLE">{{title}}-选项列表</span>
        </el-col>
        <el-col :span="12" class="text-right"> 
          <el-button type="primary" size="mini"
             @click="showSettingForm =true;
                     spcActionType='create';
                    fieldsOptionForm=Object.assign({},fieldsOption)"
            >创建控制层级选项</el-button>
       </el-col>
      </el-row> 
    </div> 
    <div class="Table pointer  m-t" >
      <el-table 
          :data="fieldsOptionList"
          style="width: 100%"
          align="center"
          size="mini"
          border
          >
          <el-table-column
              prop="fields_options_name"
              label="控制层级选项名称"
              align="center"
              >
              <!-- <template slot-scope="scope">
                <el-button  class="button-link"  type="text">{{scope.row.fields_options_name}}</el-button>
              </template> -->
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
              <el-button  class="button-link"  type="text" @click="delInfo(scope)">删除</el-button>
              <el-button  class="button-link"  type="text" @click="fieldsOptionUpdate(scope)">编辑</el-button>
          </template>
          </el-table-column>
      </el-table>
    </div>
     <div class="m-t text-center" v-show="fieldsOptionList.length>0">
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
    <el-dialog
        :close-on-click-modal='false'
        :visible.sync="showSettingForm"
        :show-close='false'
        class="dialog setting-form"
        width="600px">
        <el-form label-position="right" label-width="140px"  class="Form" size="mini">
            <el-row>
                <el-col>
                     <el-form-item  label="控制层级选项名称 :" class="required">
                        <el-col :span="22"><el-input  v-model="fieldsOptionForm.fields_options_name"> </el-input></el-col>
                    </el-form-item>
                </el-col>  
            </el-row>        
        </el-form>
        <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">
            <span slot="footer" class="dialog-footer" >
                <el-button type="primary"  size="mini" :loading="loadingSave" @click="submit">保存</el-button>
                <el-button size="mini"  @click="cancel">取消</el-button>
            </span>
        </div>
    </el-dialog>
    
  </div>
</template>

<script>
 import {fieldsOptionCreate, fieldsOptionUpdate, fieldsOptionDelete, fieldsOptionList} from "@/api/config/fieldsOption.js"
  export default {
    data(){
      return {
        pageSize:10,
        page:1,
        total:0,
        title:"",
        spc_fields_id:'',
        loadingSave:false,
        fieldsOptionList:[  //fieldsOptionList
  
       ],
       showSettingForm: false,
       fieldsOptionForm: {
         fields_options_name:'', 
       
      },
      fieldsOption: {
        fields_options_name:'', 
      },
       fieldsOptionInfo:'' , //del-scope update-scope
       spcActionType:'', //create update
      }

    },
    methods:{
        submit:function(){
          let self=this;
          self.loadingSave=true;
          if(self.spcActionType=='create'){
            self.fieldsOptionForm.spc_fields_id=self.spc_fields_id;
            fieldsOptionCreate(self.fieldsOptionForm).then(function(res){
              console.log(res);
                 if(res.resCode==0){
                    self.showSettingForm=false;
                    self.$message({
                      message:res.msg,
                      type:'success'
                    });
                    self.fieldsOptionList.unshift(res.data);
                }
                else{
                  self.$message({
                    message:res.msg,
                    type:'error'
                  });
                }
                self.loadingSave=false;
            });
          }
          if(self.spcActionType=='update'){
                fieldsOptionUpdate(self.fieldsOptionForm).then(function(res){
                 if(res.resCode==0){
                   self.showSettingForm=false;
                     console.log(res);
                    self.$message({
                      message:res.msg,
                      type:'success'
                    });
                     let data=res.data
                    self.fieldsOptionList.splice(self.fieldsOptionInfo.$index,1,data);
                }
                else{
                  self.$message({
                    message:res.msg,
                    type:'error'
                  });
                }
                self.loadingSave=false;
                
                });
          }
          
        },
        cancel:function(){
          let self=this;
          self.showSettingForm=false;
          self.fieldsOptionForm=Object.assign({},self.fieldsOption);
        },
        delInfo:function(scope){
           let self=this;
            self.$confirm('确定删除这条信息?', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'warning'
            }).then(function(){
                  fieldsOptionDelete({spc_fields_options_id:scope.row.spc_fields_options_id}).then(function(res){
                if(res.resCode==0){
                    self.$message.success(res.msg)
                   self.fieldsOptionList.splice(scope.$index,1);

                }
                else{
                 self.$message.error(res.msg)
                }
                   
            });

            }).catch(()=>{});
        },
        fieldsOptionUpdate:function(scope){
              this.fieldsOptionInfo=scope;
              this.fieldsOptionForm=Object.assign({},scope.row);
              this.showSettingForm=true;
              this.spcActionType='update'
        },
        getfieldsOptionList:function(){
          let self=this;
          fieldsOptionList({spc_fields_id:self.spc_fields_id}).then(function(res){
              if(res.resCode==0){
                 console.log(res);
                  self.total=res.data.count;
                  if(res.data.list.length>0){
                    self.title=res.data.list[0].fields_name;
                    if(res.data.list[0].spc_fields_options_id==0){
                        self.fieldsOptionLis=[];
                    }
                    else{
                       self.fieldsOptionList=res.data.list;
                    }
                  }
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
        this.$store.commit('SET_PAGE',1);
        this.$store.commit('SET_PAGESIZE',this.pageSize);
        this.getfieldsOptionList();

        },
        handleCurrentChange: function(val) {
          let self = this;
          this.page = Number(val);
          this.$store.commit('SET_PAGE',this.page);
          this.$store.commit('SET_PAGESIZE',this.pageSize);
          this.getfieldsOptionList();
        },
    },
    mounted:function(){
       this.spc_fields_id=this.$route.params.fields_id;
       this.getfieldsOptionList();
      
    },
    beforeRouteLeave:function(to,from,next){
        this.$store.commit('SET_PAGE',1);
        this.$store.commit('SET_PAGESIZE',10);
        next();
    },

  }
</script>
