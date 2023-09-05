import React, { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';

const Modal = ({ item, isOpen, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && e.target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) {
    return null;
  }

  const handleCloseModal = () => {
    onClose();
  };

  const handleDownload = () => {
    fetch(item.image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.title;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading the file:', error);
      });
  };
  

  /*const handleDownload = () => {
    // Create an anchor element to trigger the download
    const downloadLink = document.createElement('a');
    console.log("item.image " + item.image)
    downloadLink.href = item.image.split("?")[0]; // Provide the image URL
    downloadLink.download = item.title;
    downloadLink.style.display = 'none'; // Hide the anchor element
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    
  };

  const handleDownload = () => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      const blob = xhr.response;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.title;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };
    xhr.open('GET', item.image);
    xhr.send();
  };*/

  const iconWrapperStyle = {
    background: '#fff',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
    display: 'inline-flex', 
    position: 'absolute',
    top: '5px',
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {item.type === 'video' ? (
          <video controls style={{ maxWidth: '100%', height: 'auto' }}>
            <source src={item.image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={item.image}
            alt=""
            style={{ maxWidth: '100%', maxHeight: '90vh', height: 'auto', overflow: 'auto' }}
          />
        )}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div onClick={handleCloseModal} style={{...iconWrapperStyle, right: '5px'}}>
            <CloseIcon />
          </div>
          <div onClick={handleDownload} style={{...iconWrapperStyle, right: '55px'}}>
            <GetAppIcon/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
