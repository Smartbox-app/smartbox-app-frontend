import React from "react";
import { RentDescription } from "smartbox-types"
import { Section, SectionHeader } from "../../../../components/Layout";
import { __ } from "../../../../helpers/i18n";
import { RentHistory } from "../../RentHistory";

interface Props {
    description: RentDescription[];
}


export const Description = ({ description }: Props) => {
    return (
        <Section highlight>
            <SectionHeader title="application.rentHistory" />
            <RentHistory description={description} />
        </Section>
    )
}