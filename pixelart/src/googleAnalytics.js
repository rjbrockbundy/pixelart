
import { useEffect } from 'react';
import ReactGA from "react-ga4";
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        ReactGA.initialize("G-B8KSLNZ9X9");
        ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);

    return null;
};

export default GoogleAnalytics;
