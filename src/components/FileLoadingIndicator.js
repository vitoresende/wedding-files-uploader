import React from 'react';
import UploadFile from '@mui/icons-material/UploadFile';

const FileLoadingIndicator = ({ fileUploaded, totalFiles }) => {
  return (
    <div style={{ display: 'flex', zoom:0.8, color: 'white' }}>
      {/* Display the file icon here (you can customize this part) */}
      <div style={{ marginRight: '10px' }}>
        <UploadFile fontSize="small" /> 
      </div>
      <div>
        <div style={{zoom: 0.6}}>Carregando arquivos...</div>
        <div>{`${fileUploaded} / ${totalFiles}`}</div>
      </div>
    </div>
  );
};

export default FileLoadingIndicator;
