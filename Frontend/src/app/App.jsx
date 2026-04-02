import React from 'react'
import './App.css';
import { Editor } from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

const App = () => {

  const editorRef = useRef(null);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  });
  const [users, setUsers] = useState([]);

  const yDoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => yDoc.getText("monaco"), [yDoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current])
    );
  }

  const handleJoin = (e) => {
    e.preventDefault();
    setUsername(e.target.username.value);
    window.history.pushState({}, "", "?username=" + e.target.username.value);
  }

  useEffect(() => {
    if (username) {
      const provider = new SocketIOProvider("/", "monaco", yDoc, {    //change the server URL to / if the frontend and backend are served from the same origin for production, otherwise use the backend server URL (e.g., http://localhost:3000) for development
        autoConnect: true
      });

      provider.awareness.setLocalStateField("user", { username });

      provider.awareness.on("change", () => {
        const states = Array.from(provider.awareness.getStates().values());
        setUsers(states.filter(state => state.user && state.user.username).map(state => state.user));
      });

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null);
      }

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        provider.disconnect();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    }
  }, [username])

  if (!username) {
    return (
      <main className='h-screen w-full flex bg-linear-to-br from-gray-950 via-blue-950 to-gray-900 p-4 gap-4 items-center justify-center overflow-hidden'>
        {/* Animated background elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
          <div className='absolute -bottom-8 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
        </div>

        {/* Card */}
        <div className='relative z-10 flex flex-col gap-8 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-10 w-full max-w-md shadow-2xl'>
          {/* Header */}
          <div className='flex flex-col gap-3'>
            <div className='text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
              Code<span className='text-[#f35b04]'>Weave</span>
            </div>
            <p className='text-gray-400 text-sm'>Join a collaborative coding session</p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="username" className='text-gray-200 font-semibold text-sm tracking-wide'>Username</label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-blue-400'>👤</span>
                <input
                  type="text"
                  id='username'
                  name='username'
                  required
                  placeholder='Enter your name'
                  className='w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300'
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 flex items-center justify-center gap-2'
            >
              <span>✨</span>
              Join Room
            </button>
          </form>

          {/* Footer */}
          <div className='text-center'>
            <p className='text-gray-500 text-xs'>Share this session code with your teammates</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='h-screen w-full flex bg-gray-950 p-4 gap-4'>
      <aside className='h-full w-1/4 bg-[#e3d5ca] rounded-lg'>
        <h2 className='text-2xl font-bold p-4 border-b border-gray-400'>Connected Users</h2>
        <ul className='mt-5'>
          {users.map((user, index) => (
            <li key={index} className='p-2 bg-[#e55400] text-white mx-7 mb-2 rounded'>
              {user.username}
            </li>
          ))}
        </ul>
      </aside>
      <section className='w-3/4 bg-neutral-800 rounded-lg overflow-hidden'>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Write your code here"
          theme='vs-dark'
          fontSize={18}
          onMount={handleMount}
        />
      </section>
    </main>
  )
}

export default App;