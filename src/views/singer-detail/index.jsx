import { defineComponent, ref, computed } from 'vue'
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list'
import storage from 'good-storage'
import { KEY_SINGER } from '@/assets/js/constant'
import './index.scss'

export default defineComponent({
  name: 'SingerDetail',
  props: {
    singer: Object
  },
  setup (props) {
    const songs = ref([])
    const loading = ref(true)
    const singer = computed(() => {
      const currentSinger = props.singer
      const storageSinger = storage.session.get(KEY_SINGER)
      if (!currentSinger) {
        if (storageSinger) {
          return storageSinger
        }
      }
      return currentSinger
    })
    const title = computed(() => singer.value && singer.value.title)
    const pic = computed(() => singer.value && singer.value.pic)

    const fetchData = async () => {
      const data = await getSingerDetail(singer.value)
      const res = await processSongs(data.songs)
      songs.value = res
      loading.value = false
    }
    fetchData()

    return () => <div className="singer-detail">
      <MusicList
        songs={songs.value}
        title={title.value}
        pic={pic.value}
        loading={loading.value}
      ></MusicList>
    </div>
  }
})
