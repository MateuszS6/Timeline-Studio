import { useEffect } from 'react'
import { supabase } from './config/supabase'
import './App.css'

function App() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from("projects").select("*");
      console.log(data);
      console.log(error);
    }

    testConnection();
  }, [])

  return (
    <h1>Marvel Timelines</h1>
    
  )
}

export default App;