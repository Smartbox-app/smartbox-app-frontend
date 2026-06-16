 
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FieldType,
  TableFieldSearchableValues,
  TableSchema,
  TableSchemaField,
} from 'smartbox-tables';
import Table from '../Table';
import DateInput from '../DateInput';
import { InputSelect } from '../InputSelect';
import { StyledNativeSelect } from '../input-styled';
import { Input, Skeleton } from '../../ui';
import debounce from '../../../utils/debounce';
import {
  clearApiTableData,
  fetchApiTableData,
  loadingApiTableData,
} from '../../../actions/api-table';
import { ApplicationState } from '../../../reducers';
import { DEFAULT_API_TABLE_INSTANCE_ID } from '../../../constants/api-table-instances';

import './ApiTable.scss';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { Spinner } from 'src/components/Branded';

const StyledContainer = styled('div')({
  position: 'relative',
});

const SkeletonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing}px;
`;

const TABLE_ROW_HEIGHT = 56;
const TABLE_HEADER_HEIGHT = 60;

const ApiTableSkeleton = () => (
  <SkeletonStack>
    <Skeleton height={45} width={'340px'} radius={8} />
    <Skeleton height={TABLE_HEADER_HEIGHT} radius={8} />
    {Array.from({ length: 5 }, (_, index) => (
      <Skeleton key={index} height={TABLE_ROW_HEIGHT} radius={8} />
    ))}
  </SkeletonStack>
);

interface SelectOption {
  value: string;
  content: string;
}

export interface ApiTableProps {
  scheme: TableSchema;
  apiEndpointSubUrl: string;
  apiEndpointMethod?: string;
  /** Isolated Redux slice so multiple tables do not overwrite each other. */
  instanceId?: string;
  selectSearchByField?: string;
  selectSearchByOption?: SelectOption[];
}

/** @deprecated Use ApiTableProps */
export type ApiTableOwnProps = ApiTableProps;

const emptyTableData = { countTotal: 0, items: [] };

function getInitialSearchState(scheme: TableSchema) {
  const defaultSearchField = scheme.fields.find(
    (field) => ['string', 'number'].indexOf(typeof field.defaultSearch) > -1,
  );
  const defaultSortField = scheme.fields.find((f) => f.defaultSort === true) as
    | TableSchemaField
    | undefined;

  return {
    searchQuery: defaultSearchField
      ? String(defaultSearchField.defaultSearch)
      : '',
    searchBy: defaultSearchField?.field ?? '',
    page: 1,
    sortBy: defaultSortField?.field ?? '',
    sortDirBack: defaultSortField?.oppositeSortDir === true,
  };
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
      <StyledNativeSelect
        $size="small"
        $error={false}
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
      </StyledNativeSelect>
    );
  } else if (selectSearchByField && search.searchBy === 'currentActionName') {
    searchElement = (
      <StyledNativeSelect
        $size="small"
        $error={false}
        onChange={(e) => handleSearchQueryChange(e.target.value)}
      >
        {selectSearchByOption &&
          selectSearchByOption.map((data: SelectOption, index: number) => (
            <option key={`${selectSearchByField}_${index}`} value={data.value}>
              {data.content}
            </option>
          ))}
      </StyledNativeSelect>
    );
  } else if (fields?.type && [FieldType.Date].includes(fields.type)) {
    const parsedDate = search.searchQuery
      ? new Date(Number(search.searchQuery))
      : undefined;
    const dateValue =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? [parsedDate]
        : undefined;

    searchElement = (
      <DateInput
        name="api-table-search-date"
        label=""
        size="small"
        inline={false}
        required={false}
        value={dateValue}
        onChange={(dates: Date[]) => {
          if (dates?.length === 1) {
            handleSearchQueryChange(dates[0].getTime().toString());
          } else {
            handleSearchQueryChange('');
          }
        }}
      />
    );
  } else {
    searchElement = (
      <Input
        label=""
        name="api-table-search-query"
        type="text"
        size="small"
        placeholder="application.typeSearchedValue"
        value={search.searchQuery}
        onChange={async (e) => {
          handleSearchQueryChange(e.target.value);
        }}
        onBlur={async () => {}}
      />
    );
  }

  const searchByOptions = searchableFields.map((field) => ({
    value: field.field,
    label: field.name,
  }));

  return (
    <div className="search-box">
      <div className="search-fields">
        <div className="search-field">
          <InputSelect
            key={search.searchBy}
            className="api-table-search-select"
            name="api-table-search-by"
            placeholder="application.search"
            options={searchByOptions}
            value={search.searchBy || null}
            onChange={(value: string | null) =>
              handleSearchByChange(value ?? '')
            }
            size="small"
          />
        </div>
        <div className="search-query">{searchElement}</div>
      </div>
    </div>
  );
};

export const ApiTable = ({
  scheme,
  apiEndpointSubUrl,
  apiEndpointMethod,
  instanceId,
  selectSearchByField,
  selectSearchByOption,
}: ApiTableProps) => {
  const dispatch = useDispatch();
  const resolvedInstanceId = instanceId ?? DEFAULT_API_TABLE_INSTANCE_ID;

  const data = useSelector(
    (state: ApplicationState) =>
      state.apiTable.instances[resolvedInstanceId] ?? emptyTableData,
  );

  const [searchQuery, setSearchQuery] = useState(
    () => getInitialSearchState(scheme).searchQuery,
  );
  const [searchBy, setSearchBy] = useState(
    () => getInitialSearchState(scheme).searchBy,
  );
  const [page, setPage] = useState(() => getInitialSearchState(scheme).page);
  const [sortBy, setSortBy] = useState(
    () => getInitialSearchState(scheme).sortBy,
  );
  const [sortDirBack, setSortDirBack] = useState(
    () => getInitialSearchState(scheme).sortDirBack,
  );

  const buildUrl = useCallback(() => {
    return `${apiEndpointSubUrl}?${new URLSearchParams({
      searchBy,
      searchQuery,
      page: String(page),
      sortBy,
      sortDirBack: String(sortDirBack),
    } as Record<string, string>)}`;
  }, [apiEndpointSubUrl, searchBy, searchQuery, page, sortBy, sortDirBack]);

  const fetch = useCallback(() => {
    dispatch(loadingApiTableData(resolvedInstanceId));
    dispatch(
      fetchApiTableData(buildUrl(), apiEndpointMethod, resolvedInstanceId),
    );
  }, [dispatch, buildUrl, apiEndpointMethod, resolvedInstanceId]);

  const debouncedSearchFetchRef = useRef(
    debounce(() => {
      fetchRef.current();
    }, 600),
  );

  const getCurrentSort = useCallback((): {
    sortBy: string;
    sortDirBack: boolean;
  } | null => {
    if (sortBy !== '') {
      return { sortBy, sortDirBack };
    }
    const field = scheme.fields.find((f) => f.defaultSort === true) as
      | TableSchemaField
      | undefined;
    if (!field) return null;
    return {
      sortBy: field.field,
      sortDirBack: field.oppositeSortDir === true,
    };
  }, [sortBy, sortDirBack, scheme.fields]);

  const skipPageSortFetchRef = useRef(true);
  const skipPageFetchFromSearchRef = useRef(false);
  const pendingSearchResetRef = useRef(false);
  const skipEndpointClearRef = useRef(true);
  const prevUuidRef = useRef<string | undefined>(undefined);
  const fetchRef = useRef(fetch);
  fetchRef.current = fetch;

  useEffect(() => {
    dispatch(clearApiTableData(resolvedInstanceId));
    dispatch(loadingApiTableData(resolvedInstanceId));
    fetchRef.current();
  }, [resolvedInstanceId, dispatch]);

  useEffect(() => {
    if (skipEndpointClearRef.current) {
      skipEndpointClearRef.current = false;
      return;
    }
    dispatch(clearApiTableData(resolvedInstanceId));
  }, [apiEndpointSubUrl, resolvedInstanceId, dispatch]);

  useEffect(() => {
    if (skipPageSortFetchRef.current) {
      skipPageSortFetchRef.current = false;
      return;
    }
    if (skipPageFetchFromSearchRef.current) {
      skipPageFetchFromSearchRef.current = false;
      return;
    }
    fetch();
  }, [page, sortBy, sortDirBack, fetch]);

  useEffect(() => {
    if (data.uuid && prevUuidRef.current && data.uuid !== prevUuidRef.current) {
      fetch();
    }
    prevUuidRef.current = data.uuid;
  }, [data.uuid, fetch]);

  useEffect(() => {
    if (!pendingSearchResetRef.current) return;
    pendingSearchResetRef.current = false;
    fetchRef.current();
  }, [searchBy, searchQuery, page]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (nextPage === page) return;
      setPage(nextPage);
    },
    [page],
  );

  const handleSortChange = useCallback(
    (nextSortBy: string, nextSortDirBack: boolean) => {
      const currSort = getCurrentSort();
      if (!currSort) return;
      if (
        currSort.sortBy === nextSortBy &&
        currSort.sortDirBack === nextSortDirBack
      ) {
        return;
      }
      setSortBy(nextSortBy);
      setSortDirBack(nextSortDirBack);
    },
    [getCurrentSort],
  );

  const handleSearchChange = useCallback(
    (nextSearchBy: string, nextSearchQuery: string) => {
      if (nextSearchBy === searchBy && nextSearchQuery === searchQuery) return;

      const searchFieldCleared = nextSearchBy === '' && searchBy !== '';
      const onlySearchFieldSwitched =
        nextSearchBy !== '' &&
        nextSearchBy !== searchBy &&
        nextSearchQuery === '';

      skipPageFetchFromSearchRef.current = true;
      setSearchBy(nextSearchBy);
      setSearchQuery(nextSearchQuery);
      if (page !== 1) {
        setPage(1);
      }

      if (searchFieldCleared) {
        pendingSearchResetRef.current = true;
        return;
      }

      if (onlySearchFieldSwitched) {
        return;
      }

      debouncedSearchFetchRef.current();
    },
    [searchBy, searchQuery, page],
  );

  const showSkeleton = data.loading === true && data.countTotal === 0;
  const showSpinner = data.loading === true && data.countTotal > 0;

  return (
    <StyledContainer>
      {showSpinner && <Spinner halfTransparent overlay />}
      {data &&
        (data.countTotal > 0 || searchQuery) &&
        searchComponent(
          scheme.fields,
          { searchBy, searchQuery },
          handleSearchChange,
          selectSearchByField,
          selectSearchByOption,
        )}
      {showSkeleton && !showSpinner ? (
        <ApiTableSkeleton />
      ) : (
        <>
          <Table
            data={data}
            scheme={scheme}
            initialPage={page}
            sort={getCurrentSort()}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
          />
        </>
      )}
    </StyledContainer>
  );
};

export default ApiTable;
