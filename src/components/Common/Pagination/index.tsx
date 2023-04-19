import React from 'react';
import ReactPaginate from 'react-paginate';

import './Pagination.scss';
import {__} from "../../../helpers/i18n";

interface Props {
  pageCount: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

const Pagination = ({ pageCount, initialPage, onPageChange }: Props) => {
  const desktop = window.matchMedia('(min-width: 600px)').matches;
  if (pageCount < 2) return null;
  return desktop ? (
    <ReactPaginate
      containerClassName="pagination"
      onPageChange={({ selected }) => onPageChange && onPageChange(selected + 1)}
      previousLabel={__('application.previous')}
      nextLabel={__('application.next2')}
      initialPage={(initialPage || 1) - 1}
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
    />
  ) : (
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
  );
};

export default Pagination;
