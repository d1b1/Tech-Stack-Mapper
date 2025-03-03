import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { NodeData } from '../types';
import LogoNode from './LogoNode';
import NoteNode from './NoteNode';

interface NodeProps {
  node: NodeData;
  isSelected: boolean;
  onDragMove: (id: string, x: number, y: number) => void;
  onClick: () => void;
}

const Node: React.FC<NodeProps> = ({ node, isSelected, onDragMove, onClick }) => {
  const handleDragMove = (e: any) => {
    onDragMove(node.id, e.target.x(), e.target.y());
  };

  const handleDblClick = () => {
    // Emit a custom event that App.tsx can listen for
    const event = new CustomEvent('node-double-click', { detail: { nodeId: node.id } });
    window.dispatchEvent(event);
  };

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable
      onDragMove={handleDragMove}
      onClick={onClick}
      onTap={onClick}
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
    >
      {/* Selection indicator - subtle highlight instead of dotted border */}
      {isSelected && (
        <Rect
          width={node.width + 10}
          height={node.height + 10}
          x={-5}
          y={-5}
          fill="rgba(59, 130, 246, 0.1)"
          cornerRadius={5}
        />
      )}

      {node.type === 'logo' ? (
        <LogoNode node={node} />
      ) : (
        <NoteNode node={node} />
      )}
    </Group>
  );
};

export default Node;