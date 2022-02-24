import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Scroll from '../base/scroll'
import SongList from '../base/song-list'
import './index.scss'

const RESERVED_HEIGHT = 40

export default defineComponent({
  name: 'MusicList',
  props: {
    title: {
      type: String
    },
    pic: {
      type: String
    },
    songs: {
      type: Array,
      default: () => ([])
    },
    loading: {
      type: Boolean
    }
  },
  setup (props) {
    const router = useRouter()
    const store = useStore()
    const imageHeight = ref(0)
    const bgImage = ref()
    const scrollY = ref(0)
    const maxTranslateY = ref(0)

    const bgImageStyle = computed(() => {
      const scrollYVal = scrollY.value
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 1
      let scale = 1
      if (scrollYVal > maxTranslateY.value) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }
      if (scrollYVal < 0) {
        scale = 1 + Math.abs(scrollYVal / imageHeight.value)
      }
      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${props.pic})`,
        transform: `scale(${scale}) translateZ(${translateZ}px)`
      }
    })

    const ScrollStyle = computed(() => {
      return {
        top: `${imageHeight.value}px`
      }
    })

    const playBtnStyle = computed(() => {
      let display = ''
      if (scrollY.value >= maxTranslateY.value) {
        display = 'none'
      }
      return {
        display
      }
    })

    const filterStyle = computed(() => {
      let blur = 0
      const scrollYVal = scrollY.value
      const imageHeightVal = imageHeight.value
      if (scrollYVal >= 0) {
        blur = Math.min(maxTranslateY.value / imageHeightVal, scrollYVal / imageHeightVal) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    })

    const noResult = computed(() => {
      return !props.loading && (props.songs.length === 0)
    })

    onMounted(() => {
      imageHeight.value = bgImage.value.clientHeight
      maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
    })

    const goBack = () => {
      router.back()
    }

    const onScroll = (pos) => {
      scrollY.value = -pos.y
    }

    const selectItem = ({ index }) => {
      store.dispatch('selectPlay', { list: props.songs, index })
    }

    const random = () => {
      store.dispatch('randomPlay', { list: props.songs })
    }

    return () => <div className="music-list">
      <div
        class="back"
        onClick={goBack}
      >
        <i class="icon-back"></i>
      </div>
      <h1 class="title">{props.title}</h1>
      <div
        class="bg-image"
        style={bgImageStyle.value}
        ref={bgImage}
      >
        <div
          class="play-btn-wrapper"
          style={playBtnStyle.value}
        >
          <div
            v-show={props.songs.length > 0}
            class="play-btn"
            onClick={random}
          >
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
          </div>
        </div>
        <div
          class="filter"
          style={filterStyle.value}
        ></div>
      </div>
      <Scroll
        class="list"
        style={ScrollStyle.value}
        v-loading={props.loading}
        v-no-result={noResult.value}
        probeType={3}
        onScroll={onScroll}
      >
        <div class="song-list-wrapper">
          <SongList
            songs={props.songs}
            onSelect={selectItem}
          ></SongList>
        </div>
      </Scroll>
    </div>
  }
})
