import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AnalyticsChart({ agencies }) {
  const validAgencies = agencies.filter(a => a.wordCount !== null && a.daysSinceAmendment !== null);

  const totalWordCount = validAgencies.reduce((sum, a) => sum + a.wordCount, 0);
  const totalDays = validAgencies.reduce((sum, a) => sum + a.daysSinceAmendment, 0);

  const avgWordCount = validAgencies.length > 0 ? (totalWordCount / validAgencies.length).toFixed(2) : 0;
  const avgDaysSinceAmendment = validAgencies.length > 0 ? (totalDays / validAgencies.length).toFixed(2) : 0;

  const data = [
    { name: 'Avg Word Count', value: avgWordCount },
    
  ];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Agency Analytics</h2>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsChart;
