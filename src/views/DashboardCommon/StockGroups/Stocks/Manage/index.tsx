import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IStock } from 'smartbox-types';

import { PageHeader, ButtonsContainer, Section } from '../../../../../components/Layout';
import { Button, Tabs } from '../../../../../components/Branded';
import { Route, Switch, useParams } from 'react-router';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { BasicData } from '../../../StockGroups/Stocks/Manage/BasicData';
import { Boxes } from './Boxes';
import { Map } from './Map';
import { Groups } from './Groups';
import { Discounts } from './Discounts';
import ApiService from '../../../../../services/api-service';

const Manage = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);
    const [isMapActive, setMapActive] = useState<boolean>(false);

    const getStockData = async () => {
        await ApiService.callFetch('GET', `stock/${stockId}`, (stock: IStock) => {
            setMapActive(stock.isMapActive)
        })
    }

    useEffect(() => {
        getStockData();
    }, []);

    const tabs = useMemo(() => {
        const elements = [
            {
                to: `/${UserService.getSlugByRole(user!.role)}/stocks/${stockId}`,
                text: 'application.stockBasicData',
            },
            {
                to: `/${UserService.getSlugByRole(user!.role)}/stocks/${stockId}/groups`,
                text: 'application.boxesGroups',
            },
            {
                to: `/${UserService.getSlugByRole(user!.role)}/stocks/${stockId}/discounts`,
                text: 'application.stockSale',
            },
            {
                to: `/${UserService.getSlugByRole(user!.role)}/stocks/${stockId}/boxes`,
                text: 'application.stockBoxes',
            },

        ]

        if (isMapActive) {
            elements.push({
                to: `/${UserService.getSlugByRole(user!.role)}/stocks/${stockId}/map`,
                text: 'application.map',
            })
        }

        return elements;
    }, [isMapActive])

    return (
        <Section>
            <PageHeader title="application.stockManage" />
            <ButtonsContainer>
                <Button to="/admin/stocks" text="application.back" primary />
            </ButtonsContainer>

            <Tabs
                tabs={tabs}
            />

            <Switch>
                <Route exact path={`/${UserService.getSlugByRole(user!.role)}/stocks/:stockId`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/stocks/:stockId/settings`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/stocks/:stockId/boxes`} component={Boxes} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/stocks/:stockId/groups`} component={Groups} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/stocks/:stockId/discounts`} component={Discounts} />
                {isMapActive && <Route path={`/${UserService.getSlugByRole(user!.role)}/stocks/:stockId/map`} component={Map} />}
            </Switch>

        </Section>
    );
};

export { Manage }
