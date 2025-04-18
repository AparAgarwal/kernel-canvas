import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import dockerTheme from './theme/dockerTheme';

import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import ContainerDetails from './components/ContainerDetails';

function App() {
  const [containers, setContainers] = useState([]);
  const [images, setImages] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch initial data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch containers
        const containersResponse = await fetch('http://localhost:5000/api/containers');
        const containersData = await containersResponse.json();
        setContainers(containersData);
        
        // Fetch images
        const imagesResponse = await fetch('http://localhost:5000/api/images');
        const imagesData = await imagesResponse.json();
        setImages(imagesData);
        
        // Fetch volumes
        const volumesResponse = await fetch('http://localhost:5000/api/volumes');
        const volumesData = await volumesResponse.json();
        setVolumes(volumesData.Volumes || []);
        
        // Fetch networks
        const networksResponse = await fetch('http://localhost:5000/api/networks');
        const networksData = await networksResponse.json();
        setNetworks(networksData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling every 10 seconds to keep data fresh
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };
  
  const handleNodeDeselect = () => {
    setSelectedNode(null);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
    return (
    <ThemeProvider theme={dockerTheme}>
      <CssBaseline /> {/* This normalizes styles and applies the base theme */}
      <DndProvider backend={HTML5Backend}>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          {/* App Bar at the top spanning full width */}
          <Toolbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={sidebarOpen} />
          
          {/* Main content area with sidebar, canvas, and details */}
          <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
            <Sidebar 
              containers={containers}
              images={images}
              volumes={volumes}
              networks={networks}
              isLoading={isLoading}
              open={sidebarOpen}
              onClose={handleToggleSidebar}
            />
            <main 
              className="main-content" 
              style={{ 
                flexGrow: 1,
                padding: '16px',
                transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1)',
                overflow: 'auto'
              }}
            >
              <Canvas 
                containers={containers}
                volumes={volumes}
                networks={networks}
                onNodeSelect={handleNodeSelect}
              />
            </main>
            
            {/* Container details panel - now part of the flex layout */}
            {selectedNode && (
              <ContainerDetails 
                node={selectedNode}
                onClose={handleNodeDeselect}
              />
            )}
          </div>
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
