import { Role } from "./role";

export type User = {
    id: string,
    title: string,
    firstName: string,
    middleName: string,
    lastName: string,
    role: Role,
    updatedAt: Date,
}

export const EducationalTitles: string[] = [
    'All',
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
    'Superintendent'
  ];