import { useState } from 'react';



import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


import validator from 'validator';
import Swal from 'sweetalert2';
import axios from 'axios';
import FormData from 'form-data';


const ItemChange = ({ item, onEdit, onDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemDetails, setItemDetails] = useState({
        name: item.name,
        image: null,
        price: item.price,
        category: item.category,
        tags: item.tags
    });
    const [priceError, setPriceError] = useState(false);
   

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        // Reset state
        setItemDetails({
            name: item.name,
            image: null,
            price: item.price,
            category: item.category,
            tags: item.tags,
        });
        setPriceError(false);
        setDialogOpen(false);
    };

    // to handle price change
    const handlePriceChange = event => {
        setItemDetails({
            ...itemDetails,
            price: event.target.value
        });
        setPriceError(!validator.isNumeric(event.target.value) || validator.isEmpty(event.target.value) || event.target.value < 0 || event.target.value > 600);
    }

    // to handle tags change
    const handleTagsChange = event => {
        setItemDetails({
            ...itemDetails,

            tags: event.target.value.split(',')
        });
    }

    // Handle deletion of an item 
    const handleDelete = item => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Please confirm as you won't be able to revert to this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.value) {
                axios
                    .delete(`http://localhost:5000/api/items/delete`, {
                        headers: {
                            authorization: localStorage.getItem("token"),
                        },
                        data: {
                            item_id: item._id,
                        },
                    })
                    .then(res => {
                        Swal.fire({
                            title: `${item.name} deleted`,
                            text: `${item.name} has been deleted.`,
                            icon: "success",
                            confirmButtonText: "OK",
                        });

                        onDelete(item);
                    })
                    .catch(err => {
                        Swal.fire({
                            title: "Sorry!",
                            text: "Something went wrong!",
                            icon: "error",
                            confirmButtonText: "OK",
                            footer: `${err.response.data.error}!`,
                        });
                    });
            }
        }).catch(err => {
            Swal.fire({
                title: "Sorry!",
                text: "Something went wrong!",
                icon: "error",
                confirmButtonText: "OK",
                footer: `${err.response.data.error}!`,
            });
        });
    };

    // Handle item editing
    const handleEdit = item => {
        handleDialogClose();
        if (priceError || validator.isEmpty(itemDetails.name)) {
            handleDialogClose();
            Swal.fire({
                title: 'Error',
                text: 'Please fill all the details and fix the errors!',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            return;
        }

        // Checking price limit
        if (itemDetails.price > 600) {
            handleDialogClose();
            Swal.fire({
                title: 'Error',
                text: 'Price for an item cannot be more than 600!',
                icon: 'error',
                confirmButtonText: 'OK'
            });

            return;
        }

        

        // Create form data
        let formData = new FormData();
        formData.append('item_id', item._id);
        formData.append('original_name', item.name);
        formData.append('name', itemDetails.name);
        formData.append('price', itemDetails.price);
        formData.append('category', itemDetails.category);
        formData.append('tags', itemDetails.tags);
        formData.append('image', itemDetails.image);

        axios.patch('http://localhost:5000/api/items/edit', formData, {
            headers: {
                authorization: localStorage.getItem("token"),
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                Swal.fire({
                    title: `${item.name} Edited`,
                    text: `${item.name} has been edited successfully!`,
                    icon: "success",
                    confirmButtonText: "OK",
                })
                    .then(() => {
                        onEdit(res.data);
                    });
            })
            .catch(err => {
                Swal.fire({
                    title: "Sorry!",
                    text: "Something went wrong!",
                    icon: "error",
                    confirmButtonText: "OK",
                    footer: `${err.response.data.error}!`,
                });
            });

    };

    return (
        <div>
            <Grid
                direction="row"
                justifyContent="center"
                container
                spacing={1}
                marginTop={3}
            >
                <Grid item>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDialogOpen}
                        >
                            <EditIcon style={{ marginRight: "0.5rem" }} />Edit
                        </Button>
                        <Dialog open={dialogOpen} onClose={handleDialogClose}>
                            <DialogTitle>Edit Item</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Edit the item details below
                                </DialogContentText>
                                <Grid
                                    direction="column"
                                    alignItems="center"
                                    container
                                    spacing={1}
                                >
                                    {/* Name */}
                                    <TextField
                                        autoFocus
                                        id="name"
                                        label="Item name"
                                        type="email"
                                        fullWidth
                                        variant="outlined"
                                        defaultValue={item.name}
                                        style={{ marginTop: "2rem" }}
                                        onChange={e =>
                                            setItemDetails({
                                                ...itemDetails,
                                                name: e.target.value,
                                            })
                                        }
                                    />

                                    {/* Image Upload */}
                                    <Button
                                        variant="contained"
                                        component="label"
                                        style={{
                                            marginTop: "1.5rem",
                                        }}
                                    >
                                        Upload File
                                        <input
                                            type="file"
                                            hidden
                                            onChange={e =>
                                                setItemDetails({
                                                    ...itemDetails,
                                                    image: e.target.files[0],
                                                })
                                            }
                                        />
                                    </Button>

                                    {/* Uploaded Image Preview */}
                                    {itemDetails.image &&
                                        <img
                                            src={URL.createObjectURL(itemDetails.image)}
                                            alt="item"
                                            style={{
                                                width: "25%",
                                                height: "auto",
                                                marginTop: "1rem",
                                            }}
                                        />
                                    }

                                    {/* Price */}
                                    {priceError ?
                                        <TextField
                                            id="price"
                                            label="Price - keep price in between 0 to 600"
                                            type="number"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={item.price}
                                            style={{ marginTop: "1.5rem" }}
                                            onChange={handlePriceChange}
                                            error
                                        />
                                        :
                                        <TextField
                                            id="price"
                                            label="Price - keep price in between 0 to 600"
                                            type="number"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={item.price}
                                            style={{ marginTop: "1.5rem" }}
                                            onChange={handlePriceChange}
                                        />
                                    }

                                    {/* Category */}
                                    <TextField
                                        select
                                        style={{ marginTop: "1.5rem" }}
                                        label="Category"
                                        variant="outlined"
                                        value={itemDetails.category}
                                        fullWidth
                                        onChange={e => {
                                            setItemDetails({
                                                ...itemDetails,
                                                category: e.target.value
                                            });
                                        }}
                                    >
                                        <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                                        <MenuItem value="Non-vegetarian">Non-vegetarian</MenuItem>
                                    </TextField>

                                    {/* Tags */}
                                    <DialogContentText style={{ marginTop: "1.5rem" }}>
                                        List tags below, separated by commas
                                    </DialogContentText>
                                    <TextField
                                        id="tags"
                                        label="Tags"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={itemDetails.tags}
                                        style={{ marginTop: "1.5rem" }}
                                        onChange={handleTagsChange}
                                    >
                                    </TextField>

                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDialogClose}>Cancel</Button>
                                <Button onClick={() => handleEdit(item)}>Save Changes</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => { handleDelete(item) }}
                    >
                        <DeleteIcon style={{ marginRight: "0.5rem" }} />Delete
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default ItemChange;
