import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import {
  Text3D,
  Center,
  RoundedBox,
  MeshReflectorMaterial,
  Line,
} from '@react-three/drei';
import * as THREE from 'three';

interface BasketballCourt3DProps {
  teamA?: string;
  teamB?: string;
  percentA?: number;
  percentB?: number;
}

// Simple glowing line using drei's Line
function GlowingLine({
  points,
  color = '#ffffff',
  lineWidth = 3
}: {
  points: [number, number, number][];
  color?: string;
  lineWidth?: number;
}) {
  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      toneMapped={false}
    />
  );
}

// Glowing arc for three-point lines and center circle
function GlowingArc({
  radius,
  startAngle = 0,
  endAngle = Math.PI * 2,
  segments = 64,
  color = '#ffffff',
  position = [0, 0, 0] as [number, number, number],
  lineWidth = 3
}: {
  radius: number;
  startAngle?: number;
  endAngle?: number;
  segments?: number;
  color?: string;
  position?: [number, number, number];
  lineWidth?: number;
}) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / segments);
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius, startAngle, endAngle, segments]);

  return (
    <group position={position}>
      <GlowingLine points={points} color={color} lineWidth={lineWidth} />
    </group>
  );
}



// Basketball hoop with backboard - positioned correctly above court
function BasketballHoop({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Post/support */}
      <mesh position={[0, 1.5, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 16]} />
        <meshStandardMaterial color="#333344" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Backboard */}
      <mesh position={[0, 2.8, 0]}>
        <boxGeometry args={[1.8, 1.2, 0.05]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.7}
          emissive="#334466"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Backboard border */}
      <Line
        points={[
          [-0.9, 2.2, 0.03],
          [-0.9, 3.4, 0.03],
          [0.9, 3.4, 0.03],
          [0.9, 2.2, 0.03],
          [-0.9, 2.2, 0.03],
        ]}
        color="#ffffff"
        lineWidth={2}
        toneMapped={false}
      />
      {/* Inner square on backboard */}
      <Line
        points={[
          [-0.3, 2.55, 0.04],
          [-0.3, 3.05, 0.04],
          [0.3, 3.05, 0.04],
          [0.3, 2.55, 0.04],
          [-0.3, 2.55, 0.04],
        ]}
        color="#ffffff"
        lineWidth={1.5}
        toneMapped={false}
      />
      {/* Rim */}
      <mesh position={[0, 2.3, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.23, 0.02, 16, 32]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff2200"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      {/* Rim connector */}
      <mesh position={[0, 2.3, 0.2]}>
        <boxGeometry args={[0.08, 0.04, 0.4]} />
        <meshStandardMaterial color="#333344" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Court() {
  const groupRef = useRef<THREE.Group>(null!);

  // Subtle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.15;
    }
  });

  const courtWidth = 8;
  const courtLength = 14;
  const lineColor = '#66aaff';
  const lineColorWhite = '#ffffff';

  return (
    <group ref={groupRef} rotation={[0, 1, 0.1]}>
      
      
      {/* Tablet base */}
      <RoundedBox
        args={[courtWidth + 2,1, courtLength + 2]}
        radius={0.3}
        smoothness={4}
        position={[0, -0.5, 0]}
      >
        <meshStandardMaterial
          color="#696868"
          metalness={0.1}
          roughness={1}
        />
      </RoundedBox>

      {/* Reflective court surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[courtWidth + 1.5, courtLength + 1.5]} />
        <MeshReflectorMaterial
          color="#dcdcdc"
          mirror={0.75}
          mixBlur={1}
          mixStrength={1}
          roughness={0.5}
          metalness={0.1}
          blur={[400, 400]}
          resolution={1024}
          minDepthThreshold={.4}
          maxDepthThreshold={1.4}
          depthScale={1}
        />
      </mesh>

      {/* Court lines group */}
      <group position={[0, 0.08, 0]}>
        {/* Outer boundary */}
        <GlowingLine
          points={[
            [-courtWidth / 2, 0, -courtLength / 2],
            [courtWidth / 2, 0, -courtLength / 2],
          ]}
          color={lineColorWhite}
          lineWidth={3}
        />
        <GlowingLine
          points={[
            [courtWidth / 2, 0, -courtLength / 2],
            [courtWidth / 2, 0, courtLength / 2],
          ]}
          color={lineColorWhite}
          lineWidth={3}
        />
        <GlowingLine
          points={[
            [courtWidth / 2, 0, courtLength / 2],
            [-courtWidth / 2, 0, courtLength / 2],
          ]}
          color={lineColorWhite}
          lineWidth={3}
        />
        <GlowingLine
          points={[
            [-courtWidth / 2, 0, courtLength / 2],
            [-courtWidth / 2, 0, -courtLength / 2],
          ]}
          color={lineColorWhite}
          lineWidth={3}
        />

        {/* Center line */}
        <GlowingLine
          points={[
            [-courtWidth / 2, 0, 0],
            [courtWidth / 2, 0, 0],
          ]}
          color={lineColorWhite}
          lineWidth={3}
        />

        {/* Center circle */}
        <GlowingArc
          radius={0.75}
          color={lineColorWhite}
          position={[0, 0, 0]}
          lineWidth={3}
        />

        {/* Three-point arcs - centered on hoop position */}
        <GlowingArc
          radius={3.8}
          startAngle={Math.PI - 2.5}
          endAngle={Math.PI - 0.5}
          color={lineColor}
          position={[0, 0, -courtLength / 2 + 1.5]}
          lineWidth={3}
        />
        <GlowingArc
          radius={3.8}
          startAngle={-2.5}
          endAngle={-0.5}
          color={lineColor}
          position={[-0.25, 0, courtLength / 2 - 1.5]}
          lineWidth={3}
        />

        {/* Three-point straight lines - connecting arc to baseline */}
        <GlowingLine
          points={[
            [-3.0, 0, -courtLength / 2],
            [-3.0, 0, -courtLength / 2 + 3.5],
          ]}
          color={lineColor}
          lineWidth={3}
        />
        <GlowingLine
          points={[
            [3.0, 0, -courtLength / 2],
            [3.0, 0, -courtLength / 2 + 3.5],
          ]}
          color={lineColor}
          lineWidth={3}
        />
        <GlowingLine
          points={[
            [-3.0, 0, courtLength / 2],
            [-3.0, 0, courtLength / 2 - 3.5],
          ]}
          color={lineColor}
          lineWidth={3}
        />
        <GlowingLine
          points={[
            [3.0, 0, courtLength / 2],
            [3.0, 0, courtLength / 2 - 3.5],
          ]}
          color={lineColor}
          lineWidth={3}
        />

        {/* Free throw lanes (paint) */}
        {/* Bottom */}
        <GlowingLine
          points={[
            [-1.8, 0, -courtLength / 2],
            [-1.8, 0, -courtLength / 2 + 3.5],
          ]}
          color={lineColorWhite}
          lineWidth={2}
        />
        <GlowingLine
          points={[
            [-1.8, 0, -courtLength / 2 + 3.5],
            [1.8, 0, -courtLength / 2 + 3.5],
          ]}
          color={lineColorWhite}
          lineWidth={2}
        />
        <GlowingLine
          points={[
            [1.8, 0, -courtLength / 2 + 3.5],
            [1.8, 0, -courtLength / 2],
          ]}
          color={lineColorWhite}
          lineWidth={2}
        />

        {/* Top */}
        <GlowingLine
          points={[
            [-1.8, 0, courtLength / 2],
            [-1.8, 0, courtLength / 2 - 3.5],
          ]}
          color={lineColorWhite}
          lineWidth={2}
        />
        <GlowingLine
          points={[
            [-1.8, 0, courtLength / 2 - 3.5],
            [1.8, 0, courtLength / 2 - 3.5],
          ]}
          color={lineColorWhite}
          lineWidth={2}
        />
        <GlowingLine
          points={[
            [1.8, 0, courtLength / 2 - 3.5],
            [1.8, 0, courtLength / 2],
          ]}
          color={lineColorWhite}
          lineWidth={2}
        />

        {/* Free throw circles */}
        <GlowingArc
          radius={1.2}
          startAngle={-Math.PI / 80}
          endAngle={Math.PI }
          color={lineColorWhite}
          position={[0, 0, -courtLength / 2 + 3.5]}
          lineWidth={2}
        />
        <GlowingArc
          radius={1.2}
          startAngle={Math.PI * 2}
          endAngle={Math.PI }
          color={lineColorWhite}
          position={[0, 0, courtLength / 2 - 3.5]}
          lineWidth={2}
        />
      </group>

      {/* Basketball hoops - positioned at ends of court, above the surface */}
      <BasketballHoop position={[0, 0, -courtLength / 2 - 0.5]} rotation={[0, 0, 0]} />
      <BasketballHoop position={[0, 0, courtLength / 2 + 0.5]} rotation={[0, Math.PI, 0]} />

    </group>
  );
}

export default function BasketballCourt3D({ teamA = 'Team A', teamB = 'Team B' , percentA = 0, percentB = 0}: BasketballCourt3DProps) {
  return (
    <div style={{ width: '100%', height: '450px', background: 'transparent', overflow: 'visible' }}>
      <Canvas
        shadows
        camera={{ position: [12, 10, 12], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.4} />

        {/* Key light */}
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.6}
          color="#ffffff"
        />

        <group scale={0.85} position={[0,0,-1]}>
          <Court  />

          {/* Team A - name and percentage */}
          <group position={[-4, 4,3]} rotation={[0, Math.PI / 4, 0]}>
            <Center>
              <Text3D
                font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                size={1}
                height={0.2}
                bevelEnabled
                bevelThickness={0.03}
                bevelSize={0.02}
                bevelSegments={5}
              >
                {teamA}
                <meshStandardMaterial color="#ffffff" metalness={0} roughness={0.4} />
              </Text3D>
            </Center>
          </group>
          <group position={[-4, 3, 3]} rotation={[0, Math.PI / 4, 0]}>
            <Center>
              <Text3D
                font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                size={0.5}
                height={0.2}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.01}
                bevelSegments={3}
              >
                {`${percentA}%`}
                <meshStandardMaterial
                  color={percentA >= percentB ? "#22cc66" : "#ff4444"}
                  metalness={0}
                  roughness={0.4}
                />
              </Text3D>
            </Center>
          </group>

          {/* Team B - name and percentage */}
          <group position={[-2, 4, -3]} rotation={[0, Math.PI / 4, 0]}>
            <Center>
              <Text3D
                font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                size={1}
                height={0.2}
                bevelEnabled
                bevelThickness={0.03}
                bevelSize={0.02}
                bevelSegments={5}
              >
                {teamB}
                <meshStandardMaterial color="lightgray" metalness={0} roughness={0.4} />
              </Text3D>
            </Center>
          </group>
          <group position={[-2, 3, -3]} rotation={[0, Math.PI / 4, 0]}>
            <Center>
              <Text3D
                font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                size={0.5}
                height={0.1}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.01}
                bevelSegments={3}
              >
                {`${percentB}%`}
                <meshStandardMaterial
                  color={percentB >= percentA ? "#22cc66" : "#ff4444"}
                  metalness={0}
                  roughness={0.4}
                />
              </Text3D>
            </Center>
          </group>
        </group>
      </Canvas>
    </div>
  );
}
