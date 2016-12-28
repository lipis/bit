/** @flow */
import R from 'ramda';
import chalk from 'chalk';
import Command from '../command';
import { list } from '../../api';
import PartialBit from '../../bit/partial-bit';

export default class List extends Command {
  name = 'ls [scope]';
  description = 'list all box bits';
  alias = '';
  opts = [];
  
  action([scope]: [string]): Promise<any> {
    console.log(scope ? `List of a remote scope: ${scope}` : 'List of current scope');
    return list.list(scope);
  }

  report(bits: PartialBit[]): string {
    if (R.is(String, bits)) bits = JSON.parse(bits); // pulled from remote
    if (R.isEmpty(bits)) {
      return chalk.red('your external bits directory is empty');  
    }

    return chalk.green(bits.map(bit => `Box: ${bit.bitJson.box}, Name: ${bit.name}, Version: ${bit.bitJson.version}`).join('\n'));
  }

}
