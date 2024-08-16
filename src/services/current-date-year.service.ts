import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentDateYearService {

  constructor() { }

  getCurrentYearAndDate(option: 'get_date' | 'no_date'): string {
    const now = new Date();
    const year = now.getFullYear();
    return option === 'get_date'
      ? `${now.toLocaleString('en-US', { month: 'short' })} ${now.getDate()}, ${year}`
      : `${year}`;
  }
}
