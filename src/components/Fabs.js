import React from 'react'
import { Fab, styled, useTheme } from '@mui/material'
import { Navigation } from '@mui/icons-material'
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
      <MenuBox onClick={() => setMenu(!menu)}>DropDown</MenuBox>

      { menu && <FabGroup>
        { 
          cities.map((item, i) => (
            <Fab
              key={i} 
              variant='extended' 
              size='small'
              sx={{background: theme.palette.menubar.main, color: theme.palette.menubar.font}}
              onClick={() => {
                setCityName(item.city)
                setMenu(false)
              }}
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

const MenuBox = styled('div')(({theme}) => `
  width: 200px;
  height: 35px;
  border-radius: 25px;
  background: rgba(220,220,220);
  margin-bottom: 20px;
  text-align: center;
  line-height: 35px;
  letter-spacing: 2px;
  cursor: pointer;
  font-weight: 700;
  background: ${theme.palette.menubar.main};
  color: ${theme.palette.menubar.font};
`)

const FabGroup = styled('div')`
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
`