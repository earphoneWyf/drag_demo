<template>
    <div class="canvas-list" @mousedown.stop="containerMousedown($event)"
    >
        <CanvasListItem
         v-for="(item,index) in totalData.blocks" :key="index"
          :item="item"
          :index="index"
          @mousedown="blockMousedown($event,item,index)" 
          @contextmenu="onContextMenuBlock($event,item)"
          ></CanvasListItem>
          
          <!-- 纵线 -->
          <div class="line-x" v-if="markLine.x" :style="{left:markLine.x+'px'}"></div>
          <!-- 横线 -->
          <div class="line-y" v-if="markLine.y" :style="{top:markLine.y+'px'}"></div>
    </div>
</template>

<script setup lang="ts">
    import CanvasListItem from '@/components/canvas/CanvasListItem.vue'
    import { onMounted, inject ,watch } from 'vue';
    import { useFocus } from '@/utils/useFocus';
    import { useDrag } from '@/utils/useDrag';
    import { useStore } from '@/store';
    import { useCommand } from '@/utils/useCommand';
    import { Data } from '@/type/data';
    import { createComponent } from '@/utils/createVNode'

    const store=useStore();

    // defineProps(['blocks']);

    //引入blocks全部数据
    let totalData:Data=inject('totalData')!;

   

    watch(totalData,(newval:Data)=>{
        // 在totalData对象发生变化时重新赋值
        totalData.blocks = newval.blocks;
    })


     // 对画布组件进行点击选取 start
    const {focusData,blockMousedown,containerMousedown,lastSelectBlock} = useFocus(totalData,(e:any)=>{
        mouseDown(e)
    })

    // 对画布组件进行点击选取 end


    //监听lastSelectBlock,更新store.lastSelectBlock
    watch(lastSelectBlock,(newval)=>{
        store.lastSelectBlock=newval;
    })

    // 对画布组件进行点击拖拽 start
    const {mouseDown,markLine} = useDrag(focusData,lastSelectBlock,totalData);   
    // 对画布组件进行点击拖拽 end


    //按钮功能映射
    const { commands } = useCommand(totalData, focusData);


    //获取画布
    const containerRef=inject('containerRef');

    //右键点击出现菜单栏
    const onContextMenuBlock=(e:any,block:any)=>{
        e.preventDefault();
        e.stopPropagation();

        //如果时预览状态则跳出
        if(store.previewRef) return;
        //调用函数，动态创建组件
        createComponent(e,commands,containerRef,block);
    }

</script>

<style lang="scss">
    .canvas-list {
        position: relative;
        width: 100%;
        height: 100%;

        // 移动left
        .line-x {
            position: absolute;
            top: 0;
            bottom: 0;
            border-left: 1px dashed  red;
        }
        // 移动top
        .line-y {
            position: absolute;
            left: 0;
            right: 0;
            border-top: 1px dashed  red;
        }

        #dropdown {
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 70px;
            height: 250px;
            background-color: #ebe4e4;
            border: 1px dotted #9f9f9f;
            z-index: 2;

            button {
                margin: 2px;
            }
        }

    }
    

    
</style>