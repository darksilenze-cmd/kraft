// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SmallStatusBox = ({ statusData }) => {
  const isBusy = statusData?.isBusy || false;
  const title = statusData?.title || 'Status';
  
  const boxStyle = {
    padding: '15px 20px',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    backgroundColor: isBusy ? '#dc3545' : '#28a745',
    minWidth: '120px',
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    border: isBusy ? '2px solid #c82333' : '2px solid #1e7e34'
  };

  const statusIcon = {
    fontSize: '20px',
    marginBottom: '5px'
  };

  return (
    <div style={boxStyle} title={isBusy ? 'Busy - Click to refresh' : 'Available - Click to refresh'}>
      <div style={statusIcon}>
        {isBusy ? '🔴' : '🟢'}
      </div>
      <div>{title}</div>
    </div>
  );
};

// Compact version (even smaller)
const CompactStatusBox = ({ statusData }) => {
  const isBusy = statusData?.isBusy || false;

  const boxStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    backgroundColor: isBusy ? '#dc3545' : '#28a745',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    margin: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    border: isBusy ? '1px solid #c82333' : '1px solid #1e7e34'
  };

  return (
    <div style={boxStyle}>
      <span>{isBusy ? '🔴' : '🟢'}</span>
      <span>{isBusy ? 'BUSY' : 'AVAIL'}</span>
    </div>
  );
};

// With live status text
const SmallStatusBoxWithText = ({ statusData }) => {
  const isBusy = statusData?.isBusy || false;
  const message = statusData?.message || (isBusy ? 'Busy' : 'Available');

  const boxStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '13px',
    backgroundColor: isBusy ? '#dc3545' : '#28a745',
    minWidth: '140px',
    minHeight: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    border: isBusy ? '2px solid #c82333' : '2px solid #1e7e34'
  };

  return (
    <div style={boxStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>
          {isBusy ? '🔴' : '🟢'}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

function App() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStatusData = async () => {
    try {
      const API_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
      
      const response = await axios.get(
        `${API_URL}/api/status-boxes?populate=*&sort=updatedAt:desc&pagination[pageSize]=1`
      );
      
      if (response.data.data && response.data.data.length > 0) {
        const latestStatus = response.data.data[0];
        setStatusData({
          id: latestStatus.id,
          title: latestStatus.attributes.title,
          isBusy: latestStatus.attributes.isBusy,
          message: latestStatus.attributes.message
        });
      } else {
        // Default data if no entries
        setStatusData({
          title: 'Status',
          isBusy: false,
          message: 'Available'
        });
      }
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching status:', error);
      // Fallback data
      setStatusData({
        title: 'Offline',
        isBusy: true,
        message: 'Connection Error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatusData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontSize: '14px',
        color: '#666'
      }}>
        Loading status...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '15px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: '18px',
        color: '#333'
      }}>
        System Status
      </h2>
      
      {/* Choose one of these box styles: */}
      
      {/* Option 1: Small box with icon and title */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <SmallStatusBox statusData={statusData} onClick={fetchStatusData} />
      </div>
      
      {/* Option 2: Compact box (even smaller) */}
      {/* <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <CompactStatusBox statusData={statusData} onClick={fetchStatusData} />
      </div> */}
      
      {/* Option 3: Box with status text */}
      {/* <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <SmallStatusBoxWithText statusData={statusData} onClick={fetchStatusData} />
      </div> */}
      
      <div style={{ 
        textAlign: 'center', 
        fontSize: '11px', 
        color: '#888',
        marginTop: '10px'
      }}>
        Updated: {lastUpdated}
        <br />
        <span 
          style={{ 
            cursor: 'pointer', 
            color: '#007bff',
            textDecoration: 'underline'
          }}
          onClick={fetchStatusData}
        >
          Click to refresh
        </span>
      </div>
      
      {/* Debug info - remove in production */}
      <div style={{ 
        fontSize: '10px', 
        color: '#ccc', 
        marginTop: '15px',
        textAlign: 'center'
      }}>
        Status: {statusData?.isBusy ? 'BUSY' : 'AVAILABLE'}
      </div>
    </div>
  );
}

export default App;