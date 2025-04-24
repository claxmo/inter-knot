// ==UserScript==
// @name         绳网跨域助手
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  none
// @author       claxmo
// @run-at       document-start
// @match        http://localhost:8080/*
// @match        https://claxmo.github.io/inter-knot/*
// @connect      github.com
// @connect      api.github.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    const CLIENT_ID = "Ov23lifQzV3VA2p4vEmL";
    const CLIENT_SECRET = "b9cab7872c74d1958582676e4393bc112cacee24";
    const USERNAME = "claxmo";
    const REPO = "inter-knot";
    let accessToken = localStorage.getItem("accessToken");

    const request = async (method, url, data = null) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Accept": "application/json"
                },
                ...(data && { data: JSON.stringify(data) }),
                onload: (res) => {
                    resolve(JSON.parse(res.responseText));
                }
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
                }
            });
        });
    };

    const graphql = async (query, variables) => {
        return await request("POST","https://api.github.com/graphql",{query,variables});
    };

    unsafeWindow.authLogin = () => {
        window.location.href =`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user`;
    };

    unsafeWindow.getUserProfile = async () => {
        return await request("GET","https://api.github.com/user")
    };

    unsafeWindow.getDiscussions = async (cursor) => {
        return await graphql(`query($cursor: String) {
          repository(owner: "${USERNAME}", name: "${REPO}") {
            discussions(first: 20, after: $cursor) {
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes {
                id
                title
                body
                createdAt
                author {
                  login
                  avatarUrl
                }
                comments {
                  totalCount
                }
              }
            }
          }
        }`,{cursor});

    };

    unsafeWindow.getDiscussion = async (discussion_id) => {
        return await graphql(`
          query($id: ID!) {
              node(id: $id) {
                  ... on Discussion {
                      id
                      number
                      title
                      body
                      createdAt
                      author {
                          login
                          avatarUrl
                      }
                      comments {
                          totalCount
                      }
                      repository {
                          name
                        owner {
                              login
                          }
                      }
                  }
              }
         }
      `, { id: discussion_id });
    };

    unsafeWindow.getComments = async (discussion_id, cursor = null) => {
        return await graphql(`
          query($id: ID!, $cursor: String) {
              node(id: $id) {
                  ... on Discussion {
                      comments(first: 10, after: $cursor) {
                          nodes {
                              id
                              body
                              createdAt
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
          }`, { id: discussion_id, cursor });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
        getAccessToken(code).then((token) => {
            accessToken = token;
            localStorage.setItem("accessToken",accessToken);
            // console.log("Access Token：",accessToken);
            history.replaceState(null, '', window.location.origin + window.location.pathname);
        });

    }
})();
