import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reducers';
import SimpleStockMap from '../SimpleStockMap';

import './UserStockMap.scss';
import { __ } from '../../../helpers/i18n';
import { StockList } from '../../../../../smartbox-back/types/stock';

interface Props {
    boxNumberToMarkWay: number;
    stockList: StockList[];
}

class UserStockMap extends React.Component<Props> {
    private element: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.element = React.createRef();
    }

    private boxMarker = (list: NodeList | undefined, boxToMark: number): void => {
        if (list) {
            list.forEach((singleElement: any) => {
                if (Number(singleElement.id) === boxToMark) {
                    singleElement.classList.remove('not-my-box');
                    singleElement.classList.add('my-box');
                } else {
                    singleElement.classList.add('not-my-box');
                }
            });
        }
    };

    private arrowMarker = (list: NodeList | undefined): void => {
        if (list) {
            list.forEach((singleElement: any) => {
                singleElement.classList.add('rented');
            });
        }
    };

    private setMarker = () => {
        const { boxNumberToMarkWay } = this.props;
        setTimeout(() => {
            const row = boxNumberToMarkWay && Math.floor(boxNumberToMarkWay / 100);

            const catchElement = this.element.current?.children[1].querySelectorAll(`.row${row}00`);
            this.arrowMarker(catchElement);

            const myBox = this.element.current?.querySelectorAll('#kontenery .storage');
            this.boxMarker(myBox, boxNumberToMarkWay);
        });
    };

    componentDidMount() {
        this.setMarker();
    }

    componentDidUpdate(prevProps: Props) {
        const { boxNumberToMarkWay } = this.props;
        if (boxNumberToMarkWay !== prevProps.boxNumberToMarkWay && boxNumberToMarkWay) {
            this.setMarker();
        }
    }

    render() {
        const { boxNumberToMarkWay, stockList } = this.props;
        return (
            <div ref={this.element}>
                <p className="user-box">
                    {__('application.yourStoreNumber')} <strong>{boxNumberToMarkWay}</strong>
                </p>
                <SimpleStockMap map={stockList[0].map} />
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    stockList: state.stock.list
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserStockMap);
