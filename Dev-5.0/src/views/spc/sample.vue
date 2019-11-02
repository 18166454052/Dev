<template>
  <div class="app-container pt-none">
    <div class="m-t">
       <el-row>
        <el-col :span="22">
          <span class="TITLE" >SPC任务列表</span>
        
        </el-col>
        <el-col :span="2"  class="text-right" v-if="hasPerm('controlChart:list')">
            <el-button type="primary" size="mini" v-show="tabList.length>0"  @click="toggleShowType">
                 {{ showType=="list"?'切换到标签页':'切换到列表页' }}
            </el-button>
        </el-col>
        <!-- <el-col :span="22" class="text-right"> 
          <el-button-group>
             <el-button :type="spcType =='spcList'? 'primary':'info' " @click="spcType ='spcList'">SPC List</el-button>
             <el-button :type="spcType =='spcConfig'? 'primary':'info' " @click="spcConfigList">SPC_Config List</el-button>
           </el-button-group>
       </el-col> -->
      </el-row> 
    </div> 
    <!---标签页-->
    <div class="m-t" v-show="showType=='tab' && tabList.length>0">
      <el-tabs v-model="activeName2" type="card" 
        @tab-remove="removetab" 
        @tab-click="clicktab"
        >
        <el-tab-pane v-for="(tab,index) in tabList" 
        :label="tab.config_name" 
        :key="tab.config_name+'_'+tab.spc_config_id"
        :name="index+'_'+tab.config_name"
        closable
        >
        
       </el-tab-pane>
        <div v-for="tab in activeTabList" 
        :key="tab.spc_config_id+'_@_'"
        v-if="tab.control_graph>=0 && tab.control_graph<=4">
             <xr-template  :config_id="tab.spc_config_id"  v-show="showTem==tab.spc_config_id"></xr-template>
        </div>
        <div v-else> 
             <ct-template :config_id="tab.spc_config_id"   v-show="showTem==tab.spc_config_id"></ct-template>
        </div>
       
      </el-tabs>

    </div>
    <!---列表页-->
    <div  v-show="showType=='list'">
      <div style="margin-top:10px;">
            <el-row>
              <el-col :span="20">
                <el-form ref="form"
                 :inline="true" :label-position="'right'" 
                class="Form" label-width="95px" size="mini"
                >
                    <el-form-item label="按类型过滤 :">
                          <el-select v-model="forList.type"  clearable  @change="forList.graph=''">
                            <el-option label="计量型" value="-2"></el-option>
                            <el-option label="计数型" value="-1"></el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="按控制图过滤 :">
                          <el-select v-model="forList.graph"  clearable>
                              <el-option v-for="graph in filterGraphList" 
                              :label="graph.label"  
                              :value='graph.value'
                              :key="graph.label"
                              ></el-option>
                                  
                          </el-select>
                    </el-form-item>
                    <el-form-item >
                          <el-button  type="primary" size="mini" @click="getSpcconfigList">确定</el-button>
                    </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4" class="text-right"  v-if="hasPerm('spc:add')">
                  <el-button type="primary" size="mini"
                  @click="createConfig"
                  >创建SPC任务</el-button>
              </el-col>
            </el-row>   
          </div> 
          <div class="Table pointer " >
            <el-table
                :data="configList"
                style="width: 100%"
                align="center"
                border
                size="mini"
                >
                <el-table-column
                    prop="config_name"
                    label="任务名称"
                    align="center"
                    >
                    <template slot-scope="scope">
                      <el-button  class="button-link" 
                       type="text" @click="toDetail(scope)">{{scope.row.config_name}}</el-button>
              </template>
                </el-table-column>
                <el-table-column
                    prop="control_graph"
                    label="控制图类型"
                    align="center"
                    width="100px"
                    >
                    <template  slot-scope="scope">
                        {{graphType[scope.row.control_graph-1].label}}
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
                    <el-button  class="button-link" :loading="delLoading==scope.$index" type="text" @click="delInfo(scope)"  v-if="hasPerm('spc:delete')">删除</el-button>
                    <el-button  class="button-link"  type="text" @click="editSpcConfig(scope)"  v-if="hasPerm('spc:update')">编辑</el-button>
                    <el-button  class="button-link"  v-if="selectTab.indexOf(scope.row.spc_config_id)==-1"
                    type="text" 
                    @click="addTab(scope)"
                   
                    >添加至标签页</el-button>
                     <el-button  class="button-link"   v-else
                    type="text" 
                    style="color:#E6A23C"
                    @click="deletTab(scope)"
                    >从标签页删除</el-button>
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
    </div>
    
    <div>
    </div>
    
  </div>
</template>

<script>
import XRDetailIndex from "@/views/spc/component/sample/xr_detail_index.vue";
import CTDetailIndex from "@/views/spc/component/sample/ct_detail_index.vue";
import { spcList } from "@/api/spc";
import { dataSourceList, dataSourceDetail } from "@/api/dataSource";
import {
  spcConofigDelete,
  spcConofigList,
} from "@/api/spc/config";
import Bus from "@/utils/bus.js"
import { spcViewData } from "@/api/spc/config.js";
export default {
  components:{
    'xr-template':XRDetailIndex,
    'ct-template':CTDetailIndex
  },
  data() {
    return {
      COUNT:[],
      testLoading:false,
      showType:'list', //list tab
      pageSize:10,
      page:1,
      total:0,
      forList: {
        graph: "",
        type: ""
      },
      loadingSave: false,
      spcType: "spcList", //spcList  spcConfig
      spcLists: [
        //spc-list
      ],
      configList: [
        //spc-config-list
        // {
        //     spc_id:'1',
        //     type:'2',
        //     control_project:'33',
        //     control_graph:'4',
        //     create_time:'17:04.0'
        // }
      ],
      showSettingForm: false,
      spcConfigInfo: "", //del-scope update-scope
      spc_config_id: "",
      fullLoading:null,
      delLoading:-1,
      graphType: [
        { label: "X-R", value: 1, type: "-1"},
        { label: "X-S", value: 2, type: "-1"},
        { label: "me-R", value: 3, type: "-1"},
        { label: "X-MR", value: 4, type: "-1"},
        { label: "P", value: 5, type: "-2" },
        { label: "np", value: 6, type: "-2"},
        { label: "c", value: 7, type: "-2" },
        { label: "u", value: 8, type: "-2" }
      ],
     activeName2:'',
     showTem:'',
     tabList:[
      // {
      //   config_name:'',
      //   spc_config_id:''
      // }
     ],
     activeTabList:[]
    };
  },
  methods: {
    toggleShowType:function(){
       this.showType=='list'?this.showType='tab':this.showType='list' 
       if(this.showType=='tab'){
         this.showTem=this.tabList[0].spc_config_id;
         this.activeName2=0+'_'+this.tabList[0].config_name;
       }
    },
    toDetail:function(scope){
      console.log(scope);
      if([1,2,3,4].indexOf(scope.row.control_graph,0) >= 0){//计量型
                this.$router.push('/spc/xr_detail/'+scope.row.spc_config_id);
            }
      else{//计数型
          this.$router.push('/spc/ct_detail/'+scope.row.spc_config_id);
      }
      
    },
    createConfig:function(){
      this.$router.push('spc/create');
    },
    editSpcConfig:function(scope){
        this.$router.push("spc/edit/" + scope.row.spc_config_id);
    },
    getSpcList: function() {
      let self = this;
      spcList({page:self.page,page_size:self.pageSize}).then(function(res) {
        if (res.resCode == 0) {
          console.log(res);
          self.configList = res.data.spcList;
          self.total=res.data.spcCount;
        } else {
          self.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    cancel: function() {
      let self = this;
      self.showSettingForm = false;
      self.loadingSave = false;
      self.fieldsList = [];
      self.configForm = Object.assign({}, self.config);
     // self.$set(self.configForm,rules_info,[]);
     // self.$set(self.configForm,fields_info,[]);
      self.$refs.multipleTable.clearSelection();
    },
    delInfo: function(scope) {
      // this.$store.commit("setDeleteDialog", true);
      // this.spcConfigInfo = scope;
      let self=this;
      self.$confirm('确定删除SPC?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(()=>{
              //   self.fullLoading = this.$loading({
              //   lock: true,
              //   text: '删除中...',
              //   spinner: 'el-icon-loading',
              //   background: 'rgba(0, 0, 0, 0.5)'
              // });
              self.delLoading=scope.$index;
              spcConofigDelete({
                  spc_config_id: scope.row.spc_config_id
                }).then(function(res) {

                  if (res.resCode == 0) {
                    self.$message.success(res.msg);
                    self.configList.splice(scope.$index, 1);
                    //从添加的标签中删除此项
                    let Index=-1;
                    self.tabList.forEach((item,index)=>{
                         if(item.spc_config_id==scope.row.spc_config_id){
                              Index=index;
                         }
                    });
                    console.log(Index);
                    if(Index>=0){
                        self.tabList.splice(Index,1);
                    }
    

                  } else {
                    self.$message.error(res.msg);
                  }
                   //self.fullLoading.close();
                    self.delLoading=-1;
                });

        }).catch(()=>{});
    },
    getSpcconfigList: function() {
      let self = this,
        data = {};
      if (self.forList.graph) {
        data.control_graph = self.forList.graph;
      } else if (self.forList.type) {
        data.control_graph = self.forList.type;
      }
       data.page=self.page;
       data.page_size=self.pageSize;

      spcConofigList(data).then(function(res) {
        if (res.resCode == 0) {
          self.configList = res.data.spcList;
          self.total=res.data.spcCount;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    handleSizeChange: function(val) {
      //this.$store.commit('SET_PAGESIZE',val);
      let self = this;
      this.pageSize = Number(val);
      this.page = 1;
      this.getSpcconfigList();

    },
    handleCurrentChange: function(val) {
      let self = this;
      this.page = Number(val);
      this.getSpcconfigList();
    },
    addTab:function(scope){
      //console.log(scope);
       let obj={
          config_name:scope.row.config_name,
          spc_config_id:scope.row.spc_config_id,
          control_graph:scope.row.control_graph
       }
      if(this.tabList.length<8){
      // if(this.tabList.length<8){
          // 第一次只有第一个请求    其他点击Tab后请求
          //if(this.activeTabList.length==0){
                this.activeTabList.push(obj);
          //}

          this.tabList.push(obj);

          //所有的都请求
          //this.activeTabList.push(obj);
       }
       else{
            this.$message.warning('一次最多添加八个到标签页');
       }
       
       this.showType="list"
      //  if(this.tabList.length>0){
      //     this.showTem=tabList[0].spc_config_id
      //  }
      //  this.activeName2=0+'_'+this.tabList[0].config_name;
    },
    removetab:function(name){//标签页中删除
       // 
      let index=name.toString().split('_')[0],IndexActive=-1;
      let obj= this.tabList.splice(index,1)[0];
      this.activeTabList.forEach((item1,index1)=>{
              if(item1.spc_config_id==obj.spc_config_id){
                  IndexActive=index1;
              }
        });
      if(IndexActive>=0){
          this.activeTabList.splice(IndexActive,1);
      }
     //


     // this.tabList.splice(index,1);
      if(this.tabList.length>0){
         this.activeName2=0+'_'+this.tabList[0].config_name;
         this.showTem=this.tabList[0].spc_config_id;
      }
    
      if(this.tabList.length==0){
         this.showType="list"
      };
      Bus.$emit('indexTemActive');  // 重新触发echarts的加载
    },
    deletTab:function(scope){//列表中移除
        let Index=-1,IndexActive=-1;
        this.tabList.forEach((item,index)=>{
              if(item.spc_config_id==scope.row.spc_config_id){
                  Index=index;
              }
        });
        this.activeTabList.forEach((item1,index1)=>{
              if(item1.spc_config_id==scope.row.spc_config_id){
                  IndexActive=index1;
              }
        });
        this.tabList.splice(Index,1);
        if(IndexActive>=0){
            this.activeTabList.splice(IndexActive,1);
        }
        if(this.tabList.length==0){
          this.showType="list"
        }

        
    },
    clicktab:function(val){
      
     
       let index=val.index,name=val.label;
       // 判断是不是第一次点击（是否已经添加）
       let obj =this.tabList.slice(index,Number(index)+1)[0];
       if(this.activeTabList.length>0){
            let flag=false;
            this.activeTabList.forEach(item=>{
                  if(item.spc_config_id==obj.spc_config_id){
                      flag=true;//已经存在
                  }
            });
            if(!flag){//不存在
                this.activeTabList.push(obj);
            }
       }
       else{
         this.activeTabList.push(obj);
       }
       
       //
       this.activeName2=index+'_'+name;
       this.showTem=this.tabList[index].spc_config_id;
       Bus.$emit('indexTemActive');  // 重新触发echarts的加载
    },
    testAction:function(){
      let self=this;
      let c=0,u=0,p=0,np=0,x_mr=0,x_s=0,me_r=0,x_r=0,count=0,err=0;
        function test(){
           //self.testLoading=true;
           spcViewData({spc_config_id:193,control_graph:7}).then(function(res){
              // self.testLoading=false;
             console.log('c-------='+ c++ +'********'+res.msg);
              console.log('count-------------------------------------'+ count++)
              if(res.resCode!=0){
                 err++;
               
              } 
               console.log('error-------------------------------------'+ err)
               test()
               
           });
        }
        function test1(){
           //self.testLoading=true;
           spcViewData({spc_config_id:192,control_graph:8}).then(function(res){
              // self.testLoading=false;
             console.log('u-------='+ u++ +'********'+res.msg);
              console.log('count-------------------------------------'+ count++)
              if(res.resCode!=0){
                 err++;
               
              } 
               console.log('error-------------------------------------'+ err)
               test1()
               
           });
        }
        function test2(){
           //self.testLoading=true;
           spcViewData({spc_config_id:184,control_graph:5}).then(function(res){
              // self.testLoading=false;
             console.log('p-------='+ p++ +'********'+res.msg);
              console.log('count-------------------------------------'+ count++)
              if(res.resCode!=0){
                 err++;
               
              } 
               console.log('error-------------------------------------'+ err)
               test2()
               
           });
        }
        function test3(){
           //self.testLoading=true;
           spcViewData({spc_config_id:191,control_graph:6}).then(function(res){
              // self.testLoading=false;
             console.log('np-------='+ np++ +'********'+res.msg);
              console.log('count-------------------------------------'+ count++)
              if(res.resCode!=0){
                 err++;
               
              } 
               console.log('error-------------------------------------'+ err)
               test3()
               
           });
        }

        function test4(){
           //self.testLoading=true;
           spcViewData({spc_config_id:190,control_graph:4,move_range:2}).then(function(res){
              // self.testLoading=false;
             console.log('x_mr-------='+ x_mr++ +'********'+res.msg);
              console.log('count-------------------------------------'+ count++)
              if(res.resCode!=0){
                 err++;
               
              } 
               console.log('error-------------------------------------'+ err)
               test4()
               
           });
        }
        function test5(){
           //self.testLoading=true;
           spcViewData({spc_config_id:188,control_graph:2}).then(function(res){
              // self.testLoading=false;
             console.log('x_s-------='+ x_s++ +'********'+res.msg);
              console.log('count-------------------------------------'+ count++)
              if(res.resCode!=0){
                 err++;
               
              } 
               console.log('error-------------------------------------'+ err)
               test5()
               
           });
        }
        function test6(){
           //self.testLoading=true;
           spcViewData({spc_config_id:189,control_graph:3}).then(function(res){
              // self.testLoading=false;
            console.log('me_r-------='+ me_r++ +'********'+res.msg);
             console.log('count-------------------------------------'+ count++)
              if(res.resCode!=0){
                 err++;
               
              } 
               console.log('error-------------------------------------'+ err)
               test6()
               
           });
        }
        function test7(){
           //self.testLoading=true;
           spcViewData({spc_config_id:181,control_graph:1}).then(function(res){
              // self.testLoading=false;
            console.log('计量型大数据X-R*************='+ x_r++ +'************'+res.msg);
             console.log('count-------------------------------------'+ count++)
              if(res.resCode!=0){
                 err++;
               
              } 
              console.log('error-------------------------------------'+ err)
              test7()
               
           });
        }
        test();
        test1();
        test2();
        test3();
        test4();
        test5();
        test6();
        test7();
        
         
    }
  },
  computed:{
      filterGraphList: function() {
      // let arr = [
      //   { label: "X-R", value: 1, type: "-1" },
      //   { label: "X-S", value: 2, type: "-1" },
      //   { label: "me-R", value: 3, type: "-1" },
      //   { label: "X-MR", value: 4, type: "-1" },
      //   { label: "P", value: 5, type: "-2" },
      //   { label: "np", value: 6, type: "-2" },
      //   { label: "c", value: 7, type: "-2" },
      //   { label: "u", value: 8, type: "-2" }
      // ];
      let self = this;
      let arr=self.graphType
      if (!self.forList.type) {
        return arr;
      } else {
        return arr.filter(item => item.type == self.forList.type);
      }
    },
    selectTab: function(){
        return this.tabList.map(item=>{
            return item.spc_config_id;
        });
    }
  },
  created: function() {
    if(this.hasPerm('controlChart:list')){
       this.getSpcconfigList();
    }
    // this.testAction();
    let self=this;
    Bus.$on('Busying',function(id){
        let Index=-1,IndexActive=-1;
        self.tabList.forEach((item,index)=>{
              if(item.spc_config_id==id){
                  Index=index;
              }
        });
        self.activeTabList.forEach((item1,index1)=>{
              if(item1.spc_config_id==id){
                  IndexActive=index1;
              }
        });
        if(Index>=0){
           self.tabList.splice(Index,1);
        }
        if(IndexActive>=0){
            self.activeTabList.splice(IndexActive,1);
        }
        if(self.tabList.length==0){
          self.showType="list"
        }
    })
    //async
    
   
  }
};
</script>

<style scoped>
.text-muted {
  color: #999;
  font-size: 12px;
  line-height: 1.4;
  margin: 4px 0;
}
.setting {
  margin-bottom: -1000px;
  padding-bottom: 1000px;
}
.setting + .setting {
  border-left: 1px solid #ccc;
}
.setTitle {
  color: rgb(102, 177, 255);
  padding-bottom: 15px;
}
</style>
