import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import Swal from "sweetalert2";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";


const BuyerFavourites = () => {
    const [open, setOpen] = useState(false);
    const [unit, set_unit] = useState({
        items: [],
        buyer: {},
        vendors: [],
    });

    const toggleFavourites = value => {
        setOpen(value);
    }

    const handleFavouriteRemove = item => {
        toggleFavourites(false);
        axios
            .patch(`http://localhost:5000/api/buyers/remove_favourite`, {
                item_id: item._id
            }, {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            })
            .then(res => {
                Swal.fire({
                    title: 'Favourite removed!',
                    text: `You removed ${item.name} from your favourites!`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                    .then(() => {
                        window.location.reload();
                    });
            })
            .catch(err => {
                Swal.fire({
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    footer: err.response.data.error
                });
            });
    }

    useEffect( () => {
        const fetchData = async () => {
            const items_data = await axios.get('http://localhost:5000/api/items', {// getting info of all items 
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            const buyers_data = await axios.get('http://localhost:5000/api/buyers/details', {// we need perticular buyers detail
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });
            const vendors_data = await axios.get('http://localhost:5000/api/vendors', { // we need deta from all vendors
                headers: {
                    authorization: localStorage.getItem("token"),
                },
            });

            set_unit({
                items: items_data.data,
                buyer: buyers_data.data,
                vendors: vendors_data.data,
            });
        }

        fetchData();
    }, []);

    return (
        <div>
            <Button
                color="primary"
                style={{
                    marginTop: "2rem",
                    marginLeft: "0.5rem"
                }}
                variant="outlined"
                onClick={() => toggleFavourites(true)}>
                <FavoriteIcon style={{ marginRight: "0.5rem" }} />Favourites
            </Button>
            <Drawer
                anchor='left'
                open={open}
                onClose={() => toggleFavourites(false)}
            >
                <Box
                    role="presentation"
                >
                    <List>
                        <ListItem>
                            <Typography variant="h5" component="h2" fontWeight={"bold"}>
                                Favourites
                            </Typography>
                        </ListItem>
                        {unit.items.map(item => (
                            unit.buyer.favourite_items.includes(item._id) &&
                            <Accordion key={item._id}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{item.name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {unit.vendors.find(vendor => vendor._id === item.vendor_id).shop_name}
                                    </Typography>
                                    <Typography>
                                        Price: Rs. {item.price}
                                    </Typography>
                                    <Typography>
                                        Category: {item.category}
                                    </Typography>
                                    <Typography style={{ marginTop: "1rem" }}>
                                        {item.tags.map(tag => (
                                            tag !== "" &&
                                            <Chip label={tag} key={tag} />
                                        ))}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: "1rem" }}
                                        onClick={() => handleFavouriteRemove(item)}
                                    >
                                        Remove from Favourites
                                    </Button>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </div>
    );
};

export default BuyerFavourites;
