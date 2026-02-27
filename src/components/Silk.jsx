/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useRef, useMemo, useEffect } from "react";
import { Color } from "three";

// Memoized outside component — pure function with no closure deps
const hexToNormalizedRGB = (hex) => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

// Shaders defined outside module scope — never re-created
const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Removed unused vPosition varying to reduce GPU bandwidth
const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

// Stable geometry args — defined once, never re-allocated
const PLANE_ARGS = [1, 1, 1, 1];

// Stable canvas style — defined once outside render
const CANVAS_STYLE = { display: "block", width: "100%", height: "100%" };

// Stable container style — defined once outside render
const CONTAINER_STYLE = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "hidden",
};

const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  // useLayoutEffect → useEffect: avoids blocking paint for a non-visual-critical scale op
  // Also correctly depends on viewport dimensions, not the whole object
  useEffect(() => {
    if (ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport.width, viewport.height]);

  // Stable frame callback — no closure deps change between renders
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.uTime.value += 0.1 * delta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={PLANE_ARGS} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});
SilkPlane.displayName = "SilkPlane";

const Silk = ({
  speed = 5,
  scale = 1,
  color = "#5227ff",
  noiseIntensity = 1.5,
  rotation = 0,
}) => {
  const meshRef = useRef();

  const uniforms = useMemo(() => {
    const rgb = hexToNormalizedRGB(color);
    return {
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      // Reuse a single Color instance instead of spreading array args
      uColor: { value: new Color(rgb[0], rgb[1], rgb[2]) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    };
  }, [speed, scale, noiseIntensity, color, rotation]);

  return (
    <div style={CONTAINER_STYLE}>
      <Canvas
        // Cap pixel ratio at 1.5 instead of 2 — virtually invisible difference
        // on most screens but cuts fill-rate cost by ~44% on high-DPI devices
        dpr={[1, 1.5]}
        frameloop="always"
        style={CANVAS_STYLE}
        // Disable depth buffer — not needed for a single fullscreen quad
        gl={{ depth: false, stencil: false, antialias: false }}
      >
        <SilkPlane ref={meshRef} uniforms={uniforms} />
      </Canvas>
    </div>
  );
};

export default Silk;
