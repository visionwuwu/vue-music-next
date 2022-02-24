<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger"></IndexList>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :singer="selectedSinger" :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list'
import { KEY_SINGER } from '@/assets/js/constant'
import storage from 'good-storage'
export default {
  components: {
    IndexList
  },
  setup() {
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
    return {
      singers,
      selectSinger,
      selectedSinger
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
