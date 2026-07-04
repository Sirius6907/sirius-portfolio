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
  const vec3 COLOR_VOID = vec3(0.015, 0.015, 0.015); // #040404
  const vec3 COLOR_CRIMSON = vec3(0.72, 0.14, 0.16); // #B8252A
  const vec3 COLOR_AMBER = vec3(0.91, 0.65, 0.35);   // #E8A859
  const vec3 COLOR_CORAL = vec3(0.91, 0.29, 0.23);   // #E94B3C

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

  // Torus / Morphing Blob SDF
  float sdMorphingBlob(vec3 p) {
    // Apply dynamic rotations
    p.xy *= rot(uTime * 0.1 + uScroll * 0.001);
    p.xz *= rot(uTime * 0.07);

    // Dynamic mouse deformation
    vec3 mouseOffset = vec3(uMouse * 1.5, 0.0);
    vec3 pDeformed = p - mouseOffset;

    // Torus component
    vec2 q = vec2(length(pDeformed.xz) - 1.8, pDeformed.y);
    float torus = length(q) - 0.45;

    // Morphing sphere component
    float sphere = length(pDeformed) - 1.25;

    // Organic blob blending
    float baseShape = smin(torus, sphere, 0.6);

    // Complex organic noise displacement (like liquid glass or fire)
    float disp = noise(pDeformed * 1.8 - uTime * 0.4) * 0.35;
    disp += noise(pDeformed * 3.5 + uTime * 0.6) * 0.12;

    return baseShape - disp;
  }

  // Raymarching scene function
  float map(vec3 p) {
    return sdMorphingBlob(p);
  }

  // Calculate surface normal
  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      map(p + e.xyy) - map(p - e.xyy),
      map(p + e.yxy) - map(p - e.yxy),
      map(p + e.yyx) - map(p - e.yyx)
    ));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / uResolution.y;

    // Ray setup
    vec3 ro = vec3(0.0, 0.0, -5.0); // ray origin
    vec3 rd = normalize(vec3(uv, 1.2)); // ray direction

    float t = 0.0; // distance marched
    float maxDist = 10.0;
    float hit = 0.0;

    for (int i = 0; i < 64; i++) {
      vec3 p = ro + rd * t;
      float d = map(p);
      if (d < 0.001) {
        hit = 1.0;
        break;
      }
      t += d * 0.75; // safe step
      if (t > maxDist) break;
    }

    // Dynamic background gradient (volumetric sunset fog)
    vec2 rawUv = gl_FragCoord.xy / uResolution;
    float grad = length(rawUv - vec2(0.5, 0.3));
    vec3 bgGrad = mix(COLOR_VOID, COLOR_CRIMSON * 0.08, clamp(1.0 - grad * 1.2, 0.0, 1.0));
    bgGrad += COLOR_AMBER * 0.04 * clamp(1.0 - length(rawUv - vec2(0.5, 0.45)) * 1.8, 0.0, 1.0);

    vec3 finalColor = bgGrad;

    if (hit > 0.0) {
      vec3 p = ro + rd * t;
      vec3 normal = getNormal(p);
      vec3 lightPos = vec3(2.0, 4.0, -3.0);
      vec3 lightDir = normalize(lightPos - p);

      // Diffuse & Specular lighting
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 viewDir = normalize(ro - p);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);

      // Japanese sunset edge glow (Fresnel rim light)
      float fresnel = pow(clamp(1.0 - dot(normal, viewDir), 0.0, 1.0), 3.0);

      // Deep color mapping based on normal orientation & depth
      vec3 baseMat = mix(COLOR_CRIMSON * 0.12, COLOR_CORAL * 0.8, normal.y * 0.5 + 0.5);
      baseMat = mix(baseMat, COLOR_AMBER, spec * 0.4);

      // Add fiery rim lighting
      vec3 rimColor = mix(COLOR_CRIMSON, COLOR_AMBER, normal.x * 0.5 + 0.5);
      vec3 objColor = baseMat + rimColor * fresnel * 1.8;

      // Depth fog attenuation (fades into void)
      float fog = clamp(t / maxDist, 0.0, 1.0);
      finalColor = mix(objColor, bgGrad, fog * fog * 1.0);
    }

    // Volumetric fog god-ray sweep overlay
    float raySweep = sin(uv.x * 3.5 - uv.y * 2.0 + uTime * 0.15) * 0.5 + 0.5;
    raySweep = pow(raySweep, 4.0) * 0.015;
    finalColor += COLOR_AMBER * raySweep * (1.2 - rawUv.y);

    // Apply film grain
    float grain = (hash(vec3(gl_FragCoord.xy, uTime)) - 0.5) * 0.035;
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
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
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

      // Smooth mouse easing
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

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
