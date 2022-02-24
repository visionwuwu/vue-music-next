import { useStore, mapState, computed } from 'vuex'

export default function useState(mapper) {
  const store = useStore()
  const storeStateFns = mapState(mapper)
  const storeState = {}

  Object.keys(storeStateFns).forEach((item) => {
    const fn = storeStateFns[item].bind({ $store: store })
    storeState[item] = computed(fn)
  })

  return storeState
}
