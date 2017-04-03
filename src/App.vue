<template>
  <div id="app">
    <router-view :game="game"></router-view>
  </div>
</template>

<script>
import Game from '@/classes/game.class'

export default {
  name: 'app',
  data () {
    return {
      game: new Game
    }
  }
}
</script>

<style lang="less">

</style>
