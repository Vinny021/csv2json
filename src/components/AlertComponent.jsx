import {Alert} from '@mui/material';
import './Alert.css';

function AlertComponent() {

    var customStyle = {
        backgroundColor: 'rgb(22, 11, 11)', 
        borderColor: '#20232a',
        borderRadius: '1rem',
        borderStyle: 'solid',
        color: 'rgb(244, 199, 199)'
    }

    return (
        <div className='Alert'><Alert style={customStyle} severity="error">Não valido</Alert></div>
    );
}

export default AlertComponent;