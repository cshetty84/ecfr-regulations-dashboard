import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [wordCount, setWordCount] = useState({});
  const [checksum, setChecksum] = useState({});
  const [avgWordLength, setAvgWordLength] = useState({});

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const wordCountRes = await axios.get('/api/word-count');
      const checksumRes = await axios.get('/api/checksum');
      const avgLengthRes = await axios.get('/api/average-word-length');

      setWordCount(wordCountRes.data);
      setChecksum(checksumRes.data);
      setAvgWordLength(avgLengthRes.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">eCFR Regulations Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Word Count per Agency</h2>
        <ul className="list-disc pl-6">
          {Object.entries(wordCount).map(([agency, count]) => (
            <li key={agency}>{agency}: {count} words</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Checksum per Agency</h2>
        <ul className="list-disc pl-6">
          {Object.entries(checksum).map(([agency, checksums]) => (
            <li key={agency}>{agency}: {checksums.length} checksums</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Average Word Length per Agency</h2>
        <ul className="list-disc pl-6">
          {Object.entries(avgWordLength).map(([agency, avg]) => (
            <li key={agency}>{agency}: {avg.toFixed(2)} letters/word</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
