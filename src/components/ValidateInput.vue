<template>
    <div class="validate-input-container pb-3">
        <!-- 实现父子组件的双向绑定 -->
        <!-- 结合设置inheritAttrs为false, 使用$attrs接收默认属性, 添加到组件本身而不是根组件上 -->
        <input  
            v-if="tag !== 'textarea'"
            class="form-control" 
            :class="{'is-invalid': inputRef.error}"
            @blur="validateInput"
            v-model="inputRef.val"
            v-bind="$attrs"
        />
        <textarea
            v-else
            class="form-control" 
            :class="{'is-invalid': inputRef.error}"
            @blur="validateInput"
            v-model="inputRef.val"
            v-bind="$attrs"
        >
        </textarea>
        <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
    </div>
</template>

<script lang="ts">
const emailReg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
import { defineComponent, reactive, PropType, onMounted, watch, computed } from 'vue';
import { emitter } from './ValidateForm.vue'
interface RuleProp {
    type: 'required' | 'email' | 'range' | 'custom'
    message: string;
    minLength?: number;
    validator?: () => boolean
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
    name: 'Form',
    props: {
        rules: Array as PropType<RulesProp>,
        modelValue: String,     //父组件传递下来的实现双向绑定的值
        tag: {
            type: String as PropType<TagType>,
            default: 'input'
        }
    },
    // 禁止组件根元素(div)继承attributes
    inheritAttrs: false,
    setup(props, context){
        const inputRef = reactive({
            val: computed({
                get: () => props.modelValue || '',
                set: val => {
                    context.emit('update:modelValue', val)
                }
            }),
            error: false,
            message: ''
        })
       
        const validateInput = () => {
            if(props.rules){
                // 每条验证规则都要通过
                const allPassed = props.rules.every(rule => {
                    let passed = true
                    inputRef.message = rule.message
                    switch(rule.type){
                        case 'required':
                            passed = (inputRef.val.trim() !== '')
                            break
                        case 'email':
                            passed = emailReg.test(inputRef.val)
                            break
                        case 'range':
                            passed = (inputRef.val.length >= 6)
                            break
                        case 'custom':
                            passed = rule.validator ? rule.validator() : true
                            break
                        default:
                            break
                    }
                    return passed
                })
                inputRef.error = !allPassed
                return allPassed
            }
            return true
        }
        onMounted(() => {
            emitter.emit('form-item-created', validateInput)
        })
        return {
            inputRef,
            validateInput,
        }
    }
})
</script>