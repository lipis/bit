/** @flow */
import chalk from 'chalk';
import Command from '../command';
import { search } from '../../api';

export default class Search extends Command {
  name = 'search <scope> <query...> ';
  description = 'search for bits in configured scope';
  alias = '';
  opts = [];
  
  action([scope, query]: [string, [string[]]]): Promise<any> {
    const queryStr = query.join(' ');
    console.log(`searching bits in ${scope} for ${queryStr}`);
    return search(scope, queryStr);
  }

  report(searchResults: string): string {
    const parsedResults = JSON.parse(searchResults);
    if (!parsedResults.length) {
      return chalk.red('No Results');  
    }
    return chalk.green(parsedResults.join('\n'));
  }
}
