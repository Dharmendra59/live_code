import React, { useRef, useState } from 'react'
import Client from './Client'
import Editor from './Editor'
import { initSocket } from '../socket'
import {Navigate, useLocation,useNavigate, useParams} from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'





const EditorPage = () => {
  const [clients, setClient]  = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef();
  const location = useLocation();
  const {roomId} = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_refused', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));
      socketRef.current.on('Uncaught runtime errors:', (err) => handleErrors(err));

      const handleErrors = (e) => {
        console.log('socket error= ', e);
        toast.error('Socket Connection Failed',e.message);
        navigate('/');
        
      }
      socketRef.current.emit('join',{
        roomId,
        username: location.state?.username,
      });
      socketRef.current.on('joined',({clients, username, socketId}) =>{
        if(username !== location.state?.username) {
          toast.success(`${username} joined`);
          
          
        }
        setClient(clients);
        socketRef.current.emit('sync-code', {
          code: codeRef.current,
          socketId,
        });

      })
      socketRef.current.on('disconnected',({sockedId, username}) =>{
        toast.success(`${username} leave`)
        setClient((prev) =>{
          return prev.filter(
            (client) => client.sockedId != sockedId
          )
        })
      })
    }
    init();
    return () =>{
      socketRef.current.disconnect();
      socketRef.current.off('joined');
      socketRef.current.off('disconnected');
    }
  },[])
  
  if(!location.state){
    return <Navigate to="/"/>
  }

  const copyRoomId = async () =>{
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }

  }
  const leaveRoom = () =>{
    navigate("/");
  }

  return (
    <div>
      <div className='container-fluid vh-100'>
        <div className='row h-100'>
          <div className='col-md-2 bg-dark d-flex flex-column h-100 text-light' style={{boxShadow: "2px 0px 4px rgba(0,0,0,0.1)"}}>
          <img src="/images/evo.png" alt="logo" className='rounded img-fluid mx-auto mt-4' style={{maxHeight:"100px",maxWidth:"200Px"}}/>
          <hr style={{marginTop:"3rem"}}/>
          <div className='d-flex flex-column overflow: auto'>
            Member
            
            {
              clients.map((client) => (
               <Client key={client.sockedId} username={client.username} />
                
              ))  
            }
          </div>
          
          <div className='mt-auto'>
          <hr />
            <button onClick={copyRoomId} className='btn btn-success'>Copy Room Id</button>
            <button onClick={leaveRoom} className='btn btn-danger mt-2 mb-2 px-3 btn-block'>Leave Room</button>
          </div>
          </div>
          <div className='col-md-10 d-flex flex-column h-100 text-light'>
            <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
