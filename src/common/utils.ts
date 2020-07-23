import readline from "readline";
import * as _ from 'lodash';

const askQuestion = (query: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
};

export interface OperationResult {
  repoName: string,
  status: number,
  message: string,
  fallback?: boolean,
}

export const logActionResults = (actionResults: Array<OperationResult>) => {
  _.forEach(_.groupBy(actionResults, 'status'), (repos, status) => {
    console.log('-------------------------------------------------');
    console.log('status: ', status, '\n', 'count: ', repos.length, '\n', repos.map(repo => `${repo.repoName}:${repo.message}`).join(',\n'));
  });
};

const repoReducer = (repoList: string[],
                     branchFallbackList: string[],
                     actionFn: (repo: string, branch: string) => Promise<OperationResult>) => Promise.all(
  repoList.map((repo: string) =>
    branchFallbackList
      .reduce((prev: Promise<OperationResult>, currentBranch: string) =>
          prev.catch(errorResult => _.isNil(errorResult) || errorResult.fallback
            ? actionFn(repo, currentBranch)
            : Promise.reject(errorResult)),
        Promise.reject())
  ).map(promise => promise.catch(response => Promise.resolve(response))))
  .then(_.compact);

export const commonUtils = {
  askQuestion,
  repoReducer,
  logActionResults,
};
