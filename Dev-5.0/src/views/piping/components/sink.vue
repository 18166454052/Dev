<template>
   <el-form label-position="right" :model="sink" :rules="rules" ref="sink" :label-width="width" class="Form " size="mini">
        <el-form-item  label="节点名称 :" prop="sink.cepSinkName">
           <el-col :span="22">
               <el-input v-model="sink.sink.cepSinkName" @input="changeName"></el-input>
           </el-col>
        </el-form-item>
        <el-form-item  label="描述 :">
           <el-col :span="22">
               <el-input v-model="sink.sink.comment"></el-input>
           </el-col>
        </el-form-item>
        <!-- <el-form-item  label="Store Type :">
            <el-select v-model="tsdb"  clearable placeholder="请选择" @change="sinkTopic">
                <el-option
                label="时序数据库"
                value="1">
                </el-option>
            </el-select>
       </el-form-item> -->
        <el-form-item  label="数据格式 :" prop="sink.messageFormat">
            <el-col :span="22">
                <el-select v-model="sink.sink.messageFormat" placeholder="请选择">
                    <el-option v-for="format in messageFormat"
                        :label="format.value"
                        :value="format.num"
                        :key="format.value"
                        >
                    </el-option>
                </el-select>
            </el-col>    
        </el-form-item>
        <el-form-item  label="节点类型 :" prop="sink.cepSinkType">
            <el-col :span="22">
                <el-select v-model="sink.sink.cepSinkType"  clearable placeholder="请选择">
                    <el-option v-for= "type in sinkType" 
                        :label="type.value"
                        :value="type.num"
                        :key="type.value"
                    >
                    </el-option>
                </el-select>
            </el-col>    
        </el-form-item>
        <div v-show="sink.sink.cepSinkType=='1'">
            <el-form-item  label="Publisher Url :" prop="http.publisherUrl">
               <el-col :span="22">
                   <el-input v-model="sink.http.publisherUrl"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Method :" prop="http.method">
                <el-col :span="22">
                    <el-select v-model="sink.http.method"  clearable placeholder="请选择">
                        <el-option v-for= "type in httpType" 
                            :label="type.value"
                            :value="type.num"
                            :key="type.value"
                        >
                        </el-option>
                    </el-select>
                </el-col>    
            </el-form-item>
        </div>
        <div v-show="sink.sink.cepSinkType=='2'">
            <el-form-item  label="Bootstrap Servers :" prop="kafka.bootstrapServers">
               <el-col :span="22">
                   <el-input v-model="sink.kafka.bootstrapServers"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Topic:" prop="kafka.topic">
               <el-col :span="22">
                   <el-input v-model="sink.kafka.topic"></el-input>
                </el-col>
            </el-form-item>
             <el-form-item  label="Partition No:" prop="kafka.partitionNo">
               <el-col :span="22">
                   <el-input v-model="sink.kafka.partitionNo" placeholder="只能填写整数" type="number"></el-input>
                </el-col>
            </el-form-item>

        </div>
        <div v-show="sink.sink.cepSinkType=='3'">
           <el-form-item  label="Client Id :" prop="mqtt.mqttClientId">
              
                <el-col :span="22">
                    <el-input v-model="sink.mqtt.mqttClientId"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Broker Url :"  prop="mqtt.mqttBrokerUrl">
               <el-col :span="22">
                   <el-input v-model="sink.mqtt.mqttBrokerUrl"></el-input>
                </el-col>
            </el-form-item>
             <el-form-item  label="Username :" prop="mqtt.mqttUsername">
                <el-col :span="22">
                    <el-input v-model="sink.mqtt.mqttUsername"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Password :" prop="mqtt.mqttPassword">
                <el-col :span="22">
                     <el-input v-model="sink.mqtt.mqttPassword" type="password"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Topic :" prop="mqtt.topic">
                
                <el-col :span="22">
                    <el-input v-model="sink.mqtt.topic"></el-input>
                </el-col>
            </el-form-item>    
        </div>
        <div v-show="sink.sink.cepSinkType=='4'">
             <el-form-item  label="Url :" prop="tcp.url">
               <el-col :span="22">
                   <el-input v-model="sink.tcp.url"></el-input>
                </el-col>
            </el-form-item>
        </div>
        <el-form-item lable="">
           <el-col :span="22" class="btnBlock">
                <el-button type="primary" size="mini" @click="submit" :loading='loading'>提交</el-button>
           </el-col>
        </el-form-item>
   </el-form>
</template>

<script>
import { 
cepSinkUpdate, cepSinkDetail, 
cepSinkHttpCreate,cepSinkHttpUpdate,cepSinkHttpDetail,
cepSinkKafkaCreate,cepSinkKafkaUpdate,cepSinkKafkaDetail,
cepSinkTcpCreate,cepSinkTcpUpdate,cepSinkTcpDetail,
cepSinkMqttCreate,cepSinkMqttUpdate,cepSinkMqttDetail,
getTopic } from "@/api/piping/sink";
//import { getProDetail } from "@/api/management/index";
//import { gatewayDetail } from "@/api/management/gateway";
import { cepDetail } from "@/api/piping/cep";
export default{
   // props:['sinkId','nodeOrder'],
    data(){
        return {
            topic:'',
            empty:'',
            tsdb:'',
            sinkId:'',
            project_id:'',
            gateway_id:'',
            cepId:'',
            projectDetail:'',
            gatewayDetail:'',
            cepDetail:'',
            loading:false,
            sink:{
                sink:{
                    cepSinkName:'',
                    comment:'',
                    messageFormat:'',
                    cepSinkType:'',
                },
                http:{
                    cepSinkId:'',
                    publisherUrl:'',
                    method:'',
                },
                kafka:{
                    cepSinkId:'',
                    topic: '',
                    bootstrapServers:'',
                    partitionNo:'',
                },
                mqtt:{
                    cepSinkId:'',
                    mqttClientId:'', 
                    mqttBrokerUrl: '',
                    mqttUsername: '', 
                    mqttPassword: '',
                    topic:''
                },
                tcp:{
                    cepSinkId:'',
                    url:''
                }
            },
            rules:{
                sink:{
                    cepSinkName:[
                        {required:true,message:"请填写节点名称",trigger:"change,blur"},
                        {validator:this.$checkName,trigger:"change,blur"}
                    ],
                    messageFormat:[{required:true,message:'请选择数据格式',trigger:'change,blur'}], 
                    cepSinkType:[{required:true,message:'请选择节点类型',trigger:'change,blur'}], 
                },
                http:{
                    publisherUrl:[{required:true,message:'请填写publisherUrl',trigger:'change,blur'}],
                    method:[{required:true,message:'请选择method',trigger:'change,blur'}], 
                },
                kafka:{
                    topic:[{required:true,message:'请填写topic',trigger:'change,blur'}],
                    bootstrapServers:[{required:true,message:'请填写bootstrapServers',trigger:'change,blur'}],
                    partitionNo:[{required:true,message:'请填写partitionNo',trigger:'change,blur'}],
                },
                mqtt:{
                    mqttClientId:[{required:true,message:'请填写mqttClientId',trigger:'change,blur'}], 
                    mqttBrokerUrl:[{required:true,message:'请填写mqttBrokerUrl',trigger:'change,blur'}],
                    mqttUsername:[{required:true,message:'请填写mqttUsername',trigger:'change,blur'}],
                    mqttPassword:[{required:true,message:'请填写mqttPassword',trigger:'change,blur'}],
                    topic:[{required:true,message:'请填写topic',trigger:'change,blur'}],
                },
                tcp:{
                    url:[{required:true,message:'请填写url',trigger:'change,blur'}]
                }
            },
            sinkType:[
                { num:1,value:'http' },
                { num:2,value:'kafka'},
                { num:3,value:'mqtt' },
                { num:4,value:'tcp'},
                // { num:5,value:'websocket'},
                // { num:6,value:'file'},
                // { num:7,value:'email'}
            ],
            httpType:[
                {num:1,value:'POST'},
                {num:2,value:'GET'},
                {num:3,value:'PUT'},
                {num:4,value:'DELETE'},
            ],
            messageFormat:[
                 {num:1,value:'text'},
                 {num:2,value:'json'},
            ],
            fullLoading:null,
            LOADING:{
                LOADING: {
                lock: true,
                text: '数据处理中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
              }
          }, 
        }
    },
    methods:{
        sinkDetail:function() {
           
            cepSinkDetail({cepSinkId:this.sinkId}).then(res=>{
                if(res.code==200){
                    if(res.data && res.data.cepSinkType==0){
                        res.data.cepSinkType="";
                    }
                    this.sink.sink=Object.assign({},this.sink.sink,res.data);
                }
                else{
                    self.$message.error(res.message);
                }
            });
        },
        sinkUpdate:function(){
            this.sink.sink.cepSinkId=this.sinkId;
            cepSinkUpdate(this.sink.sink).then(function(res){
                console.log(res);
                if(res.code==200){
                    this.$message.success(res.message);
                    this.$emit('cepUpdate');
                }
                else{
                    this.$message.error(res.message);
                }
               
            });
        },
        submit:function(){
            this.$refs.sink.validate(res=>{
                if(res){
                    let arr=[cepSinkUpdate(this.sink.sink)];
                
                    // 判断  httpId/mqttId/kafkaId/tcpId/ 是否存在  判断是create/update
                    if(this.sink.sink.cepSinkType==1){//http
                        this.sink.http.cepSinkId=this.sinkId;
                        if(!this.sink.http.cepSinkHttpId){//create
                            arr.push(cepSinkHttpCreate(this.sink.http))
                        }
                        else{
                            arr.push(cepSinkHttpUpdate(this.sink.http))
                        }
                    }
                    else if(this.sink.sink.cepSinkType==2){
                        this.sink.kafka.cepSinkId=this.sinkId;
                        if(!this.sink.kafka.cepSinkKafkaId){//create
                        arr.push(cepSinkKafkaCreate(this.sink.kafka))
                        }
                        else{
                        arr.push(cepSinkKafkaUpdate(this.sink.kafka))
                        }
                    }
                    else if(this.sink.sink.cepSinkType==3){
                        this.sink.mqtt.cepSinkId=this.sinkId;
                        if(!this.sink.mqtt.cepSinkMqttId){//create
                        arr.push(cepSinkMqttCreate(this.sink.mqtt))
                        }
                        else{
                        arr.push(cepSinkMqttUpdate(this.sink.mqtt))
                        }
                    }
                    else if(this.sink.sink.cepSinkType==4){
                        this.sink.tcp.cepSinkId=this.sinkId;
                        if(!this.sink.tcp.cepSinkTcpId){//create
                        arr.push(cepSinkTcpCreate(this.sink.tcp))
                        }
                        else{
                        arr.push(cepSinkTcpUpdate(this.sink.tcp))
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
               this.$message.warning('节点名称不能包含下划线_');
                return ;
            }
            this.$emit('changeName',val);
        },
        getProjectInfo:function(){
            let self=this;
            getProDetail({project_id:self.project_id}).then(function(res){
                if(res.resCode==0){
                        console.log(res);
                        self.projectDetail=res.data
                }
                
            });
        },
        getGatewayInfo:function(){
            let self=this;
            gatewayDetail({gateway_id:self.gateway_id}).then(function(res){
                if(res.resCode==0){
                    console.log(res);
                    self.gatewayDetail=res.data
                }
                
            });
        },
        getCepInfo:function(){
            let self=this;
            cepDetail({cep_program_id:self.cepId}).then(function(res){
                if(res.resCode==0){
                    console.log(res);
                    self.cepDetail=res.data
                }
                
            });
        },
        sinkTopic:function(val){
            let self=this;
                if(val=='1'){
                    getTopic({cepSinkId:self.sinkId,type:'1'}).then(function(res){
                        if(res.resCode==0){
                            console.log(res);
                            self.topic=res.data.topic;
                        }
                    });
                }
        },
        //
        getHttpDetail:function(){
            cepSinkHttpDetail({cepSinkId:this.sinkId}).then(res=>{
                if(res.code==200){
                    this.sink.http=Object.assign({},this.sink.http,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
       
        getKafkaDetail:function(){
            cepSinkKafkaDetail({cepSinkId:this.sinkId}).then(res=>{
                if(res.code==200){
                    this.sink.kafka=Object.assign({},this.sink.kafka,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
       
        getMqttDetail:function(){
            cepSinkMqttDetail({cepSinkId:this.sinkId}).then(res=>{
                if(res.code==200){
                    this.sink.mqtt=Object.assign({},this.sink.mqtt,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
       
        getTcpDetail:function(){
            cepSinkTcpDetail({cepSinkId:this.sinkId}).then(res=>{
                if(res.code==200){
                    this.sink.tcp=Object.assign({},this.sink.tcp,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
      

    },
    watch:{
        // tsdb: function(val){
        //     let self=this;
        //       if(val==1){
        //           self.sink.cepSinkType_info.mqtt_broker_url="tcp://120.78.71.179:1883";
        //          // self.sink.cepSinkType_info.topic=
        //           self.sink.cepSinkType=3;
        //           self.sink.messageFormat=2;
        //       }
        //       else{
        //         self.sink.cepSinkType_info.mqtt_broker_url="";
        //           self.sink.cepSinkType='';
        //           self.sink.messageFormat='';
        //       }
        // },
        'sink.sink.cepSinkType':function(){
            if(this.sink.sink.cepSinkType==1){
                this.rules.http={
                    publisherUrl:[{required:true,message:'请填写publisherUrl',trigger:'change,blur'}],
                    method:[{required:true,message:'请选择method',trigger:'change,blur'}], 
                }
                this.rules.kafka={
                    topic:[],
                    bootstrapServers:[],
                    partitionNo:[]
                }
                this.rules.mqtt={
                    mqttClientId:[],
                    mqttBrokerUrl:[],
                    mqttUsername:[],
                    mqttPassword:[],
                    topic:[],
                }
                this.rules.tcp={
                    url:[]
                }
            }
            else  if(this.sink.sink.cepSinkType==2){
                this.rules.http={
                    publisherUrl:[],
                    method:[], 
                }
                this.rules.kafka={
                    topic:[{required:true,message:'请填写topic',trigger:'change,blur'}],
                    bootstrapServers:[{required:true,message:'请填写bootstrapServers',trigger:'change,blur'}],
                    partitionNo:[{required:true,message:'请填写partitionNo',trigger:'change,blur'}],
                }
                this.rules.mqtt={
                    mqttClientId:[],
                    mqttBrokerUrl:[],
                    mqttUsername:[],
                    mqttPassword:[],
                    topic:[],
                }
                this.rules.tcp={
                    url:[]
                }
            }
            else  if(this.sink.sink.cepSinkType==3){
                this.rules.http={
                    publisherUrl:[],
                    method:[], 
                }
                this.rules.kafka={
                    topic:[],
                    bootstrapServers:[],
                    partitionNo:[]
                }
                this.rules.mqtt={
                    mqttClientId:[{required:true,message:'请填写mqttClientId',trigger:'change,blur'}], 
                    mqttBrokerUrl:[{required:true,message:'请填写mqttBrokerUrl',trigger:'change,blur'}],
                    mqttUsername:[{required:true,message:'请填写mqttUsername',trigger:'change,blur'}],
                    mqttPassword:[{required:true,message:'请填写mqttPassword',trigger:'change,blur'}],
                    topic:[{required:true,message:'请填写topic',trigger:'change,blur'}],
                }
                this.rules.tcp={
                    url:[]
                }
            }
            else  if(this.sink.sink.cepSinkType==4){
                this.rules.http={
                    publisherUrl:[],
                    method:[], 
                }
                this.rules.kafka={
                    topic:[],
                    bootstrapServers:[],
                    partitionNo:[]
                }
                this.rules.mqtt={
                    mqttClientId:[],
                    mqttBrokerUrl:[],
                    mqttUsername:[],
                    mqttPassword:[],
                    topic:[],
                }
                this.rules.tcp={
                    url:[{required:true,message:'请填写url',trigger:'change,blur'}]
                }
            }
        }
    },
    computed:{
        width:function(){
            if(this.sink.sink.cepSinkType==2){
                return '130px';
            }
            else{
                return '110px';
            }
        }
    },
    mounted(){
        let self=this;
        
       // self.project_id=self.$route.params.project_id;
        //self.gateway_id=this.$route.params.id;
        self.cepId=this.$route.params.cepId;
        self.$on('sink',function(sinkId){
            self.sinkId=sinkId;
            self.sinkDetail();
            //
            self.getHttpDetail();
            self.getKafkaDetail();
            self.getMqttDetail();
            self.getTcpDetail();
        });
        
    }
}
</script>
<style scope>
</style>
