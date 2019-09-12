import Milestone from './Milestone';
import User from './User';
import TimeStats from './TimeStats';
import { Label, system, type, progress, isSystem, isType, isProgress } from './Labels';

export default interface Issue {
  id: number;
  project_id: number;
  milestone: Milestone;
  author: User;
  description: string;
  state: 'opened' | 'closed';
  iid: number;
  assignee: User;
  labels: Label[];

  label_system_name: system | undefined;
  label_issue_type: type | undefined;
  label_issue_progress: progress | undefined;
  critical: boolean;
  high_priority: boolean;

  upvotes: number;
  downvotes: number;
  merge_requests_count: number;
  title: string;
  updated_at: string;
  created_at: string;
  closed_at: string;
  closed_by: User;
  user_notes_count: 1;
  due_date: string;
  web_url: string;
  time_stats: TimeStats;
  has_tasks: boolean;
  task_status: string;
  confidential: boolean;
  discussion_locked: boolean;
  task_completion_status: {
    count: number,
    completed_count: number,
  };
}

export const makeIssue = (issue: Issue) => {
  issue.label_system_name = issue.labels.find(label => isSystem(label)) as (system | undefined);
  issue.label_issue_type = issue.labels.find(label => isType(label)) as (type | undefined);
  issue.label_issue_progress = issue.labels.find(label => isProgress(label)) as (progress | undefined);
  return issue;
};
