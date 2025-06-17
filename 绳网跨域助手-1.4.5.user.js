// ==UserScript==
// @name         绳网跨域助手
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @description  none
// @author       claxmo
// @license      MIT
// @run-at       document-start
// @match        http://localhost:*/inter-knot/*
// @match        https://claxmo.github.io/inter-knot/*
// @connect      github.com
// @connect      api.github.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/534939/%E7%BB%B3%E7%BD%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534939/%E7%BB%B3%E7%BD%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    unsafeWindow.version = '1.4.5';
    const CLIENT_ID = "Ov23lifQzV3VA2p4vEmL";
    const CLIENT_SECRET = "b9cab7872c74d1958582676e4393bc112cacee24";
    const OWNER = "claxmo";
    const REPO = "inter-knot";
    let accessToken = localStorage.getItem('access_token');

    const request = async (method, url, data = null, timeout = 5000) => {
         return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Accept": "application/json"
                },
                ...(data && { data: JSON.stringify(data) }),
                timeout,
                onload: (res) => {
                    if (res.status === 401){
                        localStorage.removeItem("access_token");
                        accessToken = null;
                        return authLogin();
                    }else{
                        resolve(JSON.parse(res.responseText));
                    }
                },
                ontimeout: () => reject(new Error('request timeout.')),
                onerror: () => reject(new Error('request error.'))
            });
        });
    };

    const getAccessToken = async (code) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://github.com/login/oauth/access_token",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                data: JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code,
                }),
                onload: (res) => {
                    resolve(JSON.parse(res.responseText).access_token);
                },
                onerror: () => reject(new Error('get access_token error.'))
            });
        });
    };

    const authLogin = () => {
        window.location.href =`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=public_repo`;
    };

    const graphql = async (query, variables) => {
        return await request("POST","https://api.github.com/graphql",{query,variables});
    };

    unsafeWindow.addDiscussionComment = async (discussion_id, body) => {
        return (await graphql(`
          mutation($discussionId: ID!, $body: String!) {
            addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
              comment {
                 id
                 bodyHTML
                 bodyText
                 createdAt
                 updatedAt
                 url
                 author {
                     login
                     avatarUrl
                  }
                }
              }
            }
          }`, { discussionId: discussion_id, body })).data.addDiscussionComment.comment;
    };


    unsafeWindow.getUserProfile = async () => {
        return await request("GET","https://api.github.com/user");
    };

    unsafeWindow.getDiscussions = async (cursor, searchQuery = "") => {
        return (await graphql(`
          query($queryString: String!, $cursor: String) {
            search(type: DISCUSSION, query: $queryString, first: 20, after: $cursor) {
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes {
                ... on Discussion {
                  number
                  id
                  title
                  bodyHTML
                  bodyText
                  createdAt
                  updatedAt
                  upvoteCount
                  url
                  author {
                    login
                    avatarUrl
                  }
                 category {
                    id
                    name
                    emoji
                  }
                }
              }
            }
          }`, {
            queryString: `repo:${OWNER}/${REPO} ${searchQuery}`.trim(),
            cursor
        })).data.search;
    };

    unsafeWindow.getComments = async (discussion_id, cursor = null) => {
        return (await graphql(`
          query($id: ID!, $cursor: String) {
              node(id: $id) {
                  ... on Discussion {
                      comments(first: 20, after: $cursor) {
                          nodes {
                              id
                              bodyHTML
                              bodyText
                              createdAt
                              updatedAt
                              url
                              author {
                                  login
                                  avatarUrl
                              }
                          }
                          totalCount
                          pageInfo {
                              endCursor
                              hasNextPage
                          }
                      }
                  }
              }
          }`, { id: discussion_id, cursor })).data.node.comments;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
        history.replaceState(null, '', window.location.origin + window.location.pathname);
        getAccessToken(code).then((token) => {
            accessToken = token;
            localStorage.setItem('access_token', accessToken);
            // console.log("Access Token：",accessToken);
        });
    }else if(!accessToken){
        authLogin();
    }
})();
