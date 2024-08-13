import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IStock } from 'smartbox-types';

import { PageHeader, ButtonsContainer, Section } from '../../../../../components/Layout';
import { Button, Tabs } from '../../../../../components/Branded';
import { Redirect, Route, Switch, useParams } from 'react-router';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { BasicData } from '../../../StockGroups/Stocks/Manage/BasicData';
import { Boxes } from './Boxes';
import { Map } from './Map';
import { Groups } from './Groups';
import { Discounts } from './Discounts';
import ApiService from '../../../../../services/api-service';
import { Handling } from './Handling';
import { Gates } from './Gates';
import { Addons } from './Addons';

const Manage = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);
    const tenant = useSelector((state: ApplicationState) => state.tenant);
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
                to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/data`,
                text: 'application.stockBasicData',
            },
            {
                to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/gates`,
                text: 'application.gates',
            },
            {
                to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/groups`,
                text: 'application.boxesGroups',
            },
            {
                to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/discounts`,
                text: 'application.stockSale',
            },
            {
                to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/boxes`,
                text: 'application.stockBoxes',
            },

        ]

        if (isMapActive) {
            elements.push({
                to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/map`,
                text: 'application.map',
            })
            elements.push({
                to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/handling`,
                text: 'application.stockHandling',
            })
        }

        if(tenant?.allowAddonsToRent) {
            elements.push({
                to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/addons`,
                text: 'application.stockAddons',
            })
        }

        return elements;
    }, [isMapActive])

    return (
        <Section>
            <PageHeader title="application.stockManage" />
            <ButtonsContainer>
                <Button to="/admin/locations/stocks" text="application.back" primary />
            </ButtonsContainer>

            <Tabs
                tabs={tabs}
            />

            <Switch>
                <Route exact path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId`} render={() => <Redirect to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/data`} />} />
                <Route exact path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/data`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/gates`} component={Gates} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/settings`} component={BasicData} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/boxes`} component={Boxes} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/groups`} component={Groups} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/discounts`} component={Discounts} />
                <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/addons`} component={Addons} />
                {isMapActive && <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/map`} component={Map} />}
                {isMapActive && <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/handling`} component={Handling} />}
                {tenant?.allowAddonsToRent && <Route path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/addons`} component={Addons} />}
            </Switch>

        </Section>
    );
};

export { Manage }
