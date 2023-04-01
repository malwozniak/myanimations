import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  image: string;
  width: number;
  height: number;
  dissolveDuration: number;
};

const DissolveImage: React.FC<Props> = ({
  image,
  width,
  height,
  dissolveDuration,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setSize(width, height);

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const scene = new THREE.Scene();

      const geometry = new THREE.PlaneGeometry(2, 2);

      const texture = new THREE.TextureLoader().load(image, () => {
        const dissolveShader = {
          uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0 },
            uDissolveDuration: { value: dissolveDuration },
          },
          vertexShader: `
            varying vec2 vUv;

            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexture;
            uniform float uTime;
            uniform float uDissolveDuration;

            varying vec2 vUv;

            void main() {
              vec4 texel = texture2D(uTexture, vUv);

              float dissolve = clamp(uTime / uDissolveDuration, 0.0, 1.0);

              if (dissolve < texel.a) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
              } else {
                gl_FragColor = texel;
              }
            }
          `,
        };

        const material = new THREE.ShaderMaterial(dissolveShader);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const clock = new THREE.Clock();

        const animate = () => {
          const elapsedTime = clock.getElapsedTime();

          material.uniforms.uTime.value = elapsedTime;

          renderer.render(scene, camera);

          requestAnimationFrame(animate);
        };

        animate();
      });
    }
  }, [canvasRef, image, width, height, dissolveDuration]);

  return <canvas ref={canvasRef} />;
};

export default DissolveImage;
