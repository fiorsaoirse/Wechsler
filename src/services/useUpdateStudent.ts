import { Student } from '@entities';
import { updateStudentUseCase } from '../domain/use-cases';
import { updateStudentBirthdateUseCase } from '../domain/use-cases/UpdateStudentBirthdate';
import { useDateTransformService } from './dateTransformAdapter';
import {
    useMetadataStorage,
    usePeriodStorage,
    useStudentStorage,
} from './storageAdapter';

export function useUpdateStudent() {
    const studentStorage = useStudentStorage();
    return <T extends keyof Student>(property: T, value: Student[T]) =>
        updateStudentUseCase(property, value, { studentStorage });
}

export function useUpdateStudentBirthdate() {
    const studentStorage = useStudentStorage();
    const metadataStorage = useMetadataStorage();
    const periodStorage = usePeriodStorage();
    const dateTransformService = useDateTransformService();

    return (date: Date | null) =>
        updateStudentBirthdateUseCase(date, {
            studentStorage,
            metadataStorage,
            periodStorage,
            dateTransformService,
        });
}
