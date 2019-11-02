<template>
   <el-form label-position="right"  label-width="120px" class="Form " size="mini">
       <el-form-item  label="spc Name :" required>
           <el-col :span="22">
               <el-input v-model="spc.cep_spc_name" @input="changeName"></el-input>
           </el-col>
       </el-form-item>
        <el-form-item  label="Comment :">
           <el-col :span="22">
               <el-input v-model="spc.comment"></el-input>
           </el-col>
       </el-form-item>
       <el-form-item  label="管制图形 :" required>
            <el-select v-model="spc.control_graph"
               @change="changeGetSpcList"
            >
                <el-option
                 v-for="graph in graphList"
                 :label="graph.label"
                 :value="graph.value"
                 :key="graph.value"
                >
                </el-option>
            </el-select>
       </el-form-item>
        <el-form-item  label="子组容量 :" required   v-show="spc.control_graph && spc.control_graph<5">
           <el-col :span="22">
               <el-input v-model="spc.group_num" 
               type="number" min='1' max="25" 
               placeholder="请输入数字1-25"
               @blur="changeGetSpcList"
               ></el-input>
           </el-col>
       </el-form-item> 
       <el-form-item label="移动极差 : " v-show="spc.control_graph==4" required>
            <el-col :span="22">
                <el-input v-model="spc.move_range"
                 @blur="changeGetSpcList"
                ></el-input>

            </el-col>
       </el-form-item> 
       <!-- <el-form-item label="数值字段 :" required >
                <el-select v-model="spc.value_fields"
                 @change="selStream"   clearable
               
                >
                    <el-option
                        v-for="column in filterStream"
                        :label="column.stream_column_name"
                        :value="column.cep_stream_column_id"
                        :key="column.cep_stream_column_id+'a'"
                    >
                    </el-option>
                </el-select>
       </el-form-item> -->
       
     
       <el-form-item label="实时spc配置 :" required>

                <el-select v-model="job_info" multiple
                @change="visibleChange"
                @remove-tag="removetag"
                >
                    <el-option
                        v-for="spc in spcList"
                        :label="spc.config_name"
                        :value="spc.spc_realtime_config_id+'_@_'+spc.config_name"
                        :key="spc.spc_realtime_config_id"
                    >
                    </el-option>
                </el-select>
       </el-form-item>
       <!-- <el-form-item  label="存储类型 :">
            <el-select v-model="spc.cep_spc_type"  placeholder="请选择" clearable>
                <el-option v-for="(type,index) in spc_type" :key="type"
                :label="type"
                :value="(index+1).toString()" >
                </el-option> 
            </el-select>
       </el-form-item> -->
       
               
        <el-form-item  v-if="Object.keys(spc.column_info).length>0" v-for="(val,keys) in  spc.column_info"  
        :label="keys +':'" 
        :key="keys" required>
                <el-row  v-for="field in val" :key="field.spc_fields_id">
                      <el-col :span="10">
                          <el-input v-model="field.fields_name" disabled></el-input>
                      </el-col>
                      <el-col :span="10" :offset="2">
                            <el-select v-model="field.cep_stream_column_id"
                              @change="selStream({field:field})"
                              clearable
                            >
                                <el-option
                                    v-for="column in filterStream"
                                    :label="column.stream_column_name"
                                    :value="column.cep_stream_column_id"
                                    :key="column.cep_stream_column_id+'c'"
                                >
                                </el-option>
                           </el-select>
                      </el-col>
                </el-row>
              
        </el-form-item>
  
          <el-form-item label="时间字段 :" required>

            <el-select v-model="spc.time_fields"
              @change="selStream"  clearable
               
            >
             <el-option
                    v-for="column in filterStream"
                    :label="column.stream_column_name"
                    :value="column.cep_stream_column_id"
                    :key="column.cep_stream_column_id+'b'"
                >
                </el-option>
              </el-select>
       </el-form-item>
       <el-form-item label="数值字段 :" required  v-show="spc.control_graph && spc.control_graph<5">

            <el-select v-model="spc.value_fields"
              @change="selStream"  clearable
               
            >
             <el-option
                    v-for="column in filterStream"
                    :label="column.stream_column_name"
                    :value="column.cep_stream_column_id"
                    :key="column.cep_stream_column_id+'b'"
                >
                </el-option>
              </el-select>
       </el-form-item>
       <el-form-item label="不良原因 :" required  v-show="spc.control_graph>4">
            <el-select v-model="spc.defect_reason_fields"
              @change="selStream"  clearable
            >
              <el-option
                  v-for="column in filterStream"
                  :label="column.stream_column_name"
                  :value="column.cep_stream_column_id"
                  :key="column.cep_stream_column_id+'g'"
              >
              </el-option>
            </el-select>
       </el-form-item>
        <el-form-item label="不良数量 :" required  v-show="spc.control_graph>4">
            <el-select v-model="spc.defect_num_fields"
              @change="selStream"  clearable
            >
              <el-option
                  v-for="column in filterStream"
                  :label="column.stream_column_name"
                  :value="column.cep_stream_column_id"
                  :key="column.cep_stream_column_id+'e'"
              >
              </el-option>
            </el-select>
       </el-form-item>
       <el-form-item label="总数 :" required  v-show="spc.control_graph>4">
            <el-select v-model="spc.total_fields"
              @change="selStream"  clearable
            >
              <el-option
                  v-for="column in filterStream"
                  :label="column.stream_column_name"
                  :value="column.cep_stream_column_id"
                  :key="column.cep_stream_column_id+'f'"
              >
              </el-option>
            </el-select>
       </el-form-item>

       <div >
            <el-form-item  label="Jdbc.url :" required>
                <el-col :span="22">
                   <el-input v-model="spc['jdbc_url']"></el-input>
                </el-col>
            </el-form-item>
             <el-form-item  label="Username :" required>
                <el-col :span="22">
                    <el-input v-model="spc.username"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Password :" required>
                <el-col :span="22">
                     <el-input v-model="spc.password"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item  label="Jdbc.driver.name :" required>
                <el-col :span="22">
                    <el-input v-model="spc['jdbc_driver_name']"></el-input>
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
import { cepSpcUpdate, cepSpcDetail } from "@/api/piping/spc";
//import { spcRealtimeList, spcRealtimeDetail } from "@/api/spc/realTime";
import { cepStreamDetail } from "@/api/piping/stream";
export default {
  // props:['storeId','nodeOrder'],
  data() {
    return {
      spc_id: "",
      stream_id: "",
      loading: false,
      spc_type: ["rdbms"],
      job_info: [],
      spc: {
        cep_program_id: "",
        cep_spc_id: "",
        cep_spc_name: "",
        control_graph: "",
        group_num: "",
        move_range:'',
        time_fields: "",
        total_fields: "",
        defect_reason_fields: "",
        defect_num_fields: "",
        comment: "",
        group_num: "",
        jdbc_url: "",
        username: "",
        password: "",
        jdbc_driver_name: "",
        column_info: {}
        // {
        //     spc_realtime_config_id:"",
        //     spc_fields_id:"",
        //     cep_stream_column_id:""
        // }
      },
      graphList: [
        { label: "X-R", value: 1 },
        { label: "X-S", value: 2 },
        { label: "me-R", value: 3 },
        { label: "X-MR", value: 4 },
        { label: "P", value: 5 },
        { label: "np", value: 6 },
        { label: "c", value: 7 },
        { label: "u", value: 8 }
      ],
      spcList: [], //
      stream_column_list: [],
      fields_list: {},
      selectedStream: []
    };
  },
  methods: {
    submit: function() {
      let self = this;
      self.loading = true;
      let spc = JSON.parse(JSON.stringify(self.spc));
      spc.cep_spc_id = self.spc_id;
      let arr = [];
      for (let col in spc.column_info) {
        arr = [...arr, ...spc.column_info[col]];
      }
      spc.column_info = arr;
      //spc.cep_spc_type_info=JSON.stringify(spc.cep_spc_type_info);
      console.log(arr);
      cepSpcUpdate(spc).then(function(res) {
        if (res.resCode == 0) {
          self.$message({
            message: res.msg,
            type: "success"
          });
          self.$emit("cepUpdate");
        } else {
          self.$message({
            message: res.msg,
            type: "error"
          });
        }
        self.loading = false;
      });
    },
    changeName: function(val) {
      this.$emit("changeName", val);
    },
    spcDetail: function(spcId) {
      let self = this;
      self.job_info = [];
      cepSpcDetail({ cep_spc_id: spcId }).then(function(res) {
        if (res.resCode == 0) {
           console.log("spcDetail*************************");
          console.log(res);
          let obj={
              cep_program_id: "",
              cep_spc_id: "",
              cep_spc_name: "",
              control_graph: "",
              group_num: "",
              move_range:'',
              time_fields: "",
              value_fields:'',
              total_fields: "",
              defect_reason_fields: "",
              defect_num_fields: "",
              comment: "",
              group_num: "",
              jdbc_url: "",
              username: "",
              password: "",
              jdbc_driver_name: "",
              column_info:[],
           };
           for(let o in obj){
             
               obj[o]=res.data[o]?res.data[o]:'';
           }

          self.spc = Object.assign({}, obj);
          

          let column_info = {},
            selectedStr = [];
          for (let col of self.spc.column_info) {
            if (!column_info[col.config_name]) {
              self.job_info.push(
                col.spc_realtime_config_id + "_@_" + col.config_name
              );
              column_info[col.config_name] = [];
              column_info[col.config_name].push(col);
              selectedStr.push(col.cep_stream_column_id);
            } else {
              column_info[col.config_name].push(col);
              selectedStr.push(col.cep_stream_column_id);
            }
          }
          //selected
          selectedStr.push(self.spc.time_fields);
          selectedStr.push(self.spc.value_fields);
          //
          self.spc.column_info = column_info;
          self.changeGetSpcList(selectedStr);
        //   setTimeout(function() {
        //     self.selectedStream = selectedStr;
        //   },0);
        } else {
          self.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    getRealtimeList: function(graph, group, move_range, ...selectedStr) {
      let self = this;
      spcRealtimeList({ control_graph: graph, group_num: group, move_range:move_range }).then(function(
        res
      ) {
        if (res.resCode == 0) {
          console.log(res);
          self.spcList = res.data.realTimeList;
          self.selectedStream=selectedStr;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    changeGetSpcList: function(...selectedStr) {
      let self = this;
      self.job_info=[];
      self.spc.column_info={};
      if (self.spc.control_graph > 4 && self.spc.control_graph <= 8) {
        //计数
        self.getRealtimeList(self.spc.control_graph, null,null,selectedStr);
      }
      if (self.spc.control_graph > 0 && self.spc.control_graph < 5) {
        //计量
        if (self.spc.control_graph && self.spc.group_num && self.move_range) {
          self.getRealtimeList(self.spc.control_graph, self.spc.group_num,self.spc.move_range,selectedStr);
        }
      }
      self.spc.job_info = [];
    },
    getStreamDetail: function() {
      let self = this;
      cepStreamDetail({ cep_stream_id: self.stream_id }).then(function(res) {
        if (res.resCode == 0) {
          console.log(res);
          self.stream_column_list = res.data.cep_stream_column;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    getRealtimeDetail: function(spc_realtime_info) {
      let self = this;
      let spc_realtime_id = spc_realtime_info.toString().split("_@_")[0],
        spc_config_name = spc_realtime_info.toString().split("_@_")[1];
      self.$set(self.fields_list, spc_config_name, []);
      self.$set(self.spc.column_info, spc_config_name, []);
      spcRealtimeDetail({ spc_realtime_config_id: spc_realtime_id }).then(
        function(res) {
          if (res.resCode == 0) {
            console.log(res);
            if (res.data.fields_info.length > 0) {
              res.data.fields_info.forEach(function(fields) {
                let obj = {
                    spc_fields_id: fields.spc_fields_id,
                    fields_name: fields.fields_name,
                    spc_realtime_config_id: res.data.spc_realtime_config_id,
                    config_name:res.data.config_name,
                    cep_stream_column_id: ""
                  };

                self.spc.column_info[res.data.config_name].push(obj);
                //spcList
              });
            }
          } else {
            self.$message.error(res.msg);
          }
        }
      );
    },
    // blur:function(event){
    //        console.log('blur**************');
    // },
    visibleChange: function() {
      let self = this;
      //
      self.selectedStream = [];
      if (self.spc.defect_num_fields) {
        self.selectedStream.push(self.spc.defect_num_fields);
      }
      if (self.spc.time_fields) {
        self.selectedStream.push(self.spc.time_fields);
      }
      if (self.spc.defect_reason_fields) {
        self.selectedStream.push(self.spc.defect_reason_fields);
      }
      if (self.spc.total_fields) {
        self.selectedStream.push(self.spc.total_fields);
      }

      //获取详情
      if (self.job_info.length > 0) {
        for (let realtimeInfo of self.job_info) {
          self.getRealtimeDetail(realtimeInfo);
        }
      }
    },
    selStream: function(streamId) {
      let self = this;
      if (typeof streamId == "number") {
          this.selectedStream.push(streamId);
      } 
      else {
          if(streamId){
              self.sameFieldsId(streamId);//streamId 是 对象
          }
      
         //   
        let arr = [];
        for (let col in self.spc.column_info) {
          arr = [...arr, ...self.spc.column_info[col]];
        }
        self.selectedStream = [];
        if (self.spc.defect_num_fields) {
           self.selectedStream.push(self.spc.defect_num_fields);
        }
        if (self.spc.time_fields) {
            self.selectedStream.push(self.spc.time_fields);
        }
        if (self.spc.defect_reason_fields) {
            self.selectedStream.push(self.spc.defect_reason_fields);
        }
        if (self.spc.total_fields) {
            self.selectedStream.push(self.spc.total_fields);
        }
        console.log(arr);
        arr.forEach(item => {
          if (item.cep_stream_column_id) {
            self.selectedStream.push(item.cep_stream_column_id);
          }
        });
        
          
       
      }
    
      //  多选  实时SPC配置  相同 spc_fields_id
    },
    removetag: function(info) {
      // realtimeid @ realtimename
      console.log(info);
      let realtimeName = info.value.toString().split("_@_")[1];
      delete this.spc.column_info[realtimeName];
    },
    sameFieldsId: function(obj) {
      // { field : field }
      //config_name  fields_name  spc_fields_id
    console.log(obj);
      let self = this;
      let nowConfigname = obj.field.config_name,
        nowFieldsId = obj.field.spc_fields_id,
        nowStreamColumnId = "";
      self.spc.column_info[nowConfigname].forEach(item => {
        if (item.spc_fields_id == nowFieldsId) {
          nowStreamColumnId = item.cep_stream_column_id;
        }
      });
      if (Object.keys(self.spc.column_info).length > 0) {
        for (let col in self.spc.column_info) {
          if (col !== nowConfigname) {
            self.spc.column_info[col].forEach(info => {
              if (info.spc_fields_id == nowFieldsId) {
                info.cep_stream_column_id = nowStreamColumnId;
              }
            });
          }
        } 
      }
    },
  
  },
  mounted() {
    let self = this;
    self.$on("spc", function(obj) {
      // {spcId:'',streamId:''}
      console.log("obj**********************spc****");
      console.log(obj);
      self.spc_id = obj.spcId;
      self.stream_id = obj.streamId;
      self.getStreamDetail();
      self.spcDetail(obj.spcId);
    });
  },
  computed: {
    filterStream: function() {
      let self = this, arr = [];
        if(self.stream_column_list.length>0){
           self.stream_column_list.forEach(column => {
              if (self.selectedStream.indexOf(column.cep_stream_column_id) == -1) {
               arr.push(column);
              }
          });
          if (arr.length == 0 && self.selectedStream.length==0) {
            return self.stream_column_list;
          }
      }
     
      return arr;
    }
  }
};
</script>
<style scope>
</style>


