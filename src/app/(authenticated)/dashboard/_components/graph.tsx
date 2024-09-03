import { Card, CardContent } from '@/components/ui/card';
import React from 'react'
// import Calendar from 'react-awesome-calendar';



export const Graph = () => {
const getCurrentMonthDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); 
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); 
    return { start, end };
  };
  
  const { start: monthStart, end: monthEnd } = getCurrentMonthDates();
  
  const events = [
    {
      id: 1,
      color: '#fd3153',
      from: monthStart.toISOString(),
      to: new Date(monthStart.getFullYear(), monthStart.getMonth(), 5).toISOString(), 
      title: 'This is an event',
    },
    {
      id: 2,
      color: '#1ccb9e',
      from: monthStart.toISOString(),
      to: new Date(monthStart.getFullYear(), monthStart.getMonth(), 15).toISOString(), 
      title: 'This is another event',
    },
    {
      id: 3,
      color: '#3694DF',
      from: monthStart.toISOString(),
      to: monthEnd.toISOString(), // End date as the last day of the month
      title: 'This is also another event',
    },
  ];
  return (
    <div>
        <Card>
            <CardContent>
             {/* <Calendar
                events={events}
                view="month"
                
            />  */}
            </CardContent>
        </Card>
    </div>
  )
}
