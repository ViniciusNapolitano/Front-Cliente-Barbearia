import './App.css'
import { EstadoProvider } from './components/Providers/estado';
import Rotas from './routes'

function App() {
  return (
    <div className="App">
      <EstadoProvider>
        <Rotas />
      </EstadoProvider>
    </div>
  )
}

export default App;
