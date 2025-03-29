'use client'
import { useEffect, useState } from "react";
import supabase from "@/supabase";
import { ArrowBigRightDash, Heart, MessageCircle } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<{ [key: string]: any }>({});

  // Fetch Posts
  const fetchPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*");

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchPosts();

    // 🔴 REALTIME UPDATES FOR LIKES
    const subscription = supabase
      .channel("posts_changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts" }, (payload) => {
        console.log("Realtime update:", payload);
        setPosts((prev) =>
          prev.map((post) => (post.id === payload.new.id ? { ...post, likes: payload.new.likes } : post))
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Fetch user info (if not cached)
  const fetchUser = async (userId: string) => {
    if (users[userId]) return;

    try {
      const res = await fetch(`/api/get_users?userId=${userId}`);
      const text = await res.text();

      if (text.startsWith("<")) {
        console.error("API returned HTML:", text);
        return;
      }

      const userData = JSON.parse(text);
      setUsers((prev) => ({ ...prev, [userId]: userData }));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    posts.forEach((post) => fetchUser(post.user_id));
  }, [posts]);

  // ✅ Optimistic Like Toggle
  const toggleLike = async (postId: string, userId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + (post.likedByUser ? -1 : 1), likedByUser: !post.likedByUser }
          : post
      )
    );

    // Check if user has already liked
    const { data } = await supabase.from("likes").select("id").eq("post_id", postId).eq("user_id", userId);

    if (data?.length) {
      // Unlike
      await supabase.from("likes").delete().match({ post_id: postId, user_id: userId });
      await supabase.rpc("decrement_likes", { post_id_input: postId });
    } else {
      // Like
      await supabase.from("likes").insert([{ post_id: postId, user_id: userId }]);
      await supabase.rpc("increment_likes", { post_id_input: postId });
    }
  };

  return (
    <div className="p-[32px]">
      <p className="text-2xl font-bold">Your Feed</p>
      <br />

      <div className="md:ml-5 md:flex">
        {/* Left Side */}
        <div className="md:w-[800px] p-4 sm:w-screen">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 mb-4 rounded shadow-sm border">
              <h2 className="text-md text-gray-400 flex gap-2">
                <img src={users[post.user_id]?.profileImageUrl} className="h-[32px] w-[32px] rounded-full" />
                @{users[post.user_id]?.username || "Loading..."}
              </h2>

              {post.image_url && (
                <img src={post.image_url} alt="Post Image" className="mt-2 w-full h-[280px] rounded" />
              )}

              {post.image_url ? <br /> : ""}

              <p className="text-lg">{post.content}</p>

              <br />

              <div className="flex gap-2">
                <button
                  className={`hover:text-red-600 ${post.likedByUser ? "text-red-600" : ""}`}
                  onClick={() => toggleLike(post.id, post.user_id)}
                >
                  <Heart size={20} /> &nbsp; {post.likes}
                </button>
                <button className="hover:text-blue-600">
                  <MessageCircle size={20} />
                </button>
                <button className="hover:text-blue-600">
                  <ArrowBigRightDash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
