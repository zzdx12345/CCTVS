import React, { useState } from 'react'
import { Fab, styled } from '@mui/material'
import { Navigation } from '@mui/icons-material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'


const Fabs = () => {

  const { setCityName } = useStore()
  const [ isClicked, setIsClicked ] = useState(false)

  const cities = [
    { name: '台北', city: 'Taipei' },
    { name: '新北', city: 'NewTaipei' },
    { name: '基隆', city: 'Keelung' },
    { name: '桃園', city: 'Taoyuan' },
    { name: '竹北', city: 'HsinchuCounty' },
    { name: '新竹', city: 'Hsinchu' },
    { name: '台中', city: 'Taichung' },
    { name: '彰化', city: 'ChanghuaCounty' },
    { name: '雲林', city: 'YunlinCounty' },
    { name: '嘉義', city: 'Chiayi' },
    { name: '宜蘭', city: 'YilanCounty' },
    { name: '台南', city: 'Tainan' },
    { name: '高雄', city: 'Kaohsiung' },
    { name: '台東', city: 'TaitungCounty' },
    { name: '屏東', city: 'PingtungCounty' },
  ]
  
  return (
    <RootBox>
      <MenuBox onClick={() => setIsClicked(!isClicked)}>DropDown</MenuBox>

      { isClicked && <FabGroup>
        { 
          cities.map((item, i) => (
            <Fab
              key={i} 
              variant='extended' 
              size='small'
              onClick={() => setCityName(item.city)}
            >
              <Navigation/>
              { item.name }
            </Fab>
          ))
        }
      </FabGroup>
      }
    </RootBox>
  )
}

export default observer(Fabs)

const RootBox = styled('div')`
  z-index: 100;
  position: fixed;
  top: 5%;
  right: 3%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const MenuBox = styled('div')((props) => `
  width: 200px;
  height: 35px;
  border-radius: 25px;
  background: rgba(220,220,220);
  color: rgb(101,101,101);
  margin-bottom: 20px;
  text-align: center;
  line-height: 35px;
  letter-spacing: 2px;
  cursor: pointer;
  font-weight: 700;
`)

const FabGroup = styled('div')((props) => `
  width: 200px;
  height: 350px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
    svg {
      margin-right: 10px;
      transform: rotate(30deg);
    }
`)