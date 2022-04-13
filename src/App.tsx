import React from 'react';
import 'antd/dist/antd.css';
import { createUseStyles } from 'react-jss';
import { Button, Popover } from 'antd';
import SearchResultsPage from './components/pages/searchResultsPage';
import { Route, Routes } from 'react-router-dom';
import TaxonomyPage from './components/pages/taxonomyPage';
import SearchBar from './components/searchBar';
import ProteinPage from './components/pages/proteinPage';


const App: React.FunctionComponent = ({ }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <img className={classes.logoImage} src='https://i.imgur.com/1SE3a2W.png' />
      </div>
      <div className={classes.page}>
        <SearchBar />
        <Routes>
          <Route path='search' element={<SearchResultsPage />} />
          <Route path='taxonomy/:id' element={<TaxonomyPage />} />
          <Route path='protein/:id' element={<ProteinPage />} />
        </Routes>
      </div>
      <div className={classes.uniprotDisclaimerContainer} style={{ 'backgroundImage': 'https://www.uniprot.org/images/UniProt_Headerimage.png' }}>
        <div className={classes.uniprotDislcaimerImageContainer}>
          <img className={classes.uniprotDisclaimerImage} src='https://www.uniprot.org/images/logos/Logo_medium.png' />
        </div>
        <Popover placement='bottom'
          content={(<p>All content is retrieved from uniprot's API, and not owned by this website</p>)}>
          <Button className={classes.uniprotDisclaimerButton} type='ghost'>DISCLAIMER</Button>
        </Popover>
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    overflow: 'hidden'
  },
  logo: {
    display: 'flex',
    width: '10vw',
    height: '10vw',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    width: '70%'
  },
  page: {
    width: '80vw',
    marginTop: '5vh',
    height: '95vh',
  },
  uniprotDisclaimerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '10vw',
    height: '10vw',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uniprotDislcaimerImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%',
    backgroundImage: 'url("https://www.uniprot.org/images/UniProt_Headerimage.png")'
  },
  uniprotDisclaimerImage: {
    width: '80%'
  },
  uniprotDisclaimerButton: {
    marginTop: '10%',
  }
});

export default App;
