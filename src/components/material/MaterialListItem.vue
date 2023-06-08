<template>
    <div class="item" draggable="true">
        <span>{{ props.item.label }}</span>
        <component :is='PreviewComponent'></component>
    </div>
</template>

<script setup lang="ts">

    const props=defineProps(['item'])

    //获取render函数
    const PreviewComponent=props.item.preview();



</script>

<style scoped lang="scss">
    .item {
        position: relative;
        width: 250px;
        margin: 10px auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        padding: 20px 60px;
        cursor: move;
        user-select: none;
        border-radius: 6px;
        overflow: hidden;

        >span {
            position: absolute;
            top: 0;
            left: 0;
            background-color: #df9413;
            color: #fff;
            font-size: 14px;
            padding: 4px;
            border-radius: 0 0 8px 0;
        }
    }
</style>