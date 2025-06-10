import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInventoryItem } from '../../services/inventoryService';
import type { InventoryItem } from '../../services/inventoryService';
import { Box, Button, TextField, Typography } from '@mui/material';

export function CreateInventoryItem() {
  const queryClient = useQueryClient();
  const [product_name, setProductName] = useState('');
  const [prod_desc, setProdDesc] = useState('');
  const [product_price, setProductPrice] = useState(0);
  const [product_qty, setProductQty] = useState(0);
  const [supplier_id, setSupplierId] = useState(0);
  const [prod_spec, setProdSpec] = useState('');

  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      // Clear form
      setProductName('');
      setProdDesc('');
      setProductPrice(0);
      setProductQty(0);
      setSupplierId(0);
      setProdSpec('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Omit<InventoryItem, 'product_id'> = {
      product_name,
      prod_desc,
      product_price,
      product_qty,
      supplier_id,
      prod_spec,
    };
    createMutation.mutate(newItem);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add New Item
      </Typography>
      <TextField
        label="Product Name"
        value={product_name}
        onChange={(e) => setProductName(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        value={prod_desc}
        onChange={(e) => setProdDesc(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Price"
        type="number"
        value={product_price}
        onChange={(e) => setProductPrice(Number(e.target.value))}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Quantity"
        type="number"
        value={product_qty}
        onChange={(e) => setProductQty(Number(e.target.value))}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Supplier ID"
        type="number"
        value={supplier_id}
        onChange={(e) => setSupplierId(Number(e.target.value))}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Product Specification"
        value={prod_spec}
        onChange={(e) => setProdSpec(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Add Item
      </Button>
    </Box>
  );
}
