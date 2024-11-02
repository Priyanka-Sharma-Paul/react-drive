import React from 'react';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';
import MainContent from './MainContent';

const Home = () => {
    const { user } = useAuth();

    return (
        <>
            {user ? <MainContent /> : <Landing />}
        </>
    );
};

export default Home;
