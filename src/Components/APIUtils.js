import { API_BASE_URL, ACCESS_TOKEN } from "./constants";

const request = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};
const responseFile = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.blob().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};
const requestFile = (options) => {
  const headers = new Headers({});

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options);
};
export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET",
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function getPost(pageRequest) {
  return request({
    url: API_BASE_URL + "/post?number="+pageRequest,
    method: "GET",
  });
}
export function getOnePost(postRequest) {
  return request({
    url: API_BASE_URL + "/post/board?id=" + postRequest,
    method: "GET",
  });
}

export function uploadPost(postRequest) {
  return request({
    url: API_BASE_URL + "/post/upload",
    method: "POST",
    body: JSON.stringify(postRequest),
  });
}

export function uploadFileTest(postRequest) {
  return requestFile({
    url: API_BASE_URL + "/post/upload/testfiles",
    method: "POST",
    body: postRequest,
  });
}

export function deletePost(postRequest) {
  return request({
    url: API_BASE_URL + "/post/delete",
    method: "POST",
    body: JSON.stringify(postRequest),
  });
}
export function loadComment(commentRequest) {
  return request({
    url: API_BASE_URL + "/comment/load?id=" + commentRequest,
    method: "GET",
  });
}

export function setComment(commentRequest) {
  return request({
    url: API_BASE_URL + "/comment/insert",
    method: "POST",
    body: JSON.stringify(commentRequest),
  });
}
export function deleteComment(deleteRequest) {
  return request({
    url: API_BASE_URL + "/comment/delete",
    method: "POST",
    body: JSON.stringify(deleteRequest),
  });
}
export function editPost(editRequest) {
  return request({
    url: API_BASE_URL + "/post/edit",
    method: "POST",
    body: JSON.stringify(editRequest),
  });
}

export function loadImage(imageRequest) {
  return responseFile({
    url: API_BASE_URL + "/image/" + imageRequest,
    method: "GET",
  });
}

export function setLike(likeRequest) {
  return request({
    url: API_BASE_URL + "/post/like",
    method: "POST",
    body: JSON.stringify(likeRequest)
  });
}

export function setDisLike(dislikeRequest) {
  return request({
    url:API_BASE_URL + "/post/dislike",
    method: "POST",
    body: JSON.stringify(dislikeRequest)
  });
}

export function getLike(likeRequest) {
  return request({
    url: API_BASE_URL + "/post/likes/user?id="+likeRequest,
    method: "GET",
  });
}
export function getDisLike(dislikeRequest) {
  return request({
    url: API_BASE_URL+ "/post/dislikes/user?id="+dislikeRequest,
    method:"GET",
  });
}