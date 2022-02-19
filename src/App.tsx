import React from 'react';
import Header from './components/header';
import SearchPage from './components/pages/searchPage';
import 'antd/dist/antd.dark.css';


const App: React.FunctionComponent = ({ }) => (
  <>
    <Header />
    <SearchPage />
  </>
)

export default App;
