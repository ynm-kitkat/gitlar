<template>
  <div class="about" @keyup.n="createNewIssue" ref="issueList">
    <v-dialog
      v-model="descriptionDialogVisible"
      width="60%"
    >
      <v-card v-if="selectedIssue">
        <v-card-title class="headline">{{ selectedIssue.issue.title }}</v-card-title>

        <v-divider class="my-2"></v-divider>

        <v-card-text class="my-1 py-1"><v-chip small v-for="label in selectedIssue.issue.labels" :key="label" class="ma-1">{{label}}</v-chip></v-card-text>

        <v-divider class="my-2"></v-divider>

        <v-card-text class="pa-5"><div v-html="selectedIssue.descriptionHtml"></div></v-card-text>

        <v-divider class="my-2"></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn
            color="green darken-1"
            text
            @click="goToGitlab"
          >
            Go to Gitlab
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-simple-table>
      <thead>
        <tr>
          <th class="text-center">id</th>
          <th class="text-center">区分</th>
          <th class="text-center">type</th>
          <th class="text-center">進捗</th>
          <th class="text-left">title</th>
          <th class="text-left">due date</th>
          <th class="text-left">assignee</th>
        </tr>
      </thead>
      <transition-group name="list-complete" tag="tbody">
        <!-- <tr v-for="(issue, i) in issues" :key="issue.id" :style="rowStyle(issue)"> -->
        <tr v-for="(issue, i) in issues" :key="issue.id" @dblclick="showDescription(issue)" :style="rowStyle(issue)">
          <td class="text-center nowrap" :tabindex="i * 10 + 1">{{ issue.id }}</td>
          <td class="text-center nowrap" :tabindex="i * 10 + 2">{{ issue.label_system_name }}</td>
          <td class="text-center nowrap" :tabindex="i * 10 + 3">{{ issue.label_issue_type }}</td>
          <td class="text-center nowrap" :tabindex="i * 10 + 4">{{ issue.label_issue_progress }}</td>
          <td class="text-left"          :tabindex="i * 10 + 5">{{ issue.title }}</td>
          <td class="text-left nowrap"   :tabindex="i * 10 + 6">{{ issue.due_date }}</td>
          <td class="text-left nowrap"   :tabindex="i * 10 + 7">
            <v-avatar v-if="issue.assignee" size="20px">
              <img alt="Avatar" :src="issue.assignee.avatar_url">
            </v-avatar>
            {{ issue.assignee && issue.assignee.name || '-' }}
          </td>
        </tr>
      </transition-group>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { get, IncomingMessage } from 'http';
import Axios from 'axios';
import Issue, { makeIssue } from '@/modules/Issue';
import configManager from '../ConfigManager';
import marked from 'marked';

@Component
export default class Issues extends Vue {
  private issues: Issue[] = [];
  private selectedIssue: { issue: Issue, descriptionHtml: string} | null = null;
  private descriptionDialogVisible = false;

  private host = '';
  private projectId = 0;
  private token = '';

  private statusFilter: '&state=opened' | '&state=closed' | '' = '&state=opened';

  private created() {
    const config = configManager();
    this.host = config.host;
    this.projectId = config.projectId;
    this.token = config.accessToken;
    this.getIssues();
  }

  private mounted() {
    this.$nextTick(() => (this.$refs.issueList as HTMLElement).focus());
  }

  private async getIssues() {
    for (let i = 1; true; i++) {
      const url = `${this.host}/api/v4/projects/`
        + `${this.projectId}/issues?private_token=${this.token}&per_page=100&page=${i}`
        + this.statusFilter;


      const data: Issue[] = (await Axios.get(url)).data;
      if (data.length <= 0) {
        break;
      }
      data
        .map(issue => makeIssue(issue))
        .forEach(e => this.issues.push(e));
    }
  }

  private rowStyle(issue: Issue) {
    switch (issue.state) {
      case 'opened':
        return '';
      case 'closed':
        return 'background-color: #cccccc80';
      default:
        break;
    }
  }

  private async showDescription(issue: Issue) {
    const url = `${this.host}/api/v4/markdown?private_token=${this.token}`;
    const postData = {
      text: issue.description,
      gfm: true,
    };
    this.selectedIssue = { issue, descriptionHtml: (await Axios.post(url, postData)).data.html };
    this.descriptionDialogVisible = true;
  }

  private goToGitlab() {
    if (this.selectedIssue) {
      const {shell} = require('electron');
      shell.openExternal(this.selectedIssue.issue.web_url);
    }
  }

  private createNewIssue() {
    console.log('aa')
  }
}
</script>

<style lang="scss" scoped>
table td {
  transition: .3s all;
  &.nowrap {
    white-space: nowrap;
  }
}

.description-dialog {
  background: #fff;
  padding: 50px;
}
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
