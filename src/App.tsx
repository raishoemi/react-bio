import React from 'react';
import 'antd/dist/antd.dark.css';
import { createUseStyles } from 'react-jss';
import { Button, Popover } from 'antd';


const App: React.FunctionComponent = ({ }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.logo}>
        <img className={classes.logoImage} src='https://p7.hiclipart.com/preview/451/428/959/ikea-logo-sign-brand-business-business.jpg' />
      </div>
      <div className={classes.page}></div>
      <div className={classes.uniprotDisclaimerContainer}>
        <img className={classes.uniprotDisclaimerImage} src='https://www.uniprot.org/images/logos/Logo_medium.png' />
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
    backgroundColor: 'blue',
    width: '80vw',
    height: '100vh',
  },
  uniprotDisclaimerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '10vw',
    height: '10vw',
    justifyContent: 'center',
    alignItems: 'center'
  },
  uniprotDisclaimerImage: {
    width: '60%'
  },
  uniprotDisclaimerButton: {
    marginTop: '10%'
  }
});

export default App;
