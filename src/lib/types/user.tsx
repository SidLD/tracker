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
    'EPS - English',
    'EPS - Filipino',
    'EPS - Math',
    'EPS - Science ',
    'EPS - MAPEH',
    'EPS - ArPa',
    'EPS - TLE',
    'PS - ESP',
    'CID Chief',
    'PSD',
    'STAFF'
  ];