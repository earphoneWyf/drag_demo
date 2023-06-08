//列表可以显示所有的物料
//key对应的组件映射关系
// import { ElButton, ElInput, ElText } from "element-plus";
import { computed, defineComponent,  reactive } from "vue";
import { Component, ComponentMap, CreateCanvasConfigResult } from "@/type/canvas";

function createCanvasConfig(): CreateCanvasConfigResult {

  const componentList: Component[] = [];
  const componentMap: ComponentMap = {};

  return {
    register: (component: Component) => {
      componentList.push(component);
      componentMap[component.key] = component;
    },
    componentList,
    componentMap
  }
}
export let registerConfig = createCanvasConfig();
//物料属性
const createInputProp = (label: String) => ({ type: 'input', label });
const createColorProp = (label: String) => ({ type: 'color', label });
const createSelectProp = (label: String, options: any) => ({ type: 'select', label, options });

registerConfig.register({
  label: '文本',
  preview: () => defineComponent({
    components: {
      ElText,
    },
    template: `<div><el-text>预览文本</el-text></div>`,
  }),
  render: (prop) => defineComponent({
    template: `<div><el-text :style="blockStyle">{{ RenderText }}</el-text></div>`,

    components: {
      ElText,
    },
    setup() {
      const block = reactive(prop);

      const blockStyle = computed(() => {
        return {
          color: block.color,
          fontSize: block.size,
        }
      })

      const RenderText = computed(() => block.text || '渲染按钮')
      return {
        block, blockStyle, RenderText
      }
    },
  }),
  key: 'text',
  props: {
    text: createInputProp('文本内容'),
    color: createColorProp('字体颜色'),
    size: createSelectProp('字体大小', [
      { label: '14px', value: '14px' },
      { label: '20px', value: '20px' },
      { label: '24px', value: '20px' }
    ])
  }
})

registerConfig.register({
  label: '按钮',
  preview: () => defineComponent({
    components: {
      ElButton,
    },
    template: `<div><el-button plain>预览按钮</el-button></div>`,
  }),
  render: (prop) => defineComponent({
    template: `<div><el-button :type="btnType" :size="btnSize">{{RenderText}}</el-button></div>`,

    components: {
      ElButton,
    },


    setup() {
      const block = reactive(prop);

      const RenderText = computed(() => block.text || '渲染按钮')

      const btnType = computed(() => block.type || 'primary')

      const btnSize = computed(() => block.size || 'default')

      return {
        block, RenderText, btnType, btnSize
      }
    },
  }),
  key: 'button',
  props: {
    text: createInputProp('按钮内容'),
    type: createSelectProp('按钮类型', [
      { label: '基础', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
      { label: '文本', value: 'text' },
    ]),
    size: createSelectProp('按钮尺寸', [
      { label: '默认', value: 'default' },
      { label: '大', value: 'large' },
      { label: '小', value: 'small' },
    ])
  }
});

registerConfig.register({
  label: '输入框',
  preview: () => defineComponent({
    components: {
      ElInput,
    },
    template: `<div><ElInput placeholder="预览输入框" /></div>`,
  }),
  render: (prop) => defineComponent({
    template: `<div><ElInput placeholder="渲染输入框" /></div>`,

    components: {
      ElInput,
    },

    setup() {
      const block = reactive(prop);
      return {
        block
      }
    },
  }),
  key: 'input',
  props: {

  }
});