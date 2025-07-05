import { currentUser } from '@clerk/nextjs/server';
import React from 'react'
import UnauthenticatedSidebar from './UnauthenticatedSidebar';

async function Sidebar() {
    const authUser = await currentUser();
    if(!authUser) return <UnauthenticatedSidebar />
    return (
    <div>
      Sidebar
    </div>
  )
}

export default Sidebar
