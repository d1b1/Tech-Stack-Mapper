import { NodeData, ConnectionData } from '../types';

export interface RootState {
  diagram: DiagramState;
}

export interface DiagramState {
  nodes: NodeData[];
  connections: ConnectionData[];
  canvasSettings: {
    backgroundColor: string;
  };
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
} 