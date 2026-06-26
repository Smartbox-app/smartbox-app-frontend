import React from 'react';
import {
  FieldType,
  TableButton,
  TableResponse,
  TableSchema,
  TableSchemaField,
} from 'smartbox-tables';
import { Alert, Pagination } from '../../Common';
import { Button } from '../../Branded';
import { formatPrice } from '../../../utils/format-price';

import './Table.scss';
import { fullDate } from '../../../utils/format-date';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { getColorForBackground } from '../../../utils/color';
import { lighten, setLightness } from 'polished';
import { ButtonsContainer } from 'src/components/Layout';
import { Link } from '../../ui';

interface Props {
  scheme: TableSchema;
  data: TableResponse<any>;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  sort?: {
    sortBy: string;
    sortDirBack: boolean;
  } | null;
  onSortChange?: (sortBy: string, sortDirBack: boolean) => void;
}

const TableContainer = styled('div')(({ theme }) => ({
  overflow: 'auto',
  width: '100%',
}));

const StyledRow = styled('tr')<{ $highlight?: boolean }>(({ theme, $highlight }) => {
  const secondaryLight = setLightness(0.95, theme.colors.secondary);
  const highlightBackground = theme.colors.surface.attention.secondary;

  return {
    height: 56,
    ...($highlight
      ? {
          backgroundColor: highlightBackground,
          color: getColorForBackground(highlightBackground),
          boxShadow: `inset 4px 0 0 ${theme.colors.surface.attention.primary}`,
        }
      : {
          '&:nth-child(odd)': {
            backgroundColor: secondaryLight,
            color: getColorForBackground(secondaryLight),
          },
        }),
  };
});

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
        <Link href={value} rel="noopener noreferrer" target="_blank">
          {value}
        </Link>
      );
    }

    case FieldType.Email: {
      return value === null ? (
        '-'
      ) : (
        <Link
          href={`mailto:${value}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {value}
        </Link>
      );
    }
    case FieldType.Tel: {
      return value === null ? (
        '-'
      ) : (
        <Link href={`tel:${value} `} rel="noopener noreferrer" target="_blank">
          {value}
        </Link>
      );
    }
    case FieldType.Img: {
      return value !== null && <img src={value} alt={field.name} />;
    }
    case FieldType.Date: {
      return value === null || value === undefined
        ? __('application.notEstablished')
        : fullDate(value);
    }
    case FieldType.Boolean: {
      return value === null
        ? __('application.default')
        : value
          ? __('application.yes')
          : __('application.no');
    }
    case FieldType.Price: {
      return !value && value !== 0 ? '-' : formatPrice(value);
    }
    case FieldType.Percent: {
      return !value && value !== 0 ? '-' : `${value} % `;
    }
    case FieldType.Text:
    default: {
      return value === null ? '' : value;
    }
  }
};

function genSortItems(
  header: TableSchemaField,
  sort: { sortBy: string; sortDirBack: boolean } | null,
  onSortChange: (sortBy: string, sortDirBack: boolean) => void,
) {
  if (header.sortable !== true) return null;

  const handleSortChange = (dirBack: boolean) => {
    onSortChange(header.field, dirBack);
  };

  const arrow1 = sort ? (
    <a
      onClick={() => handleSortChange(false)}
      className={`sort sort - up ${sort.sortBy === header.field && sort.sortDirBack !== true ? 'active' : ''} `}
    >
      <span className="fa fa-chevron-up" />
    </a>
  ) : null;
  const arrow2 = sort ? (
    <a
      onClick={() => handleSortChange(true)}
      className={`sort sort - down ${sort.sortBy === header.field && sort.sortDirBack === true ? 'active' : ''} `}
    >
      <span className="fa fa-chevron-down" />
    </a>
  ) : null;

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
    if (
      !this.props.data ||
      !this.props.data.items ||
      this.props.data.items.length === 0
    ) {
      return <Alert type="notice" text="application.lackOfDataToShow" />;
    }

    if (desktop) {
      const headers = this.props.scheme.fields.map(
        (header: TableSchemaField) => (
          <th
            className={`${header.mobile ? 'mobile' : ''} `}
            key={header.field}
          >
            {header.name}{' '}
            {this.props.sort &&
              this.props.onSortChange &&
              genSortItems(header, this.props.sort, this.props.onSortChange)}
          </th>
        ),
      );
      const rows = this.props.data.items.map((row: any, rowIndex: number) => (
        <StyledRow
          key={rowIndex}
          $highlight={this.props.scheme.highlightRow?.(row) === true}
        >
          {this.props.scheme.fields.map(
            (header: TableSchemaField, index: number) => (
              <td
                className={`${header.mobile ? 'mobile' : ''} `}
                key={`${header.field}_${rowIndex} `}
              >
                {header.buttons ? (
                  <ButtonsContainer noWrap>
                    {(
                      header.buttons.filter(
                        (button) => !!button,
                      ) as TableButton[]
                    ).map((button: TableButton, index: number) => (
                      <Button
                        key={index}
                        primary={button.type === 'primary'}
                        danger={button.type === 'danger'}
                        success={button.type === 'success'}
                        secondary={button.type === 'secondary'}
                        to={
                          button.to
                            ? typeof button.to === 'string'
                              ? `${button.to}${row.id} `
                              : button.to(row)
                            : ''
                        }
                        click={button.click ? () => button.click(row) : null}
                        text={button.name}
                      />
                    ))}
                  </ButtonsContainer>
                ) : (
                  formatValue(row[header.field], header, row)
                )}
              </td>
            ),
          )}
        </StyledRow>
      ));

      content = (
        <TableContainer>
          <table className="table">
            <thead>
              <tr>{headers}</tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </TableContainer>
      );
    } else {
      content = (
        <div className="list">
          <p>{__('application.clickToShowHideDetails')}</p>
          {this.props.data.items.map((row: any, rowIndex: number) => (
            <div
              className={`list-element ${this.state.toggled === rowIndex ? 'toggled' : ''} `}
              onClick={() => this.toggleRow(rowIndex)}
              key={rowIndex}
            >
              {this.props.scheme.fields.map(
                (header: TableSchemaField, index: number) => (
                  <div
                    className={`list-row ${header.type === FieldType.Custom || header.buttons ? 'column' : ''} ${header.mobile ? 'mobile' : ''} `}
                  >
                    {header.buttons ? (
                      <ButtonsContainer noWrap>
                        {(
                          header.buttons.filter(
                            (button) => !!button,
                          ) as TableButton[]
                        ).map((button: TableButton, index: number) => (
                          <Button
                            key={index}
                            primary={button.type === 'primary'}
                            danger={button.type === 'danger'}
                            success={button.type === 'success'}
                            secondary={button.type === 'secondary'}
                            to={
                              button.to
                                ? typeof button.to === 'string'
                                  ? `${button.to}${row.id} `
                                  : button.to(row)
                                : ''
                            }
                            click={
                              button.click ? () => button.click(row) : null
                            }
                            text={button.name}
                          />
                        ))}
                      </ButtonsContainer>
                    ) : (
                      <>
                        <strong>{header.name}</strong>
                        <span className="list-value">
                          {formatValue(row[header.field], header, row)}
                        </span>
                      </>
                    )}
                  </div>
                ),
              )}
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
          pageCount={Math.ceil(
            this.props.data.countTotal / this.props.scheme.countPerPage,
          )}
          onPageChange={(page) =>
            this.props.onPageChange && this.props.onPageChange(page)
          }
        />
      </>
    );
  }
}

export default Table;
