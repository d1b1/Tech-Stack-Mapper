import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { NodeData } from '../types';
import useImage from 'use-image';

interface LogoNodeProps {
  node: NodeData;
}

const LogoNode: React.FC<LogoNodeProps> = ({ node }) => {
  const [image] = useImage(node.imageUrl || '');
  const hasBorder = node.borderWidth && node.borderWidth > 0;
  const hasDropShadow = node.dropShadow;

  return (
    <Group>
      {/* Drop shadow if enabled */}
      {hasDropShadow && (
        <Rect
          width={node.width + (hasBorder ? 2 * (node.borderWidth || 0) : 0)}
          height={node.height + (hasBorder ? 2 * (node.borderWidth || 0) : 0)}
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

      {/* Background rect */}
      <Rect
        width={node.width + (hasBorder ? 2 * (node.borderWidth || 0) : 0)}
        height={node.height + (hasBorder ? 2 * (node.borderWidth || 0) : 0)}
        fill="white"
        stroke={hasBorder ? node.borderColor || "#000" : "#ddd"}
        strokeWidth={hasBorder ? node.borderWidth || 1 : 1}
        cornerRadius={5}
        shadowColor={hasDropShadow ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)"}
        shadowBlur={hasDropShadow ? 10 : 5}
        shadowOffset={{ x: 0, y: hasDropShadow ? 4 : 2 }}
        shadowOpacity={hasDropShadow ? 0.7 : 0.5}
      />

      {image && (
        <React.Fragment>
          {/* Use the image with proper scaling to fit within the node */}
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.rect(
                hasBorder ? (node.borderWidth || 0) : 0, 
                hasBorder ? (node.borderWidth || 0) : 0, 
                node.width, 
                node.height
              );
              ctx.closePath();
            }}
            x={hasBorder ? (node.borderWidth || 0) : 0}
            y={hasBorder ? (node.borderWidth || 0) : 0}
          >
            <Rect
              width={node.width}
              height={node.height}
              fill="white"
            />
            <Image
              image={image}
              width={node.width}
              height={node.height}
              imageSmoothingEnabled={true}
            />
          </Group>
        </React.Fragment>
      )}

      {/* Background for text */}
      <Rect
        width={node.width + (hasBorder ? 2 * (node.borderWidth || 0) : 0)}
        height={node.description ? 40 : 20}
        y={node.height + (hasBorder ? 2 * (node.borderWidth || 0) : 0) + 10}
        fill="white"
        opacity={0.85}
        cornerRadius={3}
      />

      {/* Title text */}
      <Text
        text={node.content}
        width={node.width + (hasBorder ? 2 * (node.borderWidth || 0) : 0)}
        align="center"
        y={node.height + (hasBorder ? 2 * (node.borderWidth || 0) : 0) + 15}
        fontSize={14}
        fill="#333"
      />

      {/* Description text with background */}
      {node.description && (
        <>
          <Text
            text={node.description}
            width={node.width + (hasBorder ? 2 * (node.borderWidth || 0) : 0)}
            align="center"
            y={node.height + (hasBorder ? 2 * (node.borderWidth || 0) : 0) + 35}
            fontSize={12}
            fill="#666"
          />
        </>
      )}
    </Group>
  );
};

// Import the Image component from react-konva
import { Image } from 'react-konva';

export default LogoNode;