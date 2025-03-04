import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiagramState } from './types';
import { NodeData, ConnectionData } from '../types';

const initialState: DiagramState = {
  nodes: [],
  connections: [],
  canvasSettings: {
    backgroundColor: '#f8fafc'
  },
  selectedNodeId: null,
  selectedConnectionId: null
};

const diagramSlice = createSlice({
  name: 'diagram',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<NodeData[]>) => {
      state.nodes = action.payload;
    },
    addNode: (state, action: PayloadAction<NodeData>) => {
      state.nodes.push(action.payload);
    },
    updateNode: (state, action: PayloadAction<NodeData>) => {
      const index = state.nodes.findIndex(node => node.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = action.payload;
      }
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(node => node.id !== action.payload);
      // Also remove any connections involving this node
      state.connections = state.connections.filter(
        conn => conn.from !== action.payload && conn.to !== action.payload
      );
    },
    setConnections: (state, action: PayloadAction<ConnectionData[]>) => {
      state.connections = action.payload;
    },
    addConnection: (state, action: PayloadAction<ConnectionData>) => {
      state.connections.push(action.payload);
    },
    updateConnection: (state, action: PayloadAction<ConnectionData>) => {
      const index = state.connections.findIndex(conn => conn.id === action.payload.id);
      if (index !== -1) {
        state.connections[index] = action.payload;
      }
    },
    deleteConnection: (state, action: PayloadAction<string>) => {
      state.connections = state.connections.filter(conn => conn.id !== action.payload);
    },
    setCanvasSettings: (state, action: PayloadAction<{ backgroundColor: string }>) => {
      state.canvasSettings = action.payload;
    },
    setSelectedNodeId: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    setSelectedConnectionId: (state, action: PayloadAction<string | null>) => {
      state.selectedConnectionId = action.payload;
    },
    clearAll: (state) => {
      state.nodes = [];
      state.connections = [];
      state.selectedNodeId = null;
      state.selectedConnectionId = null;
    }
  }
});

export const {
  setNodes,
  addNode,
  updateNode,
  deleteNode,
  setConnections,
  addConnection,
  updateConnection,
  deleteConnection,
  setCanvasSettings,
  setSelectedNodeId,
  setSelectedConnectionId,
  clearAll
} = diagramSlice.actions;

export default diagramSlice.reducer; 