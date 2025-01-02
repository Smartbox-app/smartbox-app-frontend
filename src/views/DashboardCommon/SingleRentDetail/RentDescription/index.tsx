import React from "react";
import { MyRentDetails, RentDescription } from "smartbox-types"
import { Section, SectionHeader } from "../../../../components/Layout";
import { __ } from "../../../../helpers/i18n";
import { RentHistory } from "../../RentHistory";

interface Props {
    description: RentDescription[];
    rent: MyRentDetails;
}


export const Description = ({ description, rent }: Props) => {
    return (
        <Section highlight>
            <SectionHeader title="application.rentHistory" />
            <RentHistory description={description} rentId={rent.id} paymentType={rent.paymentType} periods={rent.periods} />
        </Section>
    )
}