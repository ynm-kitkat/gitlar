export default interface User {
  id: number;
  username: string;
  name: string;
  state: 'all' | 'active' | 'inactive';
  avatar_url: string;
  web_url: string;
}
