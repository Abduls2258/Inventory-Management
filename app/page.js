'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, IconButton, AppBar, Toolbar, InputBase, Container, Paper } from '@mui/material';
import { Add, Remove, Search } from '@mui/icons-material';
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const InventoryManagement = () => {
  const [isClient, setIsClient] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsClient(true);
    updateInventory();
  }, []);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      inventoryList.push({ name: doc.id, quantity: data.quantity || 0 });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!item) return; // Prevent adding empty items
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <Container maxWidth="md" sx={{ bgcolor: '#f0f8ff', minHeight: '100vh', py: 4 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 1, px: 2 }}>
            <InputBase
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
            />
            <IconButton type="submit" sx={{ p: 1 }}>
              <Search />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box display="flex" justifyContent="center" mb={4}>
        <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: '#2196f3', color: 'white' }}>
          Add New Item
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{ bgcolor: '#2196f3', color: 'white' }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Inventory Items
        </Typography>
        {inventory.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            Add your items
          </Typography>
        ) : (
          <Stack spacing={2}>
            {inventory.filter(item => item.name.includes(searchTerm)).map(({ name, quantity }) => (
              <Box
                key={name}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                sx={{ bgcolor: '#e3f2fd', borderRadius: 1 }}
              >
                <Typography variant="h6">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6">
                  Quantity: {quantity}
                </Typography>
                <Box>
                  <IconButton onClick={() => addItem(name)} sx={{ color: '#4caf50' }}>
                    <Add />
                  </IconButton>
                  <IconButton onClick={() => removeItem(name)} sx={{ color: '#f44336' }}>
                    <Remove />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default dynamic(() => Promise.resolve(InventoryManagement), { ssr: false });
