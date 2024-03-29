import { Student } from '@entities';
import {
    IDtoService, IMetadataStorageService, IPeriodDispatchingService,
    IPeriodStorageService, ISerializationService,
    IStudentStorageService,
} from '@ports';
import {
    IConclusionDto,
    IDateDto, IPeriod, IPeriodDto,
    IStudentDto, TestConclusion, TestDate,
} from '@types';

export interface IImportUseCaseDependencies {
    studentStorage: IStudentStorageService;
    metadataStorage: IMetadataStorageService;
    periodStorage: IPeriodStorageService;
    serializationService: ISerializationService;
    studentDtoService: IDtoService<Student, IStudentDto>,
    periodDtoService: IDtoService<IPeriod, IPeriodDto>,
    dateDtoService: IDtoService<TestDate, IDateDto>,
    conclusionDtoService: IDtoService<TestConclusion, IConclusionDto>,
    periodDispatchingService: IPeriodDispatchingService
}

export const importUseCase = (fileContent: string, {
    studentStorage, metadataStorage,
    periodStorage, serializationService,
    studentDtoService, periodDtoService, dateDtoService,
    conclusionDtoService, periodDispatchingService,
}: IImportUseCaseDependencies): void => {
    const { updateStudent } = studentStorage;
    const { updateDate, updateConclusion } = metadataStorage;
    const { updatePeriod } = periodStorage;

    const {
        student: studentDto,
        period: periodDto,
        date: dateDto,
        conclusion: conclusionDto,
    } = serializationService.deserialize(fileContent);

    const student = studentDtoService.toEntity(studentDto);

    const date = dateDtoService.toEntity(dateDto);
    const conclusion = conclusionDtoService.toEntity(conclusionDto);

    const period = periodDto ? periodDtoService.toEntity(periodDto) : null;
    const mappedPeriod = periodDispatchingService.dispatch(period);

    period?.verbalSubtests.map(subtest => {
        mappedPeriod?.updateTestValue(subtest.name, subtest.rawPoints);
    });

    period?.nonverbalSubtests.map(subtest => {
        mappedPeriod?.updateTestValue(subtest.name, subtest.rawPoints);
    });

    updateStudent(student);
    updateDate(date);
    updateConclusion(conclusion);
    updatePeriod(mappedPeriod);

};