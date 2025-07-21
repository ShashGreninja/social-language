"use client"

import { getPosts } from '@/actions/post.action';
import { useUser } from '@clerk/nextjs';
// import { Post } from '@prisma/client';
import React, { useState } from 'react'

//we have to create 'Posts' type by ourseleves to make sure we get not only all the features of Posts in db but also _count as it makes Posts a type with the same type as return value of given function getPosts

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number] //makes a type Post which has type of any one element of type Posts

function PostCard({post, dbUserId} : {post: Post; dbUserId: string | null}) {
    const { user } = useUser();
    const [ newComment, setNewComment ] = useState("");
    const [ isCommenting, setIsCommenting ] = useState(false);
    const [ isLiking, setIsLiking ] = useState(false);
    const [ isDeleting, setIsDeleting ] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId));
    //for optimistic updates- UI updated instantly but some operations are still going on behind the scenes
    const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);



    const handleLike = async () => {
        if(isLiking) return;

        try{
            setIsLiking(true);
            setHasLiked(prev => !prev)
            //same as setHasLiked(!hasLiked)
            setOptimisticLikes(prev => prev + ((hasLiked) ? -1 : 1));

            await toggleLike(post.id)
        }
        catch(error){
            setOptimisticLikes(post._count.likes)
            setHasLiked(false)
        }
        finally{
            setIsLiking(false);
        }
    }

  return (
    <div>
      PostCard
    </div>
  )
}

export default PostCard
