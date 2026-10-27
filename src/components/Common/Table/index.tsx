import { setLightness } from 'polished';
import React from 'react';
import styled from 'styled-components';

import {
  FieldType,
  TableButton,
  TableResponse,
  TableSchema,
  TableSchemaField,
} from 'smartbox-tables';
import { Button } from 'src/components/Branded';
import { Alert, Pagination } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Link } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { getColorForBackground } from 'src/utils/color';
import { fullDate } from 'src/utils/format-date';
import { formatPrice } from 'src/utils/format-price';

import './Table.scss';

interface Props {
  scheme: TableSchema;
  data: TableResponse<object>;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  sort?: {
    sortBy: string;
    sortDirBack: boolean;
  } | null;
  onSortChange?: (sortBy: string, sortDirBack: boolean) => void;
}

const TableContainer = styled('div')({
  overflow: 'auto',
  width: '100%',
});

const StyledRow = styled('tr')<{ $highlight?: boolean }>(({
  theme,
  $highlight,
}) => {
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

const formatValue = (
  value: unknown,
  field: TableSchemaField,
  allValues: unknown,
) => {
  if (typeof field.customValue === 'function') {
    value = field.customValue(allValues, field);
  } else if (
    field.searchableValues &&
    (typeof value === 'string' || typeof value === 'number') &&
    field.searchableValues[String(value)]
  ) {
    value = field.searchableValues[String(value)];
  }

  switch (field.type) {
    case FieldType.Custom: {
      return field.customRender?.(value, field, allValues) ?? null;
    }

    case FieldType.Url: {
      return value === null ? (
        '-'
      ) : (
        <Link href={String(value)} rel="noopener noreferrer" target="_blank">
          {String(value)}
        </Link>
      );
    }

    case FieldType.Email: {
      return value === null ? (
        '-'
      ) : (
        <Link
          href={`mailto:${String(value)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {String(value)}
        </Link>
      );
    }
    case FieldType.Tel: {
      return value === null ? (
        '-'
      ) : (
        <Link
          href={`tel:${String(value)} `}
          rel="noopener noreferrer"
          target="_blank"
        >
          {String(value)}
        </Link>
      );
    }
    case FieldType.Img: {
      return value !== null && <img src={String(value)} alt={__(field.name)} />;
    }
    case FieldType.Date: {
      if (value === null || value === undefined) {
        return __('application.notEstablished');
      }
      if (
        value instanceof Date ||
        typeof value === 'string' ||
        typeof value === 'number'
      ) {
        return fullDate(value);
      }
      return __('application.notEstablished');
    }
    case FieldType.Boolean: {
      if (value === null) return __('application.default');
      return value ? __('application.yes') : __('application.no');
    }
    case FieldType.Price: {
      return !value && value !== 0 ? '-' : formatPrice(Number(value));
    }
    case FieldType.Percent: {
      return !value && value !== 0 ? '-' : `${value} % `;
    }
    case FieldType.Text:
    default: {
      if (value == null) return '';
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        return value.startsWith('application.') ? __(value) : value;
      }
      return String(value);
    }
  }
};

function buttonDestination(button: TableButton, row: object) {
  if (!button.to) return '';
  const id = 'id' in row && row.id != null ? String(row.id) : '';
  if (typeof button.to === 'string') return `${button.to}${id} `;
  return button.to(row);
}

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
    <button
      type="button"
      onClick={() => handleSortChange(false)}
      className={`sort sort - up ${sort.sortBy === header.field && sort.sortDirBack !== true ? 'active' : ''} `}
    >
      <span className="fa fa-chevron-up" />
    </button>
  ) : null;
  const arrow2 = sort ? (
    <button
      type="button"
      onClick={() => handleSortChange(true)}
      className={`sort sort - down ${sort.sortBy === header.field && sort.sortDirBack === true ? 'active' : ''} `}
    >
      <span className="fa fa-chevron-down" />
    </button>
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
    let content: React.ReactNode = null;
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
            {__(header.name)}{' '}
            {this.props.sort &&
              this.props.onSortChange &&
              genSortItems(header, this.props.sort, this.props.onSortChange)}
          </th>
        ),
      );
      const rows = this.props.data.items.map((row, rowIndex: number) => (
        <StyledRow
          key={rowIndex}
          $highlight={
            this.props.scheme.highlightRow?.(row as Record<string, unknown>) ===
            true
          }
        >
          {this.props.scheme.fields.map((header: TableSchemaField) => (
            <td
              className={`${header.mobile ? 'mobile' : ''} `}
              key={`${header.field}_${rowIndex} `}
            >
              {header.buttons ? (
                <ButtonsContainer noWrap>
                  {(
                    header.buttons.filter((button) => !!button) as TableButton[]
                  ).map((button: TableButton, index: number) => (
                    <Button
                      key={index}
                      primary={button.type === 'primary'}
                      danger={button.type === 'danger'}
                      success={button.type === 'success'}
                      secondary={button.type === 'secondary'}
                      to={buttonDestination(button, row)}
                      click={
                        button.click ? () => button.click?.(row) : undefined
                      }
                      text={button.name}
                    />
                  ))}
                </ButtonsContainer>
              ) : (
                formatValue(
                  (row as Record<string, unknown>)[header.field],
                  header,
                  row,
                )
              )}
            </td>
          ))}
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
          {this.props.data.items.map((row, rowIndex: number) => (
            <div
              className={`list-element ${this.state.toggled === rowIndex ? 'toggled' : ''} `}
              onClick={() => this.toggleRow(rowIndex)}
              key={rowIndex}
            >
              {this.props.scheme.fields.map(
                (header: TableSchemaField, index: number) => (
                  <div
                    key={header.field || index}
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
                            to={buttonDestination(button, row)}
                            click={
                              button.click
                                ? () => button.click?.(row)
                                : undefined
                            }
                            text={button.name}
                          />
                        ))}
                      </ButtonsContainer>
                    ) : (
                      <>
                        <strong>{__(header.name)}</strong>
                        <span className="list-value">
                          {formatValue(
                            (row as Record<string, unknown>)[header.field],
                            header,
                            row,
                          )}
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
