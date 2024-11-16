import React from 'react'
import Avatar from 'react-avatar'

const Client = ({username}) => {
  return (
    <div className='d-flex align-items-center mb-3'>
      <Avatar name={username.toString()} size="50" round={true} className='mr-2' />
      <span className='mx-2'>{username.toString()}</span>
      
    </div>
  )
}

export default Client
