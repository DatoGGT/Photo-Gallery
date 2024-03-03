import styled from "styled-components";
import React, { useState } from "react";
import axios from "axios";


const Parent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.608);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & ul {
    display: flex;
    flex-direction: column;
    gap:30px;
    list-style: none;
  }

  .close {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background-color: #38a3a3;
    cursor: pointer;
    font-size: 20px;
    color: white;
    font-family: cursive;
    font-weight: bold;
    z-index: 1000;
  }

  .figureWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 80%;
    height: 80%;
    border-radius: 10px;
    padding: 20px;
    
    figure {
      width: 50%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
      }
    }

    .image-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-family: cursive;
      color: #646464;
      font-weight: bold;
    }
  }
`;

interface ModalProps {
        image: {
    downloads:number;
    id: string;
    description: string;
    views: number;
    urls: {
    small: string | undefined;
    };
    // views: number; // Add the necessary properties here
    // downloads: number;
    likes: number ;
  } | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ image, onClose }) => {
    const [status, setStatus] = useState({
        views: 0,
        downloads: 0,
        likes: 0
    });
    const accessKey = 'LPkef7d7gHJlEG0CIYQ2az3h424chysgXuKHKBbVYqY';
    if (!image) {
    return null;
    }
    const getStatus = async () => {
        const response = await axios.get(`https://api.unsplash.com/photos/${image.id}/?client_id=${accessKey}`);
        console.log(response);
        setStatus({
            views: response.data.views,
            downloads: response.data.downloads,
            likes: response.data.likes
        });
    }
   getStatus(); 

    return (

    <Parent >
        <button onClick={onClose} className="close">X</button>
        <div className="figureWrapper">
            <figure>
        <img src={image.urls.small} alt="loading" />
            </figure>
            <div className="image-info">
            <ul>
                <li> Likes: {status.likes}</li>
                <li> Views: {status.views}</li>
                <li> Downloads: {status.downloads}</li>
            </ul>
        </div>
        </div>
    </Parent>
    
);
};

export default Modal;
