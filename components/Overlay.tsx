
import React from 'react';
import { Box, Circle, Cylinder, Trash2, MousePointer2 } from 'lucide-react';
import { ShapeType } from '../types';

interface OverlayProps {
  onAdd: (type: ShapeType) => void;
  onClear: () => void;
  count: number;
}

export const Overlay: React.FC<OverlayProps> = ({ onAdd, onClear, count }) => {
  return (
    <>
      {/* 顶部标题栏 */}
      <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none select-none">
        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
          3D 物理实验室
        </h1>
        <p className="text-slate-300 mt-2 text-sm max-w-md drop-shadow-sm bg-slate-900/30 p-2 rounded-lg backdrop-blur-sm">
          生成模型，抓取它们，然后看着它们碰撞翻滚。
          <br/>
          <span className="text-emerald-400 flex items-center gap-1 mt-2 font-semibold">
            <MousePointer2 size={14}/> 操作指南:
          </span>
          <ul className="list-disc list-inside ml-1 text-slate-400 mt-1 space-y-1">
             <li>点击下方按钮生成物体</li>
             <li>按住物体可 <b>拖拽</b> 移动</li>
             <li>在空白处按住左键可 <b>旋转</b> 视角</li>
             <li>使用滚轮 <b>缩放</b> 视角</li>
          </ul>
        </p>
        <div className="mt-4 text-slate-500 text-xs font-mono">
          当前对象数量: {count}
        </div>
      </div>

      {/* 底部工具栏 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-2xl select-none">
        
        {/* 立方体按钮 */}
        <button
          onClick={() => onAdd(ShapeType.BOX)}
          className="group flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:scale-105 transition-all duration-200 border border-slate-700 hover:border-indigo-400 shadow-lg active:scale-95"
          title="添加立方体"
        >
          <Box className="text-indigo-400 group-hover:text-white transition-colors" size={24} />
          <span className="text-[10px] font-medium text-slate-400 group-hover:text-white mt-1">立方体</span>
        </button>

        {/* 球体按钮 */}
        <button
          onClick={() => onAdd(ShapeType.SPHERE)}
          className="group flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:scale-105 transition-all duration-200 border border-slate-700 hover:border-emerald-400 shadow-lg active:scale-95"
          title="添加球体"
        >
          <Circle className="text-emerald-400 group-hover:text-white transition-colors" size={24} />
          <span className="text-[10px] font-medium text-slate-400 group-hover:text-white mt-1">球体</span>
        </button>
        
        {/* 圆柱体按钮 */}
        <button
          onClick={() => onAdd(ShapeType.CYLINDER)}
          className="group flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-800 hover:bg-amber-600 hover:scale-105 transition-all duration-200 border border-slate-700 hover:border-amber-400 shadow-lg active:scale-95"
          title="添加圆柱体"
        >
          <Cylinder className="text-amber-400 group-hover:text-white transition-colors" size={24} />
          <span className="text-[10px] font-medium text-slate-400 group-hover:text-white mt-1">圆柱体</span>
        </button>

        {/* 分割线 */}
        <div className="w-px h-12 bg-slate-700 mx-1 self-center"></div>

        {/* 清除按钮 */}
        <button
          onClick={onClear}
          className="group flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-800 hover:bg-red-600 hover:scale-105 transition-all duration-200 border border-slate-700 hover:border-red-400 shadow-lg active:scale-95"
          title="清空场景"
        >
          <Trash2 className="text-red-400 group-hover:text-white transition-colors" size={24} />
          <span className="text-[10px] font-medium text-slate-400 group-hover:text-white mt-1">清空</span>
        </button>
      </div>
    </>
  );
};
