export interface NodeData {
  id: string;
  x: number;
  y: number;
  type: 'logo' | 'note';
  content: string;
  width: number;
  height: number;
  imageUrl?: string;
  description?: string;
  dropShadow?: boolean;
  borderWidth?: number;
  borderColor?: string;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
}

export interface ConnectionData {
  id: string;
  from: string;
  to: string;
  controlPointOffset?: number; // For curved connections
  pathType?: 'smart' | 'curved' | 'straight'; // Type of path to use
  label?: string; // Text label for the connection
  lineColor?: string; // Color of the connection line
  lineWidth?: number; // Width of the connection line
  lineDash?: number[]; // Dash pattern for the line
}

export interface DiagramData {
  nodes: NodeData[];
  connections: ConnectionData[];
  canvasSettings?: {
    backgroundColor: string;
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface ConnectionPoint {
  point: Point;
  direction: 'top' | 'right' | 'bottom' | 'left';
}