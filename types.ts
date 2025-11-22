
// 定义形状类型的枚举
// 如果你想添加新形状（比如金字塔），请在这里添加
export enum ShapeType {
  BOX = 'BOX',          // 立方体
  SPHERE = 'SPHERE',    // 球体
  CYLINDER = 'CYLINDER' // 圆柱体
}

// 场景中每个物体的数据结构
export interface SceneObject {
  id: string;           // 唯一标识符 (UUID)
  type: ShapeType;      // 形状类型
  position: [number, number, number]; // [x, y, z] 坐标
  color: string;        // 颜色 hex 字符串
}

// 预定义的颜色列表，生成物体时随机选取
export const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
];

// TypeScript 类型扩展
// 这部分是为了让 TS 识别 React Three Fiber 的特殊 JSX 标签 (如 <mesh>, <boxGeometry> 等)
// 这是一个常见的 R3F 项目配置
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      mesh: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      gridHelper: any;
      boxGeometry: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      group: any;
    }
  }
}