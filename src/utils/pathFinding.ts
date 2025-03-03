import { NodeData, Point, ConnectionPoint } from '../types';

// Calculate the best connection points between two nodes
export function findBestConnectionPoints(fromNode: NodeData, toNode: NodeData): {
  from: ConnectionPoint;
  to: ConnectionPoint;
} {
  // Calculate center points of each node
  const fromCenter = {
    x: fromNode.x + fromNode.width / 2,
    y: fromNode.y + fromNode.height / 2
  };
  
  const toCenter = {
    x: toNode.x + toNode.width / 2,
    y: toNode.y + toNode.height / 2
  };
  
  // Calculate angle between centers
  const angle = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x);
  
  // Get connection points based on angle
  const fromPoint = getNodeConnectionPoint(fromNode, angle);
  const toPoint = getNodeConnectionPoint(toNode, angle + Math.PI); // Opposite direction
  
  return { from: fromPoint, to: toPoint };
}

// Get the best connection point on a node based on the angle to the target
function getNodeConnectionPoint(node: NodeData, angle: number): ConnectionPoint {
  // Node boundaries
  const top = node.y;
  const right = node.x + node.width;
  const bottom = node.y + node.height;
  const left = node.x;
  const centerX = node.x + node.width / 2;
  const centerY = node.y + node.height / 2;
  
  // Normalize angle to 0-2π
  const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
  
  // Determine which side to connect to based on angle
  let point: Point;
  let direction: 'top' | 'right' | 'bottom' | 'left';
  
  // Top: -π/4 to π/4
  if ((normalizedAngle >= 7 * Math.PI / 4) || (normalizedAngle <= Math.PI / 4)) {
    point = { x: right, y: centerY };
    direction = 'right';
  }
  // Bottom: π/4 to 3π/4
  else if (normalizedAngle <= 3 * Math.PI / 4) {
    point = { x: centerX, y: bottom };
    direction = 'bottom';
  }
  // Left: 3π/4 to 5π/4
  else if (normalizedAngle <= 5 * Math.PI / 4) {
    point = { x: left, y: centerY };
    direction = 'left';
  }
  // Top: 5π/4 to 7π/4
  else {
    point = { x: centerX, y: top };
    direction = 'top';
  }
  
  return { point, direction };
}

// Generate a cubic bezier path between two points with proper control points
export function generateSmartPath(
  from: ConnectionPoint,
  to: ConnectionPoint,
  tension: number = 0.5
): string {
  const { point: fromPoint, direction: fromDir } = from;
  const { point: toPoint, direction: toDir } = to;
  
  // Calculate control points based on direction
  const cp1 = getControlPoint(fromPoint, fromDir, tension);
  const cp2 = getControlPoint(toPoint, toDir, tension);
  
  // Create SVG path
  return `M ${fromPoint.x} ${fromPoint.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${toPoint.x} ${toPoint.y}`;
}

// Calculate control point based on connection point and direction
function getControlPoint(point: Point, direction: string, tension: number): Point {
  const distance = 50 * tension;
  
  switch (direction) {
    case 'top':
      return { x: point.x, y: point.y - distance };
    case 'right':
      return { x: point.x + distance, y: point.y };
    case 'bottom':
      return { x: point.x, y: point.y + distance };
    case 'left':
      return { x: point.x - distance, y: point.y };
    default:
      return { x: point.x, y: point.y };
  }
}

// Generate a simple curved path between two points
export function generateCurvedPath(fromX: number, fromY: number, toX: number, toY: number, offset = 50): string {
  // Calculate control points for the curve
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2 + offset;

  return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
}

// Generate a straight path between two points
export function generateStraightPath(fromX: number, fromY: number, toX: number, toY: number): string {
  return `M ${fromX} ${fromY} L ${toX} ${toY}`;
}