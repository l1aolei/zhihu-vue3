<template>
    <div class="dropdown" ref="dropdownRef">
        <!-- click.prevent方式a链接的默认行为 -->
        <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
            {{ title }}
        </a>
        <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
           <slot></slot>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch} from 'vue';
import useClickOutside from '@/hooks/useClickOutside';
export default defineComponent({
    name: 'Dropdown',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup(){
        const isOpen = ref(false)
        const dropdownRef = ref<null | HTMLElement>(null) // 与vue2中从this.$ref对象获取dom不同的地方在于, 其命名要与dom节点上的ref名相同
        const toggleOpen = () => {
            isOpen.value = !isOpen.value
        }
        // 自定义hook
        // 点击屏幕其他地方也能关闭dropdown组件
        // 判断dropdown的dom节点是否包含鼠标 && dropwown是否为打开状态 
        const isClickOutside = useClickOutside(dropdownRef)
        watch(isClickOutside, () => {
            if(isOpen.value && isClickOutside){
                isOpen.value = false
            }
        })
        return {
            isOpen,
            dropdownRef,
            toggleOpen,
        }
    }
})
</script>