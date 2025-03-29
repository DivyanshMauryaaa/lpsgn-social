'use client'

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase";

const page = () => {

    const { user } = useUser();

    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [posts, setPosts] = useState<any[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data, error } = await supabase.from("posts").insert([
            {
                user_id: user?.id,
                content: content,
                image_url: imageUrl,
            },
        ]);

        if (error) {
            console.error("Error creating post:", error);
        } else {
            console.log("Post created:", data);
            fetchPosts(); // Refresh posts after submission
        }
    };

    const fetchPosts = async () => {
        const { data, error } = await supabase.from("posts").select("*").eq("user_id", user?.id);

        if (error) {
            console.error("Error fetching posts:", error);
        } else {
            setPosts(data);
        }
    };

    // Fetch posts on component mount
    useEffect(() => {
        if (user?.id) {
            fetchPosts();
        }
    }, [user?.id]);

    return (
        <div className="p-[32px]">
            <p className="text-2xl font-bold">Profile</p>
            <br /><br />

            <div className="flex">
                <div className="w-[200px] h-[200px] bg-gray-300 rounded-full mr-4">
                    <img src={user?.imageUrl} alt="Profile Picture" className="w-full h-full rounded-full" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xl font-bold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-gray-500">@{user?.username}</p>
                    <p className="mt-2 text-gray-500">Last active: {user?.lastSignInAt?.toLocaleString()}</p>
                </div>
            </div>

            
                    <form onSubmit={handleSubmit} className="mt-8">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your post..."
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Image URL (optional)"
                            className="w-full p-2 border rounded mb-4"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Post
                        </button>
                    </form>

                    <div className="mt-8">
                        <h2 className="text-xl font-bold">Posts</h2>
                        {posts.map((post) => (
                            <div key={post.id} className="p-4 border rounded mb-4">
                                <p>{post.content}</p>
                                {post.image_url && (
                                    <img
                                        src={post.image_url}
                                        alt="Post Image"
                                        className="w-full h-auto mt-2"
                                    />
                                )}
                                <p className="text-gray-500 text-sm">
                                    Likes: {post.likes} | Comments: {post.comments}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
    );
}

export default page;