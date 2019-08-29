import React, { useContext } from 'react';
import { watchFile } from 'fs';
import './../index.css';
import { UserContext } from '../App';


export function UserProfileForm(props) {
    //works both to persist parentStateData from login.
    const value = useContext(UserContext);
    const data = props;
    //
    
        

    
    const table = <table><thead></thead><tbody>ab</tbody></table>
    /*
    const studentItems = studentData.map(function(student, index) {
        let tds = [];
        for(var propt in student) {
            let k = {index}+'td'+propt
            tds.push(<td key={k} style={tableDataStyle}>{student[propt]}</td>)
        }
        //add td's for buttons/etc here <--
        let delKey = {index}+'deleteButton'
        tds.push(<td key={delKey}><button onClick={() => props.deleteStudent(student)}>delete user</button></td>)
        return <tr key={index}>{tds}</tr>
    });
    */


    return(<p>{table}</p>)
}
/*
class UserProfile extends React.Component
{
    constructor(props)
    {
        super(props);

        //this.buttonOnclicked = this.buttonOnclicked.bind(this);

        // state
        this.state = {
            data: []
        }
        //this.showTeamInfo = this.showTeamInfo.bind(this);
    }


    render() {

        return(
            <div> userProfile of {this.props.userName}</div>
        )
        
    }
}

export {UserProfile};*/