'use client'

import { useState } from 'react'
import { Box, SegmentedControl } from '@radix-ui/themes'
import axios from 'axios'
import { Toast, ToggleGroup } from 'radix-ui'
import Html5QrcodePlugin from './utils/Html5QrcodeScannerPlugin'

type modeType = 'checkin' | 'verify'
type DayType = 'Friday' | 'Saturday'
type MealType = 'Lunch' | 'Dinner' | ''

export default function Home () {
  const [mode, setMode] = useState<modeType>('checkin')
  const [day, setDay] = useState<DayType>('Friday')
  const [meal, setMeal] = useState<MealType>('Lunch')
  const [open, setOpen] = useState<boolean>(false)
  const [toastMsg, setToastMsg] = useState<string>('')
  

  const handleModeSelect = (mode: modeType) => {
    setMode(mode)
    if (mode === 'checkin') {
      setDay('Friday')
      setMeal('')
    }
    setToastMsg(`Mode selected: ${mode}`)
    setOpen(true)
  }

  const handleMealSelect = (newMeal: string) => {
    switch (newMeal) {
      case 'd1l':
        setDay('Friday')
        setMeal('Lunch')
        break
      case 'd1d':
        setDay('Friday')
        setMeal('Dinner')
        break
      case 'd2l':
        setDay('Saturday')
        setMeal('Lunch')
        break
      case 'd2d':
        setDay('Saturday')
        setMeal('Dinner')
        break
      default:
        setDay('Friday')
        setMeal('')
    }
  }

  const checkInTicket = (ticketCode: string) => {
    axios.post('https://devhacksapi2.khathepham.com/api/v25/checkin', {
      ticketCode: ticketCode,
      mode: mode,
      day: day,
    }).then((res) => {
      setToastMsg(`Check-in successful for ticket: ${ticketCode}`)
      setOpen(true)
    }).catch((err) => {
      setToastMsg(err)
      setOpen(true)
    })
  }

  const verifyTicket = (ticketCode: string) => {
    axios.post('https://devhacksapi2.khathepham.com/api/v25/checkin', {
      ticketCode: ticketCode,
      mode: mode,
      day: day,
      meal: meal,
    }).then((res) => {
      setToastMsg(`Verification successful for ticket: ${ticketCode}`)
      setOpen(true)
    }).catch((err) => {
      setToastMsg(err)
      setOpen(true)
    })
  }

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    decodedText = decodedText.replace(".png", "")

    if(decodedText.length === 6 && decodedText.match(/^[a-zA-Z0-9]{6}$/)){
      if (mode === 'checkin') {
        checkInTicket(decodedText)
      } else {
        verifyTicket(decodedText)
      }
    } else{
        setToastMsg(`Invalid ticket code: ${decodedText}`)
        setOpen(true)
    }
  }

  return (
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <Html5QrcodePlugin
          fps={10}
          qrbox={250}
          disableFlip={false}
          qrCodeSuccessCallback={onScanSuccess}
        />

        <SegmentedControl.Root defaultValue="checkin" size='3' onValueChange={handleModeSelect}>
          <SegmentedControl.Item value="checkin">Check-in</SegmentedControl.Item>
          <SegmentedControl.Item value="verify">Verify</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Box aria-hidden={mode !== 'verify'} style={{ visibility: mode === 'verify' ? 'visible' : 'hidden' }}>
          <ToggleGroup.Root 
            className='flex flex-col items-start w-32 rounded-lg bg-zinc-100'
            defaultValue="d1l" 
            orientation='vertical' 
            type='single' 
            value={meal}
            onValueChange={handleMealSelect}
          >
            <ToggleGroup.Item 
              className='p-4 rounded-lg data-[state=on]:bg-green-500/50 w-full text-left'
              value="d1l"
            >
              Day 1 Lunch
            </ToggleGroup.Item>
            <ToggleGroup.Item 
              className='p-4 rounded-lg data-[state=on]:bg-green-500/50 w-full text-left'
              value="d1d"
            >
              Day 1 Dinner
            </ToggleGroup.Item>
            <ToggleGroup.Item 
              className='p-4 rounded-lg data-[state=on]:bg-green-500/50 w-full text-left'
              value="d2l"
            >
              Day 2 Lunch
            </ToggleGroup.Item>
            <ToggleGroup.Item 
              className='p-4 rounded-lg data-[state=on]:bg-green-500/50 w-full text-left'
              value="d2d"
            >
              Day 2 Dinner
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </Box>
        <Toast.Root open={open} onOpenChange={setOpen} className='rounded-lg bg-zinc-10 p-4'>
          <Toast.Description>{toastMsg}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className='fixed bottom-10 left-10 bg-white' />
      </main>
  )
}
