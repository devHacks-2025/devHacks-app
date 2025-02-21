'use client'

import { useEffect, useState } from 'react'
import { Box, SegmentedControl, Skeleton } from '@radix-ui/themes'
import QrScanner from 'qr-scanner'
import { Toast, ToggleGroup } from 'radix-ui'

type MealType = keyof typeof MEALS | ''
const MEALS = {
  'd1l': 'Day 1 Lunch',
  'd1d': 'Day 1 Dinner',
  'd2l': 'Day 2 Lunch',
  'd2d': 'Day 2 Dinner'
}

export default function Home () {
  // const [videoLoaded, setVideoLoaded] = useState<boolean>(false)
  const [mode, setMode] = useState<string>('checkin')
  const [meal, setMeal] = useState<string>('d1l')
  const [open, setOpen] = useState<boolean>(false)
  const [toastMsg, setToastMsg] = useState<string>('')

  useEffect(() => {
    window.addEventListener('load', () => {
      const video = document.getElementById('scanner') as HTMLVideoElement
      if (video) {
        // setVideoLoaded(true)
        const scanner = new QrScanner(
          video,
          result => console.log('decoded qr code:', result),
          { returnDetailedScanResult: true, }
        )

        try {
          scanner.start()
        } catch (error) {
          console.log(error);
          setToastMsg('Failed to start scanner')
          setOpen(true)
        }
      }
    })
  }, [])

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

  return (
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center h-screen">
        <video id='scanner' disablePictureInPicture/>

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