import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const renderFileMessage = (file, fileType) => {
    switch (fileType) {
      case 'pdf':
        return <a href={file} target="_blank" rel="noopener noreferrer">View PDF</a>;
      case 'doc':
      case 'docx':
        return <a href={file} target="_blank" rel="noopener noreferrer">View Document</a>;
      case 'xls':
      case 'xlsx':
        return <a href={file} target="_blank" rel="noopener noreferrer">View Spreadsheet</a>;
      case 'ppt':
      case 'pptx':
        return <a href={file} target="_blank" rel="noopener noreferrer">View Presentation</a>;
      default:
        return <a href={file} target="_blank" rel="noopener noreferrer">Download File</a>;
    }
  };

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageinfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        <span>Just now</span>
      </div>
      <div className="messagecontact">
      {message.img && (
          <a href={message.img} target="_blank" rel="noopener noreferrer" download>
            <img src={message.img} alt="" />
          </a>
        )}
        <p>{message.text}</p>
        {message.audio && (
          <audio controls>
            <source src={message.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        <div className='file-message'>
          {message.file && renderFileMessage(message.file, message.fileType)}
        </div>    
        {message.video && (
          <video controls>
            <source src={message.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default Message;

