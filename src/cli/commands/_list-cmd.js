/** @flow */
import Command from '../command';
import { fromBase64 } from '../../utils';
import { list } from '../../api';

export default class Upload extends Command {
  name = '_list <path>';
  private = true;
  description = 'list bits (executed on a remote scope)';
  alias = '';
  opts = [];
  
  action([path]: [string, ]): Promise<any> {
    return list.remoteList(fromBase64(path));
  }

  report(bits: PartialBit[]): string {
    return JSON.stringify(bits);
  }
}
