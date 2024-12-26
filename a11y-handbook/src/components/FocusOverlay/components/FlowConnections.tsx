import { Fragment } from 'react';
import { FlowIndicator, FlowLabel } from '../styles';
import { FlowConnection } from '../types';

interface FlowConnectionsProps {
  connections: FlowConnection[];
}

export function FlowConnections({ connections }: FlowConnectionsProps) {
  return (
    <>
      {connections.map((connection, index) => (
        <Fragment key={index}>
          <FlowIndicator $from={connection.from} $to={connection.to} />
          <FlowLabel style={{
            left: (connection.from.left + connection.to.left) / 2,
            top: (connection.from.top + connection.to.top) / 2
          }}>
            {connection.label}
          </FlowLabel>
        </Fragment>
      ))}
    </>
  );
} 