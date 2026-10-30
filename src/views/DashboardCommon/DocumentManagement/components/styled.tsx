import styled from 'styled-components';

export const EditorRoot = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
`;

export const EditorToolbarSticky = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 8px 0;
  background: #fff;
  border-bottom: 1px solid #e4e7eb;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const TemplateSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  max-width: 220px;
`;

export const TemplateInput = styled.input`
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  min-width: 200px;
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
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  min-height: 300px;
  max-height: 70vh;

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

  .template-variable {
    display: inline-flex;
    align-items: center;
    padding: 1px 6px;
    margin: 0 2px;
    border-radius: 4px;
    background: #e8f0fe;
    border: 1px solid #aecbfa;
    color: #1a4f9c;
    font-family: monospace;
    font-size: 12px;
    line-height: 1.4;
    vertical-align: baseline;
  }

  .template-variable--selected {
    outline: 2px solid #4c8bf5;
  }

  .template-expression {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 1px 4px;
    margin: 0 2px;
    border-radius: 4px;
    background: #e6f4ea;
    border: 1px solid #a8dab5;
    color: #137333;
    font-family: monospace;
    font-size: 12px;
    line-height: 1.4;
    vertical-align: baseline;
    max-width: 100%;
  }

  .template-expression--selected {
    outline: 2px solid #34a853;
  }

  .template-expression__prefix {
    font-weight: 700;
    padding-left: 2px;
  }

  .template-expression__input {
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    min-width: 80px;
    width: auto;
    padding: 0 4px 0 0;
    outline: none;
  }

  .template-conditional {
    margin: 12px 0;
    border: 1px dashed #7b8794;
    border-radius: 6px;
    padding: 8px;
    background: #fafbfc;
  }

  .template-conditional--selected {
    outline: 2px solid #4c8bf5;
  }

  .template-conditional__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .template-conditional__label {
    font-size: 12px;
    font-weight: 600;
    color: #52606d;
    white-space: nowrap;
  }

  .template-conditional__input {
    flex: 1;
    min-width: 0;
    padding: 4px 8px;
    border: 1px solid #cbd2d9;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
    background: #fff;
  }

  .template-conditional__content {
    min-height: 24px;
  }

  .template-conditional-branch {
    margin: 8px 0;
    padding: 8px;
    border-radius: 4px;
    background: #fff;
    border: 1px solid #e4e7eb;
  }

  .template-conditional-branch__label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #7b8794;
    margin-bottom: 6px;
  }

  .template-conditional-branch__content {
    min-height: 24px;
  }
`;

export const TableToolbarWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 4px;
  background: #fafafa;
`;
