import { ChevronRight, CreditCard } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import { type History as historyType } from '@/lib/types/history'
import _axios from '@/lib/axios'
import { HistoryContext, HistoryContextType } from '@/lib/context'
import { Separator } from '@radix-ui/react-dropdown-menu'


export const History = () => {
  const {user, location, status, getHistory, history} = useContext<HistoryContextType>(HistoryContext)  

  useEffect(() => {
    const init = async (): Promise<void> => {
      await getHistory()
    }
    void init()
    
  }, [user])

  return (
   <>
      <div className="grid gap-3">
        {history?.map((data: historyType, index: number) => {
          return <div key={index}>
            <div className="font-semibold flex justify-between items-center">
              <span>{new Date(data.dateFrom).toDateString()}</span>
              <span><ChevronRight /></span>
              <span>{new Date(data.dateTo).toDateString()}</span>

            </div>
            <Separator className='my-5' />
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Status
                </dt>
                <dd>{data?.statustype?.name}</dd>  
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Location
                </dt>
                <dd>{data?.destination?.name}</dd>
              </div>
            </dl>
          </div>
        })}
      </div>
   </>
  )
}
