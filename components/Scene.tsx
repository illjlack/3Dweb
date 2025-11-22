
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SoftShadows, Stars } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { World } from './World';
import { SceneObject } from '../types';

interface SceneProps {
  objects: SceneObject[];
}

/**
 * Scene 组件：配置 3D 环境
 * 包含：相机、光照、阴影、背景星空、物理引擎容器
 */
export const Scene: React.FC<SceneProps> = ({ objects }) => {
  return (
    <Canvas
      shadows // 开启阴影支持
      camera={{ position: [8, 8, 8], fov: 45 }} // 设置相机初始位置(x,y,z)和视野角度(fov)
      gl={{ antialias: true }} // 开启抗锯齿，让边缘更平滑
      dpr={[1, 2]} // 适配高分屏 (Retina)
    >
      {/* --- 1. 光照系统 --- */}
      
      {/* 环境光：提供基础亮度，避免阴影处全黑 */}
      <ambientLight intensity={0.4} />
      
      {/* 平行光（模拟太阳）：产生主要阴影 */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow // 允许产生阴影
        shadow-mapSize={[1024, 1024]} // 阴影贴图分辨率，越高越清晰
        // 下面设置阴影相机的覆盖范围
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* 点光源：增加场景的立体感和补光 */}
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      
      {/* --- 2. 环境装饰 --- */}
      {/* 星空背景组件 */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* 软阴影效果：让阴影边缘更真实自然 */}
      <SoftShadows size={10} focus={0} samples={10} />

      {/* --- 3. 交互控制器 --- */}
      {/* 允许用户通过鼠标旋转、缩放、平移视角 */}
      <OrbitControls 
        makeDefault 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.1} // 限制相机不能钻到地底下
      />

      {/* --- 4. 物理世界 --- */}
      {/* 
          gravity: 重力向量 [x, y, z]，y为-9.81模拟地球重力
          allowSleep: false 意味着物体即使停止运动也在持续进行物理计算（防止某些情况下无法唤醒）
      */}
      <Physics gravity={[0, -9.81, 0]} allowSleep={false}>
        <World objects={objects} />
      </Physics>
    </Canvas>
  );
};
