import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { validateEmail, validatePassword } from '../utils/validators';

export default function Register(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!validateEmail(form.email)) return setError('Invalid email')
    if (!validatePassword(form.password)) return setError('Password must be at least 8 characters')

    try {
      await register(form.email, form.password)
      setSuccess('Registration successful. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err?.message || 'Registration failed')
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      {success && <div style={{color:'green'}}>{success}</div>}
    </div>
  )
}
