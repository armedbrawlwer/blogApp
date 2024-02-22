import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from './CallToAction'
import PostCard from './PostCard'

function Home() {
  const [posts, setPosts] = useState([])
  console.log(posts)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts')
        const data = await res.json()
        if (res.ok) {
          setPosts(data.posts)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchPosts()
  }, [])
  return (
    <div>
      <div className='flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>Here yopu will find variety iof articles such as web development,
          software engineering and programming languages</p>
        <Link to='/search' className='text-xs text-teal-500 font-bold hover:underline sm:text-sm'>View all posts</Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          posts && posts.length>0 && (
            <div className='flex flex-col gap-4'>
              <h2 className='text-2xl font-semibold text-center mb-3'>Recent Posts</h2>
              <div className='flex flex-wrap gap-2 w-11/12  '>
                {
                  posts.map((post)=>(
                    <PostCard key={post._id} post={post}/>
                  ))
                }
              </div>
              <Link to='/search' className='text-lg text-teal-500 hover:underline text-center'>View all posts</Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home