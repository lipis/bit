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

function coundDocs(scopePath: string) {
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
        searchResults.push(data);
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
