import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInventoryItem } from '../../services/inventoryService';
import type { InventoryItem } from '../../services/inventoryService';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface EditInventoryItemProps {
  item: InventoryItem;
  open: boolean;
  onClose: () => void;
}

export function EditInventoryItem({ item, open, onClose }: EditInventoryItemProps) {
  const queryClient = useQueryClient();
  const [product_name, setProductName] = useState(item.product_name);
  const [prod_desc, setProdDesc] = useState(item.prod_desc);
  const [product_price, setProductPrice] = useState(item.product_price);
  const [product_qty, setProductQty] = useState(item.product_qty);
  const [supplier_id, setSupplierId] = useState(Number(item.supplier_id));
  const [prod_spec, setProdSpec] = useState(item.prod_spec || '');

  useEffect(() => {
    setProductName(item.product_name);
    setProdDesc(item.prod_desc);
    setProductPrice(item.product_price);
    setProductQty(item.product_qty);
    setSupplierId(Number(item.supplier_id));
    setProdSpec(item.prod_spec || '');
  }, [item]);

  const updateMutation = useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem: InventoryItem = {
      ...item,
      product_name,
      prod_desc,
      product_price,
      product_qty,
      supplier_id,
      prod_spec,
    };
    updateMutation.mutate(updatedItem);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2">
          Edit Item
        </Typography>
        <TextField
          label="Product Name"
          value={product_name}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          required
          sx={{ mt: 2, mb: 2 }}
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
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}
