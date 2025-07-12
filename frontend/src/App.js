import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css';
import SystemikBoard3D from './components/SystemikBoard3D';

function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <SystemikBoard3D />
      </Canvas>
    </div>
  );
}

export default App;
