import { TestDate } from '../domain/types';
import { updateDateUseCase } from '../domain/use-cases/UpdateDate';
import { useDateTransformService } from './public-api';
import {
    useMetadataStorage,
    usePeriodStorage,
    useStudentStorage,
} from './storageAdapter';

export function useUpdateDate() {
    const studentStorage = useStudentStorage();
    const metadataStorage = useMetadataStorage();
    const periodStorage = usePeriodStorage();
    const dateTransformService = useDateTransformService();

    return (date: Date | null) =>
        updateDateUseCase(date as TestDate | null, {
            studentStorage,
            metadataStorage,
            periodStorage,
            dateTransformService,
        });
}
