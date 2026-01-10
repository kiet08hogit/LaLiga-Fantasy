import React, { useEffect } from 'react';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Teams from './components/Teams';
import TeamData from './components/TeamData';
import MatchStats from "./components/MatchStats";
import Position from "./components/Position";
import Search from "./components/Search";
import LiveStats from "./components/LiveStats";
import Champion from './components/Champion';
import DreamTeam from './components/DreamTeam';

function App() {
  useEffect(() => {
    document.title = 'La Liga Fantasy';
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="teams" element={<Teams />} />
          <Route path="data" element={<TeamData />} />
          <Route path="teamdata" element={<TeamData />} />
          <Route path="matchstats" element={<MatchStats />} />
          <Route path="position" element={<Position />} />
          <Route path="livestats" element={<LiveStats />} />
          <Route path="champions" element={<Champion />} />
          <Route path="dreamteam" element={<DreamTeam />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;