import React from 'react';
import { connect } from 'react-redux';
import {
  PageSectionVariants,
  ButtonVariant,
  TextContent,
  Text,
  Button,
} from '@patternfly/react-core';

import { fetchHostsAsync } from '../../actions/hosts';
import { getHostTableRows, getHostsError, getHostsUIState } from '../../selectors/hosts';
import { RootState } from '../../store/rootReducer';
import PageSection from '../ui/PageSection';
// import HostsTable from '../HostsTable';
import { HostTableRows } from '../../types/hosts';
import ClusterWizardToolbar from '../ClusterWizardToolbar';
import { ToolbarButton } from '../ui/Toolbar';
import { WizardStep } from '../../types/wizard';
import { LoadingState, ErrorState, EmptyState } from '../ui/uiState';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { ResourceListUIState } from '../../types';

interface ClustersProps {
  hostRows: HostTableRows;
  clustersUIState: ResourceListUIState;
  clustersError: string;
  fetchHosts: () => void;
  setCurrentStep: (step: WizardStep) => void;
}

const Clusters: React.FC<ClustersProps> = ({
  fetchHosts,
  hostRows,
  clustersUIState,
  clustersError,
  setCurrentStep,
}) => {
  React.useEffect(() => {
    fetchHosts();
  }, [fetchHosts]);

  const errorState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <ErrorState title={clustersError} fetchData={fetchHosts} />;
    </PageSection>
  );
  const loadingState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <LoadingState />
    </PageSection>
  );
  const emptyState = (
    <PageSection variant={PageSectionVariants.light} isMain>
      <EmptyState
        icon={AddCircleOIcon}
        title="Create new bare metal cluster"
        content="There are no clusters yet. This wizard is going to guide you through the OpenShift bare metal cluster deployment."
        primaryAction={
          <Button
            variant={ButtonVariant.primary}
            onClick={() => setCurrentStep(WizardStep.DiscoveryImages)}
          >
            Create New Cluster
          </Button>
        }
      />
    </PageSection>
  );

  switch (clustersUIState) {
    case ResourceListUIState.LOADING:
      return loadingState;
    case ResourceListUIState.ERROR:
      return errorState;
    case ResourceListUIState.EMPTY:
      return emptyState;
    default:
      // TODO(jtomasek): if there is just one cluster, redirect to it's detail
      return (
        <>
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Managed Clusters</Text>
            </TextContent>
          </PageSection>
          <PageSection variant={PageSectionVariants.light} isMain>
            Table will be here
            {/* <HostsTable
          hostRows={hostRows}
          loading={loadingHosts}
          error={hostsError}
          fetchHosts={fetchHosts}
        /> */}
          </PageSection>
          <ClusterWizardToolbar>
            <ToolbarButton
              variant={ButtonVariant.primary}
              onClick={() => setCurrentStep(WizardStep.DiscoveryImages)}
            >
              Create New Cluster
            </ToolbarButton>
          </ClusterWizardToolbar>
        </>
      );
  }
};

const mapStateToProps = (state: RootState) => ({
  hostRows: getHostTableRows(state),
  clustersUIState: getHostsUIState(state),
  clustersError: getHostsError(state),
});

export default connect(mapStateToProps, { fetchHosts: fetchHostsAsync })(Clusters);
