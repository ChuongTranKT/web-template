import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AlertType = {
  description?: string
}
const AlertError: React.FC<AlertType> = ({ description }) => {
  return (
    <div className="border-PersianRed bg-White fixed right-4 top-4 z-50 rounded-md font-sans shadow-xl">
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="text-PersianRed h-4 w-4" />
        <AlertTitle className="text-PersianRed font-bold">Lỗi</AlertTitle>
        <AlertDescription className="text-PersianRed font-medium">
          {description}
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default AlertError
