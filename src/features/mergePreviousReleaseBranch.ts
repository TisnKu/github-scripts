import axios from 'axios';
import { gitConstants } from '../common/constant';
import { commonUtils, OperationResult } from '../common/utils';
import { gitUtils } from '../common/gitUtils';

const repos: string[] = ['github-scripts'];
const sourceBranch = '';
const targetBranchSequence = ['sales_master', 'master'];

const mergeToBranch = (repoName: string, branch: string): Promise<OperationResult> =>
  axios.post(`${gitConstants.baseUrl}/repos/${repoName}/merges`, {
    base: branch,
    head: sourceBranch,
    commit_message: `Merge ${sourceBranch} into ${branch}`
  }, gitConstants.headers)
    .then(response => ({
      repoName,
      status: response.status,
      message: 'success',
    }))
    .catch(({ response }) => Promise.reject({
      repoName,
      status: response.status,
      message: response.data.message,
      fallback: response.status == 404,
    }));

const logArguments = () => {
  console.log('####Merge Branch####\n');
  console.log('####Repo：\n');
  console.log(repos.length === 0 ? 'ALL' : repos.join(',\n'));
  console.log('\n####target branch fallback list：\n');
  console.log(targetBranchSequence.join(', '));
  console.log('\n####source branch：');
  console.log(sourceBranch);
};

const executor = () => (repos.length == 0 ? gitUtils.getAllRepoNames() : Promise.resolve(repos))
  .then(repoNames => commonUtils.repoReducer(repoNames as string[], targetBranchSequence, mergeToBranch))
  .then(commonUtils.logActionResults);

export default {
  logArguments,
  executor,
}
