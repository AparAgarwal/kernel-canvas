import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import ContainerIcon from '@mui/icons-material/ViewInAr';
import ImageIcon from '@mui/icons-material/PhotoLibrary';
import VolumeIcon from '@mui/icons-material/Storage';
import NetworkIcon from '@mui/icons-material/NetworkWifi';
import Tooltip from '@mui/material/Tooltip';

// Draggable item component
const DraggableItem = ({ type, item, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type, data: item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="draggable-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 1 }}>{icon}</Box>
        <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
          {item.Names ? item.Names[0].replace(/^\//, '') : item.name || item.Name || item.Id?.substring(0, 12)}
        </Typography>
      </Box>
    </div>
  );
};

// TabPanel component to handle tab content
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sidebar-tabpanel-${index}`}
      aria-labelledby={`sidebar-tab-${index}`}
      {...other}
      style={{ overflowY: 'auto', height: 'calc(100% - 48px)' }}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Sidebar = ({ containers, images, volumes, networks, isLoading, open, onClose }) => {
  const [tabValue, setTabValue] = useState(0);
  const drawerWidth = 280;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative', // This is key for the clipped effect
          height: '100%',
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Docker Components
        </Typography>
      </Box>
      <Divider />
        <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="docker components tabs"
        sx={{
          minHeight: '48px',
          '& .MuiTab-root': {
            minHeight: '48px',
            minWidth: '60px',
            fontSize: '0.85rem',
            padding: '8px 12px',
          },
        }}
      >
        <Tab label="Containers" />
        <Tab label="Images" />
        <Tab label="Volumes" />
        <Tab label="Networks" />
      </Tabs>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Containers Tab */}
          <TabPanel value={tabValue} index={0}>
            {containers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No containers found
              </Typography>
            ) : (
              <List>                {containers.map((container) => (
                  <ListItem key={container.Id} disablePadding>
                    <Tooltip title={container.Image} placement="right">
                      <div>
                        <DraggableItem
                          type="CONTAINER"
                          item={container}
                          icon={<ContainerIcon color={container.State === 'running' ? 'success' : 'disabled'} />}
                        />
                      </div>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
          
          {/* Images Tab */}
          <TabPanel value={tabValue} index={1}>
            {images.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No images found
              </Typography>
            ) : (
              <List>                {images.map((image) => (
                  console.log(image),
                  <ListItem key={image.RepoDigest} disablePadding>
                    <Tooltip title={image.RepoTags ? image.RepoTags[0] : 'No tag'} placement="right">
                      <div>
                        <DraggableItem
                          type="IMAGE"
                          item={image}
                          icon={<ImageIcon />}
                        />
                      </div>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
          
          {/* Volumes Tab */}
          <TabPanel value={tabValue} index={2}>
            {volumes.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No volumes found
              </Typography>
            ) : (
              <List>                {volumes.map((volume) => (
                  <ListItem key={volume.Name} disablePadding>
                    <Tooltip title={volume.Driver} placement="right">
                      <div>
                        <DraggableItem
                          type="VOLUME"
                          item={volume}
                          icon={<VolumeIcon />}
                        />
                      </div>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
          
          {/* Networks Tab */}
          <TabPanel value={tabValue} index={3}>
            {networks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No networks found
              </Typography>
            ) : (
              <List>                {networks.map((network) => (
                  <ListItem key={network.Id} disablePadding>
                    <Tooltip title={network.Driver} placement="right">
                      <div>
                        <DraggableItem
                          type="NETWORK"
                          item={network}
                          icon={<NetworkIcon />}
                        />
                      </div>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
        </>
      )}
    </Drawer>
  );
};

export default Sidebar;
