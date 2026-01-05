import { useEffect, useState } from 'react';
import Loader from 'react-loaders';
import { Link } from 'react-router-dom';
import LogoLaliga from '../../assets/images/LaLiga_EA_Sports_2023_Vertical_Logo.svg';
import AnimatedLetters from '../AnimatedLetters';
import ParticleBall from '../ParticleBall';
import './index.scss';

const Home = () => {
    const [letterClass, setLetterClass] = useState('text-animate')
    const nameArray = "Welcome to".split("");
    const jobArray = "La Liga Fantasy!".split("");

    useEffect(() => {
        const timerId = setTimeout(() => {
          setLetterClass('text-animate-hover');
        }, 4000);
      
        return () => {
          clearTimeout(timerId);
        };
      }, []);

    return(
      <>
        <div className = "container home-page">
            <div className="text-zone">
                <h1>
                <img src={LogoLaliga} alt = "La Liga" />
                <br />
                <AnimatedLetters letterClass={letterClass} strArray={nameArray} idx={12} />
                <br /> 
                <AnimatedLetters letterClass={letterClass} strArray={jobArray} idx={15} /> 
                </h1>
                <h2>One platform. All of La Liga!</h2>
                <Link to="/teams" className="flat-button">GET STARTED</Link>
            </div>
            <div className="ball-zone">
                <ParticleBall />
            </div>
        </div>
        <Loader type="pacman" />
      </>
    )
}

export default Home