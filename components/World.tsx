
import React from 'react';
import { usePlane } from '@react-three/cannon';
import { DraggableShape } from './DraggableShape';
import { SceneObject } from '../types';

interface WorldProps {
  objects: SceneObject[];
}

/**
 * 地板组件
 * 这是一个静态的物理刚体，物体掉下来会落在上面
 */
const Floor = () => {
  // usePlane 是 Cannon.js 的钩子，创建一个无限大的平面刚体
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], // 旋转 -90 度，使其水平放置
    position: [0, 0, 0],
    material: { friction: 0.1, restitution: 0.5 } // 摩擦力0.1，弹性0.5
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      {/* 可视化的几何体 */}
      <planeGeometry args={[100, 100]} />
      {/* 地板材质 */}
      <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.2} />
      {/* 网格辅助线，让空间感更强 */}
      <gridHelper args={[100, 50, '#64748b', '#475569']} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </mesh>
  );
};

/**
 * World 组件
 * 负责渲染所有的物理实体
 */
export const World: React.FC<WorldProps> = ({ objects }) => {
  return (
    <>
      <Floor />
      {/* 遍历物体数组，为每个数据生成一个可拖拽的 3D 形状 */}
      {objects.map((obj) => (
        <DraggableShape key={obj.id} data={obj} />
      ))}
    </>
  );
};
