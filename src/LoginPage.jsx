import React, { useEffect, useRef } from 'react';
import { Mail, Lock, LogIn, Apple, Globe } from 'lucide-react';

// --- Animated Shader Background Component ---
const ShaderBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_texCoord;
        float strength = 0.5 + 0.5 * sin(uv.x * 3.0 + u_time * 0.5 + sin(uv.y * 2.0 + u_time * 0.3));
        
        vec3 color1 = vec3(0.058, 0.09, 0.165); // Deep slate
        vec3 color2 = vec3(0.2, 0.3, 0.5);      // Mid blue
        vec3 accent = vec3(0.4, 0.5, 1.0);      // Glow
        
        vec3 finalColor = mix(color1, color2, strength * 0.5);
        finalColor += accent * (0.1 * sin(u_time * 0.8 + uv.y * 5.0));
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId;
    const render = (time) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    render(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />;
};

// --- Main Login Page Component (Fully Mobile-Responsive) ---
const LoginPage = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen w-full overflow-y-auto flex flex-col justify-between items-center px-4 py-6 sm:py-10 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      `}</style>
      
      {/* Background Canvas */}
      <ShaderBackground />

      {/* Main Login Card Container */}
      <div className="relative z-10 w-full max-w-md md:max-w-lg my-auto py-4 sm:py-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl shadow-slate-900/20 border border-slate-100/80 flex flex-col items-center">
          
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
