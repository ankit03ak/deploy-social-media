import api from "../apiCalls";

export const getProfilePosts = (username) => {
  if (!username) {
    return Promise.reject({
      response: { data: { message: "Username missing" } }
    });
  }
  return api.get(`/api/posts/profile/${username}`);
};

export const getTimelinePosts = (userId) => {
  if (!userId) {
    return Promise.reject({
      response: { data: { message: "UserId missing" } }
    });
  }
  return api.get(`/api/posts/timeline/${userId}`);
};
export const likePost = (postId, userId) =>
  api.put(`/api/posts/${postId}/like`, { userId });

export const deletePostById = (postId, userId) =>
  api.delete(`/api/posts/${postId}`, { data: { userId } });

export const getUserById = (userId) =>
  api.get(`/api/users?userId=${userId}`);

export const getFriendsByUserId = (userId) =>
  api.get(`/api/users/friends/${userId}`);

export const followUser = (userId, currentUserId) =>
  api.put(`/api/users/${userId}/follow`, { userId: currentUserId });

export const unfollowUser = (userId, currentUserId) =>
  api.put(`/api/users/${userId}/unfollow`, { userId: currentUserId });

export const getConversationsByUser = (userId) =>
  api.get(`/api/conversations/${userId}`);

export const createConversation = (senderId, receiverId) =>
  api.post(`/api/conversations`, {
    senderId,
    receiverId,
  });

export const createPost = (formData) =>
  api.post("/api/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const searchQuery = (query) =>
  api.get(`/api/search?q=${query}`);

export const findConversation = (firstId, secondId) =>
  api.get(`/api/conversations/find/${firstId}/${secondId}`);

export const getUserByUsername = (username) => {
  if (!username) {
    return Promise.reject({
      response: { data: { message: "Username missing" } }
    });
  }
  return api.get(`/api/users?username=${username}`);
};

export const getMessagesByConversation = (conversationId) =>
  api.get(`/api/messages/${conversationId}`);

export const sendMessageApi = (message) =>
  api.post(`/api/messages`, message);