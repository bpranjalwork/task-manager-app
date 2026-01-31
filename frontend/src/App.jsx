import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getTasks, createTask, deleteTask, updateTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const refreshData = useCallback(async () => {
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isLoggedIn) refreshData();
  }, [refreshData, isLoggedIn]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    try {
      const res = await axios.post(`http://localhost:5000/${endpoint}`, { email, password });
      if (isRegistering) {
        alert("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Auth failed. Please check credentials.");
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'All' ? true : t.status === filter);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">{isRegistering ? "Sign Up" : "Login"}</h2>
          <input className="w-full p-3 mb-4 border rounded-xl" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full p-3 mb-6 border rounded-xl" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Submit</button>
          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-4 text-blue-600 text-sm underline">
            {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600 uppercase">Task Manager</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-sm font-bold text-slate-500 hover:text-red-500">LOGOUT</button>
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          await createTask({ title, description });
          setTitle(''); setDescription('');
          await refreshData();
        }} className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <input className="w-full p-3 mb-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="w-full p-3 mb-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Task Description" value={description} onChange={e => setDescription(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">ADD TASK</button>
        </form>

        <div className="flex gap-2 mb-6">
          {['All', 'Pending', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center hover:border-blue-200 transition">
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 cursor-pointer accent-blue-600"
                  checked={task.status === 'Completed'} 
                  onChange={async () => {
                    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
                    await updateTask(task.id, newStatus);
                    await refreshData();
                  }} 
                />
                <div className={task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}>
                  <p className="font-bold">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.description}</p>
                </div>
              </div>
              <button 
                onClick={async () => { if(window.confirm("Delete this task?")) { await deleteTask(task.id); await refreshData(); } }} 
                className="text-red-300 hover:text-red-600 text-xs font-bold transition"
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;