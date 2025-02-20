'use client'

import { useEffect, useRef } from 'react'
import { SegmentedControl } from '@radix-ui/themes'
import QrScanner from 'qr-scanner'

export default function Home () {
  useEffect(() => {
    window.addEventListener('load', () => {
      const video = document.getElementById('scanner') as HTMLVideoElement
      if (video) {
        const scanner = new QrScanner(
          video,
          result => console.log('decoded qr code:', result),
          { returnDetailedScanResult: true, }
        )
        scanner.start()
      }
    })
  }, [])

  return (
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <video id='scanner' disablePictureInPicture></video>

        <SegmentedControl.Root defaultValue="checkin" size='3' >
          <SegmentedControl.Item value="checkin">Check-in</SegmentedControl.Item>
          <SegmentedControl.Item value="verify">Verify</SegmentedControl.Item>
        </SegmentedControl.Root>

        <div className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3" id="toastContainer">
        </div>
      </main>
  )
}