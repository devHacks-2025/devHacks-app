'use client'

import { useEffect, useRef } from 'react'
import { SegmentedControl } from '@radix-ui/themes'
import QrScanner from 'qr-scanner'

export default function Home () {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElem = videoRef.current
    if (videoElem) {
      const scanner = new QrScanner(
        videoElem,
        result => console.log('decoded qr code:', result),
        { returnDetailedScanResult: true, }
      )

      scanner.start()
      console.log(videoElem);
    }
  }, [])

  return (
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3" id="toastContainer">
        </div>

        <SegmentedControl.Root defaultValue="checkin" size='3' >
          <SegmentedControl.Item value="checkin">Check-in</SegmentedControl.Item>
          <SegmentedControl.Item value="verify">Verify</SegmentedControl.Item>
        </SegmentedControl.Root>

        <div id="reader" className="container-xl align-items-stretch"></div>
        <video id='scanner' disablePictureInPicture></video>
      </main>
  )
}