/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TableFieldSearchableValues, TableSchema, TableSchemaField } from 'smartbox-tables';
import Spinner from '../Spinner';
import Table from '../Table';
import debounce from '../../../utils/debounce';
import { apiTable } from '../../../actions';

import { formatPrice } from '../../../utils/format-price';
import { ApplicationState } from '../../../reducers';

import './ApiTable.scss';

interface SelectOption {
  value: string;
  content: string;
}

interface Props {
  fetchApiTableData: (url: string, method?: string) => void;
  loading: boolean;
  data: any;
  scheme: TableSchema;
  apiEndpointSubUrl: string;
  apiEndpointMethod?: string; // Defaults to GET
  selectSearchByField?: string;
  selectSearchByOption?: SelectOption[];
}

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
    onSearchChange(searchBy, search.searchQuery);
  };

  let searchElement;

  const fields = allFields.find((field) => field.field === search.searchBy) as TableSchemaField;
  const searchableValues = fields ? fields.searchableValues : null;

  if (search.searchBy === '') {
    searchElement = null;
  } else if (searchableValues && typeof searchableValues === 'object') {
    searchElement = (
      <select className="input" placeholder="Wybierz szukaną wartość">
        {Object.keys(searchableValues as TableFieldSearchableValues).map((key) => (
          <option value={key} key={key}>
            {searchableValues[key]}
          </option>
        ))}
      </select>
    );
  } else if (selectSearchByField && search.searchBy === 'currentActionName') {
    searchElement = (
      <select className="input" onChange={(e) => handleSearchQueryChange(e.target.value)}>
        {selectSearchByOption &&
          selectSearchByOption.map((data: SelectOption, index: number) => (
            <option key={`${selectSearchByField}_${index}`} value={data.value}>
              {data.content}
            </option>
          ))}
      </select>
    );
  } else {
    searchElement = (
      <input
        className="input"
        type="text"
        placeholder="Wpisz szukaną wartość"
        value={search.searchQuery}
        onChange={(e) => handleSearchQueryChange(e.target.value)}
      />
    );
  }

  return (
    <div className="search-box">
      <h3>Wyszukiwanie</h3>
      <div className="search-fields">
        <div className="search-field">
          <select className="input" value={search.searchBy} onChange={(e) => handleSearchByChange(e.target.value)}>
            <option value="">Wybierz pole, które chcesz przeszukać</option>
            {allFields
              .filter((field) => field.searchable === true)
              .map((field) => (
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

class ApiTable<T> extends Component<Props> {
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
  }

  private buildUrl(): string {
    const { apiEndpointSubUrl } = this.props;
    const { searchBy, searchQuery, page, sortBy, sortDirBack } = this.state;
    return `${apiEndpointSubUrl}?${new URLSearchParams({ searchBy, searchQuery, page, sortBy, sortDirBack } as any)}`;
  }

  private async fetch() {
    await this.props.fetchApiTableData(this.buildUrl(), this.props.apiEndpointMethod);
  }

  private getCurrentSort(): {
    sortBy: string;
    sortDirBack: boolean;
  } {
    const { searchBy, searchQuery, page, sortBy, sortDirBack } = this.state;
    const { scheme } = this.props;

    if (sortBy !== '') {
      return {
        sortBy,
        sortDirBack,
      };
    } else {
      const field = scheme.fields.find((f) => f.defaultSort === true) as TableSchemaField;
      return {
        sortBy: field.field,
        sortDirBack: field.oppositeSortDir !== true,
      };
    }
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.data.uuid) {
      if (this.props.data.uuid !== prevProps.data.uuid) {
        this.fetch();
      }
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
    if (currSort.sortBy === sortBy && currSort.sortDirBack === sortDirBack) return;

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

    let table;

    if (loading) {
      table = <Spinner transparent />;
    } else {
      table = (
        <Table
          data={data}
          scheme={scheme}
          initialPage={page}
          sort={this.getCurrentSort()}
          onPageChange={this.handlePageChange}
          onSortChange={this.handleSortChange}
        />
      );
    }

    return (
      <>
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
      </>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  data: state.apiTable,
  loading: state.spinner.loading,
});

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({ ...apiTable }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiTable);
