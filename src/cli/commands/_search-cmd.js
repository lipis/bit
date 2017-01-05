/** @flow */
import Command from '../command';
import { fromBase64 } from '../../utils';
import { localSearch } from '../../search';

export default class Fetch extends Command {
  name = '_search <path> <query>';
  private = true;
  description = 'search for bits from a scope';
  alias = '';
  opts = [];

  action([path, query, ]: [string, string, ]): Promise<any> {
    return localSearch.search(fromBase64(path), fromBase64(query));
  }

  report(searchReslts: string[]): string {
    return JSON.stringify(searchReslts);
  }
}
