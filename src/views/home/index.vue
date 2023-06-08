<template>
    <div class="home" v-if="store.editorRef">
        <div class="home-left">
            <MaterialList @updateData="updateData"></MaterialList>
        </div>
        <div class="home-top">
            <NavList></NavList>
        </div>
        <div class="home-right">
            <Operator></Operator>
        </div>
        <div class="home-container">
            <!-- 负责产生滚动条 -->
            <div class="home-container-canvas">
                <!-- 画布，产生内容区域 -->
                <div class="home-container-canvas-content" :style="containerStyle" ref="containerRef">
                    <CanvasList :blocks="data.blocks"></CanvasList>
                </div>
            </div>
        </div>

        <!-- 浮窗 -->
        <Dialog></Dialog>
    </div>
    <div 
    v-else
    class="home-container-canvas-content" 
    :style="containerStyle" 
    ref="containerRef">
        <el-button @click="store.editorRef=!store.editorRef">回到编辑</el-button>
        <CanvasList :blocks="data.blocks"></CanvasList>
    </div>
    
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, provide, ref, watch,watchEffect } from "vue";
import jsonData from "@/data.json";
import CanvasList from "@/components/canvas/CanvasList.vue";
import MaterialList from "@/components/material/MaterialList.vue";
import NavList from "@/components/nav/NavList.vue";
import Dialog from "@/components/dialog/Dialog.vue";
import Operator from "@/components/operator/Operator.vue";
import { Data } from "@/type/data";
import { useStore } from "@/store";
import { registerConfig as config } from "@/utils/canvas";
import { useFocus } from "element-plus";


const store=useStore();

//data.json的全部数据
const data:Data = reactive(jsonData);

//用计算属性生成containter的style
const containerStyle = computed(() => {
    return {
        width: data.container.width + "px",
        height: data.container.height + "px",
    };
});


//提供data.json
provide("totalData", data);

provide('config',config);


//获取画布
const containerRef = ref(null);

provide("containerRef", containerRef);

//更新data的值
const updateData = (obj: any) => {
    data.blocks.push(obj);
};


</script>

<style scoped lang="scss">
.home {
    position: relative;
    width: 100%;
    height: 100vh;

    &-left,
    &-right {
        position: absolute;
        width: 270px;
        background-color: #bbdda0;
        top: 0;
        bottom: 0;
    }

    &-left {
        left: 0;
    }

    &-right {
        right: 0;
    }

    &-top {
        position: absolute;
        height: 80px;
        right: 280px;
        left: 280px;
        background-color: #f1e2b3;
    }

    &-container {
        padding: 80px 270px 0;
        height: 100%;

        &-canvas {
            overflow: hidden;
            height: 100%;

            &-content {
                position: relative;
                margin: 20px auto;
                background-color: #f4cece;

                
            }
        }
    }
}
</style>
