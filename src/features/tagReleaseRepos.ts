import { commonUtils, logActionResults, OperationResult } from '../common/utils';
import { gitUtils } from '../common/gitUtils';

const repos: string[] = [];
const branchFallbackList: string[] = ['firstChoice', 'secondChoice', 'thirdChoice'];
const newTag: string = 'tag';

const tagRepoBranch = (repo: string, branch: string): Promise<OperationResult> =>
  gitUtils.getBranchRef(repo, branch).then(branchSha => gitUtils.createTag(repo, newTag, branchSha))
    .then(response => ({ repoName: repo, status: response.status, message: 'success' }))
    .catch(({ response }) => Promise.reject({
      repoName: repo,
      status: response.status,
      message: response.statusText,
      fallback: response.status == 404
    }));

const logArguments = () => {
  console.log('####TAG####\n');
  console.log('####Repos：\n');
  console.log(repos.length === 0 ? 'ALL' : repos.join(',\n'));
  console.log('\n####branch fallback list：\n');
  console.log(branchFallbackList.join(', '));
  console.log('\n####tag to add：');
  console.log(newTag);
};

const executor = () => (repos.length == 0 ? gitUtils.getAllRepoNames() : Promise.resolve(repos))
  .then(repos => commonUtils.repoReducer(repos, branchFallbackList, tagRepoBranch))
  .then(logActionResults);

export default {
  logArguments,
  executor,
}
