'use client'

import { useEffect, useState } from 'react'
import { Box, SegmentedControl } from '@radix-ui/themes'
import axios from 'axios'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Toast, ToggleGroup } from 'radix-ui'
import Html5QrcodePlugin from './utils/Html5QrcodeScannerPlugin'

type MealType = keyof typeof MEALS | ''
const MEALS = {
  'd1l': 'Day 1 Lunch',
  'd1d': 'Day 1 Dinner',
  'd2l': 'Day 2 Lunch',
  'd2d': 'Day 2 Dinner'
}

export default function Home () {
  const [mode, setMode] = useState<string>('checkin')
  const [meal, setMeal] = useState<string>('d1l')
  const [open, setOpen] = useState<boolean>(false)
  const [toastMsg, setToastMsg] = useState<string>('')
  

  const handleModeSelect = (mode: string) => {
    setMode(mode)
    setToastMsg(`Mode selected: ${mode}`)
    setOpen(true)
  }

  const handleMealSelect = (newMeal: MealType) => {
    setMeal(prev => newMeal === '' ? prev : newMeal)

    if (newMeal !== '') {
      setToastMsg(`Meal selected: ${MEALS[newMeal]}`)
      setOpen(true)
    }
  }

  const checkinTicket = (ticketCode: string) => {
    // axios.post(`https://devhacksapi.khathepham.com/api/v25/checkin/`, {
    //   ticket: ticketCode,
    // }).then((res) => {
    //   setToastMsg(`Check-in successful for ticket: ${ticketCode}`)
    //   setOpen(true)
    // }).catch((err) => {
    //   setToastMsg(`Check-in failed for ticket: ${ticketCode}`)
    //   setOpen(true)
    // })
    setToastMsg(`Check-in successful for ticket: ${ticketCode}`)
    setOpen(true)
  }

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    decodedText = decodedText.replace(".png", "")

    if(decodedText.length === 6 && decodedText.match(/^[a-zA-Z0-9]{6}$/)){
        checkinTicket(decodedText)
    } else{
        setToastMsg(`Invalid ticket code: ${decodedText}`)
        setOpen(true)
    }
  }

  const onScanFailure = (error: string) => {
    setToastMsg(error)
    setOpen(true)
  }

  const verifyTicket = (ticketCode: string) => {
    // axios.post(`https://devhacksapi.khathepham.com/api/v25/verify/`, {
    setToastMsg(`Ticket verified: ${ticketCode}`)
    setOpen(true)
  }

  useEffect(() => {

    window.addEventListener('load', () => {
      console.log('loaded');
      
      const scanner = new Html5QrcodeScanner(
        'scanner',
        { fps: 10, qrbox: {width: 250, height: 250} }, 
        false
      )
      console.log(scanner);
      
      scanner.render(onScanSuccess, onScanFailure)
    })
  }, [onScanSuccess, onScanFailure])

  const onNewScanResult = (ticketCode: string) => {
    if (mode === 'checkin') {
      checkinTicket(ticketCode)
    } else {
      verifyTicket(ticketCode)
    }
  }

  return (
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center h-screen">
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
            className='flex flex-col items-start w-32 rounded-lg bg-zinc-100/50'
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
        <Toast.Root open={open} onOpenChange={setOpen} className='rounded-lg bg-zinc-100/50 text-black p-4'>
          <Toast.Description>{toastMsg}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className='fixed bottom-10 left-auto' />
      </main>
  )
}
