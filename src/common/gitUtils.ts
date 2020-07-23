import axios, { AxiosResponse } from 'axios';
import { gitConstants } from './constant';
import * as _ from 'lodash';

const getBranchRef = (repoName: string, branch: string) =>
  axios.get(`${gitConstants.baseUrl}/repos/${repoName}/git/refs/heads/${branch}`, gitConstants.headers)
    .then(response => response.data.object.sha);

const createTag = (repo: string, tag: string, sha: string): Promise<any> =>
  axios.post(`${gitConstants.baseUrl}/repos/${repo}/git/refs`, {
    ref: `refs/tags/${tag}`,
    sha,
  }, gitConstants.headers);

const createBranch = (repoName: string, sourceSha: string, targetBranch: string): Promise<AxiosResponse> =>
  axios.post(`${gitConstants.baseUrl}/repos/${repoName}/git/refs`, {
    ref: 'refs/heads/' + targetBranch,
    sha: sourceSha,
  }, gitConstants.headers);

const getAllRepos = async () => {
  const { data: allReposOfCurrentUser1 } = await axios.get(`${gitConstants.baseUrl}/user/repos?per_page=100&page=1`, gitConstants.headers);
  const { data: allReposOfCurrentUser2 } = await axios.get(`${gitConstants.baseUrl}/user/repos?per_page=100&page=2`, gitConstants.headers);
  return [...allReposOfCurrentUser1, ...allReposOfCurrentUser2];
};

const getAllRepoNames = () => getAllRepos().then(repos => _.map(repos, 'name'));

export const gitUtils = {
  getBranchRef,
  getAllRepos,
  createTag,
  createBranch,
  getAllRepoNames,
};
