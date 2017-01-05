import path from 'path';
import searchIndex from 'search-index';

const indexName = 'searchIndex';
const logLevel = 'debug';

function getIndexPath(scopePath: string) {
  return path.join(scopePath, indexName);
}

function initializeIndex(scopePath: string): Promise<any> {
  const indexOptions = {
    indexPath: getIndexPath(scopePath),
    logLevel
  };
  return new Promise((resolve, reject) => {
    searchIndex(indexOptions, (err, si) => {
      if (err) reject(err);
      resolve(si);
    });
  });
}

module.exports = {
  initializeIndex,
};
