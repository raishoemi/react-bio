import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Popover, Button } from 'antd';
import 'antd/dist/antd.css';

const Header: React.FC = () => {
    const classes = useStyles();
    const [disclaimerVisible, setDisclaimerVisible] = useState<boolean>(false);
    return (
        <div className={classes.container}>
            <div>
                <img className={classes.logo} src='https://p7.hiclipart.com/preview/451/428/959/ikea-logo-sign-brand-business-business.jpg' />
            </div>
            <div className={classes.uniprotDisclaimerContainer}>
                <img className={classes.uniprotImage} src='https://www.uniprot.org/images/logos/Logo_medium.png' />
                <Popover placement='bottom' visible={disclaimerVisible}
                    onVisibleChange={(visibility: boolean) => setDisclaimerVisible(visibility)}
                    content={(
                        <a onClick={() => setDisclaimerVisible(previousValue => !previousValue)}>
                            All content is retrieved from uniprot's API, and not owned by this website
                        </a>
                    )}>
                    <Button type='ghost'>DISCLAIMER</Button>
                </Popover>
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: '4%',
        left: '5%',
        width: '90%',
    },
    uniprotDisclaimerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    logo: {
        width: '10%'
    },
    uniprotImage: {
        margin: 'auto',
        marginBottom: '15%'
    }
})

export default Header;