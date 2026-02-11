import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, logout } from '../services/auth'

export default function Dashboard(){
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() =>{
    async function load(){
      try{
        const p = await getProfile()
        setProfile(p)
      }catch(err){
        console.error('Failed to load profile:', err)
        logout()
        navigate('/login')
      }
    }
    load()
  }, [navigate])

  const handleLogout = () =>{
    logout()
    navigate('/')
  }

  return (
    <div>
      <div className="profile">
        <h2 style={{marginTop:0}}>User Profile</h2>
        {profile ? (
          <>
            <p><strong>ID:</strong> {profile.id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <div>Loading profile...</div>
        )}
      </div>
    </div>
  )
}
