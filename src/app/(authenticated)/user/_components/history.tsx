import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-select'
import { CreditCard, Pencil } from 'lucide-react'
import React from 'react'

export const History = () => {
  return (
   <>
   <div className="grid gap-3">
            <div className="font-semibold flex justify-start items-center">
              <span>Date: 08/25/2024</span>
              <Button variant="ghost" className='w-4 mx-1 p-0'>
                <Pencil  />
              </Button>
            </div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Status
                </dt>
                <dd>****</dd>
                
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Location
                </dt>
                <dd>****</dd>
              </div>
            </dl>
          </div>
          <Separator className='my-5'/>
          <div className="grid gap-3">
            <div className="font-semibold flex justify-start items-center">
              <span>Date: 08/25/2024</span>
              <Button variant="ghost" className='w-4 mx-1 p-0'>
                <Pencil  />
              </Button>
            </div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Status
                </dt>
                <dd>****</dd>
                
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Location
                </dt>
                <dd>****</dd>
              </div>
            </dl>
          </div>
        </>
  )
}
