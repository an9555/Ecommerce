import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@material-ui/core';
import {commerce} from './lib/commerce'
import {Products,Navbar,Cart,Checkout} from './components'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order,setOrder] = useState({});
  const [errorMessage,setErrorMessage] = useState('');

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const handleAddToCart = async (productId, quantity) => {
    const cart = await commerce.cart.add(productId, quantity);
    setCart(cart);
  };

  const handleUpdateCartQty = async (productId, quantity) =>{
  const cart = await commerce.cart.update(productId, {quantity})
  setCart(cart);
  } 
  const handleRemoveFromCart = async (lineItemId) => {
    const cart = await commerce.cart.remove(lineItemId);
    setCart(cart);
    }
  const handleEmptyCart = async () => {
    const {cart} = await commerce.cart.empty();
    setCart(cart)
  }

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  }

  const handleCaptureCheckout = async (CheckoutTokenId,newOrder) =>{
    try{
      const incomingOrder =await commerce.checkout.capture(CheckoutTokenId,newOrder);
      setOrder(incomingOrder);
      refreshCart();
    }catch (error){
      setErrorMessage(error.data.error.message);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);
  
console.log(cart);
  return (
    <Router>
    <div>
      <Navbar totalItems={cart.total_items}/>

      <Routes>
        <Route path="/" element={<Products products={products} onAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={
          <Cart 
            cart={cart} 
            handleUpdateCartQty={handleUpdateCartQty}
            handleRemoveFromCart={handleRemoveFromCart}
            handleEmptyCart={handleEmptyCart}
          />} 
        />
        <Route path="/checkout" exact element={
          <Checkout 
            cart={cart}
            order={order}
            onCaptureCheckout={handleCaptureCheckout}
            error={errorMessage}
            />}
        />
        
      </Routes>
    </div>
  </Router>
  )
}

export default App