import React, { useEffect, useRef, useState } from 'react';
import { useSearch } from './SearchContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Modal from "./Modal"

const Parent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & button {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 170px;
    height: 50px;
    background-color: #38a3a3;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    color: white;
}
    & button:hover {
        background-color: #2e8c8c;
    }
.historylink {
    list-style: square;
    
    & a {
        text-decoration: none;
        font-size: 18px;
        font-family: cursive;
            color: black;
        }
    }
    & a:hover {
        color: darkgray;
    }
    .wrapper{
        display: flex;
        flex-wrap: wrap;
    }
    .child{
        display: flex;
        flex-wrap: wrap;
    }
    .image {
        cursor: pointer;
    }

`;



interface Props {
    
    results: any;
    id: string;
    description: string;
    downloads: number;

    views: number;
    urls: {
    
    small: string | undefined;
    };
    onClose: () => void;
    likes: number;
}


const History: React.FC = () => {
    const { searchHistory, addToSearchHistory } = useSearch();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [SelectedWord, setSelectedWord] = useState<Props[]>([]);
    const navigate = useNavigate();
    const [SaveValue, setSaveValue] = useState<string>('');
    const [ShowModal, setShowModal] = useState<boolean>(false)
    const [selectedImage, setSelectedImage] = useState<Props | null>(null);
    const accessKey = 'LPkef7d7gHJlEG0CIYQ2az3h424chysgXuKHKBbVYqY';
    const containerRef = useRef<HTMLDivElement>(null);
   



useEffect(() => {
        const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    
        if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoading) {
        
            FetchImages();
            setPage((prevPage) => prevPage + 1);
            
        }
        };
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
    }, [ page ]);

    const handleClearHistory = () => {
    localStorage.removeItem('searchHistory');
    const element = document.getElementById('searchHistory');
    element?.remove();
    setPage(1); 
    };
    const searchWithWords = async (e: Event) => {
        const value = (e.target as HTMLDivElement).innerText;
        setSaveValue(value);

        try {
            const res = await axios.get(
        `https://api.unsplash.com/search/photos?query=${value}&page=${page}&per_page=30&client_id=${accessKey}`
        );
        const data = res.data.results.map((item: any) => ({
        id: item.id,
        likes: item.likes,
        urls: {
            small: item.urls.small || '',
        }
        }))


        setSelectedWord([data]);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
    const FetchImages = async () => {
    
    try {
        const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${SaveValue}&page=${page}&per_page=30&client_id=${accessKey}`
        );
        const imageData: Props[] = response.data.results.map((item: any) => ([{
        id: item.id,
        likes: item.likes,
        urls: {
            small: item.urls.small || '',
        },
    }]));
    
        setSelectedWord((prevImages) => (page === 1 ? imageData : [...prevImages, ...imageData]));
        setIsLoading(false);
        
    } catch (error) {
        console.log(error);
    }
};



const ShowModalOnClick = (image: Props) => {
    console.log('Clicked on figure. Modal should show up.');
    setSelectedImage(image);
    setShowModal(true);
};



return (
    <>
    <Parent ref={containerRef}>
    
    <button type='button' onClick={() => navigate('/')} >⌂ Back To Home</button>
            
    
    <button onClick={handleClearHistory}>Clear History</button>
        <h1>Search History</h1>
        {isLoading ? (
        <p>Loading...</p>
        ) : (
        <div id="searchHistory">
            <ul className="historylink">
            {searchHistory.map((item, index) => (
                <li key={index}>
                <a href="#" onClick={(e) => searchWithWords(e as any)}>
                {item} 
                    </a>
                </li>
                ))}
            </ul>
            </div>
        )}
        {SelectedWord.length > 0 && (
    <div className='wrapper'> 
    {SelectedWord.map((items, index) => (
        <div key={index} className='child'>
        {Array.isArray(items) ? (
            items.map((item, itemIndex) => (
            <figure  onClick={() => ShowModalOnClick(item)}  className='image' >
            <img key={itemIndex} src={item.urls.small} alt="" />
            </figure>
            ))
        ) : (
            <img src={items.urls.small} alt="" />
        )}
        </div>
    ))}
    </div>
)}


    
        </Parent>
        {ShowModal && selectedImage && (
        <Modal onClose={() => setShowModal(false)} image={selectedImage} />
    )}
    </>
    );
};

export default History;
