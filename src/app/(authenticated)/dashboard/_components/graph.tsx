import { Card, CardContent } from '@/components/ui/card';
import _axios from '@/lib/axios';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Calendar = dynamic(() => import('react-awesome-calendar'), { ssr: false });

export const Graph = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Function to generate random hex color
  function generateRandomHexColor(): string {
    const randomNumber = Math.floor(Math.random() * 16777215);
    const hexString = randomNumber.toString(16).padStart(6, '0');
    return `#${hexString}`;
  }

  // Function to fetch records from the API
  const fetchRecords = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); 
      const formattedMonth = `${year}-${month}`;

      const { data } = await _axios.get('/api/record', {
        params: {
          month: formattedMonth
        }
      });

      // Process data to match calendar format
      const _d = data.map((event: any) => {
        const dateTo = new Date(event.dateTo);
        const dateFrom = new Date(event.dateFrom);
        dateTo.setDate(dateTo.getDate() + 1);
        dateFrom.setDate(dateFrom.getDate() + 1);

        return {
          id: event.id,
          color: generateRandomHexColor(),
          from: dateFrom,
          to: dateTo,
          title: `${event.user.firstName}, ${event.user.lastName} at ${event.destination.name}`,
        };
      });

      setEvents(_d);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to set the client-side flag
  useEffect(() => {
    setIsClient(true);
    fetchRecords();
  }, []);

  // Render loading state or calendar
  return (
    <>
      {!loading && isClient && (
        <div>
          <Card>
            <CardContent>
              <Calendar events={events} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
