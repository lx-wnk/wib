import Wib from '../src/Wib';
import 'mocha';
import * as Command from 'commander';

describe('Wib response', () => {
  it('Should return instance of program', () => {
    const wib = Wib;

    if (wib instanceof Command.Command) {
      return true;
    }

    return false;
  });
});
