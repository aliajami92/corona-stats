import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PapaParser from 'papaparse';

const App = () => {
  const [lastDate, setLastDate] = useState();
  const [confirmed, setConfirmed] = useState();
  const [deaths, setDeaths] = useState();
  const [recovered, setRecoverd] = useState();

  useEffect(() => {
    const getTotalConfirmed = async () => {
      try {
        const res = await axios.get(
          'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv'
        );
        let data = PapaParser.parse(res.data);
        let todayArr = data.data[0];
        let todayDate = todayArr[todayArr.length - 1];
        setLastDate(todayDate);
        let totalConfirmed = getTotal(data.data);
        setConfirmed(totalConfirmed);
      } catch (error) {
        console.log(error.response);
      }
    };

    const getTotalDeaths = async () => {
      try {
        const res = await axios.get(
          'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv'
        );
        let data = PapaParser.parse(res.data);
        let totalDeaths = getTotal(data.data);
        setDeaths(totalDeaths);
      } catch (error) {
        console.log(error.response);
      }
    };

    const getTotalRecoved = async () => {
      try {
        const res = await axios.get(
          'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv'
        );
        let data = PapaParser.parse(res.data);
        let totalRecovered = getTotal(data.data);
        setRecoverd(totalRecovered);
      } catch (error) {
        console.log(error.response);
      }
    };

    getTotalConfirmed();
    getTotalDeaths();
    getTotalRecoved();
  }, []);

  const getTotal = arr => {
    let numbersArr = [];
    arr.forEach(item => {
      let itemToNum = parseInt(item[item.length - 1]);
      if (Number.isInteger(itemToNum)) {
        numbersArr.push(itemToNum);
      }
    });
    numbersArr.shift();
    let sum = numbersArr.reduce((acc, val) => acc + val);
    return sum;
  };

  const getPercentage = (smNum, lgNum) => {
    return `${((smNum / lgNum) * 100).toFixed(2)}%`;
  };

  return (
    <div className='App'>
      <h1>Corona tracker</h1>
      <h2>Last record date</h2>
      {lastDate && <div>{lastDate}</div>}
      <hr />
      <h2>Total confirmed cases</h2>
      {confirmed && <div>{confirmed}</div>}
      <hr />
      <h2>Total deaths</h2>
      {deaths && (
        <div>
          <span>{deaths} </span>
          <span>--- {getPercentage(deaths, confirmed)}</span>
        </div>
      )}
      <hr />
      <h2>Total recovered</h2>
      {recovered && (
        <div>
          <span>{recovered}</span>
          <span>--- {getPercentage(recovered, confirmed)}</span>
        </div>
      )}
    </div>
  );
};

export default App;
