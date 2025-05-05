import React, { useEffect, useState } from 'react';
import AnalyticsChart from './AnalyticsChart.jsx';


function AgencyList() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingAll, setFetchingAll] = useState(false);
  const [fetchingAllChanges, setFetchingAllChanges] = useState(false);
  const [fetchingAllChecksums, setFetchingAllChecksums] = useState(false);



  useEffect(() => {
    async function fetchAgencies() {
      try {
        const response = await fetch('http://localhost:3001/api/agencies');
        const data = await response.json();
        const agenciesWithMetrics = data.map((agency) => ({
          ...agency,
          wordCount: null,
          daysSinceAmendment: null,
          checksum: null,
        }));
        
        setAgencies(agenciesWithMetrics);
      } catch (error) {
        console.error('Error fetching agencies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgencies();
  }, []);

  async function fetchWordCount(titleNumber) {
    try {
      const response = await fetch(`http://localhost:3001/api/agency/${titleNumber}/wordcount`);
      const data = await response.json();

      setAgencies((prevAgencies) =>
        prevAgencies.map((agency) =>
          agency.number === titleNumber
            ? { ...agency, wordCount: data.wordCount }
            : agency
        )
      );
    } catch (error) {
      console.error('Error fetching word count:', error);
    }
  }

  async function fetchChecksum(titleNumber) {
    try {
      const response = await fetch(`http://localhost:3001/api/agency/${titleNumber}/checksum`);
      const data = await response.json();
  
      setAgencies((prevAgencies) =>
        prevAgencies.map((agency) =>
          agency.number === titleNumber
            ? { ...agency, checksum: data.checksum }
            : agency
        )
      );
    } catch (error) {
      console.error('Error fetching checksum:', error);
    }
  }
  
  async function fetchAllChecksums() {
    setFetchingAllChecksums(true);
    for (const agency of agencies) {
      await fetchChecksum(agency.number);
    }
    setFetchingAllChecksums(false);
  }
  

  async function fetchHistoricalChange(titleNumber) {
    try {
      const response = await fetch(`http://localhost:3001/api/agency/${titleNumber}/historical-change`);
      const data = await response.json();

      setAgencies((prevAgencies) =>
        prevAgencies.map((agency) =>
          agency.number === titleNumber
            ? { ...agency, daysSinceAmendment: data.daysSinceAmendment }
            : agency
        )
      );
    } catch (error) {
      console.error('Error fetching historical change:', error);
    }
  }

  

  async function fetchAllWordCounts() {
    setFetchingAll(true);
    for (const agency of agencies) {
      await fetchWordCount(agency.number);
    }
    setFetchingAll(false);
  }

  async function fetchAllHistoricalChanges() {
    setFetchingAllChanges(true);
    for (const agency of agencies) {
      await fetchHistoricalChange(agency.number);
    }
    setFetchingAllChanges(false);
  }

  const fetchReservedTitles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/agencies/reserved');
      const data = await response.json();
      console.log('Reserved Titles:', data);
      alert(JSON.stringify(data, null, 2)); // <-- TEMPORARY
    } catch (error) {
      console.error('Error fetching reserved titles:', error);
      alert('Failed to fetch reserved titles');
    }
  };
  
  
  

  if (loading) {
    return <p>Loading agencies...</p>;
  }

  return (
    <div>
      <h2>List of Agencies (Titles)</h2>
      <button onClick={fetchAllWordCounts} disabled={fetchingAll}>
        {fetchingAll ? 'Fetching Word Counts...' : 'Fetch All Word Counts'}
      </button>
      <button onClick={fetchAllHistoricalChanges} disabled={fetchingAllChanges}>
  {fetchingAllChanges ? 'Fetching Changes...' : 'Fetch All Historical Changes'}
</button>
<button onClick={fetchAllChecksums} disabled={fetchingAllChecksums}>
  {fetchingAllChecksums ? 'Fetching Checksums...' : 'Fetch All Checksums'}
</button>




      <br /><br />
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Title Number</th>
            <th>Agency Name</th>
            <th>Latest Issue Date</th>
            <th>Up to Date As Of</th>
            <th>Word Count</th>
            <th>Days Since Last Amendment</th>
            <th>Checksum</th>
            <th>Reserved?</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          {agencies.map((agency) => (
            <tr key={agency.number}>
              <td>{agency.number}</td>
              <td>{agency.name}</td>
              <td>{agency.latest_issue_date}</td>
              <td>{agency.up_to_date_as_of}</td>
              <td>{agency.wordCount !== null ? agency.wordCount : '-'}</td>
              <td>{agency.daysSinceAmendment !== null ? agency.daysSinceAmendment : '-'}</td>
              <td>{agency.checksum !== null ? agency.checksum.slice(0, 12) + '...' : '-'}</td>
              <td>{agency.reserved ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => fetchWordCount(agency.number)}>
                  Fetch Word Count
                </button>
                <br />
                <button onClick={() => fetchHistoricalChange(agency.number)}>
                  Fetch Historical Change
                </button>
                <button onClick={() => fetchChecksum(agency.number)}>
  Fetch Checksum
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AnalyticsChart agencies={agencies} />

    </div>
  );
}

export default AgencyList;

