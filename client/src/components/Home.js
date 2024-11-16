import React, { useState } from 'react'
import toast from 'react-hot-toast';
import uuid from 'react-uuid';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const navigate = useNavigate()
  const generateRoomId = (e) => {
    e.preventDefault()
    const id = uuid()
    setRoomId(id)
    toast.success("Room Id is generated")
  }
  const joinRoom = () => {
    if(!roomId || !username){
      toast.error("ROOM ID AND USERNAME IS REQUIRED")
      return
    }
    navigate(`/editor/${roomId}`,{
      state: {username},
    })
    toast.success("Joined Room")
  }
  return (
    <div className='container-fluid'>
      <div className='row justify-content-center align-items-center min-vh-100'>
        <div className='col-12 col-md-5'>
            <div className='card shadow-sm p-2 mb-5 bg-secondary text-white rounded'>
                  <div className='card-body text-center bg-dark'>
                   <img src="/images/evo.png" alt="logo" className='rounded-circle'/>
                   <h1 className='mt-3'>EVO Real-Time Code</h1>
                   <div className='form-group mt-4 mb-2'>
                        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text" className="form-control mb-2" placeholder="ROOM ID" />
                        
                   </div>
                   <div className='form-group'>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control mb-2" placeholder="USERNAME"/>
                   </div>
                   <button onClick={joinRoom} type="button" className="btn btn-primary btn-lg btn-block">JOIN ROOM</button>
                   <p className='mt-4'>Don't have a room Id?{" "} <span className='text-success p-2 text-bold' style={{cursor:"pointer",fontWeight:"bold"}} onClick={generateRoomId}>Create Room</span></p>
                  </div>  
            </div>
        </div>
        
      </div>

    </div>
  )
}

export default Home
