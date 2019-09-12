<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12 my-4>
        <h1 class="display-2 font-weight-thin mb-3">
          Welcome to Gitlar
        </h1>
      </v-flex>
      <v-flex
        mb-5
        xs12
        text-left
        v-if="showWelcome">
        <v-layout justify-center wrap>
          <v-flex xs12 my-4>
            <v-form>
              <v-text-field
                v-model="host"
                label="Host"
                required
              ></v-text-field>
              <v-text-field
                v-model="token"
                label="Access Token"
                required
              ></v-text-field>
            </v-form>
          </v-flex>
          <v-flex xs12 my-4>
            <v-btn @click="setConfig">ok</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <template v-else>
        <v-flex
          mb-5
          xs12
          text-left>
          <h1 class="display-1 font-weight-thin mb-5">
            @Mentions
          </h1>
          <v-layout justify-center wrap>
            <v-flex
              xs11
              mb-4
              v-for="todo in mentions"
              :key="todo.id"
            >
              <v-card
                class="mx-auto"
                outlined
              >
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">created at {{ toLocaleString(new Date(todo.created_at)) }}</div>
                    <v-list-item-title class="headline font-weight-thin mb-1">{{ todo.body }}</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="40"
                    color="grey"
                  ><img :src="todo.author.avatar_url"></v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex
          mb-5
          xs12
          text-left>
          <h1 class="display-1 font-weight-thin mb-5">
            Your Issues
          </h1>
          <v-layout justify-center wrap>
            <v-flex
              xs11
              mb-4
              v-for="issue in issues"
              :key="issue.id"
            >
              <v-card
                class="mx-auto"
                outlined
              >
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">#{{ issue.id }} created at {{ toLocaleString(new Date(issue.created_at)) }}</div>
                    <v-list-item-title class="heading mb-1">{{ issue.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ issue.title }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="40"
                    color="grey"
                  ><img :src="issue.assignee.avatar_url"></v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-flex>
            <v-flex
              xs11
              mb-4
              v-if="issues.length === 0"
            >
              あなたのタスクはすべて完了しています！
            </v-flex>
          </v-layout>
        </v-flex>
      </template>

    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import configManager from '../ConfigManager';
import { Gitlab } from 'gitlab';
import { GetResponse } from 'gitlab/dist/infrastructure';
import Todo from '@/modules/Todo';
import Issue from '../modules/Issue';

@Component
export default class Home extends Vue {
  private token = configManager().accessToken;
  private host = configManager().host;

  private issues: Issue[] = [];
  private api: Gitlab  = new Gitlab({
    host: configManager().host,
    token: configManager().accessToken,
  });
  private projectId = 0;

  get showWelcome() {
    return (configManager().host === '' || configManager().accessToken === '');
  }

  get todos() {
    return configManager().todos;
  }

  get mentions() {
    return this.todos.filter(t => t.action_name === 'mentioned' || t.action_name === 'directly_addressed');
  }

  private async created() {
    const config = configManager();
    this.projectId = config.projectId;

    this.issues = await this.api.Issues.all({ scope: 'assigned_to_me', state: 'opened' }) as Issue[];
  }

  private setConfig() {
    configManager().accessToken = this.token;
    configManager().host = this.host;
  }

  private toLocaleString(d: Date) {
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.toLocaleTimeString()}`;
  }
}
</script>
