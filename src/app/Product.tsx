"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';

interface Product {
  id: number;
  title: string;
  image: string;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCells, setVisibleCells] = useState<number[]>([]);
  const [focusedCell, setFocusedCell] = useState<number | null>(null);

  useEffect(() => {
    axios.get<Product[]>('https://fakestoreapi.com/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleCellClick = (index: number) => {
    setVisibleCells((prev) => {
      const newVisibleCells = [...prev];
      if (!newVisibleCells.includes(index)) {
        newVisibleCells.push(index);
      }
      return newVisibleCells;
    });
    setFocusedCell(index);
  };
// React2devs
  const handleKeyDown = (event: KeyboardEvent) => {
    if (focusedCell !== null) {
      let newFocusedCell = focusedCell;
      switch (event.key) {
        case 'ArrowUp':
          newFocusedCell = focusedCell >= 4 ? focusedCell - 4 : focusedCell;
          break;
        case 'ArrowDown':
          newFocusedCell = focusedCell < 16 ? focusedCell + 4 : focusedCell;
          break;
        case 'ArrowLeft':
          newFocusedCell = focusedCell % 4 !== 0 ? focusedCell - 1 : focusedCell;
          break;
        case 'ArrowRight':
          newFocusedCell = focusedCell % 4 !== 3 ? focusedCell + 1 : focusedCell;
          break;
      }
      setFocusedCell(newFocusedCell);
      setVisibleCells((prev) => {
        const newVisibleCells = [...prev];
        if (!newVisibleCells.includes(newFocusedCell)) {
          newVisibleCells.push(newFocusedCell);
        }
        return newVisibleCells;
      });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedCell]);

  const renderCellContent = (index: number) => {
    if (visibleCells.includes(index) && products[index]) {
      return (
        <Box>
          <img src={products[index].image} alt={products[index].title} style={{ width: '100%', padding: '15px', height: '250px' }} />
          <Typography>{products[index].title}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Grid container spacing={2}>
      {Array.from({ length: 20 }).map((_, index) => (
        <Grid item xs={3} key={index}>
          <Box
            sx={{
              height: 450,
              outline: focusedCell === index ? '4px solid red' : 'none',
              backgroundColor: 'black',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleCellClick(index)}
            tabIndex={0}
            onFocus={() => setFocusedCell(index)}
          >
            {renderCellContent(index)}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Product;
