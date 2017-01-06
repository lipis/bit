/** @flow */
import serverlessIndex from './serverless-index';

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

function search(scopePath: string, query: string) {
  return new Promise((resolve, reject) => {
    localIndex = serverlessIndex.initializeIndex(scopePath);
    const searchResults = [];
    return localIndex.then((indexInstance) => {
      indexInstance.search({
        query: [{
          AND: { '*': [query] }
        }]
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
