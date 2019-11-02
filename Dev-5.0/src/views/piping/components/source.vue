<template>
   <el-form label-position="right"  :model="source" :rules="rules" ref="source" :label-width="width" class="Form " size="mini">
       <el-form-item  label="节点名称 :"  prop="source.cepSourceName">
           <el-col :span="22">
               <el-input v-model="source.source.cepSourceName" @input="changeName"
                  placeholder="Source节点名称不能包含下划线_"
               ></el-input>
           </el-col>
       </el-form-item>
       <el-form-item  label="描述 :">
           <el-col :span="22">
               <el-input v-model="source.source.comment"></el-input>
           </el-col>
       </el-form-item> 
        <el-form-item label="使用模板 : ">
           <el-col :span="22">
               <el-radio-group v-model="useTemplate" @change="templateIndex=''">
                    <el-radio :label='true'>是</el-radio>
                    <el-radio :label='false'>否</el-radio>
            </el-radio-group>
               
           </el-col>
       </el-form-item>
       <el-form-item label="模板 : " v-show="useTemplate">
           <el-col :span="22">
               <el-select v-model="templateIndex"
                @change="setTemplateAttr"
               >
                    <el-option 
                    v-for="(column,index) in sourceTemplate"
                    :key="index+'_'+column.cepSourceName"
                    :label="column.cepSourceName"
                    :value="index"
                    ></el-option>
               </el-select>
               
           </el-col>
       </el-form-item>
       <el-form-item  label="数据格式 :" prop="source.messageFormat">
            <el-col :span="22">
                <el-select v-model="source.source.messageFormat"  placeholder="请选择">
                        <el-option v-for="format in messageFormat"
                        :label="format.value"
                        :value="format.num"
                        :key="format.value"
                        >
                        </el-option>
                        
                </el-select>
            </el-col>    
       </el-form-item>
       <el-form-item  label="节点类型 :" prop="source.cepSourceType">
            <el-col :span="22">
           <el-select  v-model="source.source.cepSourceType" placeholder="请选择"
           @change="setTemplate"
           >
                <el-option v-for= "type in sourceType" 
                :label="type.value"
                :value="type.num"
                :key="type.value"
                >
                </el-option>
            </el-select>
            </el-col>
       </el-form-item>
       <div v-show="source.source.cepSourceType=='1'">
            <el-form-item  label="Receiver Url :" prop="http.receiverUrl"> 
                <el-col :span="22">
                    <el-input v-model="source.http.receiverUrl"></el-input>
                </el-col>
           </el-form-item>
       </div>
       
       <div v-show="source.source.cepSourceType=='2'">
            <el-form-item  label="Bootstrap Servers :" prop="kafka.bootstrapServers">
                <el-col :span="22">
                    <el-input v-model="source.kafka.bootstrapServers"></el-input>
                </el-col>
           </el-form-item>
           <el-form-item  label="Topic List :" prop="kafka.topicList">
                <el-col :span="22">
                    <el-input v-model="source.kafka.topicList"></el-input>
                </el-col>
           </el-form-item>
           <el-form-item  label="Group Id :" prop="kafka.groupId">
                <el-col :span="22">
                    <el-input v-model="source.kafka.groupId"></el-input>
                </el-col>
           </el-form-item>
           <el-form-item  label="Threading Option :" prop="kafka.threadingOption">
                <el-col :span="22">
                     <el-select v-model="source.kafka.threadingOption">
                         <el-option
                            v-for="option in kafkaThreadOption"
                            :label="option.value"
                            :value="option.num"
                            :key="option.value"
                         ></el-option>
                     </el-select>
                </el-col>
           </el-form-item>
            <el-form-item  label="Partition No List :" prop="kafka.partitionNoList">
                <el-col :span="22">
                    <el-input v-model="source.kafka.partitionNoList"></el-input>
                </el-col>
           </el-form-item>
       </div>
       <div v-show="source.source.cepSourceType=='3'">
            <el-form-item  label="Client Id :" prop="mqtt.clientid">
                <el-col :span="22">
                    <el-input v-model="source.mqtt.clientid"></el-input>
                </el-col>
           </el-form-item>
            <el-form-item  label="Url :" prop="mqtt.url">
                <el-col :span="22">
                    <el-input v-model="source.mqtt.url"></el-input>
                </el-col>
           </el-form-item>
            <el-form-item  label="Username :" prop="mqtt.username">
                <el-col :span="22">
                    <el-input v-model="source.mqtt.username"></el-input>
                </el-col>
           </el-form-item>
           <el-form-item  label="Password :" prop="mqtt.password">
                <el-col :span="22">
                    <el-input v-model="source.mqtt.password" type="password"></el-input>
                </el-col>
           </el-form-item>
           <el-form-item  label="Topic :" prop="mqtt.topic">
                <el-col :span="22">
                    <el-input v-model="source.mqtt.topic"></el-input>
                </el-col>
           </el-form-item>
       </div>
        <div v-show="source.source.cepSourceType=='4'">
             <el-form-item  label="Context :" prop="tcp.context">
                <el-col :span="22">
                    <el-input v-model="source.tcp.context"></el-input>
                </el-col>
           </el-form-item>
       </div>
      <el-form-item v-show="showAddMapping">
           <el-button size="mini" type="primary" @click="addMapping">添加Mapping</el-button>
       </el-form-item>
       <el-form-item  label="Mapping :"  v-show="showMapping">
            <el-row v-show="hasAddedStreamColumn.length>0" v-for="(mapping,index) in hasAddedStreamColumn" :key="mapping.cepSourceMapId">
                <el-col :span="9">
                     <el-input  placeholder="Regex" v-model="mapping.regex" :readonly="mapping.cepSourceMapId>0"></el-input>
                </el-col>
                <el-col :span="7" v-if="mapping.cepSourceMapId>0" :offset="1">
                    <el-input readonly :value="getStreamName(mapping.cepStreamColumnId)"></el-input>
                </el-col>
                <el-col :span="7" v-else  :offset="1">
                    <el-select v-model="mapping.cepStreamColumnId" placeholder="streamColumnName">
                        <el-option v-for="column in showStreamColumn" 
                        :label="column.streamColumnName" 
                        :value="column.cepStreamColumnId"
                        :key="column.cepStreamColumnId"
                        ></el-option>
                    </el-select>
                </el-col> 
                    <!-- </el-row>   -->
                <!-- </el-col> -->
                <el-col :span="5" class="text-right">
                    <el-button type="primary"  size="mini"  @click="createMapping(index)" :disabled="!mapping.regex || !mapping.cepStreamColumnId" v-show="!mapping.cepSourceMapId">提交</el-button>
                    <el-button type="primary"  size="mini"  @click="mapDelete(mapping,index)" v-show="mapping.cepSourceMapId>0"><i class="el-icon-delete"></i></el-button>
                   
                    
                </el-col>
                <el-col :span="22" class="text-right">
                    <el-button type="primary"  size="mini"  @click="addMapplist" v-show="index==hasAddedStreamColumn.length-1"><i class="el-icon-plus"></i></el-button>
                    
                </el-col>

            </el-row>
            <!---->
            <el-row v-show="hasAddedStreamColumn.length==0" >
                <el-col :span="9">
                        <el-col :span="20"><el-input v-model="mapping.regex" placeholder="Regex"></el-input></el-col>
                </el-col>
                <el-col :span="9">
                    <el-col :span="20">
                        <el-select v-model="mapping.cepStreamColumnId"  placeholder="streamColumnName">
                            <el-option v-for="column in showStreamColumn" 
                            :label="column.streamColumnName" 
                            :value="column.cepStreamColumnId"
                            :key="column.cepStreamColumnId"
                            ></el-option>
                        </el-select>
                    </el-col> 
                  
                </el-col>
                <el-col :span="4" class="text-right">
                    <el-button type="primary" size="mini" :disabled="!mapping.regex || !mapping.cepStreamColumnId"  @click="createMappingFirst">提交</el-button>
                </el-col>
            </el-row>
       </el-form-item>
       <el-form-item label="设置为模板 : ">
           <el-col :span="22">
               <el-radio-group v-model="source.source.published">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
            </el-radio-group>
               
           </el-col>
       </el-form-item>
       <el-form-item label="">
           <el-col :span="22" class="btnBlock">
                <el-button type="primary" size="mini" @click="submit" :loading='loading'>提交</el-button>
           </el-col>
       </el-form-item>
   </el-form>
</template>

<script>
import { 

cepSourceDetail,cepSourceCreate,cepSourceUpdate,
cepSourceHttpCreate,cepSourceHttpUpdate,cepSourceHttpDetail,
cepSourceKafkaCreate,cepSourceKafkaUpdate,cepSourceKafkaDetail,
cepSourceMqttCreate,cepSourceMqttUpdate,cepSourceMqttDetail,
cepSourceTcpCreate,cepSourceTcpUpdate,cepSourceTcpDetail,
cepSourceMapCreate,cepSourceMapDelete,cepSourceMapDetail,
cepSourceTemplate

} from  "@/api/piping/source";
import { cepStreamColumnDetail } from "@/api/piping/stream";
export default{
    props:["hasStream"],
    data(){


        return {
           sourceTemplate:[],
           useTemplate:false,
           templateIndex:'',
           fullLoading:null,
           LOADING:{
                LOADING: {
                lock: true,
                text: '数据处理中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
              }
          },  
          sourceId:'',
          loading:false,
          showAddMapping:false,
          showMapping:false,
          cepProgramId:'',
          source:{
            source:{
                cepSourceId:'',
                cepSourceName:'',
                comment:'',
                messageFormat:'',
                cepSourceType:'', 
                published:0, 
             },
            http:{
                cepSourceHttpId:'',
                cepSourceId:'',
                receiverUrl:''
             },
            kafka:{
                cepSourceKafkaId:'',
                cepSourceId:'',
                bootstrapServers:'',
                topicList:'',
                groupId:'',
                threadingOption:'',
                partitionNoList:'',
            } ,
            mqtt:{
                cepSourceMqttId:'',
                cepSourceId:'',
                url:'',
                username:'',
                password:'',
                clientid:'',
                topic:'' 
             },
            tcp:{
                cepSourceTcpId:'',
                cepSourceId:'',
                context:'',
               }
        },
            rules:{
                source:{
                    cepSourceName:[
                        {required:true,message:'请填写节点名称',trigger:'change,blur'},
                        {validator:this.$checkName,trigger:"change,blur"}
                    ],
                    messageFormat:[{required:true,message:'请选择数据格式',trigger:'change,blur'}], 
                    cepSourceType:[{required:true,message:'请选择节点类型',trigger:'change,blur'}], 
                },
                http:{
                    receiverUrl:[{required:true,message:'请填写receiverUrl',trigger:'change,blur'}]
                },
                kafka:{
                    bootstrapServers:[{required:true,message:'请填写bootstrapServers',trigger:'change,blur'}],
                    topicList:[{required:true,message:'请填写topicList',trigger:'change,blur'}],
                    groupId:[{required:true,message:'请填写groupId',trigger:'change,blur'}],
                    threadingOption:[{required:true,message:'请选择threadingOption',trigger:'change,blur'}],
                    partitionNoList:[{required:true,message:'请填写partitionNoList',trigger:'change,blur'}]
                },
                mqtt:{
                    url:[{required:true,message:'请填写 url',trigger:'change,blur'}],
                    username:[{required:true,message:'请填写 username',trigger:'change,blur'}],
                    password:[{required:true,message:'请填写 password',trigger:'change,blur'}],
                    clientid:[{required:true,message:'请填写 clientid',trigger:'change,blur'}],
                    topic:[{required:true,message:'请填写 topic',trigger:'change,blur'}],
                },
                tcp:{
                    context:[{required:true,message:'请填写 context',trigger:'change,blur'}]
                }

            },
            hasAddedStreamColumn:[],//保存已经添加的streamColumn
            //showStreamColumn:[], //除去已经添加的streamColumn,用户可选择的streamColumn
            mapping:{
                cepStreamColumnId:'',
                regex:'',
                cepSourceMapId:'',
                cepSourceId:''
            },
            cepStreamColumn:[] ,//所有的cepStreamColumn选项
            sourceType:[
                { num:1,value:'http' },
                { num:2,value:'kafka'},
                { num:3,value:'mqtt' },
                { num:4,value:'tcp'},
                // { num:5,value:'websocket'},
                // { num:6,value:'file'},
                // { num:7,value:'email'}
            ],
            kafkaThreadOption:[
                { value:'single.thread', num:1 },
                { value:'topic-wise', num:2 },
                { value:'partition.wise', num:3 },
            ],
            messageFormat:[
                { value:'text', num:1 },
                { value:'json', num:2 },
            ]
            
        }
    },
    methods:{
        addMapping:function(){
            this.showMapping=true;
            //
            /*
            if(this.useTemplate && this.templateIndex>=0){//
                this.hasAddedStreamColumn=this.sourceTemplate[this.templateIndex]['cepSourceMap'];
                if(this.hasAddedStreamColumn.length>0){
                    this.hasAddedStreamColumn.forEach(map=>{
                        map.cepSourceMapId=0;
                        map.cepStreamColumnId="";
                    });
                }
            }
            */
        },
        sourceDetail:function(){
            let data={};
            data.cepSourceId=this.sourceId;
            cepSourceDetail(data).then(res=>{
                if(res.code==200){
                  this.source.source=Object.assign({},this.source.source,res.data);
                  
                }
                else{
                    this.$message.error(res.message);  
                }
            });
        }, 
        sourceUpdate:function(){
            this.source.source.cepSourceId=this.sourceId;
            cepSourceUpdate(this.source.source).then(res => {
                if(res.code==200){
                    this.$message.success(res.message);
                    this.$emit('cepUpdate');
                }
                else{
                    this.$message.error(res.message);
                }
               // self.loading=false;
            });
        },
        StreamId:function(hasStream){//用于判断source是否有stream和它相连
                     let self=this;
                     console.log('source*******');
                if(hasStream=='0'){
                    self.showAddMapping=false;
                    self.showMapping=false;
                }
                else{
                      cepStreamColumnDetail({cepStreamId:hasStream}).then(res=>{
                            console.log('cepStreamColumn');
                            console.log(res);
                            if(res.code==200){
                                
                                if(res.data  && res.data.length>0){
                                    self.cepStreamColumn=res.data;
                                    self.showAddMapping=true;
                                    self.selectedMapList();
                                }
                                else{
                                    self.showAddMapping=false;
                                    self.showMapping=false;
                                }
                              
                            }
                            else{
                                self.$message.error(res.message);
                            }
                        });
                }
            // let  sourceStreamKey='', self=this,sourcekey='',sourceStreamId='';
            // let  node_order=JSON.parse(self.nodeOrder);
            // console.log(node_order);
            // console.log(node_order['nodeDataArray']);
            // node_order['nodeDataArray'].forEach(function(item){
            //         if(item.id==self.sourceId){
            //            sourcekey=item.key;
            //         }
            //     });
            // node_order['linkDataArray'].forEach(function(item1){
            //         if(item1.from==sourcekey){
            //            sourceStreamKey=item1.to;
            //         }
            //     }); 
            // if(sourceStreamKey){ //存在stream
            //     node_order['nodeDataArray'].forEach(function(item2){
            //         if(item2.key==sourceStreamKey){
            //             sourceStreamId=item2.id;
            //             //调接口  获取streamColumn
            //             console.log(sourceStreamId);
            //             cepStreamDetail({cep_stream_id:sourceStreamId}).then(function(res){
            //                 console.log('cepStreamColumn');
            //                 console.log(res);
            //                 if(res.resCode==0){
            //                     self.cepStreamColumn=res.data.cep_stream_column;
            //                 }
            //                 else{
            //                     self.$message({
            //                         message:res.msg,
            //                         type:'error'
            //                     });
            //                 }
            //             });
            //         }
            //     });
            //    //
            //     self.showAddMapping=true;
            //     self.selectedMapList();
            // }
            // else{//不存在stream
            //     self.showAddMapping=false;
            //     self.showMapping=false;
            // }

        },
        createMapping:function(index){
            let self=this,data;
            data=self.hasAddedStreamColumn[index];
            data.cepSourceId=self.sourceId;
            console.log(data);
            cepSourceMapCreate(data).then(function(res){
                 console.log(res);
                if(res.code==200){
                    self.hasAddedStreamColumn.splice(index,1,res.data);
                }
                else{
                    self.$message.error(res.message);
                }
             });
        },
        createMappingFirst:function(){//第一个Mapping提交
            let self=this;
            self.mapping.cepSourceId=self.sourceId;
            console.log(self.mapping);
             cepSourceMapCreate(self.mapping).then(function(res){
                 console.log(res);
                if(res.code==200){
                    self.hasAddedStreamColumn.push(res.data);
                    self.$message.success(res.message);
                }
                else{
                    self.$message.error(res.message);
                }
             });
        },
        selectedMapList:function(){
            let data={},self=this;
            data.cepSourceId=self.sourceId;
            cepSourceMapDetail(data).then(function(res){
                console.log('selectMappinglist');
                 console.log(res); //[]--[{}]
                 if(res.code==200){
                     if(res.data){
                        self.hasAddedStreamColumn=res.data;
                     }
                }else{
                     self.$message.error(res.message);
                 }
            });
        },
        addMapplist:function(){  //点击+添加一列提交map
           
            this.hasAddedStreamColumn.push({
                cepStreamColumnId:'',
                regex:'',
                cepSourceId:''
            });
                
        },
        mapDelete:function(mapping,index){

            let self=this;
            this.$confirm('确定删除列'+ mapping.regex+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{

                cepSourceMapDelete({cepSourceMapId:mapping.cepSourceMapId}).then(function(res){
                    if(res.code==200){
                        self.hasAddedStreamColumn.splice(index,1);
                        self.$message.success(res.message);

                    }
                    else{
                        self.$message.error(res.message);
                    }
                });
            }).catch(()=>{});
                
           
        },
        submit:function(){
            this.$refs.source.validate(res=>{
                if(res){
                    let arr=[cepSourceUpdate(this.source.source)];
                
                    // 判断  httpId/mqttId/kafkaId/tcpId/ 是否存在  判断是create/update
                    if(this.source.source.cepSourceType==1){//http
                        this.source.http.cepSourceId=this.sourceId;
                        if(!this.source.http.cepSourceHttpId){//create
                            arr.push(cepSourceHttpCreate(this.source.http))
                        }
                        else{
                            arr.push(cepSourceHttpUpdate(this.source.http))
                        }
                    }
                    else if(this.source.source.cepSourceType==2){
                        this.source.kafka.cepSourceId=this.sourceId;
                        if(!this.source.kafka.cepSourceKafkaId){//create
                        arr.push(cepSourceKafkaCreate(this.source.kafka))
                        }
                        else{
                        arr.push(cepSourceKafkaUpdate(this.source.kafka))
                        }
                    }
                    else if(this.source.source.cepSourceType==3){
                        this.source.mqtt.cepSourceId=this.sourceId;
                        if(!this.source.mqtt.cepSourceMqttId){//create
                        arr.push(cepSourceMqttCreate(this.source.mqtt))
                        }
                        else{
                        arr.push(cepSourceMqttUpdate(this.source.mqtt))
                        }
                    }
                    else if(this.source.source.cepSourceType==4){
                        this.source.tcp.cepSourceId=this.sourceId;
                        if(!this.source.tcp.cepSourceTcpId){//create
                        arr.push(cepSourceTcpCreate(this.source.tcp))
                        }
                        else{
                        arr.push(cepSourceTcpUpdate(this.source.tcp))
                        }
                    }
                    this.fullLoading=this.$loading(this.LOADING);
                    Promise.all(arr).then(res=>{
                        this.fullLoading.close();
                        res.forEach(res1=>{
                            if(res1.code==200){
                                this.$message.success(res1.message);
                            }
                            else{
                                this.$message.error(res1.message);
                            }
                        });
                    
                    });
                }
            });
        },
        changeName:function(val){
            if(val.indexOf('_')>=0){
               
            }
            else{
                this.$emit('changeName',val);
            }
            
        },
        //////
        getHttpDetail:function(){
            cepSourceHttpDetail({cepSourceId:this.sourceId}).then(res=>{
                if(res.code==200){
                    this.source.http=Object.assign({},this.source.http,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getKafkaDetail:function(){
            cepSourceKafkaDetail({cepSourceId:this.sourceId}).then(res=>{
                if(res.code==200){
                    this.source.kafka=Object.assign({},this.source.kafka,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getMqttDetail:function(){
            cepSourceMqttDetail({cepSourceId:this.sourceId}).then(res=>{
                if(res.code==200){
                    this.source.mqtt=Object.assign({},this.source.mqtt,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getTcpDetail:function(){
            cepSourceTcpDetail({cepSourceId:this.sourceId}).then(res=>{
                if(res.code==200){
                    this.source.tcp=Object.assign({},this.source.tcp,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getStreamName:function(cepStreamColumnId){
            if(this.cepStreamColumn.length>0){
                let streamColumn=this.cepStreamColumn.find(column=>column.cepStreamColumnId==cepStreamColumnId);
                //debugger
                if(streamColumn){
                    return streamColumn.streamColumnName;
                }
            }
        },
        setTemplate:function(){
          
            if(this.useTemplate && this.templateIndex>=0){//
                let type=this.sourceType[this.source.source.cepSourceType-1]['value'];// mqtt http kafka 
                Object.assign(this.source[type],this.sourceTemplate[this.templateIndex]['cepSource'+ type.slice(0,1).toUpperCase()+type.slice(1)]);
            }
        },
        setTemplateAttr:function(){
            
            if(this.source.source.cepSourceType>0){// 已经选中 http mqtt kafka 
                let type=this.sourceType[this.source.source.cepSourceType-1]['value'];// mqtt http kafka 
                Object.assign(this.source[type],this.sourceTemplate[this.templateIndex]['cepSource'+ type.slice(0,1).toUpperCase()+type.slice(1)]);
            }
        },
        getSourceTemplate:function(){
            cepSourceTemplate().then(res=>{
                if(res.code==200){
                    if(res.data && Array.isArray(res.data) && res.data.length>0){
                        this.sourceTemplate=res.data.filter(item=>item.cepSourceId!=this.sourceId);
                    }
                }
                else{
                    this.$message.error(res.message);
                }
            });
        }

    },
    computed:{
        showStreamColumn:function(){
         let arr=[];
         let self = this;
         self.cepStreamColumn.forEach(function(item){
             if(self.hasAddedStreamColumn.length>0){
                let flag=true;
                self.hasAddedStreamColumn.forEach(function(item1){
                    if(item1.cepStreamColumnId==item.cepStreamColumnId && item1.cepSourceMapId>0){
                           flag=false;//
                    }
                });
                if(flag){  //没有被提交
                    arr.push(item);
                }
                else{
                    flag=true;
                }  
             }
             else{
                 arr=self.cepStreamColumn;
                 return arr;
             }           
         });
         console.log(arr);
         return arr;
        },
        width:function(){
            if(this.source.source.cepSourceType==2){
                return '150px'
            }
            else{
                return '100px'
            }
        }
        // addNext:function(mapping,index){
        //       if(mapping.cepSourceMapId>0 && index!==this.hasAddedStreamColumn.length-1){
        //           return true;
        //       }
        //       return false;
        // }
    },
    watch:{
       'source.source.cepSourceType':function(){
           if(this.source.source.cepSourceType==1){
                this.rules.http={
                    receiverUrl:[{required:true,message:'请填写receiverUrl',trigger:'change,blur'}]
                },
                this.rules.kafka={
                    bootstrapServers:[],
                    topicList:[],
                    groupId:[],
                    threadingOption:[],
                    partitionNoList:[]
                },
                this.rules.mqtt={
                    url:[],
                    username:[],
                    password:[],
                    clientid:[],
                    topic:[],
                },
                this.rules.tcp={
                    context:[]
                }
           }
           else if(this.source.source.cepSourceType==2){
                this.rules.http={
                    receiverUrl:[]
                },
                this.rules.kafka={
                    bootstrapServers:[{required:true,message:'请填写bootstrapServers',trigger:'change,blur'}],
                    topicList:[{required:true,message:'请填写topicList',trigger:'change,blur'}],
                    groupId:[{required:true,message:'请填写groupId',trigger:'change,blur'}],
                    threadingOption:[{required:true,message:'请选择threadingOption',trigger:'change,blur'}],
                    partitionNoList:[{required:true,message:'请填写partitionNoList',trigger:'change,blur'}]
                },
                this.rules.mqtt={
                   url:[],
                    username:[],
                    password:[],
                    clientid:[],
                    topic:[],
                },
                this.rules.tcp={
                    context:[]
                }
           }
           else if(this.source.source.cepSourceType==3){
                this.rules.http={
                    receiverUrl:[]
                },
                this.rules.kafka={
                    bootstrapServers:[],
                    topicList:[],
                    groupId:[],
                    threadingOption:[],
                    partitionNoList:[]
                },
                this.rules.mqtt={
                    url:[{required:true,message:'请填写 url',trigger:'change,blur'}],
                    username:[{required:true,message:'请填写 username',trigger:'change,blur'}],
                    password:[{required:true,message:'请填写 password',trigger:'change,blur'}],
                    clientid:[{required:true,message:'请填写 clientid',trigger:'change,blur'}],
                    topic:[{required:true,message:'请填写 topic',trigger:'change,blur'}],
                   
                },
                this.rules.tcp={
                    context:[]
                }
           }
           else if(this.source.source.cepSourceType==4){
                this.rules.http={
                    receiverUrl:[]
                },
                this.rules.kafka={
                    bootstrapServers:[],
                    topicList:[],
                    groupId:[],
                    threadingOption:[],
                    partitionNoList:[]
                },
                this.rules.mqtt={
                    url:[],
                    username:[],
                    password:[],
                    clientid:[],
                    topic:[],
                }
                this.rules.tcp={
                    context:[{required:true,message:'请填写 context',trigger:'change,blur'}]
                }
           }
       }
    },
    mounted(){
        this.cepProgramId=this.$route.params.cep_id;
        let self=this;
        self.$on('source',function(obj){
            console.log('---------source------'+obj.stream)
               self.sourceId=obj.source;
               self.useTemplate=false,
               self.templateIndex='';
               self.sourceDetail();
               self.StreamId(obj.stream);
                //判断 httpId kafkaId mqttId tcpId   获取详情
                self.getHttpDetail();
                self.getKafkaDetail();
                self.getMqttDetail();
                self.getTcpDetail();
                self.getSourceTemplate();
        });
    }
   
    
}
</script>
<style scope>
</style>
