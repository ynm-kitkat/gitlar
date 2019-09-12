<template>
  <v-app>
    <v-app-bar app dark>
      <v-toolbar-title class="headline text-uppercase">
        <span>Gitlar</span>
        <span class="font-weight-light orange--text text--darken-3"> task manager</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="to('/')">
        <span>HOME</span>
      </v-btn>
      <v-btn text @click="to('/issues')">
        <span>issues</span>
      </v-btn>
      <v-btn text icon color="grey" class="mr-2" @click="to('/issues')">
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Gitlab } from 'gitlab';
import configManager from './ConfigManager';
import Todo from './modules/Todo';
import _ from 'lodash';

const api = new Gitlab({
  host: configManager().host,
  token: configManager().accessToken,
});
const fetchNewTodo = async () => {
  const todos = await api.Todos.all() as Todo[];
  const prevTodos = configManager().todos;
  const diff = _.difference(todos, prevTodos);

  configManager().todos = todos;
};

@Component
export default class Home extends Vue {
  private created() {
    fetchNewTodo();
    setInterval(fetchNewTodo, 10000);
  }
  private to(path: string) {
    return this.$route.path !== path ? this.$router.push(path) : '';
  }
}
</script>

<style lang="scss">
* {
  font-family: 'Roboto', 'Noto Sans JP', sans-serif !important;
}
</style>
