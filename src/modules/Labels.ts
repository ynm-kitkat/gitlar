export type Label = system | type | progress | 'high-priority' | 'critical' | 'duplicate' | 'invalid' | 'wontfix';

export type system = 'TMC-Server' | 'TMC-Front' | 'For-Customer' | 'Mock' | 'Batch' | 'infra';
export type type = 'BUG' | 'ENHANCEMENT' | 'QUESTION' | 'REMINDER' | 'HELP WANTED' | '全体周知';
export type progress = 'todo' | 'please discussion' | 'doing' | '確認待ち';

export const isSystem = (label: Label): label is system => {
  return label === 'TMC-Server'
      || label === 'TMC-Front'
      || label === 'For-Customer'
      || label === 'Mock'
      || label === 'Batch'
      || label === 'infra';
};

export const isType = (label: Label): label is type => {
  return label === 'BUG'
      || label === 'ENHANCEMENT'
      || label === 'QUESTION'
      || label === 'REMINDER'
      || label === 'HELP WANTED'
      || label === '全体周知';
};

export const isProgress = (label: Label): label is progress => {
  return label === 'todo'
      || label === 'please discussion'
      || label === 'doing'
      || label === '確認待ち';
};
