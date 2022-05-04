import React, {useEffect, useRef, useState} from 'react';
import {Chart as ChartJS, ChartData, ChartOptions, registerables} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import './App.css';

ChartJS.register(...registerables);

enum chartView {
  bar = 'bar',
  line = 'line',
  // pie = 'pie',
  // doughnut = 'doughnut'
}

const initialLabels: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July'
];

const initialValues: number[] = [
  3,
  4,
  3,
  4,
  6,
  8,
  6
]

const initialData: ChartData = {
  labels: initialLabels,
  datasets: [
    {
      borderColor: '#cee3f4',
      borderWidth: 4,

      data: initialValues,
    },
  ],
};

const initialOptions: ChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const App: React.FC = () => {
  const chartRef = useRef<ChartJS>(null);

  const [inputLabels, setInputLabels] = useState<string>('');
  const [chartLabels, setChartLabels] = useState<string[]>(initialLabels);

  const [inputValues, setInputValues] = useState<string>('');
  const [chartValues, setChartValues] = useState<number[]>(initialValues)

  const [chartData, setChartData] = useState<ChartData>(initialData);
  const [
    chartOptions,
    // setChartOptions
  ] = useState<ChartOptions>(initialOptions);

  const [view, setView] = useState<chartView>(chartView.bar);

  const changeInputHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case 'labels':
        setInputLabels(value);
        break;
      case 'values':
        setInputValues(value);
        break;
      default:
        break;
    }
  };

  const setCorrectDataToChart = () => {
    setChartLabels((prevLabels) => {
      if (!inputLabels.trim().length) {
        return prevLabels;
      } else {
        return inputLabels.split(',')
          .map((label) => label.trim())
      }
    });

    setChartValues((prevValues) => {
      if (!inputValues.trim().length) {
        return prevValues;
      } else {
        const preparedValues = inputValues
          .split(',')
          .map((value) => Number(value) || 0);

        const diff = chartLabels.length - preparedValues.length;

        if (diff === 0) {
          return preparedValues;
        } else if (diff < 0) {
          return prevValues;
        } else {
          return preparedValues.concat(Array.from(
            { length: diff }, () => 0)
          );
        }
      }
    });
  };

  const enterHandler = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      setCorrectDataToChart();
    }
  }

  const loseFocusHandler = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    setCorrectDataToChart();
  }

  const changeView = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setView((prevView) => {
      switch (e.target.value) {
        case chartView.bar:
          return chartView.bar;
        case chartView.line:
          return chartView.line;
        // case chartView.pie:
        //   return chartView.pie;
        // case chartView.doughnut:
        //   return chartView.doughnut;
        default:
          return prevView;
      }
    });
  };

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      labels: chartLabels,
      datasets: prevData.datasets.map((dataset) => ({
        ...dataset,
        data: chartValues
      }))
    }))
  }, [chartLabels, chartValues]);

  return (
    <>
      <div className="inputs">
        <div className="mb-4">
          <label htmlFor="x" className="form-label">
            X axis labels:
          </label>
          <input
            type="text"
            id="x"
            name="labels"
            className="form-control"
            placeholder="label1, label2, ..."
            value={inputLabels}
            onChange={changeInputHandler}
            onKeyDown={enterHandler}
            onBlur={loseFocusHandler}
          />
        </div>

        <div>
          <label htmlFor="y" className="form-label">
            Y axis values:
          </label>
          <input
            type="text"
            id="y"
            name="values"
            className="form-control"
            placeholder="value1, value2, ..."
            value={inputValues}
            onChange={changeInputHandler}
            onKeyDown={enterHandler}
            onBlur={loseFocusHandler}
          />
        </div>
      </div>

      <div className="chart">
        <Chart
          ref={chartRef}
          type={view}
          key={view}
          data={chartData}
          options={chartOptions}
        />
      </div>

      <div className="radio">
        <div className="form-check mb-2">
          <input
            type="radio"
            name="view"
            className="form-check-input"
            id="view-bar"
            value={chartView.bar}
            onChange={changeView}
            defaultChecked
          />
          <label htmlFor="view-bar" className="form-check-label">
            Bar Chart
          </label>
        </div>

        <div className="form-check mb-2">
          <input
            type="radio"
            name="view"
            className="form-check-input"
            id="view-line"
            value={chartView.line}
            onChange={changeView}
          />
          <label htmlFor="view-line" className="form-check-label">
            Line Chart
          </label>
        </div>

        {/*<div className="form-check mb-2">*/}
        {/*  <input*/}
        {/*    type="radio"*/}
        {/*    name="view"*/}
        {/*    className="form-check-input"*/}
        {/*    id="view-pie"*/}
        {/*    value={chartView.pie}*/}
        {/*    onChange={changeView}*/}
        {/*  />*/}
        {/*  <label htmlFor="view-pie" className="form-check-label">*/}
        {/*    Pie Chart*/}
        {/*  </label>*/}
        {/*</div>*/}

        {/*<div className="form-check mb-2">*/}
        {/*  <input*/}
        {/*    type="radio"*/}
        {/*    name="view"*/}
        {/*    className="form-check-input"*/}
        {/*    id="view-doughnut"*/}
        {/*    value={chartView.doughnut}*/}
        {/*    onChange={changeView}*/}
        {/*  />*/}
        {/*  <label htmlFor="view-doughnut" className="form-check-label">*/}
        {/*    Doughnut Chart*/}
        {/*  </label>*/}
        {/*</div>*/}
      </div>
    </>
  );
}
