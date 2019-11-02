<template>
<div>
    <el-row 
     v-show="!$store.getters.showFolderTask"
    style="border-bottom:1px solid #dcdfe6;padding:5px 20px;position:fixed;top:0;left:66px;right:0px;z-index:999;background:#fff">
            <el-col :span="10"  style="font-size:20px;">
                    &nbsp;
                   <el-button   
                     @click="$store.commit('SET_TASK',true)"
                   type="text" ><i class="el-icon-menu el-icon--left"></i>{{Form.msaTaskName}}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            </el-col>
            <el-col :span="14" class="text-right">
                <el-button size="mini" type="primary"  @click="back">
                    <svg-icon  icon-class="back" style="font-size:20px"></svg-icon>
                </el-button>
            </el-col>
    </el-row>
     <div class="app-container" >
        <el-row class="vertical-tabs" >
            <el-col :xs="{span:20,offset:2}" :sm="{span:18,offset:3}"
                :md="{span:16,offset:4}" :lg="{span:16,offset:4}" :xl="{span:16,offset:4}"  style="position:relative" >
                <el-button  style="position:absolute;left:20px;top:260px;z-index:99" type="primary" size="small" :loading="updateLoading"  @click="submit">保存</el-button>
                <el-tabs  type="border-card" tab-position="left" v-model="activeName" :style="{'min-height':$Height()-100+'px'}" style="margin-top:50px">
                    <el-tab-pane label="基本配置" name="first">
                         <el-form  label-position="right"  label-width="120px"  ref="msa" :model="Form"  :rules="rules"  class="Form m-t" size="mini">
                            <el-col :span="22">
                                <el-form-item label="任务配置名 :" prop="msaTaskName">
                                    <el-input v-model="Form.msaTaskName"></el-input>
                                </el-form-item>
                                <el-form-item label="描述 :">
                                    <el-input v-model="Form.comment"></el-input>
                                </el-form-item>
                                <el-form-item  label="数据分析 :" prop="configDataanalysisId">
                                    <el-select v-model="Form.configDataanalysisMsaId"  placeholder="请选择数据分析"
                                    >
                                        <el-option
                                           v-for="ds in dsList"
                                            :key="ds.configDataanalysisMsaId"
                                            :label="ds.configDataanalysisMsaName"
                                            :value="ds.configDataanalysisMsaId">
                                            <span style="float: left">{{ ds.configDataanalysisMsaName }}</span>
                                            <span style="float: right; color: #999; font-size: 12px">MSA</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="规格上限 :" prop="usl">
                                    <el-input v-model.number="Form.usl"></el-input>
                                </el-form-item>
                                <el-form-item label="规格下限 :" prop="lsl">
                                    <el-input v-model.number="Form.lsl"></el-input>
                                </el-form-item>
                                <el-form-item label="目标值 :" prop="targetValue">
                                    <el-input v-model.number="Form.targetValue"></el-input>
                                </el-form-item>
                            </el-col>
                         </el-form>

                    </el-tab-pane>
                    <el-tab-pane label="判异配置" name="second">
                        <el-form  label-position="right" label-width="20px" class="Form">
                            <el-row>
                                <el-col :span="23">
                                    <el-form-item >
                                        <div  class="Table SPC_Table" style="position:relative">
                                            <el-table 
                                                ref='multipleTable'
                                                :data="ruleList"
                                                tooltip-effect="dark"
                                                style="width: 100%;overflow:hidden"
                                                border
                                                size="mini"
                                                row-key="ruleNumber"
                                                @select="selectRules"
                                            >
                                                <el-table-column
                                                type="selection"
                                                :reserve-selection="true"
                                                align="center"
                                                width="30px">
                                                </el-table-column>
                                                <el-table-column
                                                label="编号"
                                                prop="ruleNumber"
                                                align="center"
                                                width="50px">
                                                </el-table-column>
                                                <el-table-column
                                                label="现行规则"
                                                min-width="10px"
                                                show-overflow-tooltip
                                                >
                                                <template slot-scope="scope">
                                                    {{scope.row.content.replace('n',scope.row.n).replace('m',scope.row.m)}}
                                                </template>
                                                </el-table-column>
                                                <el-table-column
                                                prop="content"
                                                label="规则依据"
                                                min-width="10px"
                                                show-overflow-tooltip>
                                                </el-table-column>
                                                <el-table-column
                                                
                                                label="操作"
                                                width="150px"
                                                align="center"
                                                show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                        <el-button size="mini"  :type="judgeSelect.indexOf(scope.row.ruleNumber)==-1?'info':'primary'" :disabled="judgeSelect.indexOf(scope.row.ruleNumber)==-1"  @click="rowDbclick(scope)" >编辑</el-button>
                                                        <el-button size="mini"  :type="ruleNumber==scope.row.ruleNumber?'success':'info'" plain
                                                            @click="chartDes(scope.row)"
                                                            ><svg-icon icon-class="line-chart"></svg-icon>
                                                        </el-button>
                                                </template>
                                                </el-table-column>
                                            </el-table>
                                            <div style="z-index:10;position:absolute;width:25px;height:25px;
                                                top:10px;left:4px;text-align:center
                                                line-height:25px;
                                                background:rgb(245,246,250);
                                                ">
                                                    #
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item>
                                         <v-ruleline v-if="activeName=='second'"
                                         :ruleNumber="ruleNumber"
                                         :content="content"
                                         :n="n"
                                         :m="m"
                                         ></v-ruleline>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>            
                    </el-tab-pane>
                    <!-- <el-tab-pane label="新添加项" name="third">
                                1111111111111111
                    </el-tab-pane> -->
                </el-tabs>
            </el-col>
        </el-row>
     </div> 
     <el-dialog
            :close-on-click-modal='false'
            :visible.sync="showChangePy"
            :show-close='false'
            class="dialog setting-form"
            width="300px"
            >
            <el-form label-position="right" label-width="40px"  class="Form" size="mini">
                <el-form-item v-for="(val, k, index) in selectedPy"
                v-if="k!=='ruleNumber'" :key="index+'_'+'@'"  :label="'['+ k +'] =' ">
                      <el-input v-model="selectedPy[k]"></el-input>
                </el-form-item>
            </el-form>
            <div style="border-top:1px solid #ebeef5;margin-top:20px;text-align:center;padding-top:20px;margin-bottom:-10px">
                <span slot="footer" class="dialog-footer" >
                    <el-button type="primary"  size="mini" @click="changePy">修改</el-button>
                    <el-button size="mini"  @click="cancelChangePy">取消</el-button>
                </span>
            </div>
    </el-dialog> 
     <v-folder v-show="$store.getters.showFolderTask"></v-folder>    
 </div>
</template>   
<script>
import folderTask from '@/views/home/folderList'
import { dsMsaList  } from "@/api/dataSource";
import { msaRuleList, msaRuleUpdate, msaDetail,msaUpdate} from "@/api/msaDoe/msa"
import RuleLine from "@/views/spc/com/ruleLine"
export default {
    components:{
       'v-folder':folderTask,
       'v-ruleline':RuleLine
    },
    data(){
         let uslValidate=(rule,value,callback)=>{
             if(value){
                // let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                //   if(reg.test(value) && value>0){
                        if(this.Form.lsl && value <= this.Form.lsl){
                              callback(new Error('规格上限必须大于规格下限'));
                        }
                        else  if(this.Form.targetValue && value <= this.Form.targetValue){
                             callback(new Error('规格上限必须大于目标值'));
                         }
                         else{
                            callback();
                         }
                        
                //   }
                //   else{
                //       callback(new Error('规格上限只能是>0的数字'));
                //   }
             }
             else{
               callback();
             }
        }
        let lslValidate=(rule,value,callback)=>{
             if(value){
                // let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                //   if(reg.test(value) && value>0){
                        if(this.Form.usl && value >= this.Form.usl){
                             callback(new Error('规格下限必须小于规格上限'));
                         }
                        else if(this.Form.target_value && value >= this.Form.target_value){
                                callback(new Error('规格下限必须小于目标值'));
                        }
                        else{
                           callback();
                        }
                       
                //   }
                //   else{
                //       callback(new Error('规格下限只能是>=0的数字'));
                //   }
             }
             else{
               callback();
             }
        }
        let targetValidate=(rule,value,callback)=>{
              if(value){
                // let reg=/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
                //   if(reg.test(value) && value>0){
                        if(this.Form.usl && value >= this.Form.usl){
                              callback(new Error('目标值必须小于规格上限'));
                        }
                        else if(this.Form.lsl && value <= this.Form.lsl){
                           callback(new Error('目标值必须大于规格下限'));
                        }
                        else {
                           callback();
                        }
                       
                //   }
                //   else{
                //       callback(new Error('目标值只能是>0的数字'));
                //   }
             }
             else{
               callback();
             }
        }

        return {
            ruleNumber:'',
            content:'',
            n:'',
            m:'',
            activeName:'first',
            showChangePy:false,
            updateLoading:false,
            msaTaskId:'',
            selectedPy:{},
            selectedPyIndex:'',
            Form:{
                configDataanalysisMsaId:'',
                msaTaskName:'',
                decimalGigits:'',
                usl:'',
                lsl:'',
                targetValue:'',
                comment:'',
            },
            rules:{
                configDataanalysisMsaId:[
                    {required:true,message:'请选择数据分析',trigger:"change,blur"}
                ],
                msaTaskName:[
                    {required:true,message:'请填写任务配置名',trigger:"change,blur"}
                ],
                usl:[
                    {required:true,message:'请填写规格上限',trigger:"change,blur"},
                    {type:'number',message:'规格上限必须是数字',trigger:"change,blur"},
                    { validator: uslValidate,trigger:'change,blur'}

                ],
                lsl:[
                    {required:true,message:'请填写规格下限',trigger:"change,blur"},
                    {type:'number',message:'规格下限必须是数字',trigger:"change,blur"},
                    { validator: lslValidate,trigger:'change,blur'}
                ],
                targetValue:[
                    { validator: targetValidate,trigger:'change,blur'}
                ],
            },
            ruleList:[],
            pyNum: [//  计量 X
                {
                ruleNumber: 1,
                n: "1",
                },
                {
                ruleNumber: 2,
                n: "9"
                },
                {
                ruleNumber: 3,
                n: "6"
                },
                {
                ruleNumber: 4,
                n: "14"
                },
                {
                ruleNumber: 5,
                n: "3",
                m: "2"
                },
                {
                ruleNumber: 6,
                n: "5",
                m: "4"
                },
                {
                ruleNumber: 7,
                n: "15"
                },
                {
                ruleNumber: 8,
                n: "8"
                }
            ],
            dsList:[]
        }
    },
    methods:{
        back:function(){
            this.$router.push("/msa/detail/"+this.msaTaskId);
        },
        getDsList:function(){
            dsMsaList().then(res=>{
                console.log('======getDsList========');
                console.log(res);
                if(res.code==200){
                    this.dsList=res.data.list;
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        selectRules: function(selection, row) {
            let data=Object.assign({},this.ruleList[row.ruleNumber-1]);
            data.enable=-(data.enable);
            this.fullLoading=this.$loading(this.LOADING);
            msaRuleUpdate(data).then(res=>{
                this.fullLoading.close();
                if(res.code==200){
                    this.ruleList[row.ruleNumber-1].enable=-(this.ruleList[row.ruleNumber-1].enable)
                }
            });
        },
        rowDbclick: function(scope) {//编辑
            console.log(scope)
            this.showChangePy = true;
            let rule=this.pyNum[scope.$index];
            for(let k in rule){
                if(k!='ruleNumber'){
                    rule[k]=scope.row[k]
                }
            }
            //rule.spcTaskId=scope.row.spcTaskId;
            //rule.enable=scope.row.enable;
            this.selectedPy = Object.assign({},rule);
            this.selectedPyIndex = scope.$index;    
        },
        cancelChangePy: function() {
            this.showChangePy = false;
        },
        changePy: function() {
            let selectRule=this.ruleList[this.selectedPyIndex];
            let data=Object.assign({},selectRule,this.selectedPy);
           
            console.log(data);
            this.fullLoading=this.$loading(this.LOADING);
            msaRuleUpdate(data).then(res=>{
                 this.fullLoading.close();
                 if(res.code==200){
                    this.showChangePy=false;
                    this.ruleList.splice(this.selectedPyIndex,1,data);
                    this.$message.success(res.message);
                     //修改属性
                    this.n=data.n;
                    this.m=data.m;
                    this.content=data.content.replace('n',data.n).replace('m',data.m);  
                    this.ruleNumber=data.ruleNumber;
                 }
                 else{
                    this.$message.error(res.message);
                 }
            });
          
        },
        submit:function(){
            this.$refs.msa.validate(res=>{
                if(res){
                    this.updateLoading=true;
                    msaUpdate(this.Form).then(res=>{
                        this.updateLoading=false;
                        if(res.code==200){
                            this.$message.success(res.message);
                        }
                        else{
                            this.$message.error(res.message);
                        }
                        console.log(res);
                    });
                }
            });
        },
        getRuleList:function(){
            msaRuleList({msaTaskId:this.msaTaskId}).then(res=>{
                if(res.code==200){
                    console.log(res);
                    this.ruleList=res.data;
                    this.filterRules();
                }
            });
        },
        filterRules:function(controlGraph){
            if(this.ruleList.length>0){
               this.ruleList.forEach(row => {
                    if(row.enable==1){
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                });
            }
        },
        getMsaDetail:function(){
            msaDetail({msaTaskId:this.msaTaskId}).then(res=>{
                if(res.code==200){
                    this.Form=res.data;
                }
            });
        },
        chartDes:function(info){
          
            this.n=info.n;
            this.m=info.m;
            this.content=info.content.replace('n',info.n).replace('m',info.m);  
            this.ruleNumber=info.ruleNumber;
        }
    },
    computed:{
        judgeSelect:function(){
            let arr=[];
            if(this.ruleList.length>0){
                this.ruleList.forEach(item=>{
                    if(item.enable==1){
                        arr.push(item.ruleNumber);
                    }
                });
            }
            return arr;     
        }
    },
    created:function(){
        this.msaTaskId=this.$route.params.msa_id;
        this.getMsaDetail();
        this.getRuleList();
        this.getDsList();
    }
}
</script>
<style scoped>

</style>

                    
                   