import { IDtoService, PeriodType } from '@ports';
import { IPeriod, IPeriodDto } from '@types';
import { useSubtestDtoService } from './subtestDtoService';

function getEnumKeyByEnumValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
    const key = Object.keys(myEnum).find(x => myEnum[x] === enumValue);
    return key ?? null;
}

export const usePeriodDtoService = (): IDtoService<IPeriod, IPeriodDto> => {
    const subtestDtoService = useSubtestDtoService();

    const typeMapper = (type: string): PeriodType => {
        const key = getEnumKeyByEnumValue(PeriodType, type);

        if (!key) {
            throw Error(`Unknown type for mapping: "${type}"`);
        }

        return PeriodType[key];
    };

    return {
        toDto(from: IPeriod): IPeriodDto {
            return {
                type: from.type as string,
                verbalSubtests: from.verbalSubtests.map(x => subtestDtoService.toDto(x)),
                nonverbalSubtests: from.nonverbalSubtests.map(x => subtestDtoService.toDto(x)),
            };
        },

        toEntity(from: IPeriodDto): IPeriod {
            const verbalSubtests = from.verbalSubtests.map(x => subtestDtoService.toEntity(x));
            const nonverbalSubtests = from.nonverbalSubtests
                .map(x => subtestDtoService.toEntity(x));

            return {
                type: typeMapper(from.type),
                verbalSubtests,
                nonverbalSubtests,
            };
        },
    };
};
