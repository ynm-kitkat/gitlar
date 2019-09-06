import Milestone from './Milestone';
import User from './User';

export default interface Issue {
  id: number;
  project_id: number;
  milestone: Milestone;
  author: User;
  description: string;
  state: 'opened' | 'closed';
  iid: number;
  assignees: User[];
  assignee: User;
  labels: string[];
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
  time_stats: {
     time_estimate: number,
     total_time_spent: number,
     human_time_estimate: number | null,
     human_total_time_spent: number | null,
  };
  has_tasks: boolean;
  task_status: string;
  confidential: boolean;
  discussion_locked: boolean;
  _links: {
     self: string,
     notes: string,
     award_emoji: string,
     project: string,
  };
  task_completion_status: {
     count: number,
     completed_count: number,
  };
}
