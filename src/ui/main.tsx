import React from 'react'
import ReactDom from 'react-dom/client'

function App(){
    return (
        <div style={{position:'absolute', top:20, left:20}}>
            <h1>React + WebGPU</h1>
            <button onClick={() => alert('Hello from react!')}>Clieck Me!</button>
        </div>
    )
}

ReactDom.createRoot(document.getElementById('ui-root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)