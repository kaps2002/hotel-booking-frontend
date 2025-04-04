import React, { useState, useEffect } from 'react';
import hotelimg from '../Images/hotel-bg.jpg';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { hotels } from '../services/api';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalBarIcon from '@mui/icons-material/LocalBar';

function HotelList(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';

  const [hotelList, setHotelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await hotels.search(searchTerm);
        setHotelList(response.data);
      } catch (error) {
        setError('Failed to fetch hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchTerm]);

  const renderAmenities = (hotel) => (
    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {hotel.wifi && <Chip icon={<WifiIcon />} label="WiFi" size="small" />}
      {hotel.breakfast && <Chip icon={<RestaurantIcon />} label="Breakfast" size="small" />}
      {hotel.swimmingPool && <Chip icon={<PoolIcon />} label="Pool" size="small" />}
      {hotel.gym && <Chip icon={<FitnessCenterIcon />} label="Gym" size="small" />}
      {hotel.bar && <Chip icon={<LocalBarIcon />} label="Bar" size="small" />}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {searchTerm ? `Search Results for "${searchTerm}"` : 'All Hotels'}
      </Typography>
      <Grid container spacing={3}>
        {hotelList.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel.hotelId}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={hotelimg}
                alt={hotel.hotelName}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {hotel.hotelName}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {hotel.city}, {hotel.state}
                </Typography>
                <Rating value={hotel.ratings || 0} readOnly />
                {renderAmenities(hotel)}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HotelList; 