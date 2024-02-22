import { Alert, Button, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'
import { Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const navigate = useNavigate()
    const [comments, setComments] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)
    console.log(comments)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await fetch('/api/comment/createComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setComment('');
                setCommentError(null);
                setComments([data, ...comments]);
            }
        } catch (error) {
            setCommentError(error.message);
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data)
                }
            } catch (e) {
                console.log(e)
                setCommentError(e)
            }
        }
        getComments()
    }, [postId])


    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            });
            if (res.ok) {
                const data = await res.json();
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                likes: data.likes,
                                numberOfLikes: data.likes.length,
                            }
                            : comment
                    )
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) =>
                c._id === comment._id ? ({ ...c, content: editedContent }) : c)
        )
    }

    const handleDelete = async (commentId) => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: "DELETE"
            })
            if (res.ok) {
                setComments(
                    comments.filter((c) =>
                        c._id !== commentId)
                )
                setShowModal(false)
                setCommentToDelete(null)
            }
        } catch (e) {
            console.log(e)
        }
    }



    return (
        <div className=' max-w-3xl mx-auto  w-full '> {
            currentUser ? (
                <div className='flex  items-center my-5  gap-1'>
                    <p>
                        signed in as:
                    </p>
                    <img className=' w-5 h-5 rounded-full object-cover' src={currentUser.profilePicture
                    } />
                    <Link to='/dashboard?tab=profile' className='text-sm text-cyan-400 hover:underline'>
                        @{currentUser.username}</Link>
                </div>
            ) : (
                <Link to='/sign-in'>
                    sign in to comment</Link>
            )
        }
            {
                currentUser &&
                (<form className='w-full max-w-2xl border border-teal-200 rounded-md p-3'
                    onSubmit={handleSubmit}>
                    <Textarea placeholder='Add a comment'
                        rows='3'
                        maxLength='200'
                        onChange={(e) => { setComment(e.target.value) }}
                        value={comment} />
                    <div className='flex justify-between mt-5 gap-5 items-center'>
                        <p className='text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
                        <Button outline type='submit'>
                            Submit
                        </Button>
                    </div>
                    {commentError && (<Alert color='failure'>{commentError}</Alert>)}

                </form>)}

            {comments.length === 0 ? (<div> no post yet</div>) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>comments</p>
                        <div className='border border-gray-200 py-1 px-2 rounded-sm'  >
                            {comments.length}
                        </div>
                    </div>
                    {comments.map((comment) => (
                        <Comment key={comment._id}
                            comment={comment}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDelete={(commentId) => {
                                setShowModal(true)
                                setCommentToDelete(commentId)
                            }}
                        />
                    ))}
                </>
            )}
            <Modal show={showModal} popup size='md' onClose={() => setShowModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your comment?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={() => handleDelete(commentToDelete)}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    )
}
