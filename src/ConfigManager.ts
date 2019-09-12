
import Config from 'electron-store';
import Todo from './modules/Todo';

interface Bounds {
  width: number;
  height: number;
  x: number;
  y: number;
}

const defaultBounds: Bounds = {
  width: 800,
  height: 600,
  x: 0,
  y: 0,
};

class ConfigManager {
  private config = new Config({
    defaults: {
      bounds: defaultBounds,
      protocol: 'http' as 'http' | 'https',
      host: '',
      subhost: '',
      accessToken: '',
      projectId: 10,
      todos: [] as Todo[],
    },
  });

  public get bounds(): Bounds {
    return this.config.get('bounds') as Bounds;
  }

  public set bounds(v: Bounds) {
    this.config.set('bounds', v);
  }

  public get protocol(): 'http' | 'https' {
    return this.config.get('protocol') as 'http' | 'https';
  }

  public set protocol(v: 'http' | 'https') {
    this.config.set('protocol', v);
  }

  public get host(): string {
    return this.config.get('host') as string;
  }

  public set host(v: string) {
    this.config.set('host', v);
  }

  public get subhost(): string {
    return this.config.get('subhost') as string;
  }

  public set subhost(v: string) {
    this.config.set('subhost', v);
  }

  public get accessToken(): string {
    return this.config.get('accessToken') as string;
  }

  public set accessToken(v: string) {
    this.config.set('accessToken', v);
  }

  public get projectId(): number {
    return this.config.get('projectId') as number;
  }

  public set projectId(v: number) {
    this.config.set('projectId', v);
  }

  public get todos(): Todo[] {
    return this.config.get('todos') as Todo[];
  }

  public set todos(v: Todo[]) {
    this.config.set('todos', v);
  }
}

const config: ConfigManager | null = null;

const configManager = () => {
  return config != null ? config : new ConfigManager();
};

export default configManager;
