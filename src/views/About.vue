<template>
  <div class="about">
    <h1>issues</h1>
    <ul>
      <li v-for="issue in issues" :key="issue.id">{{ issue.title }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { get, IncomingMessage } from 'http';
import Axios from 'axios';
import Issue from '@/modules/Issue';

@Component
export default class Issues extends Vue {
  private issues: Issue[] = [];
  private created() {
    this.getIssues();
  }

  private async getIssues() {
    const host = '172.31.2.183';
    const projectId = '10';
    const token = 'oX_zMcjxRvLembhSaEUE';

    for (let i = 1; true; i++) {
      const url = `http://${host}/api/v4/projects/${projectId}/issues?private_token=${token}&per_page=5&page=${i}`;

      const data: Issue[] = (await Axios.get(url)).data;
      if (data.length <= 0) {
        break;
      }
      data.forEach(e => this.issues.push(e));
    }
  }
}
</script>
