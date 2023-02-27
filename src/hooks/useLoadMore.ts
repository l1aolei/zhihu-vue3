import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
    currentPage: number;
    pageSize: number;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = { currentPage: 2, pageSize: 5 }) => {
    const store = useStore()
    const currentPage = ref(params.currentPage)
    // 使用computed计算currentPage的最新值, 否则一直为常量2
    const requestParams = computed(() => ({
        currentPage: currentPage.value,
        pageSize: params.pageSize
    }))
    const loadMorePage = () => {
        store.dispatch(actionName, requestParams.value).then(() => {
            currentPage.value++
        })
    }
    const isLastPage = computed(() => {
        return Math.ceil(total.value / params.pageSize) < currentPage.value
    })
    return {
        currentPage,
        loadMorePage,
        isLastPage
    }
}

export default useLoadMore