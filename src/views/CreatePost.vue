<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
    <uploader 
      actions="/upload"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFIleUploaded"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <h2>正在上传</h2>
       </div>
      </template>
      <template #uploaded="dataprops">
        <img :src="dataprops.uploadedData.data.url" alt="">
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <editor 
          v-model="contentVal" 
          :options=editorOptions 
          ref="editorRef"
          @blur="checkEditor"
          :class="[!editorStatus.isValid ? 'is-invalid' : '' ]"
        >
        </editor>
        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{ isEditMode ? '更新文章' : '发表文章' }}</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import EasyMDE, { Options } from 'easymde'
import Uploader from '@/components/Uploader.vue'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { beforeUploadCheck } from '../helper'
import createMessage from '@/components/createMessage'
import Editor from '@/components/Editor.vue'
interface EditorInstance {
  clear: () => void;
  getMDEInstance: () => EasyMDE | null;
}

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader,
    Editor
  },
  setup() {
    const uploadedData = ref()
    const titleVal = ref('')
    const editorStatus = reactive({
      isValid: true,
      message: ''
    })
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    const store = useStore<GlobalDataProps>()
    const textArea = ref<null | HTMLTextAreaElement>(null)
    const editorRef = ref<EditorInstance | null>()
    let imageId = ''
    const editorOptions: Options = {
      spellChecker: false
    } 
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const checkEditor = () => {
      if(contentVal.value.trim() === ''){
        editorStatus.isValid = false
        editorStatus.message = '文章详情不能为空'
      } else {
        editorStatus.isValid = true
        editorStatus.message = ''
      }
    }
    onMounted(() => {
      if(editorRef.value){
        console.log(editorRef.value.getMDEInstance());
      }
      if(isEditMode){
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if(currentPost.image){
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const handleFIleUploaded = (rawData: ResponseType<ImageProps>) => {
      if(rawData.data._id){
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      checkEditor()
      if (result && editorStatus.isValid) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column: String(column),
            author: String(_id)
          }
          if(imageId){
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(()=> {
            createMessage('发表成功, 两秒后跳转到文章', 'success')
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {format: ['image/jpeg', 'image/png'], size: 1})
      const { passed, error } = result
      if(error === 'format'){
        createMessage('格式错误, 上传的图片只能是JPG/PNG格式', 'error')
      } else if(error === 'size'){
        createMessage('尺寸太大, 上传的图片不超过1MB', 'error')
      }
      return passed
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      uploadedData,
      isEditMode,
      textArea,
      editorStatus,
      editorOptions,
      editorRef,
      onFormSubmit,
      uploadCheck,
      handleFIleUploaded,
      checkEditor
    }
  }
})
</script>

<style>
  .create-post-page .file_upload_container {
    height: 200px;
    cursor: pointer;
  }

  .create-post-page .file_upload_container img{
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
</style>