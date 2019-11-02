<template>
   <el-form label-position="right" label-width="100px" class="Form " size="mini">
       <el-form-item  label="table Name :">
           <el-col :span='23'>
               <el-input v-model="table.cepTableName" @input="changeName"></el-input>
           </el-col>
       </el-form-item>
        <el-form-item  label="Comment :">
           <el-col :span='23'>
               <el-input v-model="table.comment"></el-input>
           </el-col>
       </el-form-item>
        <el-form-item  label="table Column :">
            <!-- <el-row  v-for="(column,index) in comtableColumn" :key="column.cepTableColumnId">
                            <el-col :span="8">
                                <el-input  placeholder="column_name" v-model="column.tableColumnName" :readonly="column.cepTableColumnId>0"></el-input>
                            </el-col>
                             <el-col :span="8" v-if="column.cepTableColumnId>0" :offset="1">
                                <el-input v-model="column.valueTypeName" :readonly="column.cepTableColumnId>0"></el-input>
                            </el-col>
                            <el-col :span="8" v-else  :offset="1">
                                 <el-select v-model="column.valueType" placeholder="select column_type">
                                    <el-option v-for="o in valueType" :key="o.label" :label="o.label" :value="o.value"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span='5' class="text-right">
                                <el-button size="mini" type="primary" v-show="column.cepTableColumnId <'1' "  @click="createtableColumn(column,index)">添加</el-button>
                                <el-button size="mini" @click="addColumnList" v-show="index==tableColumn.length-1 && column.cepTableColumnId >'0'"><i class="el-icon-plus" ></i></el-button>
                                <el-button size="mini" @click="deleteColumn(column,index)" v-show="column.cepTableColumnId >'0'"><i class="el-icon-delete"></i></el-button>   
                            </el-col> 

             </el-row> -->
             <el-col :span="23" class=" Table TableNoHover">
              <el-table
                    :data="comtableColumn"
                   >
                    <el-table-column
                     align="left"
                    prop="tableColumnName"
                    label="column_name"
                    min-width="50px">
                      <template slot-scope="scope">
                         <el-input v-model="scope.row.tableColumnName" :readonly="scope.row.cepTableColumnId>0"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                     align="left"
                    prop="valueType"
                    label="valueType"
                    min-width="50px"
                    >
                      <template slot-scope="scope">
                            <el-input v-if="scope.row.cepTableColumnId>0" 
                                 v-model="scope.row.valueTypeName" :readonly="scope.row.cepTableColumnId>0">
                            </el-input>
                             <el-select   v-else
                                   v-model="scope.row.valueType" >
                                    <el-option v-for="o in valueType" :key="o.label" :label="o.label" :value="o.value"></el-option>
                           </el-select>
                      </template>
                    </el-table-column>
                     <el-table-column
                      align="left"
                    prop="primaryKey"
                    label="primaryKey"
                    min-width="40px"
                    >
                      <template slot-scope="scope">
                           <el-checkbox v-model="scope.row.primaryKey" :disabled="scope.row.cepTableColumnId>0 || hasPrimaryKey "></el-checkbox>
                      </template>
                    </el-table-column>
                     <el-table-column
                      align="left"
                    prop="tableIndex"
                    label="index"
                    min-width="25px"
                    >
                      <template slot-scope="scope">
                         <el-checkbox v-model="scope.row.tableIndex" :disabled="scope.row.cepTableColumnId>0"></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column
                     align="left"
                    min-width="35px"
                     >
                      <template slot-scope="scope">
                            <el-button size="mini" type="primary"   :disabled="!scope.row.tableColumnName || !scope.row.valueType"  v-show="scope.row.cepTableColumnId <'1' "  @click="createtableColumn(scope)">添加</el-button>
                            <el-button size="mini"  type="primary"  @click="deleteColumn(scope)" v-show="scope.row.cepTableColumnId >'0'"><i class="el-icon-delete"></i></el-button>   
                            <el-button size="mini"  type="primary" @click="addColumnList" v-show="scope.$index==tableColumn.length-1 && scope.row.cepTableColumnId >'0'"><i class="el-icon-plus" ></i></el-button>
                            
                      </template>
                    </el-table-column>

                </el-table>
             </el-col>
       </el-form-item>
        <el-form-item lable="">
           <el-col :span="22" class="btnBlock">
                <el-button type="primary" size="mini" @click="submit" :loading='loading'>提交</el-button>
           </el-col>
       </el-form-item>
   </el-form>
</template>

<script>
import { cepTableDetail, cepTableColumnCreate, cepTableColumnDelete, cepTableUpdate} from "@/api/piping/table";
export default{
    // props:['tableId','nodeOrder'],
     data(){
        return {
            tableId:'',
            loading:false,
            hasPrimaryKey:false,  //primaryKey 只能选一个，，
            table:{
                
                cepTableName:'',
                comment:'',
            },
            cepTableColumn://一行空的值
                {
                    cepTableColumnId:'',
                    tableColumnName:'',
                    valueType:'',//1
                    valueTypeName:'',//int
                    primaryKey:'',
                    tableIndex:''
                   
                },
            tableColumn:[
                
            ],//循环列表
            valueType:[
                { label:'string',value:'1' },
                { label:'int',value:'2' },
                { label:'float',value:'3' },
                { label:'double',value:'4' }
            ]
        }
    },
    methods:{
        tableDetail:function(tableId){
            let self=this;
           
           cepTableDetail({cepTableId:tableId}).then(function(res){
               console.log(res);
                 if(res.code==200){
                      /// console.log(res.data);
                      self.table.cepTableName=res.data.cepTableName;
                      self.table.comment=res.data.comment;
                      //debugger
                      self.tableColumn=res.data.cepTableColumn.slice();
                      console.log(self.tableColumn);
                      self.tableColumn.forEach(function(item){
                            if( item.tableIndex==1){
                                item.tableIndex=true
                            }
                            else{
                                item.tableIndex=false
                            }
                            if( item.primaryKey==1){
                                item.primaryKey=true
                            }
                            else{
                                item.primaryKey=false
                            }
                            self.valueType.forEach(function(item1){
                                 if(item1.value==item.valueType){
                                     item.valueTypeName=item1.label;
                                 }
                            });
                            
                      });
                       
                 }
                 else{
                   self.$message.error(res.message);
                 }
           });
        },
        // tableColumnDetail:function(){
        //     let self=this;
        //    /* ceptableColumnShow({cepTableId:self.tableId}).then(function(res){
        //         if(res.resCode==0){
        //             console.log('table---column');
        //             console.log(res);
        //            self.tableColumn=res.data;
        //         }
        //         else{
        //              self.$message({
        //                 message:res.msg,
        //                 type:'error'
        //             });
        //         }
        //     })*/
        // },
        createtableColumn:function(scope){
            let data=Object.assign({},scope.row),self=this;
            data.cepTableId=self.tableId;
                if(data.tableIndex){
                    data.tableIndex=1;
                }
                else{
                    data.tableIndex=0;
                }
                if(data.primaryKey){
                    data.primaryKey=1;
                }
                else{
                    data.primaryKey=0;
                }

           console.log(data);
            cepTableColumnCreate(data).then(function(res){
                if(res.code==200){
                   let data=Object.assign({},res.data);
                    if(data.tableIndex==1){
                        data.tableIndex=true
                    }
                    else{
                         data.tableIndex=false
                    }
                     if(data.primaryKey==1){
                       data.primaryKey=true
                    }
                    else{
                        data.primaryKey=false
                    }
                     self.valueType.forEach(function(item){
                        if(item.value==res.data.valueType){
                           data.valueTypeName=item.label;
                        }
                });
                    self.tableColumn.splice(scope.$index,1,data);
                }
                else{
                    self.$message({
                        message:res.message,
                        type:'error'
                    });
                }
            });
        },
       
        addColumnList:function(){
            let self=this,flag=false;
            this.tableColumn.forEach(function(item){
                if(item.primaryKey){
                     self.hasPrimaryKey=true;
                     flag=true;
                }

            });
            if(!flag){
                this.hasPrimaryKey=false;
            }
            this.tableColumn.push(Object.assign({},self.cepTableColumn));      
        },
        deleteColumn:function(scope){
            let self=this,flag=false;
             this.$confirm('确定删除列'+ scope.row.tableColumnName+'?', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
            }).then(()=>{
                cepTableColumnDelete({cepTableColumnId:scope.row.cepTableColumnId}).then(function(res){
                                    if(res.code==200){
                                        self.tableColumn.splice(scope.$index,1);
                                    self.tableColumn.forEach(function(item){
                                            if(item.primaryKey){
                                                self.hasPrimaryKey=true;
                                                flag=true;
                                            }

                                        });
                                        if(!flag){
                                            self.hasPrimaryKey=false;
                                        }
                                    }
                                    else{
                                        self.$message({
                                            message:res.message,
                                            type:'error'
                                        });
                                    }

                            });

            }).catch(()=>{});
          
        },
        submit:function(){
            let self=this;
            if(self.table.cepTableName.indexOf('_')>=0){
               self.$message.warning('tableName 不能包含下划线_');
                return ;
            }
            self.loading=true;
            self.table.cepTableId=self.tableId;
            cepTableUpdate(self.table).then(function(res){
                if(res.code==200){
                    self.$message({
                        message:res.message,
                        type:'success'
                    });
                    self.$emit('cepUpdate');
                }
                else{
                      self.$message({
                        message:res.message,
                        type:'error'
                    });
                }
                self.loading=false;
            });

        },
        changeName:function(val){
            if(val.indexOf('_')>=0){
               this.$message.warning('tableName 不能包含下划线_');
                return ;
            }
             this.$emit('changeName',val);
        }
    },
    computed:{
        comtableColumn:function(){
            let self=this;
            if(self.tableColumn.length==0){
                self.tableColumn.push(Object.assign({},self.cepTableColumn));
            }
            return self.tableColumn;
        }
   },
    mounted(){
        let self=this;
        self.$on('table',function(tableId){
          
               self.tableId=tableId;
               self.tableDetail(tableId);
              // self.tableColumnDetail();
        });
    }
}
</script>
<style scope>
</style>
