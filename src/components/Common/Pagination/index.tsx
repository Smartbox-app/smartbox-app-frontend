import React from 'react';
import ReactPaginate from 'react-paginate';

import './Pagination.scss';
import { __ } from "../../../helpers/i18n";
import styled from 'styled-components';
import { lighten } from 'polished';
import { getColorForBackground } from '../../../utils/color';

interface Props {
  pageCount: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

const StyledReactPaginateContainer = styled('div')(({ theme }) => `
  .next, .previous {
    background-color: ${theme.colors.primary};
    color: ${getColorForBackground(theme.colors.primary)};

    &:hover {   
      background-color: ${lighten(0.25, theme.colors.primary)};
          color: ${getColorForBackground(theme.colors.primary)};
    }
  }
    .selected {
     border: 1px solid ${theme.colors.primary};
    }
     a {
     &:hover {
      color: ${theme.colors.secondary};
     }

`)

const Pagination = ({ pageCount, initialPage, onPageChange }: Props) => {
  const desktop = window.matchMedia('(min-width: 600px)').matches;
  if (pageCount < 2) return null;
  return desktop ? (
    <StyledReactPaginateContainer>
      <ReactPaginate
        containerClassName="pagination"
        onPageChange={({ selected }) => onPageChange && onPageChange(selected + 1)}
        previousLabel={__('application.previous')}
        nextLabel={__('application.next2')}
        initialPage={(initialPage || 1) - 1}
        pageCount={pageCount}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
      /></StyledReactPaginateContainer>
  ) : (
    <StyledReactPaginateContainer>
      <ReactPaginate
        containerClassName="pagination pagination-mobile"
        onPageChange={({ selected }) => onPageChange && onPageChange(selected + 1)}
        previousLabel="<"
        nextLabel=">"
        initialPage={(initialPage || 1) - 1}
        pageCount={pageCount}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
      />
    </StyledReactPaginateContainer>
  );
};

export default Pagination;
