'use client'

import React, {FC, useState} from  'react';
import Heading from './utils/Heading';
import Header from './components/Header';


interface Props{}


const Page: FC<Props> = (props)=>{
  return(
    <div>
      <Heading
      title='Afro E-Learning'
      description='E learing platform for Tech related courses'
      keyword='Programming, software, AI, machine learning'
      />
      <Header/>
    </div>
  )
};


export default Page;

