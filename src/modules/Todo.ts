import User from './User';
import Issue from './Issue';
import MergeRequest from './MergeRequest';
import Project from './Project';

export default interface Todo {
  id: number;
  project: Project;
  action_name: 'assigned' | 'mentioned' | 'build_failed' | 'marked' | 'approval_required' | 'unmergeable' | 'directly_addressed';
  body: string;
  author: User;
  state: 'pending' | 'done';
  target: Issue | MergeRequest;
  target_type: 'Issue' | 'MergeRequest';
  target_url: string;
  created_at: string;
}
