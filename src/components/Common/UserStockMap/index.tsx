import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reducers';
import SimpleStockMap from '../SimpleStockMap';

interface Props {
  boxNumberToMarkWay: number;
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
          singleElement.classList.add('myBox');
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

  public componentDidMount(): void {
    const { boxNumberToMarkWay } = this.props;
    const row = boxNumberToMarkWay && Math.floor(boxNumberToMarkWay / 100);

    const catchElement = this.element.current?.children[1].querySelectorAll(`.row${row}00`);
    this.arrowMarker(catchElement);

    const myBox = this.element.current?.querySelectorAll('#kontenery .storage');
    this.boxMarker(myBox, boxNumberToMarkWay);
  }

  render() {
    const { boxNumberToMarkWay } = this.props;
    return (
      <div ref={this.element}>
        <p className="user-box">
          Twoja skrytka ma numer: <strong>{boxNumberToMarkWay}</strong>
        </p>
        <SimpleStockMap />
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserStockMap);
