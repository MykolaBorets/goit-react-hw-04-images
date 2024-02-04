import React, { useState, useEffect } from 'react';
import * as API from '../Services/pixabay-api';
import { Container } from './App.styled';
import { Searchbar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

const App = () => {
  const [images, setImages] = useState([]);
  const [values, setValues] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('inactive');

  useEffect(() => {
    const loadImages = async () => {
      try {
        const { hits, totalHits } = await API.getImages(values, page);
        setImages(prevImages => [...prevImages, ...hits]);
        setStatus(Math.ceil(totalHits / 12) <= page ? 'inactive' : 'resolved');
      } catch (error) {
        alert(
          'Uh-oh, there was an error! Give the page a reload and try again.'
        );
        setStatus('rejected');
      }
    };

    if (values) {
      loadImages();
    }
  }, [page, values]);

  const updateValues = newValues => {
    setImages([]);
    setValues(newValues);
    setPage(1);
    setStatus('pending');
  };

  const updatePage = () => {
    setPage(prevPage => prevPage + 1);
    setStatus('pending');
  };

  return (
    <Container>
      <Searchbar onSubmit={updateValues} />
      {values && <ImageGallery images={images} />}
      {status === 'resolved' && <Button handleClick={updatePage} />}
      {status === 'pending' && <Loader />}
    </Container>
  );
};

export default App;
