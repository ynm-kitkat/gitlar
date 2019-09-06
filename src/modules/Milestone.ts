export default interface Milestone {
  id: number;
  iid: number;
  project_id: number | undefined;
  group_id: number | undefined;
  title: string;
  description: string;
  due_date: string | null;
  state: 'active' | 'closed';
  updated_at: string;
  created_at: string;
}
