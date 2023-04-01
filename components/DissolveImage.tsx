import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

type Props = {
  particleCount: number;
  particleSize: number;
};

const DissolveImage: React.FC<Props> = ({ particleCount, particleSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const particlesRef = useRef<THREE.Points>();

  const handleMouseMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { left, top } = canvas.getBoundingClientRect();
    const x =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const y =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    mousePosRef.current.x = ((x - left) / canvas.clientWidth) * 2 - 1;
    mousePosRef.current.y = (-(y - top) / canvas.clientHeight) * 2 + 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const particles = new THREE.BufferGeometry();
    particles.setAttribute('position', new THREE.Float32BufferAttribute([], 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: particleSize,
      color: 0xffffff,
    });

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      particles.attributes.position.setXYZ(
        i,
        particle.x,
        particle.y,
        particle.z
      );
    }
    particles.attributes.position.needsUpdate = true;

    particlesRef.current = new THREE.Points(particles, particleMaterial);
    scene.add(particlesRef.current);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const renderScene = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    const offscreenScene = new THREE.Scene();
    const offscreenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const offscreenTexture = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    const offscreenMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: offscreenTexture.texture },
        uMousePos: { value: mousePosRef.current },
      },
      vertexShader: `
      precision highp float;

      attribute float pindex;
      attribute vec3 position;
      attribute vec3 offset;
      attribute vec2 uv;
      attribute float angle;
      
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      
      uniform float uTime;
      uniform float uRandom;
      uniform float uDepth;
      uniform float uSize;
      uniform vec2 uTextureSize;
      uniform sampler2D uTexture;
      uniform sampler2D uTouch;
      
      varying vec2 vPUv;
      varying vec2 vUv;
      
      #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
      
      float random(float n) {
        return fract(sin(n) * 43758.5453123);
      }
      
      void main() {
        vUv = uv;
        // particle uv
        vec2 puv = offset.xy / uTextureSize;
        vPUv = puv;
      
        // pixel color
        vec4 colA = texture2D(uTexture, puv);
        float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
      
        // displacement
        vec3 displaced = offset;
        // randomise
        displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
        float rndz = (random(pindex) + snoise_1_2(vec2(pindex * 0.1, uTime * 0.1)));
        displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
        // center
        displaced.xy -= uTextureSize * 0.5;
      
        // touch
        float t = texture2D(uTouch, puv).r;
        displaced.z += t * 20.0 * rndz;
        displaced.x += cos(angle) * t * 20.0 * rndz;
        displaced.y += sin(angle) * t * 20.0 * rndz;
      
        // particle size
        float psize = (snoise_1_2(vec2(uTime, pindex) * 0.5) + 2.0);
        psize *= max(grey, 0.2);
        psize *= uSize;
      
        // final position
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        mvPosition.xyz += position * psize;
        vec4 finalPosition = projectionMatrix * mvPosition;
      
        gl_Position = finalPosition;
      `,
      fragmentShader: `

        uniform sampler2D uTexture;
        uniform vec2 uMousePos;
        
        varying vec2 vUv;
        varying vec2 vPUv;
        
        void main() {
          vec4 color = vec4(0.0);
	vec2 uv = vUv;
	vec2 puv = vPUv;

	// pixel color
	vec4 colA = texture2D(uTexture, puv);

	// greyscale
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
	vec4 colB = vec4(grey, grey, grey, 1.0);

	// circle
	float border = 0.3;
	float radius = 0.5;
	float dist = radius - distance(uv, vec2(0.5));
	float t = smoothstep(0.0, border, dist);

	// final color
	color = colB;
	color.a = t;

	gl_FragColor = color;
          }
        `,
    });

    const offscreenQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      offscreenMaterial
    );
    offscreenScene.add(offscreenQuad);

    const animate = () => {
      requestAnimationFrame(animate);

      particlesRef.current.rotation.x += 0.001;
      particlesRef.current.rotation.y += 0.001;

      offscreenMaterial.uniforms.uMousePos.value = mousePosRef.current;
      renderer.setRenderTarget(offscreenTexture);
      renderer.render(offscreenScene, offscreenCamera);

      renderer.setRenderTarget(renderScene);
      renderer.render(scene, camera);

      renderer.setRenderTarget(null);
      renderer.render(offscreenScene, offscreenCamera);
    };

    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default DissolveImage;
