'use client'

import React from 'react';

import { SDMXDashboard } from 'sdmx-dashboard-components';

const DashboardWrapper = (props:
  { uri: string, className?: string }
) => {
  return (
    <div className={props.className}>
      <SDMXDashboard url={props.uri} />
    </div>
  );
}

export default DashboardWrapper;