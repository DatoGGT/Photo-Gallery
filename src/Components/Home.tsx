import axios from 'axios';
import React, { useState, useEffect, useRef, FormEvent, FormEventHandler, MutableRefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import noresults from '../assets/imgs/noresu.webp'
import { useSearch } from './SearchContext';
import Modal from './Modal';


const StyledHeader = styled.header`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 230px;
    align-items: center;
    background-color: #38a3a3;
    border-radius: 10px transparent;
    & h1 {
        font-family: cursive;
        color: aliceblue;
    }
    & nav{
    display: flex;
    justify-content: space-between;
    width: 48%;
    align-items: center;
    list-style: none;
    & input {
    width: 650px;
    height: 30px;
    border-radius: 5px;
    border-color: black;
    }
    & a {
    text-decoration: none;
    color: black;
    font-weight: bold;
    font-size: 20px;
    &:hover {
    color: #646464;
    }
    
    }
    }
    
`
const Main = styled.main`
    display: flex;
    flex-wrap: wrap;
    & .noresults {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & img {
        width: 350px;
        height: 350px;
    }
    & span {
        font-size: 50px;
        font-weight: bold;
        color: #646464;
        font-family: cursive;
        margin-top: 20px;
    }
    }
    .OpenModal {
        cursor: pointer;
    }
`

interface Image {
    views: number;
    downloads: number;
    description: string;
    likes: number;
    urls: {
    small: string;
    };
    id: string;

}


const Home: React.FC = () => {
        const Searchinput = useRef<HTMLInputElement>(null);
        const [images, setImages] = useState<Image[]>([]);
        const [totalPages, setTotalPages] = useState<number>(0);
        const [page, setPage] = useState<number>(1);
        const [loading, setLoading] = useState<boolean>(false); 
        const { addToSearchHistory } = useSearch()
        const [defaultValue, setDefaultValue] = useState<string>('all')
        const [ShowModal, setShowModal] = useState<boolean>(false)
        const [selectedImage, setSelectedImage] = useState<Image | null>(null);
        const accessKey = 'LPkef7d7gHJlEG0CIYQ2az3h424chysgXuKHKBbVYqY';

        let responseMap:MutableRefObject<Record<string,Image>>= useRef({})


    const ShowModalOnClick = (image: Image) => {
    console.log('Clicked on figure. Modal should show up.');
    setSelectedImage(image);
    setShowModal(true);
};

    
    const FetchImages = async () => {
        
        try {
            if(responseMap.current[Searchinput.current!.value]){
            console.log(responseMap.current[Searchinput.current!.value])
            // @ts-ignore
            setImages(responseMap.current[Searchinput.current!.value])
            return
        }
        const response = await axios.get(
            `https://api.unsplash.com/search/photos?query=${Searchinput.current!.value}&page=${page}&per_page=30&client_id=${accessKey}`
        );

        const imageData: Image[] = response.data.results.map((item: any) => ({
        id: item.id,
        description: item.description || '',
        likes: item.likes,
        urls: {
            small: item.urls.small || '',
        },
    }));
    
    
    
        setImages((prevImages) =>{
            //@ts-ignore
            responseMap.current[Searchinput.current!.value] = (page === 1 ? imageData : [...prevImages, ...imageData])
            return  (page === 1 ? imageData : [...prevImages, ...imageData])
        });
        setTotalPages(response.data.total_pages);
    } catch (error) {
        console.log(error);
    }
    };

    const FetchPopularPhotos = async () => {
    try {
        const response = await axios.get(`https://api.unsplash.com/photos/?order_by=popular&page=${page}&per_page=20&client_id=${accessKey}`);

        const imageData: Image[] = response.data.map((item: any) => ({
        id: item.id,
        description: item.description || '',
        likes: item.likes,
        urls: {
            small: item.urls.small || '',
        },
    }));

    
        setImages((prevImages) => (page === 1 ? imageData : [...prevImages, ...imageData]));
        setTotalPages(response.headers['x-total-pages']);
    } catch (error) {
        console.log(error);
    }
    };

    const HandleSearch: FormEventHandler<HTMLFormElement> = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTerm = Searchinput.current!.value.trim();
    setImages([]); 
    setPage(1); 
    setDefaultValue(Searchinput.current!.value);
    if (!searchTerm) {
    
        FetchPopularPhotos();
    } else {
    
        FetchImages();
        addToSearchHistory(searchTerm);
    }
    };



    const FetchMorePopularPhotos = async () => {
        
    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${defaultValue}&page=${page}&per_page=30&client_id=${accessKey}`);

        const imageData: Image[] = response.data.results.map((item: any) => ({
        id: item.id,
        description: item.description || '',
        likes: item.likes,
        urls: {
            small: item.urls.small || '',
        },
        }));
    

    
        setImages((prevImages) => [...prevImages, ...imageData]);
        setPage((prevPage) => prevPage + 1);
        setTotalPages(response.headers['x-total-pages']);
    } catch (error) {
        console.log(error);
    }
    };

    const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
        FetchMorePopularPhotos();
    }
    };

    useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
    }, [handleScroll]);

    useEffect(() => {
    
    FetchPopularPhotos();

    }, []);
    const Navigate = useNavigate();
        
    
        return (
            <>
            <StyledHeader>
            <h1>Search Images</h1>
            <nav>
                <form onSubmit={HandleSearch}>
                <input type="text" placeholder="Type and enter..." ref={Searchinput} />
                </form>
                <a href="" onClick={() => Navigate('/History')}>
                History
                </a>
            </nav>
            </StyledHeader>
            <Main>
            {images.length === 0 ? (
                <figure className="noresults">
                    <img src={noresults} alt="" />
                <span>No Results</span>
                </figure>
            ) : (
                images.map((image) => { 
                    console.log(image);
                return(

    
                <figure  className="OpenModal"  onClick={() => ShowModalOnClick(image)} >
                    <img src={image.urls.small || ''} alt={image.description} />
                </figure>
                )}
                )
            )}
            {loading && <span>Loading...</span>}
          
            </Main>
            {ShowModal && selectedImage && (
        <Modal image={selectedImage} onClose={() => setShowModal(false)} />
      )}
            </>
        
        );
    };
    
    export default Home;