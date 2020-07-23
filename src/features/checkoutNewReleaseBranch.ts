import { commonUtils, OperationResult } from '../common/utils';
import { gitUtils } from '../common/gitUtils';
import * as _ from 'lodash';

const repos: string[] = []; 
const lastRelease = '';
const targetBranch = '';
const sourceBranchSequence = ['master'];

export const checkoutBranch = async (repoName: string, sourceBranch: string): Promise<OperationResult> =>
  gitUtils.getBranchRef(repoName, sourceBranch)
    .then(sha => gitUtils.createBranch(repoName, sha, targetBranch))
    .then(
      response => ({
        repoName,
        status: response.status,
        message: 'success',
      }),
      ({ response }) => Promise.reject({
        repoName,
        status: response.status,
        message: response.data.message,
        fallback: true,
      })
    );

const filterReposWithLastReleaseBranch = (repoList: string[]): Promise<string[]> =>
  Promise.all(_.map(repoList, repo => gitUtils.getBranchRef(repo, lastRelease).then(() => repo).catch(() => null)))
    .then(_.compact);

const logArguments = () => {
  console.log('####Create branch####：\n');
  console.log(repos.length === 0 ? 'ALL' : repos.join(',\n'));
  console.log('\n####source branch fallback list：\n');
  console.log(sourceBranchSequence.join(', '));
  console.log('\n####last release branch：');
  console.log(lastRelease);
  console.log('\n####new release branch：');
  console.log(targetBranch);
};

const executor = () => (repos.length == 0 ? gitUtils.getAllRepoNames() : Promise.resolve(repos))
  .then(filterReposWithLastReleaseBranch)
  .then(repos => commonUtils.repoReducer(repos, sourceBranchSequence, checkoutBranch))
  .then(commonUtils.logActionResults);

export default {
  logArguments,
  executor,
}
