"use client"

import { useEffect, useState } from "react"
import { Box, SegmentedControl } from "@radix-ui/themes"
import { Toast, ToggleGroup } from "radix-ui"
import { Html5QrcodeScanner } from "html5-qrcode"

type modeType = "checkin" | "verify"
type DayType = "Friday" | "Saturday"

export default function Home() {
    const [mode, setMode] = useState<modeType>("checkin")
    const [day, setDay] = useState<DayType>("Friday")
    const [meal, setMeal] = useState<"Lunch" | "Dinner" | "" | "test" >('Lunch')
    const [mealProp, setMealProp] = useState<string>("d1l")
    const [open, setOpen] = useState<boolean>(false)
    const [toastMsg, setToastMsg] = useState<string>("")
    let scanner: Html5QrcodeScanner | undefined = undefined
    
    const handleModeSelect = (newMode: modeType) => {
        console.log(`Mode selected: ${newMode}`)
        setMode(newMode)
        setToastMsg(`Mode selected: ${newMode}`)
        setOpen(true)
    }
    
    const handleMealSelect = (newMeal: string) => {
        switch (newMeal) {
            case "d1l":
                setDay("Friday")
                setMeal("Lunch")
                setMealProp("d1l")
                break
            case "d1d":
                setDay("Friday")
                setMeal("Dinner")
                setMealProp("d1d")
                break
            case "d2l":
                setDay("Saturday")
                setMeal("Lunch")
                setMealProp("d2l")
                break
            case "d2d":
                setDay("Saturday")
                setMeal("Dinner")
                setMealProp("d2d")
                break
            default:
                setDay(day)
                setMeal(meal)
                setMealProp((prev) => (newMeal === "" ? prev : newMeal))
                break
        }
    }
    
    const checkInTicket = (ticketCode: string) => {
        console.log(`Checking in ticket: ${ticketCode}`);
        
        scanner!.pause()
        const params = {
            ticketCode: ticketCode,
            mode: mode,
            day: day,
        }
        const xmlhttpsrequest = new XMLHttpRequest()
        xmlhttpsrequest.open("POST", "https://devhacksapi2.khathepham.com/api/v25/checkin")
        xmlhttpsrequest.setRequestHeader("Content-Type", "application/json")
        xmlhttpsrequest.send(JSON.stringify(params))
        
        xmlhttpsrequest.onload = () => {
            setToastMsg(`${xmlhttpsrequest.responseText}`)
            setOpen(true)
        }
        
        xmlhttpsrequest.onerror = () => {
            setToastMsg(`Error: ${xmlhttpsrequest.responseText}`)
            setOpen(true)
        }
        
        setTimeout(() => {
            scanner!.resume()
        }, 2000)
    }
    
    const verifyTicket = (ticketCode: string) => {
        scanner!.pause()
        console.log(`Verifying ticket: ${ticketCode}`);
        
        const params = {
            ticketCode: ticketCode,
            mode: mode,
            day: day,
            meal: meal,
        }
        console.log(params)
        
        const xmlhttpsrequest = new XMLHttpRequest()
        xmlhttpsrequest.open("POST", "https://devhacksapi2.khathepham.com/api/v25/checkin")
        xmlhttpsrequest.setRequestHeader("Content-Type", "application/json")
        xmlhttpsrequest.send(JSON.stringify(params))
        
        xmlhttpsrequest.onload = () => {
            setToastMsg(`${xmlhttpsrequest.responseText}`)
            setOpen(true)
        }
        
        xmlhttpsrequest.onerror = () => {
            setToastMsg(`Error: ${xmlhttpsrequest.responseText}`)
            setOpen(true)
        }
        
        setTimeout(() => {
            scanner!.resume()
        }, 2000)
    }
    
    const onScanSuccess = (decodedText: string, decodedResult: any) => {
        decodedText = decodedText.replace(".png", "")
        
        if (decodedText.length === 6 && decodedText.match(/^[a-zA-Z0-9]{6}$/)) {
            if (mode === "checkin") {
                checkInTicket(decodedText)
            } else {
                verifyTicket(decodedText)
            }
        } else {
            setToastMsg(`Invalid ticket code: ${decodedText}`)
            setOpen(true)
        }
    }
    
    useEffect(() => {
        // when component mounts
        scanner = new Html5QrcodeScanner("scanner", { fps: 10, qrbox: 500, disableFlip: false }, false)
        
        scanner.render(onScanSuccess, undefined)
        
        // cleanup function when component will unmount
        return () => {
            scanner!.clear().catch((error) => {
                console.error("Failed to clear html5QrcodeScanner. ", error)
            })
        }
    }, [mode, meal, day])
    
    return (
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <div id="scanner"></div>
        
        <SegmentedControl.Root
            defaultValue="checkin"
            size="3"
            onValueChange={handleModeSelect}
        >
        <SegmentedControl.Item value="checkin">Check-in</SegmentedControl.Item>
        <SegmentedControl.Item value="verify">Verify</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Box
            aria-hidden={mode !== "verify"}
            style={{ visibility: mode === "verify" ? "visible" : "hidden" }}
        >
        <ToggleGroup.Root
            className="flex flex-col items-start w-32 rounded-lg bg-zinc-100"
            defaultValue="d1l"
            orientation="vertical"
            type="single"
            value={mealProp}
            onValueChange={handleMealSelect}
        >
        <ToggleGroup.Item
            className="p-4 rounded-lg data-[state=on]:bg-green-500/50 w-full text-left"
            value="d1l"
        >
            Day 1 Lunch
        </ToggleGroup.Item>
        <ToggleGroup.Item
            className="p-4 rounded-lg data-[state=on]:bg-green-500/50 w-full text-left"
            value="d1d"
        >
            Day 1 Dinner
        </ToggleGroup.Item>
        <ToggleGroup.Item
            className="p-4 rounded-lg data-[state=on]:bg-green-500/50 w-full text-left"
            value="d2l"
        >
            Day 2 Lunch
        </ToggleGroup.Item>
        <ToggleGroup.Item
            className="p-4 rounded-lg data-[state=on]:bg-green-500/50 w-full text-left"
            value="d2d"
        >
            Day 2 Dinner
        </ToggleGroup.Item>
        </ToggleGroup.Root>
        </Box>
        <Toast.Root
            open={open}
            onOpenChange={setOpen}
            className="rounded-lg bg-zinc-10 p-4"
        >
        <Toast.Description>{toastMsg}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-10 left-10 bg-white" />
        </main>
    )
}
