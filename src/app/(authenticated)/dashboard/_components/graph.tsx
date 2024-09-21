import { Card, CardContent } from '@/components/ui/card';
import _axios from '@/lib/axios';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Calendar = dynamic(() => import('react-awesome-calendar'), { ssr: false });

export const Graph = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  function generateRandomHexColor(): string {
    const randomNumber = Math.floor(Math.random() * 16777215);
    const hexString = randomNumber.toString(16).padStart(6, '0');
    return `#${hexString}`;
  }

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

      const _d = data.map((event: any) => {
        const dateTo = new Date(event.dateTo);
        const dateFrom = new Date(event.dateFrom);
        dateTo.setDate(dateTo.getDate() + 1);
        dateFrom.setDate(dateFrom.getDate() + 1);

        // Collect all destinations from the user's locations
        const destinations = event.locations
          .map((location: any) => location.location.destinations.map((destination: any) => destination.name))
          .flat()
          .join(', '); // Join multiple destinations into a single string

        // Add status and purpose to the title
        const status = event.user.statustype?.name || 'No Status'; // Updated to get status from user.statustype
        const purpose = event.purpose || 'No Purpose';

        return {
          id: event.id,
          color: generateRandomHexColor(),
          from: dateFrom,
          to: dateTo,
          title: `${event.user.firstName} ${event.user.lastName} - Purpose: ${purpose}, Status: ${status} at ${destinations}`,
        };
      });

      setEvents(_d);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchRecords();
  }, []);

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
