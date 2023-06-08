<template>
    <div class="material-list">
        <h3 style="text-align: center;">左侧物料区域</h3>
        <MaterialListItem
         v-for="(item,index) in componentList" :key="index"
          :item="item"
          draggable="true"
          @dragstart="dragstart(item)"
          @dragend="dragend"
          ></MaterialListItem>
    </div>
</template>

<script setup lang="ts">
    import { onMounted,inject} from 'vue';
    import { events } from '@/utils/events';
    import MaterialListItem from './MaterialListItem.vue';
    import {CreateCanvasConfigResult} from '@/type/canvas'

    const emits=defineEmits(['updateData'])

    const config:CreateCanvasConfigResult=inject('config')!;

    //获取页面画布
    const containerRef:any=inject('containerRef');

    //获取当前所有的物料列表
    const componentList=config.componentList;

    //被拖拽的物料
    let currentComponent:any=null;

    //进入元素中，添加一个移动的标识
    const dragenter=(e:any)=>{
        e.dataTransfer.dropEffect='move';
    }

    //在目标元素经过，必须阻止默认行为，否则不能触发drop
    const dragover=(e:any)=>{
        e.preventDefault();
    }

    //离开元素的时候，需要增加一个禁用标识
    const dragleave=(e:any)=>{
        e.dataTransfer.dropEffect='none';
    }

    //松手的时候，根据拖拽的组件，添加一个组件
    const drop=(e:any)=>{
        //拿到当前的物料，将其添加到home组件的data里面
        const current={
            top:e.offsetY,
            left:e.offsetX,
            zIndex:1,
            key:currentComponent.key,
            alignCenter:true,//希望拖拽松手时，block居中
            props:{}
        }
        //调用父组件方法，将当前拖拽的物料存到data里面
        emits('updateData',current)
    }

    const dragstart=(e:any)=>{
        //当前拖拽的物料
        currentComponent=e;
        //进去画布后的操作
        containerRef.value.addEventListener('dragenter',dragenter);
        containerRef.value.addEventListener('dragover',dragover);
        containerRef.value.addEventListener('dragleave',dragleave);
        containerRef.value.addEventListener('drop',drop);
        //发布start
        events.emit('start');
    }
    
    const dragend=()=>{
        //离开之后移除事件
        containerRef.value.removeEventListener('dragenter',dragenter);
        containerRef.value.removeEventListener('dragover',dragover);
        containerRef.value.removeEventListener('dragleave',dragleave);
        containerRef.value.removeEventListener('drop',drop);
        //发布end
        events.emit('end');
    }
    
   
</script>

<style scoped >

</style>