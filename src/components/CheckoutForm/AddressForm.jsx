import React ,{ useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography, Input } from '@material-ui/core';
import { useForm, FormProvider} from 'react-hook-form';
import FormInput from './CustomTextField';
import { commerce } from '../../lib/commerce';
import { Link } from 'react-router-dom';

const AddressForm = ({checkoutToken,next}) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const methods = useForm();

  const fetchShippingCountries = async (checkoutTokenId) =>{
    const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  }

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });
    setShippingOptions(options);
    setShippingOption(options[0].id);
  };

  useEffect(() =>{
    fetchShippingCountries(checkoutToken.id)
  },[]);

  useEffect(() =>{
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant='h6' gutterBottom>Shipping Address</Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => next({...data,shippingCountry,shippingSubdivision,shippingOption}))}>
         
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}><Input fullWidth required name="firstName" placeholder="First Name" /></Grid>
              <Grid item xs={12} sm={6}><Input fullWidth required name="lastName" placeholder="Last Name" /></Grid>
              <Grid item xs={12} sm={6}><Input fullWidth required name="address1" placeholder="Address Line 1" /></Grid>
              <Grid item xs={12} sm={6}><Input fullWidth required name="email" placeholder="Email" /></Grid>
              <Grid item xs={12} sm={6}><Input fullWidth required name="city" placeholder="City" /></Grid>
              <Grid item xs={12} sm={6}><Input fullWidth required name="zip" placeholder="Zip / Postal Code" /></Grid>
              
               <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Country</InputLabel>
                <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        <br/>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
            <Button type="submit" variant="contained" color="primary">Next</Button>
        </div> 
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
