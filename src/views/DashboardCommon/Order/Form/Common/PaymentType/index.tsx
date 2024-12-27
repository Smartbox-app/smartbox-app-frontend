import styled from "styled-components";
import { Section } from "../../../../../../components/Layout";
import { __ } from "../../../../../../helpers/i18n";
import { IStock, RentPaymentType, StockPaymentType } from "smartbox-types";
import { SinglePaymentType } from "./SinglePaymentType";

type Props = {
    stock: IStock;
}

const StyledHeader = styled('h4')({
    margin: '10px 0',
    fontWeight: 700,
    fontSize: '1.1rem'
})

export const PaymentType = ({ stock }: Props) => {
    const getPaymentTypeText = (type: StockPaymentType) => {
        switch (type) {
            case StockPaymentType.Both: return 'application.choosePaymentType';
            case StockPaymentType.InAdvance: return 'application.paymentInAdvance';
            case StockPaymentType.Installments: return 'application.paymentInstallments';
        }
    }

    return (
        <Section highlight>
            <StyledHeader>
                {__('application.paymentType')}
            </StyledHeader>
            <p>{__(getPaymentTypeText(stock.clientPaymentTypeConfig))}</p>
            {stock.clientPaymentTypeConfig === StockPaymentType.Both ? <ul>
                <SinglePaymentType type={RentPaymentType.InAdvance} label='application.paymentInAdvance' />
                <SinglePaymentType type={RentPaymentType.Installments} label='application.paymentInstallments' />
            </ul> : null}
        </Section>
    );
}