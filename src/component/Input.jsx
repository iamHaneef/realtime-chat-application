import React, { useContext, useState } from 'react';
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import Audio from "../img/audio.png"; // Assuming you have an audio icon
import Doc from "../img/doc.png"; // Assuming you have a document icon
import Video from "../img/videos.jpg"; // Assuming you have a video icon
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

  const handleSend = async () => {
    // Your existing handleSend function

    if (!currentUser || !data.chatId) {
      console.error("Current user or chat ID not available.");
      return;
    }

    try {
      let downloadURL = null;
      const messageData = {
        id: uuidv4(),
        senderId: currentUser.uid,
        date: Timestamp.now(),
        text: text || "",   // ✅ ADD THIS LINE
      };

      if (img) {
        const storageRef = ref(storage, `chats/${data.chatId}/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, img);

        downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading image:", error);
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });

        messageData.img = downloadURL;
        setImg(null); // Reset image state
        document.getElementById('imageInput').value = null; // Reset file input
      } else if (audioFile) {
        const audioStorageRef = ref(storage, `chats/${data.chatId}/${uuidv4()}`);
        const audioUploadTask = uploadBytesResumable(audioStorageRef, audioFile);

        downloadURL = await new Promise((resolve, reject) => {
          audioUploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading audio:", error);
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(audioUploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });

        messageData.audio = downloadURL;
        setAudioFile(null); // Reset audio file state
        document.getElementById('audioInput').value = null; // Reset file input
      } else if (docFile) {
        const docStorageRef = ref(storage, `chats/${data.chatId}/${uuidv4()}`);
        const docUploadTask = uploadBytesResumable(docStorageRef, docFile);

        downloadURL = await new Promise((resolve, reject) => {
          docUploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading document:", error);
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(docUploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });

        messageData.file = downloadURL;
        messageData.fileType = docFile.name.split('.').pop();
        setDocFile(null); // Reset document file state
        document.getElementById('docInput').value = null; // Reset file input
      } else if (videoFile) { // Assuming you have a videoFile state for handling video uploads
        const videoStorageRef = ref(storage, `chats/${data.chatId}/${uuidv4()}`);
        const videoUploadTask = uploadBytesResumable(videoStorageRef, videoFile);

        downloadURL = await new Promise((resolve, reject) => {
          videoUploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading video:", error);
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(videoUploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });

        messageData.video = downloadURL;
        setVideoFile(null); // Reset video file state
        document.getElementById('videoInput').value = null; // Reset file input
      }

      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(messageData),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${data.chatId}.lastMessage`]: {
          text: text || "Media", // Provide a fallback if text is empty
        },
        [`${data.chatId}.date`]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [`${data.chatId}.lastMessage`]: {
          text: text || "Media", // Provide a fallback if text is empty
        },
        [`${data.chatId}.date`]: serverTimestamp(),
      });

      setText("");
      setImg(null);
      setAudioFile(null);
      setDocFile(null);
      setVideoFile(null); // Clear the video file state
    } catch (error) {
      console.error("Error sending message:", error);
    }

  };

  const handleOptionSelect = (option) => {
    // Handle option selection based on the chosen file type
    if (option === 'image') {
      document.getElementById('imageInput').click();
    } else if (option === 'audio') {
      document.getElementById('audioInput').click();
    } else if (option === 'doc') {
      document.getElementById('docInput').click();
    } else if (option === 'video') {
      document.getElementById('videoInput').click();
    }
    setShowDropdown(false); // Close dropdown after selecting an option
  };

  return (
    <div className='inputs'>
      <input
        type="text"
        placeholder='Type Something...'
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="block">
        <img src={Attach} alt='' onClick={() => setShowDropdown(!showDropdown)} className='master' />
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => handleOptionSelect('image')}>
              <img src={Img} alt='Upload File' />
              <span>Image</span>
            </div>
            <div className="dropdown-item" onClick={() => handleOptionSelect('audio')}>
              <img src={Audio} alt='Upload File' />
              <span>Audio</span>
            </div>
            <div className="dropdown-item" onClick={() => handleOptionSelect('doc')}>
              <img src={Doc} alt='Upload File' />
              <span>Docs  </span>
            </div>
            <div className="dropdown-item" onClick={() => handleOptionSelect('video')}>
              <img src={Video} alt='Upload File' />
              <span>Video</span>
            </div>
          </div>
        )}
        <input
          type="file"
          id='imageInput'
          style={{ display: 'none' }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <input
          type="file"
          id='audioInput'
          accept='audio/*'
          style={{ display: 'none' }}
          onChange={(e) => setAudioFile(e.target.files[0])}
        />
        <input
          type="file"
          id='docInput'
          accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
          style={{ display: 'none' }}
          onChange={(e) => setDocFile(e.target.files[0])}
        />
        <input
          type="file"
          id='videoInput'
          accept='video/*'
          style={{ display: 'none' }}
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
