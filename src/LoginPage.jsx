import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Mail, Lock, LogIn, Apple, Globe } from 'lucide-react';

// --- 3D Background Component (matching WelcomePage) ---
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
      new THREE.MeshPhongMaterial({ color: 0x4f46e5, shininess: 100 }), // Primary Indigo
      new THREE.MeshPhongMaterial({ color: 0x818cf8, shininess: 100 }), // Secondary Light Indigo
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
      
      mesh.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.02
      );
      mesh.userData.rotSpeed = new THREE.Vector3(
        (Math.random() * 0.02 + 0.01),
        (Math.random() * 0.02 + 0.01),
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
        child.rotation.x += child.userData.rotSpeed ? child.userData.rotSpeed.x : 0.02;
        child.rotation.y += child.userData.rotSpeed ? child.userData.rotSpeed.y : 0.02;
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

// --- Main Login Page Component (Fully Mobile-Responsive) ---
const LoginPage = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen w-full overflow-y-auto flex flex-col justify-between items-center px-4 py-6 sm:py-10 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      `}</style>
      
      {/* Background 3D Canvas */}
      <ThreeBackground />

      {/* Main Login Card Container */}
      <div className="relative z-10 w-full max-w-md md:max-w-lg my-auto py-4 sm:py-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl shadow-indigo-100/80 border border-white/80 flex flex-col items-center">
          
          {/* Brand Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f172a] mb-1.5 sm:mb-2 text-center font-['Plus_Jakarta_Sans',sans-serif]">
            Campus <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">Commerce</span>
          </h1>
          
          <p className="text-slate-500 mb-6 sm:mb-8 text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
            Sign in to your account
          </p>

          {/* Form */}
          <form
            className="w-full space-y-4 sm:space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (onLogin) onLogin();
            }}
          >
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-700 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  defaultValue="student@campus.edu"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-mono text-slate-700 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs sm:text-sm text-slate-600 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#4f46e5] text-white py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg hover:bg-[#4338ca] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/25 cursor-pointer active:scale-[0.99]"
            >
              <span>Login</span>
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="w-full my-6 sm:my-7 flex items-center gap-4 text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] sm:text-xs uppercase font-mono tracking-wider">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social Buttons */}
          <div className="w-full grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => onLogin && onLogin()}
              className="flex items-center justify-center gap-2 py-2.5 sm:py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-xs sm:text-sm cursor-pointer active:scale-[0.99]"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => onLogin && onLogin()}
              className="flex items-center justify-center gap-2 py-2.5 sm:py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-xs sm:text-sm cursor-pointer active:scale-[0.99]"
            >
              <Apple className="w-4 h-4" />
              <span>Apple</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-600 font-medium text-center">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-indigo-600 font-bold hover:underline cursor-pointer ml-1"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-lg md:max-w-4xl px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2 text-center">
        <p>© 2026 CampusCommerce. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <button type="button" className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy Policy</button>
          <button type="button" className="hover:text-indigo-600 transition-colors cursor-pointer">Terms of Service</button>
          <button type="button" className="hover:text-indigo-600 transition-colors cursor-pointer">Help Center</button>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;

