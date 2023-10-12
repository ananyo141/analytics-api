"use client";

import React from 'react'
import { Provider } from 'jotai'

type Props = {
  children: React.ReactNode
}

const Providers = (props: Props) => {
  return (
    <Provider>
      {props.children}
    </Provider>
  )
}

export default Providers 

