import { useParams, } from 'react-router';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';

const Addons = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const user = useSelector((state: ApplicationState) => state.user.details);

    if (!user) return null;

    return null
}

export { Addons };
