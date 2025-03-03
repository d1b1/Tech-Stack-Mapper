import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { NodeData } from '../types';

interface NoteNodeProps {
  node: NodeData;
}

const NoteNode: React.FC<NoteNodeProps> = ({ node }) => {
  // Default values if not specified
  const fontSize = node.fontSize || 14;
  const fontColor = node.fontColor || '#333';
  const backgroundColor = node.backgroundColor || '#fffde7';
  const borderWidth = node.borderWidth || 0;
  const borderColor = node.borderColor || '#e6ee9c';
  const hasDropShadow = node.dropShadow;

  return (
    <Group>
      {/* Drop shadow if enabled */}
      {hasDropShadow && (
        <Rect
          width={node.width}
          height={node.height}
          fill="black"
          opacity={0.3}
          cornerRadius={5}
          x={2}
          y={2}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={10}
          shadowOffset={{ x: 0, y: 4 }}
          shadowOpacity={0.5}
        />
      )}
      
      <Rect
        width={node.width}
        height={node.height}
        fill={backgroundColor}
        stroke={borderWidth > 0 ? borderColor : undefined}
        strokeWidth={borderWidth}
        cornerRadius={5}
        shadowColor={hasDropShadow ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)"}
        shadowBlur={hasDropShadow ? 10 : 5}
        shadowOffset={{ x: 0, y: hasDropShadow ? 4 : 2 }}
        shadowOpacity={hasDropShadow ? 0.7 : 0.5}
      />
      <Text
        text={node.content}
        width={node.width - 20}
        height={node.height - 20}
        x={10}
        y={10}
        fontSize={fontSize}
        fill={fontColor}
        wrap="word"
      />
    </Group>
  );
};

export default NoteNode;