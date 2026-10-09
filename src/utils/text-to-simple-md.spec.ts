import { isValidElement, ReactElement } from 'react';
import { textToSimpleMD } from './text-to-simple-md';

type BoldNode = ReactElement<{ children: string }>;

describe('textToSimpleMD', () => {
  it('splits bold markers into text and strong nodes', () => {
    const nodes = textToSimpleMD('Hello **bold** and **more**') as Array<
      string | BoldNode
    >;

    expect(nodes[0]).toBe('Hello ');
    expect(isValidElement(nodes[1])).toBe(true);
    expect((nodes[1] as BoldNode).props.children).toBe('bold');
    expect(nodes[2]).toBe(' and ');
    expect((nodes[3] as BoldNode).props.children).toBe('more');
  });

  it('returns the whole string when there are no markers', () => {
    expect(textToSimpleMD('plain')).toEqual(['plain']);
  });

  it('returns an empty list for an empty string', () => {
    expect(textToSimpleMD('')).toEqual([]);
  });

  it('leaves an unclosed marker as text', () => {
    expect(textToSimpleMD('Hello **bold')).toEqual(['Hello **bold']);
  });
});
