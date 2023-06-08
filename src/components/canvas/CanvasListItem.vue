<template>
    <div class="item" :style="blockStyle" ref="blockRef" :class="props.item.focus ? 'active' : 'item'">
        <component :is="RenderComponent"></component>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, inject, ref,watch } from "vue"
import {CreateCanvasConfigResult} from '@/type/canvas'

const props = defineProps(['item', 'index'])

const config:CreateCanvasConfigResult=inject('config')!;

const blockStyle = computed(() => {
    return {
        top: props.item.top + 'px',
        left: props.item.left + 'px',
        zIndex: props.item.zIndex
    }
})

//当前拖拽过来的block 
const blockRef = ref(null);

onMounted(() => {
    interface CurrentBlock {
        offsetWidth: number;
        offsetHeight: number;
    }
    const currentBlock: CurrentBlock = blockRef?.value!;
    let { offsetWidth, offsetHeight } = currentBlock

    //说明是拖拽松手的时候才渲染的，其他的默认渲染到页面上的内容不需要居中
    if (props.item.alignCenter) {
        props.item.left = props.item.left - offsetWidth / 2;
        props.item.top = props.item.top - offsetHeight / 2;
        props.item.alignCenter = false;//让选然后的结构才能去居中
    }
    props.item.width = offsetWidth;
    props.item.height = offsetHeight;

})


//通过block的key属性直接获取对应的组件
let component = config.componentMap[props.item.key];

//获取render函数
let RenderComponent = component.render(props.item.props);


//监听block的变化更新动态组件
watch(props,(newval)=>{
    component = config.componentMap[newval.item.key];
    RenderComponent = component.render(newval.item.props);
})

</script>

<style scoped lang="scss"> .item {
     position: absolute;
     // background-color: #d2aaaa;
     text-align: center;
     cursor: pointer;
 }

 .item.active {
     border: 2px solid salmon;
 }
</style>