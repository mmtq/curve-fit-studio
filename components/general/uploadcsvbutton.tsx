'use client'

import { useRef, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadCloud } from 'lucide-react'
import { uploadCsv } from '@/actions/uploadcsv'

export default function CSVUploader({
  onPoints,
}: {
  onPoints: (pts: [number, number][]) => void
}) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleUpload = async (formData: FormData) => {
    startTransition(async () => {
      const points = await uploadCsv(formData)
      console.log('points', points)
      onPoints(points)
      formRef.current?.reset()
    })
  }

  return (
    <form action={handleUpload} ref={formRef} className="space-y-2">
      <Label htmlFor="csv-upload" className="flex items-center gap-2 cursor-pointer">
        <UploadCloud className="w-5 h-5" />
        Upload CSV File
      </Label>
      <Input
        type="file"
        name="file"
        id="csv-upload"
        accept=".csv"
        className="cursor-pointer"
        disabled={isPending}
      />
    </form>
  )
}
