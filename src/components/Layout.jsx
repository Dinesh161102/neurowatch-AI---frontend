import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NeuralParticles from './animations/NeuralParticles';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#050B1A] text-white overflow-hidden">
      <NeuralParticles />
      <Sidebar />
      <main className="ml-[280px] relative z-10">
        <Outlet />
      </main>
    </div>
  );
}