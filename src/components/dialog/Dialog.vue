<template>
    <div class="dialog">
        <el-dialog v-model="store.dialogVisible" :title="store.aboutDialog.title" width="45%">
            <el-input type="textarea" :rows="8" v-model="store.aboutDialog.content"></el-input>
            <template #footer v-if="store.aboutDialog.showBtn">
                <span class="dialog-footer">
                    <el-button @click="store.dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="importData">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { inject } from 'vue';
import { Data } from '@/type/data';
import { useCommand } from '@/utils/useCommand';
import { useFocus } from '@/utils/useFocus';

const store=useStore();
const totalData=inject<Data>('totalData')!;

const {focusData}=useFocus(totalData,()=>{});

//按下确定按钮导入数据
const importData=()=>{
    store.dialogVisible = false;
    // const data=JSON.parse(store.aboutDialog.content);
    const data=store.aboutDialog.content;

    if(data.hasOwnProperty('container')){//如果导入的数据是整个画布的数据
        const {commands}=useCommand(totalData,focusData);
        commands.updateContainer(data);
    }else{  //如果导入的是单独block的数据
        const {commands}=useCommand(totalData,focusData);
        const oldData=JSON.parse(JSON.stringify(store.aboutDialog.curBlock))
        commands.updateBlock(data,oldData)
    }   
    
}

</script>

<style scoped lang="scss">

    el-input {
        height: 200px;
    }
    .dialog-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 0;
        margin-right: 0;
    }
</style>