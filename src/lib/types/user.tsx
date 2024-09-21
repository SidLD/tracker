import { History } from "./history";
import { StatusType } from "./status";

export type User = {
    id: string,
    title: string,
    firstName: string,
    middleName: string,
    lastName: string,
    updatedAt: Date,
    record: History[] | undefined
    statustype: StatusType
}

export const EducationalTitles: string[] = [
    'All',
    'EPS I',
    'EPS II',
    'EPS - English',
    'EPS - Filipino',
    'EPS - Math',
    'EPS - Science ',
    'EPS - MAPEH',
    'EPS - ArPa',
    'EPS - TLE',
    'EPS - ESP',
    'EPS - PERSONNEL',
    'PS - ESP',
    'CID Chief',
    'PSDS',
    'STAFF'
  ];