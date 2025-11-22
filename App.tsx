
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { SceneObject, ShapeType, COLORS } from './types';

/**
 * App 组件：整个应用程序的入口
 * 负责管理全局状态（即场景中有哪些物体）
 */
export default function App() {
  // state: 存储当前场景中所有物体的数组
  const [objects, setObjects] = useState<SceneObject[]>([]);

  // 功能：添加一个新的物体
  // 使用 useCallback 优化性能，避免重复创建函数
  const addObject = useCallback((type: ShapeType) => {
    const newObject: SceneObject = {
      id: uuidv4(), // 生成唯一ID，确保 React 渲染列表时不混乱
      type,
      // position: 在空中随机位置生成 [X(-1到1), Y(5米高), Z(-1到1)]
      position: [Math.random() * 2 - 1, 5, Math.random() * 2 - 1], 
      // 随机选择一个颜色
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    
    // 更新状态，将新物体追加到数组末尾
    setObjects((prev) => [...prev, newObject]);
  }, []);

  // 功能：清空所有物体
  const clearObjects = useCallback(() => {
    setObjects([]);
  }, []);

  return (
    // 这里使用了 Tailwind CSS 设置全屏容器
    <div className="relative w-full h-screen bg-slate-900">
      {/* 3D 场景层：负责渲染画面 */}
      <Scene objects={objects} />
      
      {/* UI 覆盖层：负责按钮和交互界面 */}
      <Overlay onAdd={addObject} onClear={clearObjects} count={objects.length} />
    </div>
  );
}
