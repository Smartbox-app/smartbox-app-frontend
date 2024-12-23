import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import { Tabs } from '../../../components/Branded';
import { Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';


const Management = () => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
    return <Section full>
        <Tabs
            tabs={[

            ]}
        />

        <Switch>
        </Switch>
    </Section>
}

export default Management;
