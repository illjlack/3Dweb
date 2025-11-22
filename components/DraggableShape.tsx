/// <reference lib="dom" />

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useBox, useSphere, useCylinder } from '@react-three/cannon';
import { SceneObject, ShapeType } from '../types';
import * as THREE from 'three';

interface DraggableShapeProps {
  data: SceneObject;
}

/**
 * 形状配置参数 (尺寸)
 * 提取到组件外部，方便管理
 */
const SHAPE_CONFIG = {
  [ShapeType.BOX]: [1, 1, 1] as [number, number, number], // 长宽高
  [ShapeType.SPHERE]: [0.6] as [number], // 半径
  [ShapeType.CYLINDER]: [0.6, 0.6, 1.2, 16] as [number, number, number, number], // 顶半径, 底半径, 高度, 分段数
};

/**
 * 可拖拽形状组件 (核心组件)
 * 结合了 Three.js 的渲染和 Cannon.js 的物理计算
 */
export const DraggableShape: React.FC<DraggableShapeProps> = ({ data }) => {
  const { camera } = useThree(); // 获取场景摄像机
  const [isDragging, setIsDragging] = useState(false); // 记录当前是否被拖拽
  
  // --- 物理引擎部分 ---
  
  // 根据类型选择不同的物理钩子 (Hooks)
  // useBox/useSphere 返回:
  // 1. physicsRef: 绑定到 mesh 上，将视觉对象与物理刚体同步
  // 2. api: 用于控制刚体 (设置速度、质量、位置等)
  let physicsRef: any;
  let api: any;

  // 注意：这里使用了条件 Hook，但在本应用中是安全的，
  // 因为我们在父组件中用 key={id} 强制由类型决定组件生命周期。
  // 也就是说，一个组件一旦创建，它的 type 就不会变。
  if (data.type === ShapeType.BOX) {
    [physicsRef, api] = useBox(() => ({ 
      mass: 1, // 质量: 1kg
      position: data.position, 
      args: SHAPE_CONFIG[ShapeType.BOX] 
    }));
  } else if (data.type === ShapeType.SPHERE) {
    [physicsRef, api] = useSphere(() => ({ 
      mass: 1, 
      position: data.position, 
      args: SHAPE_CONFIG[ShapeType.SPHERE] 
    }));
  } else {
    [physicsRef, api] = useCylinder(() => ({ 
      mass: 1, 
      position: data.position, 
      args: SHAPE_CONFIG[ShapeType.CYLINDER] 
    }));
  }

  // --- 拖拽逻辑变量 ---
  
  // Raycaster: 射线投射器，用于检测鼠标在 3D 空间中指向哪里
  const raycaster = useRef(new THREE.Raycaster());
  // DragPlane: 一个虚拟的水平面，拖拽时物体实际上是沿着这个不可见的平面移动
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  // IntersectPoint: 存储射线与虚拟平面相交的点
  const intersectPoint = useRef(new THREE.Vector3());

  // --- 事件处理 ---

  // 鼠标按下事件
  const handlePointerDown = (e: any) => {
    // 1. 阻止事件冒泡，防止 OrbitControls (旋转视角) 抢夺控制权
    e.stopPropagation();
    
    // 2. 锁定指针捕捉，这样鼠标移出物体也能继续拖拽
    // R3F events have a target of Object3D, but R3F patches them with setPointerCapture
    // Casting to 'any' avoids TS errors about setPointerCapture missing on Object3D/HTMLElement
    (e.target as any).setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    
    // 3. 物理控制关键点：
    // 将质量设为 0，物体变成 "Kinematic" (运动学) 物体。
    // 这意味着它不再受重力影响，而是完全由我们的代码控制位置。
    api.mass.set(0);
    
    // 清空速度，防止惯性干扰
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
    
    // 4. 计算拖拽平面的高度
    // 让虚拟平面与物体当前的点击点高度一致，这样拖拽体验更自然
    dragPlane.current.constant = -e.point.y;
  };

  // 鼠标松开事件
  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    (e.target as any).releasePointerCapture(e.pointerId);
    
    setIsDragging(false);
    
    // 1. 恢复质量，让物体重新受重力影响掉落
    api.mass.set(1);
    
    // 2. 给一个微小的随机旋转，让落地更自然生动
    api.angularVelocity.set(
      Math.random() - 0.5, 
      Math.random() - 0.5, 
      Math.random() - 0.5
    );
  };

  // --- 每一帧的更新循环 (60fps) ---
  
  useFrame(({ mouse }) => {
    if (isDragging) {
      // 1. 设置射线：从摄像机出发，穿过鼠标在屏幕上的位置
      raycaster.current.setFromCamera(mouse, camera);
      
      // 2. 计算射线与虚拟平面的交点
      raycaster.current.ray.intersectPlane(dragPlane.current, intersectPoint.current);
      
      // 3. 强制更新物理刚体的位置到交点
      const x = intersectPoint.current.x;
      // 限制最小高度为 0.5，防止被拖到地底下
      const y = Math.max(0.5, intersectPoint.current.y); 
      const z = intersectPoint.current.z;
      
      api.position.set(x, y, z);
      
      // 再次重置速度，确保拖拽时物体不会"积攒"动量突然飞出去
      api.velocity.set(0, 0, 0); 
    }
  });

  // --- 渲染视图 ---
  return (
    <mesh
      ref={physicsRef} // 绑定物理引用
      castShadow // 产生阴影
      receiveShadow // 接收阴影
      onPointerDown={handlePointerDown} // 绑定交互事件
      onPointerUp={handlePointerUp}
      // 鼠标悬停时改变光标样式
      onPointerOver={() => document.body.style.cursor = 'grab'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* 根据类型渲染对应的几何体 */}
      {data.type === ShapeType.BOX && <boxGeometry args={SHAPE_CONFIG[ShapeType.BOX]} />}
      {data.type === ShapeType.SPHERE && <sphereGeometry args={SHAPE_CONFIG[ShapeType.SPHERE]} />}
      {data.type === ShapeType.CYLINDER && <cylinderGeometry args={SHAPE_CONFIG[ShapeType.CYLINDER]} />}
      
      {/* 材质设置 */}
      <meshStandardMaterial 
        color={isDragging ? '#ffffff' : data.color} // 拖拽时变白高亮
        emissive={isDragging ? '#444444' : '#000000'} // 拖拽时自发光
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
};