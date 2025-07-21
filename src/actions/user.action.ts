"use server";
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
//purpose is to connect clerk auth to neon db on cloud
import React from 'react'

export async function syncUser() {
  try{
    const {userId} = await auth();
    const user = await currentUser();

    if(!userId || !user) return;

    //check if user already exists
    const existingUser = await prisma.user.findUnique({
        where:{
            clerkId: userId,
        }
    });

    const dbUser = await prisma.user.create({
        data:{
            clerkId:userId,
            name:`${user.firstName||""} ${user.lastName || ""}`,
            username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
            //if username is null then fill it with first part of first email address b4 "@"
            ,
            email: user.emailAddresses[0].emailAddress,
            image: user.imageUrl,
        }
    })

    return dbUser
  }
  catch(error){
    console.log("Error in syncUser", error)
  }
}

export async function getUserByClerkId(clerkId : string){
  return prisma.user.findUnique(
    {
      where : {
        clerkId: clerkId, //we can also just write clerkId in this case
      },
      include:{ //write which relations to include as well
        _count:{
          select : {
            followers : true,
            following : true,
            posts : true,
          }
        }
      }
    }
  )
}

export async function getDbUserId(){
  const {userId : clerkId} = await auth();
  if(!clerkId) throw new Error("Unauthorized");

  const user = await getUserByClerkId(clerkId);

  if(!user) throw new Error("User not found");

  return user.id
}

export async function getRandomUsers(){
  try{
    const userId = await getDbUserId();

    //get 3 random users excluding ourselves & users we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND:[ //2 condns to and
          {NOT:{id:userId}},
          {
            NOT:{
              followers:{
                //followers field of fetched user shouldnt be same as current user id
                some:{
                  followerId: userId
                }
              }
            }
          }
        ]
      },
      select:{
        id: true,
        name: true,
        username: true,
        image: true,
        _count:{
          select:{
            followers: true,
          }
        }
      },
      take:3,
    })

    return randomUsers;
  }
  catch(error){
    console.log("Error fetching random users", error);
    return [];
  }
}