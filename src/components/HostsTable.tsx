import React from 'react';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';
import { HostTableRows } from '../types/hosts';
import { EmptyState, ErrorState, LoadingState } from './ui/uiState';
import { getColSpanRow } from './ui/table/utils';
import { ResourceListUIState } from '../types';
import { useSelector } from 'react-redux';
import { getHostsError } from '../selectors/hosts';

interface Props {
  hostRows: HostTableRows;
  uiState: ResourceListUIState;
  fetchHosts: () => void;
}

const HostsTable: React.FC<Props> = ({ hostRows, uiState, fetchHosts }) => {
  const error = useSelector(getHostsError);
  const headerStyle = {
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 1,
  };
  const headerConfig = { header: { props: { style: headerStyle } } };
  // TODO(jtomasek): Those should not be needed to define as they are optional,
  // needs fixing in @patternfly/react-table
  const columnConfig = {
    transforms: [],
    cellTransforms: [],
    formatters: [],
    cellFormatters: [],
    props: {},
  };
  const columns = [
    { title: 'Name', ...headerConfig, ...columnConfig },
    { title: 'IP Address', ...headerConfig, ...columnConfig },
    { title: 'Status', ...headerConfig, ...columnConfig },
    { title: 'CPU', ...headerConfig, ...columnConfig },
    { title: 'Memory', ...headerConfig, ...columnConfig },
    { title: 'Disk', ...headerConfig, ...columnConfig },
    { title: 'Type', ...headerConfig, ...columnConfig },
  ];

  const emptyState = (
    <EmptyState
      title="No hosts connected yet."
      content="Connect at least 3 hosts to your cluster to pool together resources and start running workloads."
    />
  );
  const errorState = <ErrorState title={error} fetchData={fetchHosts} />;
  const loadingState = <LoadingState />;

  const getRows = () => {
    const columnCount = columns.length;
    switch (uiState) {
      case ResourceListUIState.LOADING:
        return getColSpanRow(loadingState, columnCount);
      case ResourceListUIState.ERROR:
        return getColSpanRow(errorState, columnCount);
      case ResourceListUIState.EMPTY:
        return getColSpanRow(emptyState, columnCount);
      default:
        return hostRows;
    }
  };

  return (
    <Table
      rows={getRows()}
      cells={columns}
      variant={columns.length > 5 ? TableVariant.compact : undefined}
      aria-label="Hosts table"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default HostsTable;
