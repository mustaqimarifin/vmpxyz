import useSWR from 'swr';

import fetcher from 'lib/fetcher';
import { Views } from 'lib/types';
import MetricCard from 'components/metrics/Card';

export default function AnalyticsCard() {
  const { data } = useSWR<Views>('/api/page', fetcher);

  const pageViews = new Number(data?.total);
  const link = 'https://mustaqimarifin.xyz';

  return (
    <MetricCard
      header="All-Time Views"
      link={link}
      metric={pageViews}
      isCurrency={false}
    />
  );
}
