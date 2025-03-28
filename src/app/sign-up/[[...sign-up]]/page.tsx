'use client'

import { SignUp, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import supabase from '@/supabase';

export default function Page() {
  const { isSignedIn, user } = useUser();

  async function syncUserToSupabase() {
    if (!user) return; // If no user, do nothing

    const { id, emailAddresses, username, imageUrl, createdAt } = user;

    // Check if user already exists in Supabase
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (data) return; // If user exists, stop here

    // Insert new user into Supabase
    await supabase.from('users').insert(
      {
        id: id,
        email: emailAddresses[0]?.emailAddress,
        username: username,
        profile_pic: imageUrl,
        joined: createdAt ? new Date(createdAt) : null,
        follower_count: 0,
        following_count: 0,
        posts_count: 0,
        followers: [],
        following: [],
        close_friends: [],
        saved_posts: [],
        saved_groups: [],
        notifications: [],
        status: null,
        badge: null
      }
    );
  }

  return (
    <div className='ml-[150%]'>
      <SignUp />
    </div>
  );
}
