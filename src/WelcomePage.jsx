import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowRight, PartyPopper } from 'lucide-react';

// --- 3D Background Component ---
const ThreeBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x4f46e5, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Particles Group
    const group = new THREE.Group();
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
    ];
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x4f46e5, shininess: 100 }), // Primary
      new THREE.MeshPhongMaterial({ color: 0x818cf8, shininess: 100 }), // Secondary
      new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 })  // White
    ];

    for (let i = 0; i < 30; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geom, mat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5
      );
      
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.scale.setScalar(Math.random() * 0.5 + 0.2);
      
      // Faster particle velocity for energetic celebratory animation
      mesh.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.04
      );
      mesh.userData.rotSpeed = new THREE.Vector3(
        (Math.random() * 0.02 + 0.02),
        (Math.random() * 0.02 + 0.02),
        (Math.random() * 0.02 + 0.01)
      );
      group.add(mesh);
    }
    scene.add(group);
    camera.position.z = 8;

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      group.children.forEach(child => {
        child.position.add(child.userData.velocity);
        child.rotation.x += child.userData.rotSpeed ? child.userData.rotSpeed.x : 0.03;
        child.rotation.y += child.userData.rotSpeed ? child.userData.rotSpeed.y : 0.03;
        child.rotation.z += child.userData.rotSpeed ? child.userData.rotSpeed.z : 0.01;
        
        if (Math.abs(child.position.x) > 10) child.userData.velocity.x *= -1;
        if (Math.abs(child.position.y) > 10) child.userData.velocity.y *= -1;
        if (child.position.z > 2 || child.position.z < -15) child.userData.velocity.z *= -1;
      });
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#f8f9ff]" />;
};

// --- Main Welcome Page Component (Fully Mobile-Responsive) ---
const WelcomePage = ({ onGoToDashboard }) => {
  return (
    <div className="relative min-h-screen w-full overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      `}</style>
      
      {/* Background 3D Canvas */}
      <ThreeBackground />
      
      {/* UI Overlay Card */}
      <div className="relative z-10 w-full max-w-lg md:max-w-2xl my-auto py-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl shadow-indigo-100/80 border border-white/60 flex flex-col items-center text-center transition-all duration-300">
          
          {/* Celebratory Icon Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0f172a] rounded-full flex items-center justify-center mb-5 sm:mb-7 shadow-lg shadow-indigo-900/20">
            <PartyPopper className="text-white w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          
          {/* Welcome Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-3 sm:mb-4 tracking-tight leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Welcome to <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">Campus Commerce</span>
          </h1>
          
          {/* Welcome Subtext */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-10 max-w-md mx-auto leading-relaxed">
            Your account has been successfully verified. We are thrilled to have you join our platform. Let's start exploring.
          </p>
          
          {/* CTA Action Button */}
          <button 
            onClick={() => onGoToDashboard && onGoToDashboard()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 border-2 border-slate-200 hover:border-indigo-600 bg-white hover:bg-slate-50 rounded-xl font-semibold text-sm sm:text-base text-[#0f172a] shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-95"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
