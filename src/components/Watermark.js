import React from 'react';
import ImageIcon from '@mui/icons-material/Image';
import VideoIcon from '@mui/icons-material/PlayArrow';

import './Watermark.css';

const Watermark = ({ type }) => {
  return (
    <div className="watermark centralized-icon">
      {type === 'image' ? <ImageIcon fontSize="small" /> : <VideoIcon fontSize="small" />}
    </div>
  );
};

export default Watermark;
