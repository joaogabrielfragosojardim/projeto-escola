import moment from 'moment';

import { monthsObject } from '@/constants/month';
import { prisma } from '@/lib/prisma';

interface GetAllLearningMonitoringUseCaseRequest {
  startDate?: Date;
  finalDate?: Date;
  teacherId?: string;
  coordinatorId?: string;
  projectId?: string;
  period?: string;
  year?: string;
  studentId?: string;
}

type SeaStatus =
  | 'Pré-Silábico'
  | 'Silábico'
  | 'Silábico-Alfabético'
  | 'Alfabético';

export class GetAllSeaUseCase {
  async execute({
    teacherId,
    coordinatorId,
    projectId,
    studentId,
    finalDate,
    startDate,
    year,
    period,
  }: GetAllLearningMonitoringUseCaseRequest) {
    const learningMonitoring = await prisma.learningMonitoring.findMany({
      select: {
        writingLevel: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
      where: {
        createdAt: {
          gte: startDate,
          lte: finalDate,
        },
        classroom: {
          school: {
            projectId: {
              equals: projectId,
            },
            coordinators: {
              every: {
                coordinatorId: { equals: coordinatorId },
              },
            },
          },
          period: {
            equals: period,
          },
          year: {
            equals: year,
          },
        },
        teacher: { id: { equals: teacherId } },
        studentId: { equals: studentId },
      },
    });

    const momentData = learningMonitoring.map((item) => {
      const monthAndYear = moment(item.createdAt).format('YYYY-MM');

      return {
        writingLevel: item.writingLevel,
        date: monthAndYear,
      };
    });

    const uniqueYears = [
      ...new Set(momentData.map((item) => moment(item.date).year())),
    ];

    const allSameYear = uniqueYears.length === 1;

    const result: {
      name: string;
      'Pré-Silábico': number;
      Silábico: number;
      'Silábico-Alfabético': number;
      Alfabético: number;
    }[] = [];

    if (allSameYear) {
      const byMonthData = momentData.map((item) => {
        const monthFormat = moment(item.date).format('MM');
        const yearFormat = moment(item.date).format('YYYY');

        return {
          writingLevel: item.writingLevel,
          date: monthFormat,
          yearFormat,
        };
      });

      byMonthData.forEach((item) => {
        const { date, writingLevel } = item;

        const hasMonthInArray = result.filter(
          (someItem) =>
            someItem.name === `${monthsObject[date]}/${item.yearFormat}`,
        );

        if (!hasMonthInArray.length) {
          const dataToPush = {
            name: `${monthsObject[date]}/${item.yearFormat}`,
            'Pré-Silábico': 0,
            Silábico: 0,
            'Silábico-Alfabético': 0,
            Alfabético: 0,
          };
          // eslint-disable-next-line no-multi-assign
          dataToPush[writingLevel as SeaStatus] = dataToPush[
            writingLevel as SeaStatus
          ] += 1;

          result.push(dataToPush);
          console.log('bateu aq');
        } else if (hasMonthInArray[0]) {
          const existentIndex = result.indexOf(hasMonthInArray[0]);
          // @ts-ignore
          // @ts-ignore
          // eslint-disable-next-line no-multi-assign
          result[existentIndex][writingLevel as SeaStatus] = result[
            existentIndex
          ][writingLevel as SeaStatus] += 1;
        }
      });

      return { data: result };
    }

    const byYearData = momentData.map((item) => {
      const yearFormat = moment(item.date).format('YYYY');

      return {
        writingLevel: item.writingLevel,
        date: yearFormat,
      };
    });

    byYearData.forEach((item) => {
      const { date, writingLevel } = item;

      const hasYearInArray = result.filter(
        (someItem) => someItem.name === date,
      );

      if (!hasYearInArray.length) {
        const dataToPush = {
          name: date,
          'Pré-Silábico': 0,
          Silábico: 0,
          'Silábico-Alfabético': 0,
          Alfabético: 0,
        };
        // eslint-disable-next-line no-multi-assign
        dataToPush[writingLevel as SeaStatus] = dataToPush[
          writingLevel as SeaStatus
        ] += 1;

        result.push(dataToPush);
      } else if (hasYearInArray[0]) {
        const existentIndex = result.indexOf(hasYearInArray[0]);
        // @ts-ignore
        // @ts-ignore
        // eslint-disable-next-line no-multi-assign
        result[existentIndex][writingLevel as SeaStatus] = result[
          existentIndex
        ][writingLevel as SeaStatus] += 1;
      }
    });

    return {
      data: result,
    };
  }
}
