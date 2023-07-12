import React from 'react';
import DataComponent from './components/DataComponent';
import FormComponent from './components/FormComponent';
import './index.css';


const App = () => {
  return (
    <div className="App bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Test technique</h1>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Form</h2>
            <FormComponent />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Graph</h2>
            <DataComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
