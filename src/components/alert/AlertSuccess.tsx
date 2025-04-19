import { RocketIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import React from "react"

type AlertType = {
  description?: string
}
const AlertSuccess: React.FC<AlertType> = ({ description }) => {
  return (
    <div className="bg-White fixed right-4 top-4 z-50 rounded-md font-sans shadow-xl">
      <Alert>
        <RocketIcon color="#2a435d" className="h-4 w-4" />
        <AlertTitle className="text-Charcoal font-bold">Thông báo!</AlertTitle>
        <AlertDescription className="text-Charcoal font-medium">
          {description}
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default AlertSuccess
