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
import { NodeData, ConnectionData, DiagramData } from './types';

// Local storage key
const STORAGE_KEY = 'stack-diagram-data';
const NOTE_SETTINGS_KEY = 'stack-diagram-note-settings';
const CONNECTION_SETTINGS_KEY = 'stack-diagram-connection-settings';

function App() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
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
    fontColor: '#333333',
    backgroundColor: '#fffde7',
    width: 200,
    height: 120
  });
  const [canvasSettings, setCanvasSettings] = useState({
    backgroundColor: '#f8fafc'
  });
  
  const stageRef = useRef<any>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData: DiagramData = JSON.parse(savedData);
        if (parsedData.nodes && parsedData.connections) {
          setNodes(parsedData.nodes);
          setConnections(parsedData.connections);
          
          // Load canvas settings from the same data object
          if (parsedData.canvasSettings) {
            setCanvasSettings(parsedData.canvasSettings);
          }
          
          console.log('Loaded diagram data from localStorage');
        }
      } catch (error) {
        console.error('Error loading diagram from localStorage:', error);
      }
    }
    
    // Load note settings
    const savedNoteSettings = localStorage.getItem(NOTE_SETTINGS_KEY);
    if (savedNoteSettings) {
      try {
        const parsedSettings = JSON.parse(savedNoteSettings);
        setNoteEditorSettings(parsedSettings);
        console.log('Loaded note settings from localStorage');
      } catch (error) {
        console.error('Error loading note settings from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever nodes, connections, or canvas settings change
  useEffect(() => {
    if (nodes.length > 0 || connections.length > 0 || canvasSettings) {
      const diagramData: DiagramData = {
        nodes,
        connections,
        canvasSettings
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diagramData));
      console.log('Saved diagram data to localStorage');
    }
  }, [nodes, connections, canvasSettings]);
  
  // Save note settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NOTE_SETTINGS_KEY, JSON.stringify(noteEditorSettings));
    console.log('Saved note settings to localStorage');
  }, [noteEditorSettings]);

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
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === id ? { ...node, x, y } : node
      )
    );
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
      
      setNodes(prevNodes => [...prevNodes, newNode]);
      setShowImageUploader(false);
      
      // Auto-select the newly created node
      setSelectedNodeId(newNode.id);
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
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setShowNoteEditor(false);
    
    // Auto-select the newly created node
    setSelectedNodeId(newNode.id);
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
    
    setConnections(prevConnections => [...prevConnections, newConnection]);
    setShowConnectionModal(false);
  };

  // Handle connection selection
  const handleConnectionSelect = (connectionId: string) => {
    setSelectedNodeId(null); // Deselect any selected node
    setSelectedConnectionId(connectionId);
  };

  // Update connection from details panel
  const handleConnectionUpdate = (updatedConnection: ConnectionData) => {
    setConnections(prevConnections =>
      prevConnections.map(connection =>
        connection.id === updatedConnection.id ? updatedConnection : connection
      )
    );
  };

  // Update connection label
  const handleConnectionLabelUpdate = (connectionId: string, label: string) => {
    setConnections(prevConnections =>
      prevConnections.map(connection =>
        connection.id === connectionId ? { ...connection, label } : connection
      )
    );
    setShowConnectionLabelEditor(false);
  };

  // Delete connection
  const handleConnectionDelete = (connectionId: string) => {
    setConnections(prevConnections =>
      prevConnections.filter(connection => connection.id !== connectionId)
    );
    setSelectedConnectionId(null);
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
      // Remove the node
      setNodes(prevNodes => prevNodes.filter(node => node.id !== selectedNodeId));
      
      // Remove any connections involving this node
      setConnections(prevConnections => 
        prevConnections.filter(
          conn => conn.from !== selectedNodeId && conn.to !== selectedNodeId
        )
      );
      
      setSelectedNodeId(null);
      setShowDeleteConfirmation(false);
    }
  };

  // Show clear all confirmation modal
  const handleShowClearAllConfirmation = () => {
    setShowClearAllConfirmation(true);
  };

  // Clear all data from localStorage and reset the diagram
  const handleClearAll = () => {
    setNodes([]);
    setConnections([]);
    localStorage.removeItem(STORAGE_KEY);
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    setShowClearAllConfirmation(false);
  };

  // Save diagram to JSON file
  const handleSave = () => {
    const diagramData: DiagramData = {
      nodes,
      connections,
      canvasSettings
    };
    
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'stack-diagram.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Export diagram as PNG
  const handleExport = () => {
    setShowExportModal(true);
  };

  // Process the PNG export with the given filename
  const handleExportConfirm = (fileName: string) => {
    if (!stageRef.current) {
      alert('Cannot export diagram. Please try again.');
      return;
    }

    try {
      // Get the Konva stage
      const stage = stageRef.current.getStage();
      
      // Create a data URL of the stage
      const dataURL = stage.toDataURL({
        pixelRatio: 2, // Higher quality
        mimeType: 'image/png'
      });
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting diagram:', error);
      alert('Failed to export diagram. Please try again.');
    }
  };

  // Open settings panel
  const handleOpenSettings = () => {
    setShowSettingsPanel(true);
  };

  // Save settings
  const handleSaveSettings = (backgroundColor: string) => {
    setCanvasSettings({
      ...canvasSettings,
      backgroundColor
    });
  };

  // Load diagram from JSON file
  const handleLoad = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data: DiagramData = JSON.parse(result);
        
        if (data.nodes && data.connections) {
          setNodes(data.nodes);
          setConnections(data.connections);
          
          // Load canvas settings if available
          if (data.canvasSettings) {
            setCanvasSettings(data.canvasSettings);
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
      setSelectedNodeId(nodeId);
      setShowLogoEditor(true);
    } else if (node && node.type === 'note') {
      setSelectedNodeId(nodeId);
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
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === id ? { ...node, content, description } : node
      )
    );
    setShowLogoEditor(false);
  };

  // Update note content
  const handleNoteUpdate = (content: string) => {
    if (selectedNodeId) {
      const selectedNode = nodes.find(n => n.id === selectedNodeId);
      
      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === selectedNodeId ? { 
            ...node, 
            content,
            width: noteEditorSettings.width,
            height: noteEditorSettings.height,
            fontSize: noteEditorSettings.fontSize,
            fontColor: noteEditorSettings.fontColor,
            backgroundColor: noteEditorSettings.backgroundColor,
            borderWidth: 0 // Ensure border is removed
          } : node
        )
      );
      setShowNoteEditor(false);
    }
  };

  // Update node from details panel
  const handleNodeUpdateFromPanel = (updatedNode: NodeData) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === updatedNode.id ? updatedNode : node
      )
    );
    
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
    setSelectedNodeId(null);
    setShowDetailsPanel(false);
  };

  // Close connection details panel
  const handleCloseConnectionDetailsPanel = () => {
    setSelectedConnectionId(null);
    setShowConnectionDetailsPanel(false);
  };

  // Handle canvas click - only deselect if clicking on empty space
  const handleCanvasClick = (id: string | null, isEmptySpace: boolean) => {
    if (isEmptySpace) {
      setSelectedNodeId(null);
      setSelectedConnectionId(null);
    } else if (id) {
      setSelectedNodeId(id);
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
    setNodes(prevNodes => 
      prevNodes.map(node => ({
        ...node,
        x: node.x + offsetX,
        y: node.y + offsetY
      }))
    );
  };

  // Get the selected node
  const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;
  
  // Get the selected connection
  const selectedConnection = selectedConnectionId ? connections.find(conn => conn.id === selectedConnectionId) : null;

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
        selectedNodeId={selectedNodeId}
      />
      
      <div className="pt-16 flex flex-1">
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
            setSelectedConnectionId(null);
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
    </div>
  );
}

export default App;