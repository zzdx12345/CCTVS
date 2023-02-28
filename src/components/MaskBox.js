import React from 'react'
import { styled } from '@mui/material'


const MaskBox = (props) => {

    const { ismobile } = props

    return (
        <RootBox ismobile={ismobile}>Loading...</RootBox>
    )
}

export default MaskBox


const RootBox = styled('div')(({ismobile}) =>`
  width: ${ismobile? '350px' : '500px'};
  height: ${ismobile? '250px' : '350px'};
  z-index: 100;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: gray;
  font-size: 30px;
`)