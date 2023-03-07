import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationState } from 'src/reducers';
import { Input } from '../../../../components/Common';
import { __ } from "../../../../helpers/i18n";
import './StockSelect.scss';

interface Props {
    onChange: (stock: string) => void;
}

const StockSelect = ({ onChange }: Props) => {
    const { list } = useSelector((state: ApplicationState) => state.stock);

    const [value, setValue] = useState<string>();

    useEffect(() => {
        if (value) onChange(value);
    }, [value])

    useEffect(() => {
        console.log('list', list);
        if (list && list[0])
            setValue(list[0].id)
    }, [list])

    return (
        <div className="stock-select-wrapper">
            <Input
                className="form-field field-type-staticSelect"
                type="select"
                input={{
                    value,
                    label: __('application.stockSelect'),
                    name: 'stockId',
                    id: 'stockId',
                    placeholder: __('application.stockSelect'),
                    onChange: (stock) => { setValue(stock.target.value) }
                }}
                options={list.map(stock => ({
                    value: stock.id,
                    name: stock.name
                }))}
            />
        </div>
    );
};

export default StockSelect;
