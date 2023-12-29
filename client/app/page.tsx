'use client'

import React, {FC, useState} from  'react';
import Heading from './utils/Heading';
import Header from './components/Header';
import Login from './components/Auth/Login';
import Hero from './components/Route/Hero';


interface Props{}


const Page: FC<Props> = (props)=>{
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const  [route, setRoute] = useState("Login");
  return(
    <div>
      <Heading
      title='Afro E-Learning'
      description='E learing platform for Tech related courses'
      keyword='Programming, software, AI, machine learning'
      />
      <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      setRoute={setRoute}
      route={route}
      />
      <Hero/>
    </div>
  )
};


export default Page;

