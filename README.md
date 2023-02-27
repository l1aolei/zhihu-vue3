# zhihu
(1) 组件: ColumnList + GlobalHeader + Dropdown + DropdownItem

1. 点击navbar其他区域使dropdown关闭:
(1) 创建自定义hook 
(2) 使用vue的ref对象获取dom节点
(2) 判断其是否包含鼠标(!dropdownRef.value.contains(e.target as HTMLElement))

2. 表单验证
(1) 抽离逻辑验证为单独的validate-input组件代替Input框
(2) 父组件传入验证规则
(3) validate-input组件接收验证规则数组为props, 使用.every()判断是否满足所有验证规则

3. 父子组件的双向绑定
(1) 父组件在子组件标签中传入v-model的值
(2) 子组件使用modelValue做接收, 且使用update:modelValue发送事件

4. slot
 (1) 在validate-form组件中使用具名插槽, #default为validate-input组件
 (2) v-slot: submit对应提交按钮模块
 (3) 在Uploader组件使用slot, 设定按钮的状态

5. 路由守卫
 (1) 在create路由添加路由元信息并结合前置守卫进行判断, 未登录时跳转到login
 (2) 在登录之后访问login页面则跳转至home

 6. 对axios中的interceptor拦截器对象做配置, 设置请求的baseurl和loading状态
 7. 使用teleport组件, 在index.html中创建与app同级的back节点 并将全局Loader组件转移到back节点上, 优化代码结构
 8. 使用token和jwt完成登录验证，保存在本地localstorage

 9. 使用render内置函数完成Message组件的创建

 10. 代码的优化:
 (1) 缓存优化: 首页模块列表的优化: 改变数据结构, posts数组转化成一个对象, 添加isLoaded标签做判断, 第一次请求加载完之后改成true, 之后首页的加载则根据isLoaded判断是否发请求  或者使用keep-alive结合路由的$route.meta属性作判断, 让首页不重新加载

 (2) 懒加载优化:
    -- 创建自定义hooks, 
  -- 传递两个参数, 当前页码和请求条数作为paramas发送请求,  当服务器总条数total / 请求条数Pagesize < 当前页码currentPage,  加载按钮不显示;
  -- hooks暴露一个发送请求的方法和是否为标记是否为最后一页的变量isLastPage
  
