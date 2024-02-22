import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from './DashboardComp/DashSidebar'
import Profile from './DashboardComp/DashProfile'
import DashProfile from './DashboardComp/DashProfile'
import DashPosts from './DashboardComp/DashPosts'
import DashUsers from './DashboardComp/DashUsers'
import DashComments from './DashboardComp/DashComments'
import DashboardComp from './DashboardComp/DashComp'



export default function Dashboard() {
  const location = useLocation()
  const [tab, settab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabfromurl = urlParams.get('tab')
    if (tabfromurl) {
      settab(tabfromurl)
    }
  }, [location.search])


  return (
    <div className='min-h-screen flex flex-col md:flex-row '>
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'comments' && <DashComments />}
      {tab==='dash' && <DashboardComp/>}
    </div>
  )
}
