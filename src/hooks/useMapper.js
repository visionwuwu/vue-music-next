import { computed } from 'vue'
import { useStore, mapState, mapGetters, createNamespacedHelpers } from 'vuex'

export default function useMapper(mapper, mapFn) {
  const store = useStore()
  const storeStateFns = mapFn(mapper)
  const storeState = {}

  Object.keys(storeStateFns).forEach((item) => {
    const fn = storeStateFns[item].bind({ $store: store })
    storeState[item] = computed(fn)
  })

  return storeState
}

export function useState(moduleName, mapper) {
  let mapperFn = mapState
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapState
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn)
}

export function useGetters(moduleName, mapper) {
  let mapperFn = mapGetters
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapGetters
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn)
}
