import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list'
import { KEY_SINGER } from '@/assets/js/constant'
import storage from 'good-storage'
import './index.scss'

export default defineComponent({
  name: 'Singer',
  setup () {
    const singers = ref([])
    const selectedSinger = ref(null)
    const router = useRouter()

    ;(async () => {
      const data = await getSingerList()
      singers.value = data.singers
    })()

    const selectSinger = (singer) => {
      selectedSinger.value = singer
      const storageSinger = storage.session.get(KEY_SINGER)
      if (!storageSinger) {
        storage.session.set(KEY_SINGER, singer)
      } else if (storageSinger.mid !== singer.mid) {
        storage.session.set(KEY_SINGER, singer)
      }
      router.push({
        path: `/singer/${singer.mid}`
      })
    }

    return () => <div className="singer" vLoading={!singers.value.length}>
      <IndexList data={singers.value} onSelect={selectSinger}></IndexList>
      <router-view singer={selectedSinger.value}></router-view>
    </div>
  }
})
