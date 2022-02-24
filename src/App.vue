<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>
  <Player></Player>
</template>

<script>
import MHeader from '@/components/header'
import Tab from '@/components/tab'
import Player from '@/components/player'

export default {
  name: 'App',
  components: {
    Tab,
    MHeader,
    Player
  }
}
</script>
