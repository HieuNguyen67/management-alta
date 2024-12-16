import React from 'react';
import logo from './logo.svg';
import './App.css';
import Apps from './components/App';
import MainLayout from './components/Layout';

function App() {
  
  return (
    <>
      <MainLayout>
        <Apps />
      </MainLayout>
    </>
  );
}

export default App;
