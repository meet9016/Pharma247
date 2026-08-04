import React from 'react';

const NoData = ({ message = "", minHeight = "75vh" }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: minHeight, width: '100%', padding: '20px', borderRadius: '10px' }}>
      <img src="/Noo.png" alt="No Data Available" style={{ maxWidth: '450px', height: 'auto', marginBottom: '20px', mixBlendMode: 'multiply' }} />
      <span style={{ fontSize: '20px', fontWeight: '700', color: '#555' }}>{message}</span>
    </div>
  );
};

export default NoData;
