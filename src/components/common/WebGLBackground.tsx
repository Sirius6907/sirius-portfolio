"use client";

import { useEffect, useRef, useState } from "react";

const VERTEX_SHADER_SOURCE = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;

  // Japanese Dark Fantasy Palette Colors
  const vec3 COLOR_VOID = vec3(0.012, 0.012, 0.012); // #030303
  const vec3 COLOR_CRIMSON = vec3(0.72, 0.14, 0.16); // #B8252A
  const vec3 COLOR_AMBER = vec3(0.91, 0.65, 0.35);   // #E8A859
  const vec3 COLOR_CORAL = vec3(0.91, 0.29, 0.23);   // #E94B3C
  const vec3 COLOR_GOLD = vec3(0.98, 0.81, 0.45);    // Warm Gold

  // Rotation matrix
  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  // Smooth minimum for organic blending
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // 3D Noise for organic surface deformation
  float hash(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z
    );
  }

  // Capsule shape SDF (Igloo style capsule container)
  float sdCapsule(vec3 p, float h, float r) {
    p.y -= clamp(p.y, -h, h);
    return length(p) - r;
  }

  // Morphing liquid core blob
  float sdCore(vec3 p) {
    // Morphing sphere
    float sphere = length(p) - 0.75;
    
    // Add organic noise displacement
    float disp = noise(p * 2.5 - uTime * 0.7) * 0.25;
    disp += noise(p * 5.0 + uTime * 1.1) * 0.08;
    
    return sphere - disp;
  }

  // Global map function
  // Returns vec2: x = distance, y = material ID (1.0 = Outer Glass, 2.0 = Inner Core)
  vec2 map(vec3 p) {
    // Eased mouse displacement
    vec3 mouseOffset = vec3(uMouse * 1.8, 0.0);
    vec3 pDeformed = p - mouseOffset;

    // Apply rotation to outer capsule
    vec3 pCapsule = pDeformed;
    pCapsule.xy *= rot(uTime * 0.12 + uScroll * 0.001);
    pCapsule.xz *= rot(uTime * 0.08);
    
    float capsule = sdCapsule(pCapsule, 1.2, 0.95);
    
    // Apply different rotation to inner core
    vec3 pCore = pDeformed;
    pCore.yz *= rot(uTime * -0.15);
    pCore.xy *= rot(uTime * 0.05 + uScroll * -0.0005);
    float core = sdCore(pCore);
    
    // Combine shapes
    if (capsule < core) {
      return vec2(capsule, 1.0);
    } else {
      return vec2(core, 2.0);
    }
  }

  // Calculate surface normal
  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      map(p + e.xyy).x - map(p - e.xyy).x,
      map(p + e.yxy).x - map(p - e.yxy).x,
      map(p + e.yyx).x - map(p - e.yyx).x
    ));
  }

  // Iridescence color palette generator
  vec3 getIridescence(float fresnel, vec3 normal) {
    // Shimmering rainbow colors
    vec3 color = 0.5 + 0.5 * cos(uTime * 0.4 + normal.xyx * 3.0 + vec3(0.0, 2.0, 4.0));
    return mix(COLOR_GOLD, color, 0.45) * fresnel;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / uResolution.y;

    // Ray setup
    vec3 ro = vec3(0.0, 0.0, -5.0); // ray origin
    vec3 rd = normalize(vec3(uv, 1.4)); // ray direction

    float t = 0.0; // distance marched
    float maxDist = 9.0;
    vec2 res = vec2(0.0);
    float hit = 0.0;

    for (int i = 0; i < 70; i++) {
      vec3 p = ro + rd * t;
      res = map(p);
      if (res.x < 0.001) {
        hit = 1.0;
        break;
      }
      t += res.x * 0.65; // safe step
      if (t > maxDist) break;
    }

    // Dynamic background gradient (volumetric sunset fog)
    vec2 rawUv = gl_FragCoord.xy / uResolution;
    float grad = length(rawUv - vec2(0.5, 0.3));
    vec3 bgGrad = mix(COLOR_VOID, COLOR_CRIMSON * 0.08, clamp(1.0 - grad * 1.3, 0.0, 1.0));
    bgGrad += COLOR_AMBER * 0.04 * clamp(1.0 - length(rawUv - vec2(0.5, 0.45)) * 1.8, 0.0, 1.0);

    vec3 finalColor = bgGrad;

    if (hit > 0.0) {
      vec3 p = ro + rd * t;
      vec3 normal = getNormal(p);
      vec3 lightPos = vec3(3.0, 5.0, -4.0);
      vec3 lightDir = normalize(lightPos - p);
      vec3 viewDir = normalize(ro - p);

      float diff = max(dot(normal, lightDir), 0.0);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      float fresnel = pow(clamp(1.0 - dot(normal, viewDir), 0.0, 1.0), 3.5);

      if (res.y == 1.0) {
        // MATERIAL 1: Outer Glass Capsule
        // Refraction & Reflection
        vec3 refraction = bgGrad * 0.25;
        vec3 glassSpecular = COLOR_GOLD * spec * 0.8;
        vec3 iridescence = getIridescence(fresnel, normal);
        
        // Translucent envelope coloring
        vec3 glassColor = mix(COLOR_CRIMSON * 0.05, COLOR_AMBER * 0.08, normal.y * 0.5 + 0.5);
        vec3 objColor = glassColor + glassSpecular + iridescence * 1.6 + refraction;
        
        // Fog
        float fog = clamp(t / maxDist, 0.0, 1.0);
        finalColor = mix(objColor, bgGrad, fog * fog);
      } else {
        // MATERIAL 2: Glowing Inner Liquid Core
        vec3 coreBase = mix(COLOR_CRIMSON * 0.9, COLOR_CORAL * 1.2, normal.y * 0.5 + 0.5);
        // Inner spec
        vec3 coreSpec = COLOR_GOLD * spec * 0.5;
        vec3 objColor = coreBase + coreSpec + COLOR_GOLD * fresnel * 0.8;
        
        // Core has high emissive glow
        objColor += COLOR_CORAL * 0.25;

        float fog = clamp(t / maxDist, 0.0, 1.0);
        finalColor = mix(objColor, bgGrad, fog * fog * 0.9);
      }
    }

    // Volumetric fog god-ray sweep overlay
    float raySweep = sin(uv.x * 4.0 - uv.y * 2.5 + uTime * 0.12) * 0.5 + 0.5;
    raySweep = pow(raySweep, 5.0) * 0.02;
    finalColor += COLOR_AMBER * raySweep * (1.2 - rawUv.y);

    // Apply film grain
    float grain = (hash(vec3(gl_FragCoord.xy, uTime)) - 0.5) * 0.03;
    finalColor += vec3(grain);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const WebGLBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.8;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported by this browser.");
      return;
    }

    // Helper to compile shader
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set up full screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uScroll = gl.getUniformLocation(program, "uScroll");

    let animationId: number;
    const startTime = Date.now();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const time = (Date.now() - startTime) / 1000.0;

      // Smooth mouse easing with spring damping
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, m.x, m.y);
      gl.uniform1f(uScroll, scroll);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [scroll]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent opacity-85"
      style={{ mixBlendMode: "lighten" }}
    />
  );
};
