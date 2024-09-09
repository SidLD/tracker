import { History } from "./history";
import { Role } from "./role";

export type User = {
    id: string,
    title: string,
    firstName: string,
    middleName: string,
    lastName: string,
    updatedAt: Date,
    record: History[] | undefined
}

export const EducationalTitles: string[] = [
    'All',
    'Supervisor - English',
    'Supervisor - Science',
    'Supervisor - Math',
    'Supervisor - Filipino',
    'Supervisor - MAPEH',
    'Supervisor - TLE',
    'Supervisor - ArPa',
    'Supervisor - ESP',
    'Elementary School Teacher',
    'High School Teacher',
    'Special Education Teacher',
    'English Teacher',
    'Math Teacher',
    'Science Teacher',
    'History Teacher',
    'Art Teacher',
    'Music Teacher',
    'Physical Education Teacher',
    'Guidance Counselor',
    'Academic Advisor',
    'Principal',
    'Vice Principal',
    'Department Head',
    'Curriculum Coordinator',
    'Instructional Coach',
    'Teacher Assistant',
    'Educational Consultant',
    'School Social Worker',
    'School Psychologist',
    'Superintendent',
  ];