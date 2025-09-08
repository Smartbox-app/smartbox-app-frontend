import React from 'react';
import { UserClientListRes } from 'smartbox-types';
import { __ } from '../../../../../../helpers/i18n';
import './StockDetails.scss';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

interface Props {
    user: UserClientListRes
}

const getBoxesLimit = (stockLimit: number | null | undefined, tenantLimit: number) => {
    if (typeof stockLimit === 'number') return stockLimit;
    return tenantLimit;
}

const StocksDetails = ({ user }: Props) => {
    const { getText } = useTenantNaming();
    const { allowedBoxesCount, allowedStocksCount, stocks } = user;

    if (!stocks) return null;
    return <div className={`stock-details ${stocks.length > allowedStocksCount ? 'stock-warning' : ''}`}>
        {getText('count')} {stocks.length}/{allowedStocksCount}
        {stocks.map(stock => <div className={`stock-details ${stock.boxes.count > getBoxesLimit(stock.allowexBoxesCount, allowedBoxesCount) ? 'stock-warning' : ''}`} key={stock.id}>
            <strong>{stock.name}</strong>
            <div>{stock.boxes.count}/{getBoxesLimit(stock.allowexBoxesCount, allowedBoxesCount)} {__('application.boxesShortcut')}</div>
        </div>)}
    </div>
}

export { StocksDetails }