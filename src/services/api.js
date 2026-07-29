import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import { TaskPulse } from "cronflex";

const dbWriteQueue = new TaskPulse({
  concurrency: 1, // Only 1 write to MongoDB at a time to prevent race conditions
  rateMax: 5,     // Limit rate of writes
  rateWindow: 1000,
});

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const subscribeToLoading = (callback) => {
  return () => {};
};

const defaultFallbackDB = {
  users: [
    {
      _id: "u1",
      name: "Guest User",
      email: "guest@example.com",
      password: "password",
      dateOfBirth: "1995-01-01",
      gender: "male",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
    },
    {
      _id: "u_admin",
      name: "Admin User",
      email: "admin@example.com",
      password: "password",
      dateOfBirth: "1990-01-01",
      gender: "male",
      photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200"
    }
  ],
  posts: []
};

// Helper to initialize and retrieve mock database
const fetchMockDB = async () => {
  try {
    const response = await fetch("/local-db-api");
    if (!response.ok) throw new Error("Failed to fetch database");
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch database from MongoDB", e);
    return defaultFallbackDB;
  }
};

const saveMockDB = async (db) => {
  return new Promise((resolve, reject) => {
    dbWriteQueue.add(
      {
        id: `save-db-${Date.now()}`,
        priority: 1
      },
      async () => {
        try {
          const response = await fetch("/local-db-api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(db, null, 2),
          });
          if (!response.ok) throw new Error("Failed to save database");
          resolve();
        } catch (e) {
          console.error("Could not sync database to MongoDB", e);
          reject(e);
        }
      }
    );
  });
};

const getCurrentUser = (db) => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  const userId = token.replace("fake-token-", "");
  return db.users.find(u => u._id === userId) || null;
};

const fileToDataURL = (file) => {
  return new Promise((resolve) => {
    if (!file || !(file instanceof File || file instanceof Blob)) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 600; // Resize to a max dimension of 600px to keep file tiny

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to highly compressed JPEG (0.6 quality)
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.onerror = () => {
        resolve(event.target.result); // Fallback to raw base64 if image load fails
      };
    };
    reader.onerror = () => {
      resolve(null);
    };
  });
};

// Router function to process calls locally
const handleMockRequest = async (method, url, data) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const db = await fetchMockDB();
  const currentUser = getCurrentUser(db);
  
  const normalizedUrl = url.startsWith("/") ? url.slice(1) : url;
  const cleanUrl = normalizedUrl.split("?")[0];

  // Helper to extract ID from endpoint like "posts/id" or "comments/id"
  const getUrlId = (prefix) => {
    if (normalizedUrl.startsWith(prefix)) {
      return normalizedUrl.replace(prefix, "");
    }
    return null;
  };

  // 1. SIGNIN
  if (cleanUrl === "users/signin" && method.toLowerCase() === "post") {
    const { email, password } = data || {};
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const token = `fake-token-${user._id}`;
    return { message: "success", token, user };
  }

  // 2. SIGNUP
  if (cleanUrl === "users/signup" && method.toLowerCase() === "post") {
    const { name, email, password, dateOfBirth, gender } = data || {};
    if (db.users.some(u => u.email === email)) {
      throw new Error("Email already exists");
    }
    const newUser = {
      _id: `u_${Date.now()}`,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      photo: ""
    };
    db.users.push(newUser);
    await saveMockDB(db);
    return { message: "success", user: newUser };
  }

  // 3. PROFILE DATA
  if (cleanUrl === "users/profile-data" && method.toLowerCase() === "get") {
    if (!currentUser) throw new Error("Unauthorized");
    return { message: "success", user: currentUser };
  }

  // 4. UPLOAD PHOTO
  if (cleanUrl === "users/upload-photo" && method.toLowerCase() === "put") {
    if (!currentUser) throw new Error("Unauthorized");
    let photoUrl = currentUser.photo;
    if (data instanceof FormData && data.has("photo")) {
      const photoFile = data.get("photo");
      const dataUrl = await fileToDataURL(photoFile);
      if (dataUrl) photoUrl = dataUrl;
    }
    
    // Update user profile pic in db
    db.users = db.users.map(u => u._id === currentUser._id ? { ...u, photo: photoUrl } : u);
    
    // Update creator profile pic in all their posts and comments
    db.posts = db.posts.map(post => {
      let updatedPost = { ...post };
      if (post.user._id === currentUser._id) {
        updatedPost.user = { ...post.user, photo: photoUrl };
      }
      if (post.comments) {
        updatedPost.comments = post.comments.map(c => 
          c.commentCreator._id === currentUser._id 
            ? { ...c, commentCreator: { ...c.commentCreator, photo: photoUrl } } 
            : c
        );
      }
      return updatedPost;
    });

    await saveMockDB(db);
    return { message: "success", user: { ...currentUser, photo: photoUrl } };
  }

  // 4.5 UPDATE PROFILE (BIO AND BANNER) (PUT users/update-profile)
  if (cleanUrl === "users/update-profile" && method.toLowerCase() === "put") {
    if (!currentUser) throw new Error("Unauthorized");
    const { bio, banner } = data || {};
    db.users = db.users.map(u => 
      u._id === currentUser._id 
        ? { ...u, bio: bio !== undefined ? bio : u.bio, banner: banner !== undefined ? banner : u.banner } 
        : u
    );
    await saveMockDB(db);
    const updatedUser = db.users.find(u => u._id === currentUser._id);
    return { message: "success", user: updatedUser };
  }

  // 5. CHANGE PASSWORD
  if (cleanUrl === "users/change-password" && method.toLowerCase() === "patch") {
    if (!currentUser) throw new Error("Unauthorized");
    const { password } = data || {};
    db.users = db.users.map(u => u._id === currentUser._id ? { ...u, password } : u);
    await saveMockDB(db);
    return { message: "success" };
  }

  // 6. GET ALL POSTS OR GET USER POSTS
  if (cleanUrl === "posts" && method.toLowerCase() === "get") {
    return { message: "success", posts: db.posts };
  }

  // GET USER POSTS (e.g. users/userId/posts)
  if (normalizedUrl.startsWith("users/") && normalizedUrl.endsWith("/posts") && method.toLowerCase() === "get") {
    const parts = normalizedUrl.split("/");
    const userId = parts[1];
    const userPosts = db.posts.filter(p => p.user._id === userId);
    return { message: "success", posts: userPosts };
  }

  // 7. GET POST BY ID
  const postIdForGet = getUrlId("posts/");
  if (postIdForGet && method.toLowerCase() === "get") {
    const post = db.posts.find(p => p._id === postIdForGet);
    if (!post) throw new Error("Post not found");
    return { message: "success", post };
  }

  // 8. CREATE POST
  if (cleanUrl === "posts" && method.toLowerCase() === "post") {
    if (!currentUser) throw new Error("Unauthorized");
    let body = "";
    let imageFile = null;
    let imageUrl = "";

    if (data instanceof FormData) {
      body = data.get("body") || "";
      imageFile = data.get("image");
    } else {
      body = data.body || "";
      imageFile = data.image;
    }

    if (imageFile) {
      imageUrl = await fileToDataURL(imageFile);
    }

    const newPost = {
      _id: `p_${Date.now()}`,
      body,
      image: imageUrl,
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        photo: currentUser.photo
      },
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };

    db.posts.unshift(newPost);
    await saveMockDB(db);
    return { message: "success", post: newPost };
  }

  // 9. UPDATE POST
  const postIdForPut = getUrlId("posts/");
  if (postIdForPut && method.toLowerCase() === "put") {
    if (!currentUser) throw new Error("Unauthorized");
    let body = "";
    let imageFile = null;
    let keepExistingImage = true;

    if (data instanceof FormData) {
      body = data.get("body") || "";
      imageFile = data.get("image");
      keepExistingImage = !data.has("image");
    } else {
      body = data.body || "";
      imageFile = data.image;
      keepExistingImage = data.image === undefined;
    }

    db.posts = await Promise.all(db.posts.map(async (p) => {
      if (p._id === postIdForPut) {
        if (p.user._id !== currentUser._id) throw new Error("Forbidden");
        let imageUrl = p.image;
        if (!keepExistingImage) {
          imageUrl = imageFile ? await fileToDataURL(imageFile) : "";
        }
        return {
          ...p,
          body: body || p.body,
          image: imageUrl
        };
      }
      return p;
    }));

    await saveMockDB(db);
    const updatedPost = db.posts.find(p => p._id === postIdForPut);
    return { message: "success", post: updatedPost };
  }

  // 10. DELETE POST
  const postIdForDelete = getUrlId("posts/");
  if (postIdForDelete && method.toLowerCase() === "delete") {
    if (!currentUser) throw new Error("Unauthorized");
    const postToDelete = db.posts.find(p => p._id === postIdForDelete);
    if (postToDelete && postToDelete.user._id !== currentUser._id) {
      throw new Error("Forbidden");
    }
    db.posts = db.posts.filter(p => p._id !== postIdForDelete);
    await saveMockDB(db);
    return { message: "success" };
  }

  // 11. LIKE POST (PATCH posts/:id)
  const postIdForLike = getUrlId("posts/");
  if (postIdForLike && method.toLowerCase() === "patch") {
    if (!currentUser) throw new Error("Unauthorized");
    db.posts = db.posts.map(p => {
      if (p._id === postIdForLike) {
        const likes = p.likes || [];
        const index = likes.findIndex(l => (typeof l === 'object' ? l.user : l) === currentUser._id);
        const newLikes = index === -1 ? [...likes, { user: currentUser._id }] : likes.filter((_, idx) => idx !== index);
        return { ...p, likes: newLikes };
      }
      return p;
    });
    await saveMockDB(db);
    const updatedPost = db.posts.find(p => p._id === postIdForLike);
    return { message: "success", post: updatedPost };
  }

  // 12. CREATE COMMENT
  if (cleanUrl === "comments" && method.toLowerCase() === "post") {
    if (!currentUser) throw new Error("Unauthorized");
    const { post: postId, content } = data || {};
    const newComment = {
      _id: `c_${Date.now()}`,
      content,
      commentCreator: {
        _id: currentUser._id,
        name: currentUser.name,
        photo: currentUser.photo
      },
      createdAt: new Date().toISOString()
    };

    db.posts = db.posts.map(p => {
      if (p._id === postId) {
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    });

    await saveMockDB(db);
    return { message: "success", comment: newComment };
  }

  // 13. UPDATE COMMENT (PUT comments/:id)
  const commentIdForPut = getUrlId("comments/");
  if (commentIdForPut && method.toLowerCase() === "put") {
    if (!currentUser) throw new Error("Unauthorized");
    const { content } = data || {};
    db.posts = db.posts.map(p => {
      if (p.comments) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c._id === commentIdForPut) {
              if (c.commentCreator._id !== currentUser._id) throw new Error("Forbidden");
              return { ...c, content };
            }
            return c;
          })
        };
      }
      return p;
    });
    await saveMockDB(db);
    return { message: "success" };
  }

  // 14. DELETE COMMENT (DELETE comments/:id)
  const commentIdForDelete = getUrlId("comments/");
  if (commentIdForDelete && method.toLowerCase() === "delete") {
    if (!currentUser) throw new Error("Unauthorized");
    db.posts = db.posts.map(p => {
      if (p.comments) {
        return {
          ...p,
          comments: p.comments.filter(c => {
            if (c._id === commentIdForDelete) {
              if (c.commentCreator._id !== currentUser._id) throw new Error("Forbidden");
              return false;
            }
            return true;
          })
        };
      }
      return p;
    });
    await saveMockDB(db);
    return { message: "success" };
  }

  throw new Error(`Endpoint mock handler not found for: ${method} ${url}`);
};


export const useApiQuery = (key, url, options = {}) => {
  const queryKey = Array.isArray(key) ? key : [key];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      return handleMockRequest("get", url, null);
    },
    ...options,
  });
};

export const useApiMutation = (method, url, options = {}) => {
  const queryClient = useQueryClient();
  const { skipLoading = false, ...restOptions } = options;

  return useMutation({
    mutationFn: async (data) => {
      const finalUrl = typeof url === 'function' ? url(data) : url;
      return handleMockRequest(method, finalUrl, data);
    },
    onSuccess: (data, variables, context) => {
      if (restOptions.invalidateQueries) {
        queryClient.invalidateQueries(restOptions.invalidateQueries);
      }
      restOptions.onSuccess?.(data, variables, context);
      if (restOptions.successMessage) {
        toast.success(restOptions.successMessage);
      }
    },
    onError: (error, variables, context) => {
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast.error(errorMsg);
      restOptions.onError?.(errorMsg, variables, context);
    },
    ...restOptions,
  });
};

export { http };

