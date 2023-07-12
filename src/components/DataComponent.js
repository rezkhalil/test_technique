import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const DataComponent = () => {
  const [uai, setUai] = useState("");
  const [year, setYear] = useState("");
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const handleChartSubmit = (e) => {
    e.preventDefault();

    axios
      .get(
        `https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-dnma-par-uai-appareils&q=&facet=debutsemaine&facet=uai&refine.uai=${uai}&refine.debutsemaine=${year}`
      )
      .then((response) => {
        const records = response.data.records;
        const data = processDataForChart(records);
        setChartData(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setChartData(null);
        setError("Error fetching data. Please try again.");
      });
  };

  const processDataForChart = (records) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const visitsTablet = Array(12).fill(0);
    const visitsSmartphone = Array(12).fill(0);
    const visitsComputer = Array(12).fill(0);

    records.forEach((record) => {
      const monthIndex = new Date(record.fields.debutsemaine).getMonth();
      visitsTablet[monthIndex] += record.fields.visites_tablette || 0;
      visitsSmartphone[monthIndex] += record.fields.visites_smartphone || 0;
      visitsComputer[monthIndex] += record.fields.visites_ordinateur || 0;
    });

    const data = {
      labels: months,
      datasets: [
        {
          label: "Tablet",
          data: visitsTablet,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Smartphone",
          data: visitsSmartphone,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Computer",
          data: visitsComputer,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    return data;
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleChartSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
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
          <span className="text-gray-700">Year:</span>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
        <button
          type="submit"
          className="inline-block bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
        >
          Generate Chart
        </button>
      </form>

      {chartData ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Visits by Month</h2>
          <Line data={chartData} />
        </div>
      ) : (
        <p className="mt-8 text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DataComponent;
