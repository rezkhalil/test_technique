import React, { useState } from "react";
import axios from "axios";

const FormComponent = () => {
  const [uai, setUai] = useState("");
  const [granularity, setGranularity] = useState("");
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    axios
      .get(
        `https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-dnma-par-uai-appareils&q=&facet=debutsemaine&facet=uai&refine.uai=${uai}`
      )
      .then((response) => {
        const records = response.data.records;
        const data = processData(records, granularity);
        setChartData(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setChartData(null);
        setError("Error fetching data. Please try again.");
      });
  };

  const processData = (records, granularity) => {
    const aggregatedData = {};

    records.forEach((record) => {
      const weekStartDate = record.fields.debutsemaine;
      let key = "";

      if (granularity === "semaine") {
        key = weekStartDate;
      } else if (granularity === "mois") {
        key = weekStartDate.slice(0, 7); // Extract the year and month from the start date
      } else if (granularity === "annee") {
        key = weekStartDate.slice(0, 4); // Extract the year from the start date
      }

      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          visits_tablette: 0,
          visits_smartphone: 0,
          visits_ordinateur: 0,
        };
      }

      aggregatedData[key].visits_tablette += record.fields.visites_tablette || 0;
      aggregatedData[key].visits_smartphone += record.fields.visites_smartphone || 0;
      aggregatedData[key].visits_ordinateur += record.fields.visites_ordinateur || 0;
    });

    return aggregatedData;
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleFormSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <label className="block mb-4">
          <span className="text-gray-700">UAI:</span>
          <input
            type="text"
            value={uai}
            onChange={(e) => setUai(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Granularity:</span>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Granularity</option>
            <option value="semaine">Week</option>
            <option value="mois">Month</option>
            <option value="annee">Year</option>
          </select>
        </label>
        <button
          type="submit"
          className="inline-block bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
        >
          Generate Table
        </button>
      </form>

      {chartData ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Data Table</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {granularity === "semaine" && <th className="py-2">Week</th>}
                {granularity === "mois" && <th className="py-2">Month</th>}
                {granularity === "annee" && <th className="py-2">Year</th>}
                <th className="py-2">Visits Tablet</th>
                <th className="py-2">Visits Smartphone</th>
                <th className="py-2">Visits Computer</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(chartData).map((key) => (
                <tr key={key} className="bg-white">
                  {granularity === "semaine" && <td className="py-2">{key}</td>}
                  {granularity === "mois" && <td className="py-2">{key}</td>}
                  {granularity === "annee" && <td className="py-2">{key}</td>}
                  <td className="py-2">{chartData[key].visits_tablette}</td>
                  <td className="py-2">{chartData[key].visits_smartphone}</td>
                  <td className="py-2">{chartData[key].visits_ordinateur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormComponent;
