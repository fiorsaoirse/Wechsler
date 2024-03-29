import { useUpdatePeriod } from '@adapters';
import { Subtest } from '@entities';
import WarningIcon from '@mui/icons-material/WarningRounded';
import { IconButton, TableCell, TableRow, TextField, Tooltip } from '@mui/material';
import { buildSubtestTranslateKey } from '@utils';
import { useTranslation } from 'react-i18next';

export interface IRawTestItemProps {
    subtest: Subtest;
}

const getTooltip = (title: string): JSX.Element => {
    return (
        <Tooltip className="tooltip-container" title={title}>
            <IconButton className="tooltip-container__content">
                <WarningIcon />
            </IconButton>
        </Tooltip>
    );
};

export const RawTestItem = (props: IRawTestItemProps): JSX.Element => {
    const { t } = useTranslation();
    const updatePeriod = useUpdatePeriod();

    const { subtest } = props;

    const name = buildSubtestTranslateKey(subtest.name);

    const handlePointChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value ?? null;
        updatePeriod(subtest.name, value);
    };

    return (
        <TableRow key={subtest.name}>
            <TableCell key={`${name}-label`} component="th" scope="row">{t(name)}</TableCell>
            <TableCell key={`${name}-icon`}
                width="20px">
                { subtest.isInvalid
                    ? getTooltip(t('subtest.maxPointsOverflow', { maxValue: subtest.maxAvaiableValue }))
                    : <div className="tooltip-container__empty"></div>
                }
            </TableCell>
            <TableCell width="150px" key={name} align="right" className="field">
                <TextField 
                    error={subtest.isInvalid}
                    value={subtest.rawPoints ?? ''}
                    onChange={handlePointChange}
                />
            </TableCell>
        </TableRow>
    );
};