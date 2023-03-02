import React from 'react'
import { Fab, styled, useTheme } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'


const Fabs = () => {

  const { menu, setCityName, setMenu } = useStore()
  const theme = useTheme()

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
      { !menu && <FabGroup>
        { 
          cities.map((item, i) => (
            <Fab
              key={i} 
              variant='extended' 
              sx={{background: theme.palette.menubar.main, color: theme.palette.menubar.font}}
              onClick={() => {
                setCityName(item.city)
                setMenu(false)
              }}
            >
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
  width: 90%;
  z-index: 100;
  position: fixed;
  top: 13%;
  left: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FabGroup = styled('div')`
  width: 100%;
  display: flex;
  overflow-x: auto;
  gap: 10px;
    button {
        flex-shrink: 0;
        width: 60px;
        height: 30px;
        padding: 5px;
    }
    &::-webkit-scrollbar{
      display: none;
    }
`