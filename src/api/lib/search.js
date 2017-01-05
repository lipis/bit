/** @flow */
import { loadConsumer } from '../../consumer';

export default function search(scope: string, query: string) {
  return loadConsumer().then((consumer) => {
    return consumer.remoteSearch(scope, query);
  });
} 
