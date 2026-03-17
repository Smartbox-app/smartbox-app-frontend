import styled from 'styled-components';

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
`;

export const Button = styled.button<{ active?: boolean }>`
  padding: 4px 8px;
  border: 1px solid #ccc;
  background: ${({ active }) => (active ? '#ddd' : '#fff')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: #f3f3f3;
  }
`;

export const EditorWrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px;
  min-height: 300px;

  .ProseMirror {
    outline: none;
    min-height: 260px;
  }

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td,
  th {
    border: 1px solid #ccc;
    padding: 6px;
  }

  a {
    color: blue;
    text-decoration: underline;
  }
`;

export const TableToolbarWrapper = styled.div`
  border: 1px solid #ccc;
  padding: 6px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: #fafafa;
`;
