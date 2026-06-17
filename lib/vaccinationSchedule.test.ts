import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getVaccinationStatus, VaxRecord } from './vaccinationSchedule';
import { subDays, addDays, subMonths, format } from 'date-fns';

describe('getVaccinationStatus', () => {
  const now = new Date();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  // Level 1: Valid Until (Expiry)
  it('should return DUE if valid_until is in the past', () => {
    const expiredDate = format(subDays(now, 5), 'yyyy-MM-dd');
    const okDate = format(addDays(now, 60), 'yyyy-MM-dd');
    const records: VaxRecord[] = [
      { vaccination_date: format(subDays(now, 100), 'yyyy-MM-dd'), valid_until: okDate, vaccine_type: 'Other' },
      { vaccination_date: format(subDays(now, 370), 'yyyy-MM-dd'), valid_until: expiredDate, vaccine_type: 'Rabies' }
    ];
    const status = getVaccinationStatus('Dog', null, records);
    expect(status.state).toBe('due');
    expect(status.label).toBe('Rabies Vaccination Due');
  });

  it('should return UPCOMING if valid_until is within 30 days', () => {
    const upcomingDate = format(addDays(now, 10), 'yyyy-MM-dd');
    const okDate = format(addDays(now, 60), 'yyyy-MM-dd');
    const records: VaxRecord[] = [
      { vaccination_date: format(subDays(now, 350), 'yyyy-MM-dd'), valid_until: upcomingDate, vaccine_type: 'Other' },
      { vaccination_date: format(subDays(now, 100), 'yyyy-MM-dd'), valid_until: okDate, vaccine_type: 'Rabies' }
    ];
    const status = getVaccinationStatus('Cat', null, records);
    expect(status.state).toBe('upcoming');
    expect(status.label).toBe('Core Vaccination upcoming');
    if (status.state === 'upcoming') {
      expect(status.daysLeft).toBe(10);
    }
  });

  it('should return OK if valid_until is > 30 days away', () => {
    const farDate = format(addDays(now, 60), 'yyyy-MM-dd');
    const records: VaxRecord[] = [
      { vaccination_date: format(subDays(now, 100), 'yyyy-MM-dd'), valid_until: farDate, vaccine_type: 'Other' },
      { vaccination_date: format(subDays(now, 100), 'yyyy-MM-dd'), valid_until: farDate, vaccine_type: 'Rabies' }
    ];
    const status = getVaccinationStatus('Dog', null, records);
    expect(status.state).toBe('ok');
    expect(status.label).toBe('Vaccinations Up to Date');
  });

  // Aggregation (Worst case scenario)
  it('should surface DUE if one vaccine is OK and another is DUE', () => {
    const okDate = format(addDays(now, 60), 'yyyy-MM-dd');
    const expiredDate = format(subDays(now, 5), 'yyyy-MM-dd');
    
    const records: VaxRecord[] = [
      { vaccination_date: format(subDays(now, 100), 'yyyy-MM-dd'), valid_until: okDate, vaccine_type: 'Other' }, // Core is OK
      { vaccination_date: format(subDays(now, 400), 'yyyy-MM-dd'), valid_until: expiredDate, vaccine_type: 'Rabies' } // Rabies is DUE
    ];
    
    const status = getVaccinationStatus('Dog', null, records);
    expect(status.state).toBe('due');
    expect(status.label).toBe('Rabies Vaccination Due');
  });

  // Level 2: Puppy shot 2 fallback (28-day offset)
  it('should use 28-day offset for puppy shot fallback if no valid_until', () => {
    const shot1Date = format(subDays(now, 10), 'yyyy-MM-dd');
    const okDate = format(addDays(now, 60), 'yyyy-MM-dd');
    const records: VaxRecord[] = [
      { vaccination_date: shot1Date, shot_type: 'shot_1' },
      { vaccination_date: format(subDays(now, 100), 'yyyy-MM-dd'), valid_until: okDate, vaccine_type: 'Rabies' }
    ];
    
    const status = getVaccinationStatus('Dog', null, records);
    expect(status.state).toBe('upcoming');
    expect(status.label).toBe('Shot 2 upcoming');
    if (status.state === 'upcoming') {
      expect(status.daysLeft).toBe(18); // 28 - 10
    }
  });

  // Level 3: Age-based projection (Post-puppy age gap)
  it('should explicitly display Annual Booster due in ~X months for 6-month-old post-puppy dog', () => {
    const dob = format(subMonths(now, 6), 'yyyy-MM-dd');
    const lastShotDate = format(subMonths(now, 3), 'yyyy-MM-dd');
    const okDate = format(addDays(now, 60), 'yyyy-MM-dd');
    const records: VaxRecord[] = [
      { vaccination_date: lastShotDate, vaccine_type: 'Other' },
      { vaccination_date: format(subDays(now, 100), 'yyyy-MM-dd'), valid_until: okDate, vaccine_type: 'Rabies' }
    ];

    const status = getVaccinationStatus('Dog', dob, records);
    expect(status.state).toBe('ok');
    expect(status.label).toBe('Vaccinations Up to Date');
    expect(status.sublabel).toContain('Core Annual due in ~9 months'); // 1 year from last shot
  });

  it('should return DUE for 6-month-old dog with NO history', () => {
    const dob = format(subMonths(now, 6), 'yyyy-MM-dd');
    const status = getVaccinationStatus('Dog', dob, []);
    expect(status.state).toBe('due');
    expect(status.label).toBe('Core Vaccination Due'); 
  });
});
