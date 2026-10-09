import { DEFAULT_API_TABLE_INSTANCE_ID } from '../constants/api-table-instances';
import apiTableReducer from './api-table-reducer';

const unknown = { type: 'NOPE' } as never;

describe('api table reducer', () => {
  it('writes one instance and leaves the other in place', () => {
    const loaded = apiTableReducer(undefined, {
      type: 'FETCH_API_TABLE_DATA_SUCCESS',
      payload: {
        instanceId: 'modal',
        countTotal: 2,
        items: [{ id: '1' }],
      },
    });

    expect(loaded.instances.modal.items).toEqual([{ id: '1' }]);
    expect(loaded.instances.modal.countTotal).toBe(2);
    expect(loaded.instances[DEFAULT_API_TABLE_INSTANCE_ID].items).toEqual([]);
  });

  it('refreshes every instance, or only the one that was asked', () => {
    const start = apiTableReducer(undefined, unknown);
    const defaultUuid = start.instances[DEFAULT_API_TABLE_INSTANCE_ID].uuid;
    const withModal = apiTableReducer(start, {
      type: 'FETCH_API_TABLE_DATA_SUCCESS',
      payload: { instanceId: 'modal', countTotal: 0, items: [] },
    });
    const modalUuid = withModal.instances.modal.uuid;

    const all = apiTableReducer(withModal, { type: 'REFRESH_API_TABLE' });
    expect(all.instances[DEFAULT_API_TABLE_INSTANCE_ID].uuid).not.toBe(defaultUuid);
    expect(all.instances.modal.uuid).not.toBe(modalUuid);

    const one = apiTableReducer(withModal, {
      type: 'REFRESH_API_TABLE',
      payload: { instanceId: 'modal' },
    });
    expect(one.instances.modal.uuid).not.toBe(modalUuid);
    expect(one.instances[DEFAULT_API_TABLE_INSTANCE_ID].uuid).toBe(defaultUuid);
  });

  it('clears one instance back to an empty table', () => {
    const loaded = apiTableReducer(undefined, {
      type: 'FETCH_API_TABLE_DATA_SUCCESS',
      payload: { countTotal: 4, items: [{ id: '1' }] },
    });
    const cleared = apiTableReducer(loaded, { type: 'CLEAR_API_TABLE' });

    expect(cleared.instances[DEFAULT_API_TABLE_INSTANCE_ID].items).toEqual([]);
    expect(cleared.instances[DEFAULT_API_TABLE_INSTANCE_ID].countTotal).toBe(0);
    expect(cleared.instances[DEFAULT_API_TABLE_INSTANCE_ID].loading).toBe(false);
  });

  it('marks an instance as loading', () => {
    const loading = apiTableReducer(undefined, { type: 'LOADING_API_TABLE' });
    expect(loading.instances[DEFAULT_API_TABLE_INSTANCE_ID].loading).toBe(true);
  });
});
