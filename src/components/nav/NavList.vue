<template>
    <div class="nav">
        <h3 style="text-align: center">菜单栏</h3>
        <div class="buttons">
            <el-button v-for="(btn, index) in buttons" :index="index" @click="btn.handler">
                {{ typeof btn.label === 'function' ? btn.label() : btn.label }}
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue';
import { useCommand } from '@/utils/useCommand';
import { useStore } from '@/store';
import { AboutDialog } from '@/type/dialog';
import { Data } from '@/type/data';
import { useFocus } from '@/utils/useFocus';

const store = useStore();


//data.json的数据
const totalData = inject<Data>('totalData')!;

const { focusData, clearBlockFocus } = useFocus(totalData, () => { });

//按钮功能映射
const { commands } = useCommand(totalData, focusData);

const buttons = reactive([
    {
        label: '撤销',
        handler: () => commands.undo(),
    },
    {
        label: '重做',
        handler: () => commands.redo(),
    },
    {
        label: '导入',
        handler: () => showDialog({
            title: '导入数据',
            content: '',
            showBtn: true,
        })
    },
    {
        label: '导出',
        handler: () => showDialog({
            title: '导出JSON数据',
            content: totalData,
            showBtn: false,
        })
    }, {
        label: '置顶',
        handler: () => commands.placeTop()
    }, {
        label: '置底',
        handler: () => commands.placeBottom()
    },
    {
        label: '删除',
        handler: () => commands.delete()
    },
    {
        label: () => store.previewRef ? '编辑' : '预览',
        handler: () => handlerPreviewRef()
    }, {
        label: '关闭',
        handler: () => store.editorRef = !store.editorRef
    }
]);




//dialogVisible为弹窗是否显示
const showDialog = (aboutDialog: AboutDialog) => {
    store.showDialog();
    store.aboutDialog.title = aboutDialog.title;
    store.aboutDialog.content = aboutDialog.content !== '' ? JSON.stringify(aboutDialog.content) : '';
    store.aboutDialog.showBtn = aboutDialog.showBtn;
}


const handlerPreviewRef = () => {
    store.previewRef = !store.previewRef;
    clearBlockFocus();
}

</script>

<style scoped lang="scss">
.buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;

    el-button {
        margin: auto 10px;
    }
}
</style>


