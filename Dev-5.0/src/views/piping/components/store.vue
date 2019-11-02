<template>
   <el-form label-position="right" :label-width='LabelWidth' :model="store" :rules="rules" ref="store" class="Form " size="mini">
        <el-form-item  label="节点名称 :" prop="store.cepStoreName">
           <el-col :span="22">
               <el-input v-model="store.store.cepStoreName" @input="changeName"></el-input>
           </el-col>
        </el-form-item>
        <el-form-item  label="描述 :">
           <el-col :span="22">
               <el-input v-model="store.store.comment"></el-input>
           </el-col>
        </el-form-item>
        <el-form-item label="使用模板 : ">
           <el-col :span="22">
               <el-radio-group v-model="useTemplate" @change="useTemplate?'':templateIndex=''">
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
                    v-for="(column,index) in storeTemplateList"
                    :key="index+'_'+column.cepStoreName"
                    :label="column.cepStoreName"
                    :value="index"
                    ></el-option>
               </el-select>
               
           </el-col>
       </el-form-item>
        <el-form-item  label="节点类型 :" prop="store.cepStoreType">
            <el-col :span="22">
                <el-select v-model="store.store.cepStoreType"  clearable placeholder="请选择"
                 @change="setTemplate"
                >
                    <el-option v-for="(type,index) in storeType" :key="type"
                    :label="type"
                    :value="Number(index)+ Number(1)" >
                    </el-option> 
                </el-select>
            </el-col>    
        </el-form-item>
        <div v-show="store.store.cepStoreType=='1'">
            <el-form-item  label="Type :" prop="rdbms.type">
                <el-col :span="22">
                   <el-select  v-model="store.rdbms.type" >
                       <el-option
                        v-for="base in database"
                        :label="base.label"
                        :value="base.value"
                        :key="base.label"
                       ></el-option>
                   </el-select>
                </el-col>
            </el-form-item>
            <el-form-item  label="Address :" prop="rdbms.address">
                <el-col :span="22">
                    <el-input v-model="store.rdbms.address"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Port :" prop="rdbms.port">
                <el-col :span="22">
                    <el-input v-model="store.rdbms.port"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Database_name :" prop="rdbms.databaseName">
                <el-col :span="22">
                    <el-input v-model="store.rdbms.databaseName"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Table_name :" prop="rdbms.tableName">
                <el-col :span="22">
                    <el-input v-model="store.rdbms.tableName"></el-input>
                </el-col>
            </el-form-item>
             <el-form-item  label="Username :" prop="rdbms.username">
                <el-col :span="22">
                    <el-input v-model="store.rdbms.username"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Password :" prop="rdbms.password">
                <el-col :span="22">
                     <el-input v-model="store.rdbms.password"></el-input>
                </el-col>
            </el-form-item>
             <el-form-item  label="Pool_num :" prop="rdbms.poolNum">
                <el-col :span="22">
                    <el-input v-model="store.rdbms.poolNum"></el-input>
                </el-col>
            </el-form-item>
         </div>
        <div v-show="store.store.cepStoreType=='2'">
            <el-form-item  label="tableName :" prop="hbase.tableName">
                <el-col :span="22">
                   <el-input v-model="store.hbase.tableName"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="columnFamily :" prop="hbase.columnFamily">
                <el-col :span="22">
                   <el-input v-model="store.hbase.columnFamily"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="hbase.zookeeper.quorum :" prop="hbase.hbaseZookeeperQuorum">
                <el-col :span="22">
                   <el-input v-model="store.hbase.hbaseZookeeperQuorum"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="hbase.zookeeper.property.clientPort :" prop="hbase.clientPort">
                <el-col :span="22">
                   <el-input v-model="store.hbase.clientPort"></el-input>
                </el-col>
            </el-form-item>
        </div>
        <el-form-item label="设置为模板 : ">
            <el-col :span="22">
                <el-radio-group v-model="store.store.published">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-col>
       </el-form-item>
        <el-form-item lable="">
           <el-col :span="22" class="btnBlock">
                <el-button type="success" size="mini" @click="submit" :loading='loading'>提交</el-button>
           </el-col>
       </el-form-item>
   </el-form>
</template>

<script>
import { 
cepStoreUpdate, cepStoreDetail,
cepStoreRdbmsCreate,cepStoreRdbmsUpdate,cepStoreRdbmsDetail,
cepStoreHbaseCreate,cepStoreHbaseUpdate,cepStoreHbaseDetail,
cepStoreTemplate
    
} from "@/api/piping/store";
export default{
   // props:['storeId','nodeOrder'],
    data(){
        return {
            idObj:{},
            loading:false,
            storeId:'',
            //storeType:["rdbms",'mongodb','hbase','redis','cassandra' ],
            storeType:['rdbms'],
            database:[
                {label:'mySql',value:1},
                {label:'sqlServer',value:2},
                {label:'oracle',value:3}
            ],
            store:{
                store:{
                    cepProgramId:'',
                    cepStoreName:'',
                    comment:'',
                    cepStoreType:'',
                    published:0
                },
                rdbms:{
                    cepStoreRdbmsId:'',
                    type:"" , 
                    address:'',
                    port:'',
                    databaseName:'',
                    tableName:'',
                    username:'',
                    password:'',
                    poolNum:''
                },
                hbase:{
                    tableName:'',
                    columnFamily:'',
                    'hbaseZookeeperQuorum':'',
                    clientPort:''
                }
               
            },
            useTemplate:false,
            storeTemplateList:[
            ],  
            templateIndex:'',
            rules:{
                store:{
                    cepStoreName:[
                        {required:true,message:"请填写节点名称",trigger:"change,blur"},
                        {validator:this.$checkName,trigger:"change,blur"}
                    ],
                    cepStoreType:[{required:true,message:'请选择节点类型',trigger:'change,blur'}],
                },
                rdbms:{
                    type:[{required:true,message:"请选择type",trigger:"change,blur"}],
                    address:[{required:true,message:"请填写address",trigger:"change,blur"}],
                    port:[{required:true,message:"请填写port",trigger:"change,blur"}],
                    databaseName:[{required:true,message:"请填写databasName",trigger:"change,blur"}],
                    tableName:[{required:true,message:"请填写tableName",trigger:"change,blur"}],
                    username:[{required:true,message:"请填写username",trigger:"change,blur"}],
                    password:[{required:true,message:"请填写password",trigger:"change,blur"}],
                    poolNum:[{required:true,message:"请填写poolNum",trigger:"change,blur"}],
                },
                hbase:{
                    tableName:[],
                    columnFamily:[],
                    hbaseZookeeperQuorum:[],
                    clientPort:[]
                }
            },
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
        storeDetail:function() {
           cepStoreDetail({cepStoreId:this.storeId}).then(res=>{
                if(res.code==200){
                    this.store.store=Object.assign({},this.store.store,res.data);   
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        submit:function(){
            this.$refs.store.validate(res=>{
                if(res){
                    //store 
                    let arr=[cepStoreUpdate(this.store.store)];
                
                    // 
                    if(this.store.store.cepStoreType==1){//http
                        this.store.rdbms.cepStoreId=this.storeId;
                        if(!this.store.rdbms.cepStoreRdbmsId){//create
                            arr.push(cepStoreRdbmsCreate(this.store.rdbms))
                        }
                        else{
                            arr.push(cepStoreRdbmsUpdate(this.store.rdbms))
                        }
                    }
                    else if(this.store.store.cepStoreType==2){
                        this.store.hbase.cepStoreId=this.storeId;
                        if(!this.store.hbase.cepStoreHbaseId){//create
                        arr.push(cepStoreHbaseCreate(this.store.hbase))
                        }
                        else{
                        arr.push(cepStoreHbaseUpdate(this.store.hbase))
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
            this.$emit('changeName',val);
        },
        getRdbmsDetail:function(){
            cepStoreRdbmsDetail({cepStoreId:this.storeId}).then(res=>{
                if(res.code==200){
                    this.store.rdbms=Object.assign({},this.store.rdbms,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getHbaseDetail:function(){
            cepStoreHbaseDetail({cepStoreId:this.storeId}).then(res=>{
                if(res.code==200){
                    this.store.rdbms=Object.assign({},this.store.rdbms,res.data);
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        getTemplate:function(){
            cepStoreTemplate().then(res=>{
                if(res.code==200){
                    if(res.data && Array.isArray(res.data) && res.data.length>0){
                       // debugger
                         this.storeTemplateList=res.data.filter(store=>store.cepStoreId!=this.storeId);
                    }
                }
                else{
                    this.$message.error(res.message);
                }
            });
        },
        setTemplate:function(){
          
            if(this.useTemplate && this.templateIndex>=0){//
                let type=this.storeType[this.store.store.cepStoreType-1];// 
                Object.assign(this.store[type],this.storeTemplateList[this.templateIndex]['cepStore'+ type.slice(0,1).toUpperCase()+type.slice(1)]);
            }
        },
        setTemplateAttr:function(){
            
            if(this.store.store.cepStoreType>0){// 已经选中
                let type=this.storeType[this.store.store.cepStoreType-1];//
                   Object.assign(this.store[type],this.storeTemplateList[this.templateIndex]['cepStore'+ type.slice(0,1).toUpperCase()+type.slice(1)]);
            }
        },
    },
    computed:{
        LabelWidth:function(){
            return this.store.cepStoreType=='2'?'220px':'150px'
        }
    },
    watch:{
       'store.store.cepStoreType':function(){
            if(this.store.store.cepStoreType==1){
               this.rules.rdbms={
                    type:[{required:true,message:"请选择type",trigger:"change,blur"}],
                    address:[{required:true,message:"请填写address",trigger:"change,blur"}],
                    port:[{required:true,message:"请填写port",trigger:"change,blur"}],
                    databaseName:[{required:true,message:"请填写databasName",trigger:"change,blur"}],
                    tableName:[{required:true,message:"请填写tableName",trigger:"change,blur"}],
                    username:[{required:true,message:"请填写username",trigger:"change,blur"}],
                    password:[{required:true,message:"请填写password",trigger:"change,blur"}],
                    poolNum:[{required:true,message:"请填写poolNum",trigger:"change,blur"}],
                }
                this.rules.hbase={
                    tableName:[],
                    columnFamily:[],
                    hbaseZookeeperQuorum:[],
                    clientPort:[]
                }
            }
            else if(this.store.store.cepStoreType==2){
               this.rules.rdbms={
                    type:[],
                    address:[],
                    port:[],
                    databasName:[],
                    tableName:[],
                    username:[],
                    password:[],
                    poolNum:[],
                }
                this.rules.hbase={
                    tableName:[{required:true,message:"请填写tableName",trigger:"change,blur"}],
                    columnFamily:[{required:true,message:"请填写columnFamily",trigger:"change,blur"}],
                    hbaseZookeeperQuorum:[{required:true,message:"请填写hbaseZookeeperQuorum",trigger:"change,blur"}],
                    clientPort:[{required:true,message:"请填写clientPort",trigger:"change,blur"}]
                }
            }
        }
       
    },
    mounted(){
        let self=this;
        self.$on('store',function(obj){ // {storeId:'' ,streamId:''}
        self.$refs.store.resetFields();
            self.useTemplate=false;
            self.templateIndex='';
            self.idObj=obj;
            self.storeId=obj.storeId;
            self.storeDetail();
            self.getRdbmsDetail();
            //self.getHbaseDetail();
            self.getTemplate();
        });
    }
}
</script>
<style scope>
</style>
