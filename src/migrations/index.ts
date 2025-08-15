import * as migration_20250815_145322_initial from './20250815_145322_initial';
import * as migration_20250815_185813 from './20250815_185813';

export const migrations = [
  {
    up: migration_20250815_145322_initial.up,
    down: migration_20250815_145322_initial.down,
    name: '20250815_145322_initial',
  },
  {
    up: migration_20250815_185813.up,
    down: migration_20250815_185813.down,
    name: '20250815_185813'
  },
];
