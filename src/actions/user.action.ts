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
