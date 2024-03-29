import { computed, ref } from 'vue';
import { Data } from '@/type/data';
import { useStore } from '@/store';


export const useFocus = function (totalData: Data, callback: any) {
    const store=useStore();

    //selectIndex表示选中block的索引
    const selectIndex = ref(-1);//表示没有任何一个被选中


    //最后选择block的索引
    const lastSelectBlock = computed(() => totalData.blocks[selectIndex.value]);


    //选中的元素
    const focusData = computed(() => {
        let focus: any[] = [];
        let unfocused: any[] = [];
        totalData.blocks.forEach((block: any) => (block.focus ? focus : unfocused).push(block))
        return { focus, unfocused }
    })


    //让其他元素的focus全部为false
    const clearBlockFocus = () => {
        totalData.blocks.forEach((block: any) => {
            block.focus = false;
        });
    }

    //点击容器让选中的失去焦点
    const containerMousedown = (e:any) => {
        //如果是预览状态则跳出
        if(store.previewRef) return;

        //如果点击的是block的菜单栏及其子元素则跳出
        if(e.target.closest('#dropdown')) return;
        clearBlockFocus();
        //表示没有一个选中
        selectIndex.value = -1;
        
    }


    //对画布内的元素进行选取
    const blockMousedown = (e: any, item: any, index: number) => {
        if(store.previewRef) return;
        //阻止默认和冒泡
        e.preventDefault();
        e.stopPropagation();
        //清除其他所有的focus，保留自己
        if (e.shiftKey) {
            //当前只有一个节点被选中时，按住shift键也不会切换focus状态
            focusData.value.focus.length <= 1 ? item.focus = true : item.focus = !item.focus;

        } else {
            //判断每一个item上有么有focus聚焦，如果没有则添加
            if (!item.focus) {
                clearBlockFocus();
                item.focus = true;//清空其他人的focus属性
            }//当自己被选中，再次点击还是选中

        }

        //鼠标点击时获取当前点击block的索引值
        selectIndex.value = index;
        //调用点击拖拽的函数
        // mouseDown(e)
        callback(e)
    }

    return {
        focusData,
        lastSelectBlock,
        clearBlockFocus ,
        blockMousedown,
        containerMousedown
    }
}