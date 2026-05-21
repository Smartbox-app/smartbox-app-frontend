/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import {
  FieldType,
  TableFieldSearchableValues,
  TableSchema,
  TableSchemaField,
} from 'smartbox-tables';
import { Spinner } from '../../Branded';
import Table from '../Table';
import debounce from '../../../utils/debounce';
import {
  clearApiTableData,
  fetchApiTableData,
} from '../../../actions/api-table';
import { ApplicationState } from '../../../reducers';
import { DEFAULT_API_TABLE_INSTANCE_ID } from '../../../constants/api-table-instances';

import './ApiTable.scss';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';

const StyledContainer = styled('div')({
  position: 'relative',
});

interface SelectOption {
  value: string;
  content: string;
}

export interface ApiTableOwnProps {
  scheme: TableSchema;
  apiEndpointSubUrl: string;
  apiEndpointMethod?: string;
  /** Isolated Redux slice so multiple tables do not overwrite each other. */
  instanceId?: string;
  selectSearchByField?: string;
  selectSearchByOption?: SelectOption[];
}

interface DispatchProps {
  fetchApiTableData: (url: string, method?: string) => void;
  clearApiTableData: () => void;
}

type Props = ApiTableOwnProps &
  DispatchProps & { loading: boolean; data: any };

const searchComponent = (
  allFields: TableSchemaField[],
  search: { searchBy: string; searchQuery: string },
  onSearchChange: (searchBy: string, searchQuery: string) => void,
  selectSearchByField?: string,
  selectSearchByOption?: SelectOption[],
) => {
  const handleSearchQueryChange = (searchQuery: string) => {
    onSearchChange(search.searchBy, searchQuery);
  };

  const handleSearchByChange = (searchBy: string) => {
    handleSearchQueryChange('');
    onSearchChange(searchBy, '');
  };

  let searchElement;

  const fields = allFields.find(
    (field) => field.field === search.searchBy,
  ) as TableSchemaField;

  const searchableFields = allFields.filter((f) => f.searchable);

  if (searchableFields.length === 0) return null;

  const searchableValues = fields ? fields.searchableValues : null;

  if (search.searchBy === '') {
    searchElement = null;
  } else if (searchableValues && typeof searchableValues === 'object') {
    searchElement = (
      <select
        className="input"
        onChange={(e) => handleSearchQueryChange(e.target.value)}
      >
        <option value={''}>{__('application.select')}</option>
        {Object.keys(searchableValues as TableFieldSearchableValues).map(
          (key) => (
            <option value={key} key={key}>
              {searchableValues[key]}
            </option>
          ),
        )}
      </select>
    );
  } else if (selectSearchByField && search.searchBy === 'currentActionName') {
    searchElement = (
      <select
        className="input"
        onChange={(e) => handleSearchQueryChange(e.target.value)}
      >
        {selectSearchByOption &&
          selectSearchByOption.map((data: SelectOption, index: number) => (
            <option key={`${selectSearchByField}_${index}`} value={data.value}>
              {data.content}
            </option>
          ))}
      </select>
    );
  } else if (fields.type && [FieldType.Date].includes(fields.type)) {
    searchElement = (
      <div className="date-fields-group">
        <div className="filter-field">
          <Flatpickr
            placeholder="Wybierz datę"
            options={{
              defaultDate: search.searchQuery
                ? new Date(search.searchQuery)
                : undefined,
              enableTime: false,

              locale: 'pl',
            }}
            onChange={(date: Date[]) => {
              if (date && date.length === 1)
                handleSearchQueryChange(date[0].getTime().toString());
              else handleSearchQueryChange('');
            }}
          />
        </div>
      </div>
    );
  } else {
    searchElement = (
      <input
        className="input"
        type="text"
        placeholder={__('application.typeSearchedValue')}
        value={search.searchQuery}
        onChange={(e) => handleSearchQueryChange(e.target.value)}
      />
    );
  }

  return (
    <div className="search-box">
      <h3>{__('application.search')}</h3>
      <div className="search-fields">
        <div className="search-field">
          <select
            className="input"
            value={search.searchBy}
            onChange={(e) => handleSearchByChange(e.target.value)}
          >
            <option value="">{__('application.chooseFieldToSearch')}</option>
            {searchableFields.map((field) => (
              <option value={field.field} key={field.field}>
                {field.name}
              </option>
            ))}
          </select>
        </div>
        <div className="search-query">{searchElement}</div>
      </div>
    </div>
  );
};

const emptyTableData = { countTotal: 0, items: [] };

class ApiTable extends Component<Props> {
  private debouncedFetch: () => void;

  state = {
    searchQuery: '',
    searchBy: '',
    page: 1,
    sortBy: '',
    sortDirBack: false,
    loading: false,
    data: {
      countTotal: 0,
      items: [],
    },
  };

  constructor(props: Props) {
    super(props);
    this.debouncedFetch = debounce(this.fetch, 600);

    const defaultSearchField = this.props.scheme.fields.find(
      (field) => ['string', 'number'].indexOf(typeof field.defaultSearch) > -1,
    );
    if (defaultSearchField) {
      this.state.searchBy = defaultSearchField.field;
      this.state.searchQuery = String(defaultSearchField.defaultSearch);
    }
    const defaultSortFieldield = this.props.scheme.fields.find(
      (f) => f.defaultSort === true,
    ) as TableSchemaField;
    if (defaultSortFieldield) {
      this.state.sortBy = defaultSortFieldield.field;
      this.state.sortDirBack = defaultSortFieldield.oppositeSortDir === true;
    }
  }

  private buildUrl(): string {
    const { apiEndpointSubUrl } = this.props;
    const { searchBy, searchQuery, page, sortBy, sortDirBack } = this.state;
    return `${apiEndpointSubUrl}?${new URLSearchParams({ searchBy, searchQuery, page, sortBy, sortDirBack } as any)}`;
  }

  private async fetch() {
    this.props.fetchApiTableData(
      this.buildUrl(),
      this.props.apiEndpointMethod,
    );
  }

  private getCurrentSort(): {
    sortBy: string;
    sortDirBack: boolean;
  } | null {
    const { sortBy, sortDirBack } = this.state;
    const { scheme } = this.props;

    if (sortBy !== '') {
      return {
        sortBy,
        sortDirBack,
      };
    } else {
      const field = scheme.fields.find(
        (f) => f.defaultSort === true,
      ) as TableSchemaField;
      if (!field) return null;
      return {
        sortBy: field.field,
        sortDirBack: field.oppositeSortDir === true,
      };
    }
  }

  componentDidMount() {
    this.props.clearApiTableData();
    this.fetch();
  }

  componentDidUpdate(prevProps: Props) {
    const {data, apiEndpointSubUrl, instanceId} = this.props;

    if (
      apiEndpointSubUrl !== prevProps.apiEndpointSubUrl ||
      instanceId !== prevProps.instanceId
    ) {
      this.props.clearApiTableData();
    }


    if (
      data.uuid &&
      prevProps.data.uuid &&
      data.uuid !== prevProps.data.uuid
    ) {
      this.fetch();
    }
  }

  handlePageChange = (page: number) => {
    if (page === this.state.page) return;

    this.setState(
      {
        page,
      },
      this.fetch,
    );
  };

  handleSortChange = (sortBy: string, sortDirBack: boolean) => {
    const currSort = this.getCurrentSort();
    if (!currSort) return;

    if (currSort.sortBy === sortBy && currSort.sortDirBack === sortDirBack)
      return;

    this.setState(
      {
        sortBy,
        sortDirBack,
      },
      this.fetch,
    );
  };

  handleSearchChange = (searchBy: string, searchQuery: string) => {
    const { searchBy: searchByNow, searchQuery: searchQueryNow } = this.state;
    if (searchBy === searchByNow && searchQuery === searchQueryNow) return;

    this.setState(
      {
        searchBy,
        searchQuery,
      },
      this.debouncedFetch,
    );
  };

  render() {
    const { page, searchQuery, searchBy } = this.state;
    const { loading, data, scheme } = this.props;

    const table = (
      <>
        {loading ? <Spinner halfTransparent overlay /> : null}
        <Table
          data={data}
          scheme={scheme}
          initialPage={page}
          sort={this.getCurrentSort()}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
        />
      </>
    );

    return (
      <StyledContainer>
        {data &&
          (data.countTotal > 0 || searchQuery) &&
          searchComponent(
            scheme.fields,
            {
              searchBy,
              searchQuery,
            },
            this.handleSearchChange,
            this.props.selectSearchByField,
            this.props.selectSearchByOption,
          )}
        {table}
      </StyledContainer>
    );
  }
}

const mapStateToProps = (
  state: ApplicationState,
  ownProps: ApiTableOwnProps,
) => {
  const instanceId =
    ownProps.instanceId ?? DEFAULT_API_TABLE_INSTANCE_ID;
  return {
    data: state.apiTable.instances[instanceId] ?? emptyTableData,
    loading: state.spinner.loading,
  };
};

function mapDispatchToProps(
  dispatch: any,
  ownProps: ApiTableOwnProps,
) {
  const instanceId =
    ownProps.instanceId ?? DEFAULT_API_TABLE_INSTANCE_ID;
  return {
    fetchApiTableData: (url: string, method?: string) =>
      dispatch(fetchApiTableData(url, method, instanceId)),
    clearApiTableData: () => dispatch(clearApiTableData(instanceId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiTable);
