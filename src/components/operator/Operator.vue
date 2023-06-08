<template>
    <div>
        <h3>右侧属性区</h3>
        <el-form>
            <!-- 修改容器的属性 -->
            <div class="container"
                v-if="store.lastSelectBlock === undefined || Object.keys(store.lastSelectBlock).length === 0">
                <el-form-item label="容器宽度">
                    <el-input-number v-model="container.width"></el-input-number>
                </el-form-item>
                <el-form-item label="容器高度">
                    <el-input-number v-model="container.height"></el-input-number>
                </el-form-item>
            </div>

            <!-- 修改block -->
            <div class="block" v-else>
                <el-form-item v-for="(value, key) in curComponent.props" :key="key" :label="value.label">
                    <el-input v-if="value.type === 'input'" v-model="props[key]"></el-input>
                    <el-color-picker v-else-if="value.type === 'color'" v-model="props[key]"></el-color-picker>
                    <el-select v-else-if="value.type === 'select'" v-model="props[key]">
                        <el-option v-for="(opt, i) in value.options" :key="i" :label="opt.label"
                            :value="opt.value"></el-option>
                    </el-select>
                </el-form-item>
            </div>


            <el-form-item>
                <el-button type="primary" @click="updateData">应用</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { watchEffect, inject, watch, reactive, toRefs, onMounted, Prop } from "vue";
import { useStore } from "@/store";
import { ElForm } from "element-plus";
import {useCommand} from '@/utils/useCommand'
import { useFocus } from "element-plus";
import { CreateCanvasConfigResult } from '@/type/canvas'
import deepcopy from "deepcopy";
import { Props,Data } from "@/type/data";


const store = useStore();
const totalData: Data = inject('totalData')!;

interface EditorData {
    container: {
        width: number;
        height: number;
    },
    props: Props
}

//修改的数据
const editorData: EditorData = reactive({
    container: {
        width: 0,
        height: 0,
    },
    props: {
        text: '',
        type: '',
        size: '',
        color: '',
    }
})


//组件的配置信息
const config: CreateCanvasConfigResult = inject('config')!;



//最后选中的组件
interface CurComponent {
    props?:Object
}

let curComponent = reactive({});

watch(store, (newval) => {
    if (newval.lastSelectBlock) {
        curComponent= config.componentMap[newval.lastSelectBlock.key];
        editorData.props=deepcopy(newval.lastSelectBlock.props);
        // editorData.props = newval.lastSelectBlock.props;

    } else {
        editorData.container = deepcopy(totalData.container);
        // editorData.container = totalData.container;
    }
})


//初始化数据，将container赋值给editorData
onMounted(() => {
    editorData.container = deepcopy(totalData.container);
    // editorData.container = totalData.container;
})



//更新container和block的数据
const updateData = () => {
    if(store.lastSelectBlock === undefined || Object.keys(store.lastSelectBlock).length === 0){
        totalData.container=deepcopy(editorData.container);
    }else{
        store.lastSelectBlock.props=deepcopy(editorData.props);
        console.log('block')
    }
}


const { container, props } = toRefs(editorData);




</script>

<style scoped lang="scss">
h3 {
    text-align: center;
}

.el-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .el-form-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 10px auto;
    }
}
</style>
