/** @flow */
import chalk from 'chalk';
import Command from '../command';
import { search } from '../../api';

export default class Search extends Command {
  name = 'search <scope> <query> ';
  description = 'search for bits in configured scope';
  alias = '';
  opts = [];
  
  action([scope, query]: [string, string]): Promise<any> {
    console.log(`searching bits in ${scope} for ${query}`);
    return search(scope, query);
  }

  report(searchResults: string): string {
    const parsedResults = JSON.parse(searchResults);
    if (!parsedResults.length) {
      return chalk.red('No Results');  
    }
    return chalk.green(parsedResults.join('\n'));
  }
}
