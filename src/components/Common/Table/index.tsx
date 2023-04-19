/* eslint-disable */
import React from 'react';
import { FieldType, TableResponse, TableSchema, TableSchemaField } from 'smartbox-tables';
import { Button, Alert, Pagination } from '../../Common';
import { formatPrice } from '../../../utils/format-price';

import './Table.scss';
import { fullDate } from '../../../utils/format-date';
import {__} from "../../../helpers/i18n";

interface Props {
  scheme: TableSchema;
  data: TableResponse<any>;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  sort?: {
    sortBy: string;
    sortDirBack: boolean;
  };
  onSortChange?: (sortBy: string, sortDirBack: boolean) => void;
}

const formatValue = (value: any, field: TableSchemaField, allValues: any) => {
  if (typeof field.customValue === 'function') {
    value = field.customValue(allValues, field);
  }

  switch (field.type) {
    case FieldType.Custom: {
      return field.customRender && field.customRender(value, field, allValues);
    }

    case FieldType.Url: {
      return value === null ? (
        '-'
      ) : (
        <a href={value} rel="noopener noreferrer" target="_blank">
          {value}
        </a>
      );
    }

    case FieldType.Email: {
      return value === null ? (
        '-'
      ) : (
        <a href={`mailto:${value}`} rel="noopener noreferrer" target="_blank">
          {value}
        </a>
      );
    }
    case FieldType.Tel: {
      return value === null ? (
        '-'
      ) : (
        <a href={`tel:${value}`} rel="noopener noreferrer" target="_blank">
          {value}
        </a>
      );
    }
    case FieldType.Img: {
      return value !== null && <img src={value} alt={field.name} />;
    }
    case FieldType.Date: {
      return value === null || value === undefined ? __('application.notEstablished') : fullDate(value);
    }
    case FieldType.Boolean: {
      return value === null ? __('application.default') : value ? __('application.yes'): __('application.no');
    }
    case FieldType.Price: {
      return value === (null || undefined) ? '-' : formatPrice(value);
    }
    case FieldType.Percent: {
      return value === (null || undefined) ? '-' : `${value}%`;
    }
    case FieldType.Text:
    default: {
      return value === null ? '' : value;
    }
  }
};

function genSortItems(
  header: TableSchemaField,
  sort: { sortBy: string; sortDirBack: boolean },
  onSortChange: (sortBy: string, sortDirBack: boolean) => void,
) {
  if (header.sortable !== true) return null;

  const handleSortChange = (dirBack: boolean) => {
    onSortChange(header.field, dirBack);
  };

  const arrow1 = (
    <a
      onClick={() => handleSortChange(false)}
      className={`sort sort-up ${sort.sortBy === header.field && sort.sortDirBack !== true ? 'active' : ''}`}
    >
      <span className="fa fa-chevron-up" />
    </a>
  );
  const arrow2 = (
    <a
      onClick={() => handleSortChange(true)}
      className={`sort sort-down ${sort.sortBy === header.field && sort.sortDirBack === true ? 'active' : ''}`}
    >
      <span className="fa fa-chevron-down" />
    </a>
  );

  return (
    <>
      {arrow1}
      {arrow2}
    </>
  );
}

class Table extends React.Component<Props> {
  state = {
    toggled: -1,
  };

  private toggleRow = (index: number) => {
    if (index === this.state.toggled) {
      this.setState({ toggled: -1 });
    } else this.setState({ toggled: index });
  };

  render() {
    const desktop = window.matchMedia('(min-width: 920px)').matches;
    let content: any = null;
    if (!this.props.data || this.props.data.items.length === 0) {
      return <Alert type="notice" text='application.lackOfDataToShow' />;
    }

    if (desktop) {
      const headers = this.props.scheme.fields.map((header: TableSchemaField) => (
        <th className={`${header.mobile ? 'mobile' : ''}`} key={header.field}>
          {header.name}{' '}
          {this.props.sort && this.props.onSortChange && genSortItems(header, this.props.sort, this.props.onSortChange)}
        </th>
      ));
      const rows = this.props.data.items.map((row: any, rowIndex: number) => (
        <tr key={rowIndex}>
          {this.props.scheme.fields.map((header: TableSchemaField, index: number) => (
            <td className={`${header.mobile ? 'mobile' : ''}`} key={`${header.field}_${rowIndex}`}>
              {header.buttons
                ? header.buttons.map((button: any, index: number) => (
                    <Button
                      key={index}
                      primary={button.type === 'primary'}
                      danger={button.type === 'danger'}
                      success={button.type === 'success'}
                      to={button.to ? `${button.to}${row.id}` : ''}
                      click={button.click ? () => button.click(row) : null}
                      text={button.name}
                    />
                  ))
                : formatValue(row[header.field], header, row)}
            </td>
          ))}
        </tr>
      ));

      content = (
        <table className="table">
          <thead>
            <tr>{headers}</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );
    } else {
      content = (
        <div className="list">
          <p>{__('application.clickToShowHideDetails')}</p>
          {this.props.data.items.map((row: any, rowIndex: number) => (
            <div
              className={`list-element ${this.state.toggled === rowIndex ? 'toggled' : ''}`}
              onClick={() => this.toggleRow(rowIndex)}
              key={rowIndex}
            >
              {this.props.scheme.fields.map((header: TableSchemaField, index: number) => (
                <div className={`list-row ${header.mobile ? 'mobile' : ''}`}>
                  {header.buttons ? (
                    <div className="list-buttons">
                      {header.buttons.map((button: any, index: number) => (
                        <Button
                          key={index}
                          primary={button.type === 'primary'}
                          danger={button.type === 'danger'}
                          to={button.to ? `${button.to}${row.id}` : ''}
                          click={button.click ? () => button.click(row) : null}
                          text={button.name}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <strong>{header.name}</strong>
                      <span className="list-value">{formatValue(row[header.field], header, row)}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return (
      <>
        {content}
        <Pagination
          initialPage={this.props.initialPage || 1}
          pageCount={Math.ceil(this.props.data.countTotal / this.props.scheme.countPerPage)}
          onPageChange={(page) => this.props.onPageChange && this.props.onPageChange(page)}
        />
      </>
    );
  }
}

export default Table;
