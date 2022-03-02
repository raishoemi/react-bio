import React from 'react';
import 'antd/dist/antd.css';
import { createUseStyles } from 'react-jss';
import { Button, Popover } from 'antd';
import SearchPage from './components/pages/searchPage';


const App: React.FunctionComponent = ({ }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <img className={classes.logoImage} src='https://p7.hiclipart.com/preview/451/428/959/ikea-logo-sign-brand-business-business.jpg' />
      </div>
      <div className={classes.page}>
        <SearchPage />
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
    height: '100vh'
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
