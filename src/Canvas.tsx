import React, { useState, useRef } from 'react';
import { Stage, Layer, Path, Group, Text, Rect, TextPath } from 'react-konva';
import { NodeData, ConnectionData } from '../types';
import Node from './Node';
import { findBestConnectionPoints, generateSmartPath, generateCurvedPath, generateStraightPath } from '../utils/pathFinding';

interface CanvasProps {
  nodes: NodeData[];
  connections: ConnectionData[];
  onNodeMove: (id: string, x: number, y: number) => void;
  onNodeSelect: (id: string | null) => void;
  selectedNodeId: string | null;
  onConnectionSelect: (id: string) => void;
  selectedConnectionId: string | null;
}

const Canvas: React.FC<CanvasProps> = ({
  nodes,
  connections,
  onNodeMove,
  onNodeSelect,
  selectedNodeId,
  onConnectionSelect,
  selectedConnectionId,
}) => {
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const stageRef = useRef<any>(null);

  // Update stage size on window resize
  React.useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeDragMove = (id: string, x: number, y: number) => {
    onNodeMove(id, x, y);
  };

  const handleStageClick = (e: any) => {
    // If we click on empty space, deselect
    if (e.target === e.currentTarget) {
      onNodeSelect(null);
    }
  };

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
      onClick={handleStageClick}
      className="bg-gray-50"
    >
      <Layer>
        {/* Draw connections */}
        {connections.map((connection) => {
          const fromNode = nodes.find((node) => node.id === connection.from);
          const toNode = nodes.find((node) => node.id === connection.to);

          if (!fromNode || !toNode) return null;

          // Determine path type
          const pathType = connection.pathType || 'smart';
          let pathData: string;
          let midPoint = { x: 0, y: 0 };

          if (pathType === 'smart') {
            // Use smart path finding
            const connectionPoints = findBestConnectionPoints(fromNode, toNode);
            pathData = generateSmartPath(connectionPoints.from, connectionPoints.to);
            
            // Calculate midpoint for label
            const fromPoint = connectionPoints.from.point;
            const toPoint = connectionPoints.to.point;
            midPoint = {
              x: (fromPoint.x + toPoint.x) / 2,
              y: (fromPoint.y + toPoint.y) / 2
            };
          } else if (pathType === 'straight') {
            // Calculate simple connection points
            const fromX = fromNode.x + fromNode.width / 2;
            const fromY = fromNode.y + fromNode.height;
            const toX = toNode.x + toNode.width / 2;
            const toY = toNode.y;
            pathData = generateStraightPath(fromX, fromY, toX, toY);
            
            // Calculate midpoint for label
            midPoint = {
              x: (fromX + toX) / 2,
              y: (fromY + toY) / 2
            };
          } else {
            // Default to curved path
            const fromX = fromNode.x + fromNode.width / 2;
            const fromY = fromNode.y + fromNode.height;
            const toX = toNode.x + toNode.width / 2;
            const toY = toNode.y;
            const offset = connection.controlPointOffset || 50;
            pathData = generateCurvedPath(fromX, fromY, toX, toY, offset);
            
            // Calculate midpoint for label (adjusted for curve)
            midPoint = {
              x: (fromX + toX) / 2,
              y: (fromY + toY) / 2 + offset / 2
            };
          }

          const isSelected = connection.id === selectedConnectionId;
          const pathId = `path-${connection.id}`;

          return (
            <Group 
              key={connection.id}
              onClick={() => onConnectionSelect(connection.id)}
            >
              <Path
                id={pathId}
                data={pathData}
                stroke={isSelected ? "#3b82f6" : "#666"}
                strokeWidth={isSelected ? 3 : 2}
                dash={[5, 5]}
                tension={0.5}
              />
              
              {/* Connection label */}
              {connection.label && (
                <Group>
                  {/* Background for text path */}
                  <TextPath
                    data={pathData}
                    text={connection.label}
                    fontSize={12}
                    fontStyle="bold"
                    fill="transparent"
                    stroke="white"
                    strokeWidth={8}
                    align="center"
                    letterSpacing={1}
                    textBaseline="middle"
                  />
                  {/* Actual text */}
                  <TextPath
                    data={pathData}
                    text={connection.label}
                    fontSize={12}
                    fill="#333"
                    align="center"
                    letterSpacing={1}
                    textBaseline="middle"
                  />
                </Group>
              )}
            </Group>
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onDragMove={handleNodeDragMove}
            onClick={() => onNodeSelect(node.id)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;