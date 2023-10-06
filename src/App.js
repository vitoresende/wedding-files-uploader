import React, { useState, useEffect } from 'react';
import db from './firebase-config';
import firebase from 'firebase/compat/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

import { Button, Container, Grid, Typography, CircularProgress } from '@mui/material'; // Import Material-UI components

import './App.css';

import ErrorPage from './components/ErrorPage'; // Import the ErrorPage component
import Watermark from './components/Watermark'; // Import the Watermark component
import CircularProgressWithLabel from './components/CircularProgressWithLabel';
import FileLoadingIndicator from './components/FileLoadingIndicator'; // Import the FileLoadingIndicator component
import Modal from './components/Modal'; // Import the Modal component

const STORAGE_PATH = 'uploads/';
const PREVIEW_PATH = 'previews/';
const FILES_COLLECTION = 'files';

const functions = getFunctions();
const checkCode = httpsCallable(functions, 'checkCode');

const App = () => {
  const [isUsers, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingApp, setLoadingApp] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(1);
  const [fileControl, setFileControl] = useState(0);
  const [progressControl, setProgressControl] = useState(0);
  const [finalProgress, setFinalProgress] = useState([]);
  const [sumControl, setSumControl] = useState(0);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [isAppChecked, setIsAppChecked] = useState(null);

  useEffect(() => {
    db.collection(FILES_COLLECTION).orderBy('datetime', 'desc').onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          title: doc.data().title,
          image: doc.data().images,
          preview: doc.data().preview,
          datetime: doc.data().datetime,
          type: doc.data().type
        };
      }));
    });

    if(isAppChecked === null) {
      checkCode({ codeParam: queryParams.get('code') })
      .then((result) => {
        setIsAppChecked(result.data);
        setLoadingApp(false);
      })
      .catch((error) => {
        console.log("Error: " + error);
        setIsAppChecked(false);
        setLoadingApp(false);
      });
    }
  }, []);

  useEffect(() => {
    if(sumControl){
      const sum = finalProgress.reduce(function(a, b) { return a + b; }, 0);
      console.log("SUMMM " + sum)
      setUploadProgress(sum/totalFiles);
    }
  }, [sumControl, finalProgress, totalFiles]);

  useEffect(() => {
    if(fileControl){
      setCurrentFileIndex(index => index + 1); 
    }
  }, [fileControl]);

  useEffect(() => {
    if(progressControl){
      console.log(progressControl)
      setFinalProgress(progress => {
        progress[progressControl.index] = progressControl.value
        console.log("progress " + progress)
        return progress
      })
      setSumControl(new Date().getUTCMilliseconds());
    }
  }, [progressControl]);

  const clearState = () => {
    setUploadProgress(0);
    setLoading(false);
    setTotalFiles(1);
    setCurrentFileIndex(0);
    setFileControl(0);
    setProgressControl(0);
    setFinalProgress([]);
    setSumControl(0);
  }

  const openModal = (item) => {
    setModalItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalItem(null);
  };
  

  const generateFilePreview = async (file, storage, downloadURL) => {
    // Generate and save small previews for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const previewStoragePath = PREVIEW_PATH + file.name;
      const previewStorageRef = ref(storage, previewStoragePath);

      // Generate small previews using an appropriate technique based on the file type
      let previewBlob = null;
      let type = "image";
      if (file.type.startsWith('image/')) {
        // Generate small preview image
        previewBlob = await generateImagePreview(file);
      } else if (file.type.startsWith('video/')) {
        type = "video"
        previewBlob = await generateVideoThumbnail(file);
      }

      saveFile(previewStorageRef, previewBlob, file, downloadURL, type);
    }
  }

  const generateVideoThumbnail = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");
  
      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
  
      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");
        canvas.width = 100;
        canvas.height = (100 * video.videoHeight) / video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.pause();
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, 'image/jpeg', 0.5);
      };
    });
  };

  const generateImagePreview = async (originalFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Important to enable cross-origin loading
      img.src = URL.createObjectURL(originalFile);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = (100 * img.height) / img.width;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, 'image/jpeg', 0.5);
      };
    });
  };

  const saveFile = (previewStorageRef, previewBlob, file, downloadURL, type) => {
    // Upload the generated preview
    const previewUploadTask = uploadBytesResumable(previewStorageRef, previewBlob);
    previewUploadTask.on('state_changed',
      () => {},
      (error) => {
        console.log(`Error uploading preview for ${file.name}:`, error);
      },
      async () => {
        const previewDownloadURL = await getDownloadURL(previewUploadTask.snapshot.ref);
        db.collection(FILES_COLLECTION).add({
          title: file.name,
          images: downloadURL,
          preview: previewDownloadURL,
          datetime: firebase.firestore.FieldValue.serverTimestamp(),
          type
        });
      }
    );
  }

  const addList = async (e) => {
    try {
      const storage = getStorage();

      // Set the loading state to true and show the progress bar
      setLoading(true);
      const filesLocal = Array.from(e.target.files);
      setTotalFiles(filesLocal.length)

      const uploadPromises = filesLocal.map(async (file, index) => {
        const storagePath = STORAGE_PATH + file.name;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // Update the upload progress state
            setProgressControl({index, "value": progress});
          },
          (error) => {
            console.log(`Error uploading ${file.name}:`, error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await generateFilePreview(file, storage, downloadURL);
              setFileControl(new Date().getUTCMilliseconds());
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        })
      });

      await Promise.all(uploadPromises); // Wait for all uploads and previews to complete
      clearState();
    } catch (error) {
      throw error;
    }
  }

  const queryParams = new URLSearchParams(window.location.search);

  return (
    <div className="App" style={{backgroundColor: "#93a69c", height: "100vh", overflowY: "auto"}}>
      <Modal item={modalItem} isOpen={isModalOpen} onClose={closeModal} />
      {isLoading && (<div id="loading-overlay" className="loading-overlay">
          <div className="loading-spinner padding-content">
            <FileLoadingIndicator
              fileUploaded={currentFileIndex}
              totalFiles={totalFiles}
            />
            <div style={{flex: 1, flexBasis: '100%'}}>
              <CircularProgressWithLabel value={uploadProgress? uploadProgress: 0} /> 
            </div>
          </div>
        </div>)}
      <Container maxWidth="md" style={{backgroundColor: "#b6c3b3", height: "100vh", display: "inline-table", paddingBottom: "25px"}}>
        <img
          src="/assets/wedding_main-image.jpg"
          alt="wedding image"
          style={{ width: '100%', marginBottom: '16px' }}
        />
        <Typography variant="h4" gutterBottom>Your title here</Typography>
        <Typography variant="body1" gutterBottom style={{ fontSize: '19px', fontFamily: 'Arial, sans-serif' }}>Add here your special message to your guests.</Typography>
        { isLoadingApp ? (<CircularProgress style={{ color: 'green' }} />) : isAppChecked ? 
          (
            <>
            <div className="wrapper" style={{ margin: "60px 0px"}}>
              {/* Hide the original file input */}
              <input
                  type="file"
                  accept="image/*, video/*"
                  onChange={addList}
                  multiple
                  style={{ display: 'none' }}
               />
              {/* Use the Button component as the file input button */}
              <Button
                  variant="contained"
                  component="label" // This makes the Button behave like a label
                  sx={{ backgroundColor: '#16511a', color: '#fff' }} // Custom styling
               >
                  Upload photo and/or video
                  <input type="file" accept="image/*, video/*" onChange={addList} multiple style={{ display: 'none' }} />
               </Button>
            </div>
            <Grid container spacing={1}>
               {isUsers.map((item) => (
                  <Grid item xs={4} sm={4} md={4} className="grid-container" key={item.id}>
                    {item.type === 'video' && <Watermark type="video" />}
                     <div className="wrapper__list image-div">
                        <img
                          src={item.preview}
                          alt=""
                          className="responsive-img"
                          onClick={() => openModal(item)}
                          style={{ cursor: 'pointer' }}
                        />
                     </div>
                  </Grid>
               ))}
            </Grid>
            </>
          ) : (
            <ErrorPage />
          )
        }
      </Container>
   </div>
  );
};

export default App;