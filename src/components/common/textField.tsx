import React from 'react';
import { createUseStyles } from 'react-jss';

const TextField: React.FC = () => {
    const classes = useStyles();
    return (
        <input type='text' />
    )
}

const useStyles = createUseStyles({
})

export default TextField;