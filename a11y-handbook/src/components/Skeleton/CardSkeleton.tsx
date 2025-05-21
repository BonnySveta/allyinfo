import styled from 'styled-components';
import { CardContainer, CardHeader, CardContent, ResourcesList, ResourceListItem, ResourceLink } from '../Card/styles';
import { Skeleton } from './Skeleton';

export function CardSkeleton() {
  return (
    <CardContainer>
      <CardHeader>
        <Skeleton width="40%" height={24} margin="0 0 8px 0" />
      </CardHeader>
      <CardContent>
        <ResourcesList>
          {[1, 2, 3].map(i => (
            <ResourceListItem key={i}>
              <ResourceLink style={{ pointerEvents: 'none' }}>
                <Skeleton width={20} height={20} margin="0 12px 0 0" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="70%" height={14} margin="0 0 6px 0" />
                  <Skeleton width="40%" height={10} />
                </div>
              </ResourceLink>
            </ResourceListItem>
          ))}
        </ResourcesList>
      </CardContent>
    </CardContainer>
  );
} 