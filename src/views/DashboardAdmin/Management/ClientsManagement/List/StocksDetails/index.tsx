import React from 'react';
import { UserClientListRes } from 'smartbox-types';
import { __ } from '../../../../../../helpers/i18n';
import './StockDetails.scss';

interface Props {
    user: UserClientListRes
}

const StocksDetails = ({ user }: Props) => {
    const { allowedBoxesCount, allowedStocksCount, stocks } = user;
    if(!stocks) return null;
    return <div className={`stock-details ${stocks.length > allowedStocksCount ? 'stock-warning' : ''}`}>
        {__('application.stocksCount')} {stocks.length}/{allowedStocksCount}
        {stocks.map(stock => <div className={`stock-details ${stock.boxes.count > allowedBoxesCount ? 'stock-warning' : ''}`} key={stock.id}>
            <strong>{stock.name}</strong>
            <div>{stock.boxes.count}/{allowedBoxesCount} {__('application.boxesShortcut')}</div>
        </div>)}
    </div>
}

export { StocksDetails }