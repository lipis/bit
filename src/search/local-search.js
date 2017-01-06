/** @flow */
import serverlessIndex from './serverless-index';
import indexer from './indexer';

let localIndex;

function totalHits(scopePath: string, query: string) {
  return new Promise((resolve, reject) => {
    localIndex = serverlessIndex.initializeIndex(scopePath);
    return localIndex.then((indexInstance) => {
      indexInstance.totalHits({
        query: [{
          AND: { '*': [query] }
        }]
      }, (err, count) => {
        if (err) reject(err);
        resolve(count);
      });
    });
  });
}

function countDocs(scopePath: string) {
  return new Promise((resolve, reject) => {
    localIndex = serverlessIndex.initializeIndex(scopePath);
    return localIndex.then((indexInstance) => {
      indexInstance.countDocs((err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  });
}

function getDoc(scopePath: string, docIds: string[]) {
  return new Promise((resolve, reject) => {
    localIndex = serverlessIndex.initializeIndex(scopePath);
    return localIndex.then((indexInstance) => {
      indexInstance.get(docIds).on('data', function (doc) {
        console.log(doc);
      });
    });
  });
}

function formatSearchResult(searchResult: Object): string {
  const doc = searchResult.document;
  return `${doc.box}/${doc.name}`;
}

function queryItem(field, query, boost = 1) {
  return {
    AND: { [field]: query.toLowerCase().split(' ') },
    BOOST: boost
  };
}

function search(scopePath: string, queryStr: string) {
  return new Promise((resolve, reject) => {
    localIndex = serverlessIndex.initializeIndex(scopePath);
    const searchResults = [];
    const tokenizedQuery = indexer.tokenizeStr(queryStr);
    const query = [];
    query.push(queryItem('box', queryStr, 4));
    query.push(queryItem('tokenizedBox', queryStr, 3));
    query.push(queryItem('name', queryStr, 4));
    query.push(queryItem('tokenizedName', tokenizedQuery, 3));
    query.push(queryItem('functionNames', queryStr, 3));
    query.push(queryItem('tokenizedFunctionNames', tokenizedQuery, 2));
    query.push(queryItem('description', queryStr));
    return localIndex.then((indexInstance) => {
      indexInstance.search({
        query,
      }).on('data', function (data) {
        searchResults.push(formatSearchResult(data));
      })
      .on('end', function () {
        return resolve(searchResults);
      });
    });
  });
}

module.exports = {
  search,
};
