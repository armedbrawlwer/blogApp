import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { Button, Textarea } from 'flowbite-react'
import { useSelector } from 'react-redux'

export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const { currentUser } = useSelector((state) => state.user)
    const [editedContent, setEditedContent] = useState(comment.content)
    const [user, setUser] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                }
            }
            catch (e) {
                console.log(e)
            }
        }
        getUser()
    }, [comment])

    const handleEdit = async () => {
        setIsEditing(true)
        setEditedContent(comment.content)
        try {

        } catch (e) {

        }
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    content: editedContent
                })
            })
            if (res.ok) {
                setIsEditing(false)
                onEdit(comment, editedContent)
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img
                    className='w-10 h-10 rounded-full bg-gray-200'
                    src={user.profilePicture}
                    alt={user.username}
                />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>
                        {user ? `@${user.username}` : 'anonymous user'}
                    </span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {
                    isEditing ? (
                        <>
                            <Textarea className='mb-2'
                                onChange={(e) => { setEditedContent(e.target.value) }}
                                value={editedContent} />
                            <div className='flex gap-2 items-center justify-end text-xs'>
                                <Button onClick={handleSave}
                                    type='button' size='sm' gradientDuoTone='purpleToBlue'>
                                    save
                                </Button>
                                <Button onClick={() => setIsEditing(false)}
                                    type='button' size='sm' outline gradientDuoTone='purpleToBlue'>
                                    cancel
                                </Button>
                            </div>
                        </>



                    ) : (
                        <>
                            <p className='text-gray-500 pb-2'>{comment.content}</p>
                            <div className='flex items-center pt-2 gap-2 text-xs border-t dark:border-gray-700 max-w-fit '>
                                <button type='button' onClick={() => onLike(comment._id)}
                                    className={`text-gray-400 hover:text-blue-500 ${currentUser &&
                                        comment.likes.includes(currentUser._id) &&
                                        '!text-blue-500'
                                        }`}>
                                    <FaThumbsUp className='text-sm' />
                                </button>
                                <p className='text-gray-400'>
                                    {comment.numberOfLikes > 0 &&
                                        comment.numberOfLikes +
                                        ' ' +
                                        (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                                </p>
                                {
                                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin)
                                    &&
                                    (
                                        <>
                                            <button type='button' className='text-gray-400
                                        hover:text-red-200' onClick={handleEdit}>
                                                Edit
                                            </button>
                                            <button type='button' className='text-gray-400
                                     hover:text-red-500' onClick={() => onDelete(comment._id)}>
                                                delete
                                            </button>
                                        </>

                                    )
                                }
                            </div>
                        </>
                    )
                }

            </div >
        </div >
    )
}
