<template>
  <div class="fields-container">

    <div class="player" v-for="player in game.players">
      <table class="field">

        <tr v-for="arrY, y in player.fieldState">
          <td  v-for="value, x in player.fieldState[y]" :class="['fieldCell', player.enemy && player.fieldState[y][x].indexOf('fired') === -1 && game.status !== 'end' ? 'fog' : value]" @click="game.fire(y, x, player, player.enemy);"></td>
        </tr>
      </table>
      <p class="left">Единиц у {{player.name}}: {{player.shipsLeft}}</p>
    </div>

    <div class="log" v-if="game.logs.length">
      <p class="message" v-for="message in game.logs">
        {{message}}
      </p>
    </div>
    <div style="clear:both"></div>
    <div class="greetings" v-if="game.status === 'begin' || game.status === 'end'">
      <input type="text" v-model="name" placeholder="Введите ваше имя" />
      <button @click="game.startGame(name)">Начать игру!</button>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'field',
  props: ['game'],
  data () {
    return {
      name: ''
    }
  }
}
</script>

<style lang="less" scoped>
  .fields-container{
    overflow: hidden;
    font-family:"Arial", sans-serif;
    width:960px;
    margin: 100px auto;
    .player{
      float: left;
      width:242px;
      p{
        text-align: center;

      }
    }
    .log{
      float: left;
      width:450px;
      box-sizing:border-box;
      padding:20px;
      p{
        margin:0;
        padding:0;
        color:blue;
        &:nth-child(even){
          color:red;
        }
      }
    }
  }
  .field{
    border-collapse: collapse;
    margin: 10px;
    .fieldCell{
      width: 20px;
      height: 20px;
      background-color: #eee;
      border:solid 1px #aaa;
      background-image: url('../assets/sprite.png');
      background-position:-22px 0;
      &.sea, &.margin{
        background-color: lightblue;
        &.fired{
          background-position: 0 0;
        }
      }
      &.fog{
        background-color: gray;
        background-position:-44px 0;
      }
      &.ship{
        background-color: green;
        background-position:-22px -22px;
        &.fired{
          background-position: 0 -22px;
        }
      }
    }
  }
</style>
