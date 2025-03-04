import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ImageUploader from './components/ImageUploader';
import NoteEditor from './components/NoteEditor';
import ConnectionModal from './components/ConnectionModal';
import LogoEditor from './components/LogoEditor';
import ConnectionLabelEditor from './components/ConnectionLabelEditor';
import NodeDetailsPanel from './components/NodeDetailsPanel';
import ConnectionDetailsPanel from './components/ConnectionDetailsPanel';
import ExportModal from './components/ExportModal';
import SettingsPanel from './components/SettingsPanel';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import SaveDiagramModal from './components/SaveDiagramModal';
import LoadDiagramModal from './components/LoadDiagramModal';
import LoadExampleModal from './components/LoadExampleModal';
import { NodeData, ConnectionData, DiagramData } from './types';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
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
} from './store/diagramSlice';
import LoadingSpinner from './components/LoadingSpinner';

// Local storage key
const STORAGE_KEY = 'stack-diagram-data';
const NOTE_SETTINGS_KEY = 'stack-diagram-note-settings';
const CONNECTION_SETTINGS_KEY = 'stack-diagram-connection-settings';

// Add this example data
const EXAMPLE_DATA = {
  nodes: [
    {
      id: "frontend",
      type: "logo",
      content: "React",
      description: "Frontend Framework",
      x: 400,
      y: 200,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/react.png"
    },
    {
      id: "backend",
      type: "logo",
      content: "Node.js",
      description: "Backend Runtime",
      x: 400,
      y: 400,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/nodejs.png"
    },
    {
      id: "database",
      type: "logo",
      content: "PostgreSQL",
      description: "Database",
      x: 600,
      y: 400,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/postgresql.png"
    },
    {
      id: "cache",
      type: "logo",
      content: "Redis",
      description: "Cache Layer",
      x: 600,
      y: 200,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/redis.png"
    },
    {
      id: "auth",
      type: "logo",
      content: "Auth0",
      description: "Authentication Service",
      x: 200,
      y: 300,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/auth0.png"
    },
    {
      id: "cdn",
      type: "logo",
      content: "Cloudflare",
      description: "CDN & Security",
      x: 800,
      y: 300,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/cloudflare.png"
    },
    {
      id: "storage",
      type: "logo",
      content: "S3",
      description: "Object Storage",
      x: 700,
      y: 500,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/aws-s3.png"
    },
    {
      id: "search",
      type: "logo",
      content: "Elasticsearch",
      description: "Search Engine",
      x: 300,
      y: 500,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/elasticsearch.png"
    },
    {
      id: "monitoring",
      type: "logo",
      content: "Datadog",
      description: "Monitoring & APM",
      x: 500,
      y: 600,
      width: 100,
      height: 100,
      imageUrl: "https://cdn.lowcodecto.com/logos/datadog.png"
    },
    {
      id: "note1",
      type: "note",
      content: "Modern Web Stack\nScalable Architecture",
      x: 400,
      y: 100,
      width: 200,
      height: 80,
      fontSize: 14,
      fontColor: "#333333",
      backgroundColor: "#fffde7"
    }
  ],
  connections: [
    {
      id: "conn1",
      from: "frontend",
      to: "backend",
      label: "API Calls",
      pathType: "smart",
      lineColor: "#666666",
      lineWidth: 2,
      lineDash: [5, 5]
    },
    {
      id: "conn2",
      from: "backend",
      to: "database",
      label: "Queries",
      pathType: "smart",
      lineColor: "#666666",
      lineWidth: 2,
      lineDash: [5, 5]
    },
    {
      id: "conn3",
      from: "backend",
      to: "cache",
      label: "Cache",
      pathType: "smart",
      lineColor: "#666666",
      lineWidth: 2,
      lineDash: [5, 5]
    },
    {
      id: "conn4",
      from: "frontend",
      to: "auth",
      label: "Auth",
      pathType: "smart",
      lineColor: "#666666",
      lineWidth: 2,
      lineDash: [5, 5]
    },
    {
      id: "conn5",
      from: "frontend",
      to: "cdn",
      label: "Assets",
      pathType: "smart",
      lineColor: "#666666",
      lineWidth: 2,
      lineDash: [5, 5]
    },
    {
      id: "conn6",
      from: "backend",
      to: "storage",
      label: "Files",
      pathType: "smart",
      lineColor: "#666666",
      lineWidth: 2,
      lineDash: [5, 5]
    },
    {
      id: "conn7",
      from: "backend",
      to: "search",
      label: "Search",
      pathType: "smart",
      lineColor: "#666666",
      lineWidth: 2,
      lineDash: [5, 5]
    },
    {
      id: "conn8",
      from: "monitoring",
      to: "backend",
      label: "Metrics",
      pathType: "smart",
      lineColor: "#666666",
      lineWidth: 2,
      lineDash: [5, 5]
    }
  ]
};

function App() {
  const dispatch = useAppDispatch();
  const {
    nodes,
    connections,
    canvasSettings,
    selectedNodeId,
    selectedConnectionId
  } = useAppSelector(state => state.diagram);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showLogoEditor, setShowLogoEditor] = useState(false);
  const [showConnectionLabelEditor, setShowConnectionLabelEditor] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showClearAllConfirmation, setShowClearAllConfirmation] = useState(false);
  const [connectionMode, setConnectionMode] = useState<'from' | 'to' | null>(null);
  const [connectionSource, setConnectionSource] = useState<string | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showConnectionDetailsPanel, setShowConnectionDetailsPanel] = useState(false);
  const [noteEditorSettings, setNoteEditorSettings] = useState({
    fontSize: 14,
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    width: 200,
    height: 120
  });
  const [backgroundColor, setBackgroundColor] = useState('#f8fafc');
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showLoadExampleModal, setShowLoadExampleModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const stageRef = useRef<any>(null);

  // Show details panel when a node is selected
  useEffect(() => {
    if (selectedNodeId) {
      setShowDetailsPanel(true);
      setSelectedConnectionId(null);
      setShowConnectionDetailsPanel(false);
    } else {
      setShowDetailsPanel(false);
    }
  }, [selectedNodeId]);

  // Show connection details panel when a connection is selected
  useEffect(() => {
    if (selectedConnectionId) {
      setShowConnectionDetailsPanel(true);
      setSelectedNodeId(null);
      setShowDetailsPanel(false);
    } else {
      setShowConnectionDetailsPanel(false);
    }
  }, [selectedConnectionId]);

  // Handle node movement
  const handleNodeMove = (id: string, x: number, y: number) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      dispatch(updateNode({ ...node, x, y }));
    }
  };

  // Add a new logo node
  const handleAddLogo = () => {
    setShowImageUploader(true);
  };

  // Add a new note node
  const handleAddNote = () => {
    setShowNoteEditor(true);
  };

  // Handle image upload completion
  const handleImageUpload = (imageUrl: string, name: string) => {
    // Create an image element to get the natural dimensions
    const img = new Image();
    img.onload = () => {
      // Calculate a reasonable size based on the image's natural dimensions
      // while maintaining aspect ratio
      const maxWidth = 200; // Maximum width for the node
      const aspectRatio = img.naturalHeight / img.naturalWidth;
      
      let width = Math.min(img.naturalWidth, maxWidth);
      let height = width * aspectRatio;
      
      // Create the new node with the calculated dimensions
      const newNode: NodeData = {
        id: uuidv4(),
        x: Math.random() * 500 + 100,
        y: Math.random() * 200 + 100,
        type: 'logo',
        content: name,
        description: '',
        width,
        height,
        imageUrl,
      };
      
      dispatch(addNode(newNode));
      dispatch(setSelectedNodeId(newNode.id));
      setShowImageUploader(false);
    };
    
    img.src = imageUrl;
  };

  // Handle note creation
  const handleNoteCreate = (content: string) => {
    const newNode: NodeData = {
      id: uuidv4(),
      x: Math.random() * 500 + 100,
      y: Math.random() * 200 + 300,
      type: 'note',
      content,
      width: noteEditorSettings.width,
      height: noteEditorSettings.height,
      fontSize: noteEditorSettings.fontSize,
      fontColor: noteEditorSettings.fontColor,
      backgroundColor: noteEditorSettings.backgroundColor,
      borderWidth: 0 // Set default border width to 0
    };
    
    dispatch(addNode(newNode));
    dispatch(setSelectedNodeId(newNode.id));
    setShowNoteEditor(false);
  };

  // Start connection process
  const handleAddConnection = () => {
    if (selectedNodeId) {
      setShowConnectionModal(true);
    }
  };

  // Complete connection creation
  const handleCreateConnection = (fromId: string, toId: string, pathType: 'smart' | 'curved' | 'straight' = 'smart') => {
    // Load default connection settings
    let lineColor = '#666666';
    let lineWidth = 2;
    let lineDash = [5, 5];
    
    const savedConnectionSettings = localStorage.getItem(CONNECTION_SETTINGS_KEY);
    if (savedConnectionSettings) {
      try {
        const settings = JSON.parse(savedConnectionSettings);
        lineColor = settings.lineColor || lineColor;
        lineWidth = settings.lineWidth || lineWidth;
        if (!settings.lineDash) {
          lineDash = undefined;
        }
      } catch (error) {
        console.error('Error loading connection settings:', error);
      }
    }
    
    const newConnection: ConnectionData = {
      id: uuidv4(),
      from: fromId,
      to: toId,
      controlPointOffset: Math.random() * 30 + 40, // Random offset for variety
      pathType: pathType,
      lineWidth,
      lineColor,
      lineDash
    };
    
    dispatch(addConnection(newConnection));
    setShowConnectionModal(false);
  };

  // Handle connection selection
  const handleConnectionSelect = (connectionId: string) => {
    dispatch(setSelectedNodeId(null)); // Deselect any selected node
    dispatch(setSelectedConnectionId(connectionId));
  };

  // Update connection from details panel
  const handleConnectionUpdate = (updatedConnection: ConnectionData) => {
    dispatch(updateConnection(updatedConnection));
  };

  // Update connection label
  const handleConnectionLabelUpdate = (connectionId: string, label: string) => {
    dispatch(updateConnection({ ...connections.find(c => c.id === connectionId)!, label }));
    setShowConnectionLabelEditor(false);
  };

  // Delete connection
  const handleConnectionDelete = (connectionId: string) => {
    dispatch(deleteConnection(connectionId));
    dispatch(setSelectedConnectionId(null));
    setShowConnectionDetailsPanel(false);
  };

  // Show delete confirmation modal
  const handleShowDeleteConfirmation = () => {
    if (selectedNodeId) {
      setShowDeleteConfirmation(true);
    }
  };

  // Delete selected node and its connections
  const handleDelete = () => {
    if (selectedNodeId) {
      dispatch(deleteNode(selectedNodeId));
      
      // Remove any connections involving this node
      dispatch(deleteConnection(selectedNodeId));
      
      dispatch(setSelectedNodeId(null));
      setShowDeleteConfirmation(false);
    }
  };

  // Show clear all confirmation modal
  const handleShowClearAllConfirmation = () => {
    setShowClearAllConfirmation(true);
    setShowOptionsMenu(false); // Close the options menu
  };

  // Clear all data from localStorage and reset the diagram
  const handleClearAll = () => {
    dispatch(clearAll());
    setShowClearAllConfirmation(false);
  };

  // Modify the save handler to show the modal
  const handleSave = () => {
    setShowSaveModal(true);
  };

  // Add new handler for actual saving
  const handleSaveConfirm = (fileName: string) => {
    const diagramData: DiagramData = {
      nodes,
      connections,
      canvasSettings
    };
    
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${fileName}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowSaveModal(false);
  };

  // Export diagram as PNG
  const handleExport = () => {
    setShowExportModal(true);
  };

  // Process the PNG export with the given filename
  const handleExportConfirm = (fileName: string) => {
    if (stageRef.current) {
      // Get all nodes and find the bounding box
      const nodes = stageRef.current.find('Group');
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      nodes.forEach((node: any) => {
        const box = node.getClientRect();
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
      });

      // Add 30px padding on all sides
      const padding = 30;
      const width = maxX - minX + (padding * 2);
      const height = maxY - minY + (padding * 2);

      // Create a temporary canvas with the exact size needed
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempContext = tempCanvas.getContext('2d');

      if (tempContext) {
        // Fill with background color
        tempContext.fillStyle = backgroundColor;
        tempContext.fillRect(0, 0, width, height);

        // Draw the stage content
        const stage = stageRef.current;
        const oldPos = stage.position();
        const oldScale = stage.scale();
        const oldWidth = stage.width();
        const oldHeight = stage.height();

        // Temporarily adjust stage to fit our export
        stage.position({
          x: -minX + padding,
          y: -minY + padding
        });
        stage.width(width);
        stage.height(height);

        // Draw the stage
        stage.draw();

        // Convert to PNG
        const dataURL = stage.toCanvas().toDataURL();

        // Restore original stage properties
        stage.position(oldPos);
        stage.scale(oldScale);
        stage.width(oldWidth);
        stage.height(oldHeight);
        stage.draw();

        // Create download link
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    setShowExportModal(false);
  };

  // Open settings panel
  const handleOpenSettings = () => {
    setShowSettingsPanel(true);
  };

  // Save settings
  const handleSaveSettings = (backgroundColor: string) => {
    dispatch(setCanvasSettings({
      ...canvasSettings,
      backgroundColor
    }));
  };

  // Modify the load handler to show the modal first
  const handleLoad = () => {
    setShowLoadModal(true);
  };

  // Add new handler for actual file selection
  const handleLoadConfirm = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowLoadModal(false);
  };

  // Modify the file change handler
  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data: DiagramData = JSON.parse(result);
        
        if (data.nodes && data.connections) {
          dispatch(setNodes(data.nodes));
          dispatch(setConnections(data.connections));
          
          // Load canvas settings if available
          if (data.canvasSettings) {
            dispatch(setCanvasSettings(data.canvasSettings));
          }
        }
      } catch (error) {
        console.error('Error loading diagram:', error);
        alert('Failed to load diagram. The file might be corrupted.');
      }
    };
    
    reader.readAsText(file);
  };

  // Handle double click on a node to edit it
  const handleNodeDoubleClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.type === 'logo') {
      dispatch(setSelectedNodeId(nodeId));
      setShowLogoEditor(true);
    } else if (node && node.type === 'note') {
      dispatch(setSelectedNodeId(nodeId));
      setShowNoteEditor(true);
      
      // Update note editor settings based on the selected note
      if (node.fontSize || node.fontColor || node.backgroundColor) {
        setNoteEditorSettings({
          fontSize: node.fontSize || 14,
          fontColor: node.fontColor || '#333333',
          backgroundColor: node.backgroundColor || '#fffde7',
          width: node.width || 200,
          height: node.height || 120
        });
      }
    }
  };

  // Update logo details
  const handleLogoUpdate = (id: string, content: string, description: string) => {
    dispatch(updateNode({ ...nodes.find(n => n.id === id)!, content, description }));
    setShowLogoEditor(false);
  };

  // Update note content
  const handleNoteUpdate = (content: string) => {
    if (selectedNodeId) {
      const selectedNode = nodes.find(n => n.id === selectedNodeId);
      
      dispatch(updateNode({ 
        ...selectedNode!, 
        content,
        width: noteEditorSettings.width,
        height: noteEditorSettings.height,
        fontSize: noteEditorSettings.fontSize,
        fontColor: noteEditorSettings.fontColor,
        backgroundColor: noteEditorSettings.backgroundColor,
        borderWidth: 0 // Ensure border is removed
      }));
      setShowNoteEditor(false);
    }
  };

  // Update node from details panel
  const handleNodeUpdateFromPanel = (updatedNode: NodeData) => {
    dispatch(updateNode(updatedNode));
    
    // If it's a note, update the note editor settings for consistency
    if (updatedNode.type === 'note') {
      setNoteEditorSettings({
        fontSize: updatedNode.fontSize || 14,
        fontColor: updatedNode.fontColor || '#333333',
        backgroundColor: updatedNode.backgroundColor || '#fffde7',
        width: updatedNode.width || 200,
        height: updatedNode.height || 120
      });
    }
  };

  // Close details panel
  const handleCloseDetailsPanel = () => {
    dispatch(setSelectedNodeId(null));
    setShowDetailsPanel(false);
  };

  // Close connection details panel
  const handleCloseConnectionDetailsPanel = () => {
    dispatch(setSelectedConnectionId(null));
    setShowConnectionDetailsPanel(false);
  };

  // Handle canvas click - only deselect if clicking on empty space
  const handleCanvasClick = (id: string | null, isEmptySpace: boolean) => {
    if (isEmptySpace) {
      dispatch(setSelectedNodeId(null));
      dispatch(setSelectedConnectionId(null));
    } else if (id) {
      dispatch(setSelectedNodeId(id));
    }
  };

  // Listen for node double-click events
  useEffect(() => {
    const handleEditNode = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.nodeId) {
        handleNodeDoubleClick(customEvent.detail.nodeId);
      }
    };

    window.addEventListener('edit-node', handleEditNode);
    return () => {
      window.removeEventListener('edit-node', handleEditNode);
    };
  }, [nodes]); // Re-add listener if nodes change

  // Center all elements on the canvas
  const handleCenterElements = () => {
    if (nodes.length === 0) return;
    
    // Calculate the current bounds of all nodes
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    });
    
    // Calculate the center of the current arrangement
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Get the canvas dimensions
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight - 50; // Subtract toolbar height
    
    // Calculate the offset to center the arrangement
    const offsetX = canvasWidth / 2 - centerX;
    const offsetY = canvasHeight / 2 - centerY;
    
    // Apply the offset to all nodes
    dispatch(setNodes(nodes.map(node => ({
      ...node,
      x: node.x + offsetX,
      y: node.y + offsetY
    }))))
  };

  // Get the selected node
  const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;
  
  // Get the selected connection
  const selectedConnection = selectedConnectionId ? connections.find(conn => conn.id === selectedConnectionId) : null;

  // Add this effect to simulate loading time or use it with actual data loading
  useEffect(() => {
    // Simulate loading time or replace with actual data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloneNode = (node: NodeData) => {
    const newNode = {
      ...node,
      id: crypto.randomUUID(), // Generate new ID
      x: node.x + 20, // Offset slightly from original
      y: node.y + 20,
      content: `${node.content} (Copy)` // Add (Copy) to name
    };
    
    dispatch(addNode(newNode));
    dispatch(setSelectedNodeId(newNode.id));
  };

  const handleLoadExample = () => {
    setShowLoadExampleModal(true);
  };

  const handleLoadExampleConfirm = () => {
    dispatch(setNodes(EXAMPLE_DATA.nodes));
    dispatch(setConnections(EXAMPLE_DATA.connections));
    handleCenterElements(); // Center the example elements after loading
    setShowLoadExampleModal(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toolbar
        onAddLogo={handleAddLogo}
        onAddNote={handleAddNote}
        onAddConnection={handleAddConnection}
        onDelete={handleShowDeleteConfirmation}
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onClearAll={handleShowClearAllConfirmation}
        onCenterElements={handleCenterElements}
        onOpenSettings={handleOpenSettings}
        onLoadExample={handleLoadExample}
        selectedNodeId={selectedNodeId}
      />
      
      {/* Welcome message */}
      {nodes.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome to LCCTO Technology Stack Builder!
          </h2>
          <br/>
          <p className="text-lg text-gray-600">
            Click 'Add Stack Element' in the toolbar above to add your first stack element.
            This tool is designed to help a founder plan for an map their technology stack.
          </p>
        </div>
      )}
      
      <div className="pt-16 pb-12 flex flex-1">
        <div className="w-full">
          <Canvas
            nodes={nodes}
            connections={connections}
            onNodeMove={handleNodeMove}
            onNodeSelect={handleCanvasClick}
            selectedNodeId={selectedNodeId}
            onConnectionSelect={handleConnectionSelect}
            selectedConnectionId={selectedConnectionId}
            stageRef={stageRef}
            backgroundColor={canvasSettings.backgroundColor}
          />
        </div>
        
        {showDetailsPanel && selectedNode && (
          <NodeDetailsPanel 
            node={selectedNode}
            onEdit={handleNodeDoubleClick}
            onUpdate={handleNodeUpdateFromPanel}
            onClose={handleCloseDetailsPanel}
            onDelete={handleShowDeleteConfirmation}
            onAddConnection={handleAddConnection}
            onClone={handleCloneNode}
          />
        )}

        {showConnectionDetailsPanel && selectedConnection && ( <ConnectionDetailsPanel
            connection={selectedConnection}
            nodes={nodes}
            onUpdate={handleConnectionUpdate}
            onDelete={handleConnectionDelete}
            onClose={handleCloseConnectionDetailsPanel}
          />
        )}
      </div>
      
      {showImageUploader && (
        <ImageUploader
          onImageUpload={handleImageUpload}
          onCancel={() => setShowImageUploader(false)}
        />
      )}
      
      {showNoteEditor && (
        <NoteEditor
          initialContent={selectedNodeId ? nodes.find(n => n.id === selectedNodeId)?.content || '' : ''}
          onSave={selectedNodeId ? handleNoteUpdate : handleNoteCreate}
          onCancel={() => setShowNoteEditor(false)}
        />
      )}
      
      {showConnectionModal && selectedNodeId && (
        <ConnectionModal
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onConnect={handleCreateConnection}
          onCancel={() => setShowConnectionModal(false)}
        />
      )}

      {showLogoEditor && selectedNodeId && (
        <LogoEditor
          node={nodes.find(n => n.id === selectedNodeId)!}
          onSave={handleLogoUpdate}
          onCancel={() => setShowLogoEditor(false)}
        />
      )}

      {showConnectionLabelEditor && selectedConnectionId && (
        <ConnectionLabelEditor
          connection={connections.find(c => c.id === selectedConnectionId)!}
          onSave={handleConnectionLabelUpdate}
          onDelete={handleConnectionDelete}
          onCancel={() => {
            setShowConnectionLabelEditor(false);
            dispatch(setSelectedConnectionId(null));
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          onExport={handleExportConfirm}
          onCancel={() => setShowExportModal(false)}
        />
      )}

      {showSettingsPanel && (
        <SettingsPanel
          backgroundColor={canvasSettings.backgroundColor}
          onSave={handleSaveSettings}
          onClose={() => setShowSettingsPanel(false)}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          title="Delete Element"
          message="Are you sure you want to delete this element? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}

      {showClearAllConfirmation && (
        <DeleteConfirmationModal
          title="Clear All Data"
          message="Are you sure you want to clear all diagram data? This action cannot be undone."
          onConfirm={handleClearAll}
          onCancel={() => setShowClearAllConfirmation(false)}
        />
      )}

      {showSaveModal && (
        <SaveDiagramModal
          onSave={handleSaveConfirm}
          onCancel={() => setShowSaveModal(false)}
        />
      )}

      {showLoadModal && (
        <LoadDiagramModal
          onConfirm={handleLoadConfirm}
          onCancel={() => setShowLoadModal(false)}
        />
      )}

      {showLoadExampleModal && (
        <LoadExampleModal
          onConfirm={handleLoadExampleConfirm}
          onCancel={() => setShowLoadExampleModal(false)}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileChange(file);
          }
        }}
        accept=".json"
        className="hidden"
      />
    </div>
  );
}

export default App;