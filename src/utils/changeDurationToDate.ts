import { DurationType } from '@/components/HoldersForm';

export const changeDurationToDate = (duration: string | Date, durationType: DurationType): Date => {
  if (typeof duration === 'string') {
    const now = new Date();

    switch (durationType) {
      case 'days':
        return new Date(now.setDate(now.getDate() - Number(duration)));
      case 'weeks':
        return new Date(now.setDate(now.getDate() - Number(duration) * 7));
      case 'months':
        return new Date(now.setMonth(now.getMonth() - Number(duration)));
    }
  }

  return duration;
};
