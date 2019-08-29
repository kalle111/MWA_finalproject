import React, { useContext, useState, useEffect } from 'react';
import { watchFile } from 'fs';
import './../index.css';
import { UserContext } from '../App';
import {UserProfileForm } from './UserProfileForm';
import {apiGetConsumerProfileData, apiUpdateConsumerProfileData} from './apiCalls';

//const value = useContext(UserContext);

export class UserProfile extends React.Component {
    //works both to persist parentStateData from login.
    constructor(props)
    {
        super(props);
        this.state = {
            isLoading: false,
            list: null,
            editMode: false,
            profileData: null,
            errorMsg: null
        }
        
    }
    
  
    //
    async componentDidMount() {
        this.setState({list: await this.getProfile()});
    }
    
    async handleOnChange(event) {
        let a = event.target.name;
        let b = event.target.value;
        let newProfileData = this.state.profileData;
        
        switch(a) {
            case "firstname":
                    newProfileData.firstname = b;
                    break;
            case "lastname":
                    newProfileData.lastname = b;
                    break;
            case "address":
                    newProfileData.address = b;
                    break;
            case "postal_code":
                    newProfileData.postal_code = b;
                    break;
            case "city":
                    newProfileData.city = b;
                    break;
            case "phone_number":
                    newProfileData.phone_number = b;
                    break;
            default: 
             break;
        }
        this.setState({profileData: newProfileData});       
    }
     // userName shall be unique in the database. Alternatively add id/password/et c. check. 
    buildTable(profileDataTemp) {
        let li = [];
        for(var propt in profileDataTemp) {
            if(propt != 'accountpassword' && propt != 'customer_id') {
                let k = 'li'+propt;
                li.push(<li key={k} className='profileListItem'>{propt}: <b>{profileDataTemp[propt]}</b></li>);
            }
        }
        this.setState({isLoading:false});
        return <ul className='profileList'>{li}</ul>;
    }
    buildEditableTable() {
        let li = [];

        for(var propt in this.state.profileData) {
            if(propt != 'accountpassword' && propt != 'customer_id' && propt != 'accounttype' && propt != 'accountname') {
                let k = 'li'+propt;
                let tempVal = this.state.profileData[propt]
                li.push(<li key={k} className='profileListItem'>{propt}:<input type='text' className='profileListItemInput' name={propt} defaultValue={tempVal} onChange={(event) => this.handleOnChange(event)}></input></li>);
            }
        }
        return <ul className='profileList'>{li}</ul>;
    }
    
    async getProfile() {
        this.setState({isLoading:true});
        for(var propt in this.state.profileData) {
            await this.setState({propt: this.state.profileData[propt]});
        }
        let profileDataTemp =  await apiGetConsumerProfileData({"username":this.props.data.userName});
        if(typeof profileDataTemp != 'string') {
            await this.setState({profileData: profileDataTemp});
            let tbl = this.buildTable(profileDataTemp);
            return tbl;
        } else {
            this.setState({isLoading: false});
            return <b>an error occured while fetching</b>
        }
        
    }

    editProfile() {
        this.setState({editMode: true, isLoading:true});
        let editableTable = this.buildEditableTable();
        this.setState({list: editableTable});
        this.setState({isLoading:false});
    }

    async saveEditedProfil() {
        var profileDataTemp, tbl;
        await this.setState({isLoading:true},async function() {
            profileDataTemp= await apiUpdateConsumerProfileData(this.state.profileData);
            if(typeof profileDataTemp != 'string') {
            await this.setState({profileData: profileDataTemp});
            tbl = this.buildTable(profileDataTemp);
            this.setState({list: tbl});
            }
        });
        this.setState({isLoading:false}, function() {
            this.setState({editMode: false});
        });
    }
    render() {
        const headline = <h3>Userprofile of {this.props.data.userName}</h3>
        const saveButton = <button onClick={()=> this.saveEditedProfil()}>Save Profile</button>
        const errorSpan = <span className='errorSpanProfile'>{this.state.errorMsg}</span>
    return(
        <div className='profileListDiv'>
            {headline}<hr/>
            <button onClick={() => this.editProfile()}>edit userprofile</button>
            {this.state.editMode ? saveButton : ''}
            {this.state.errorMsg != null ? errorSpan : ''}
            <br/>

        {this.state.isLoading ? '...loading...' : this.state.list }
        </div>)
    }
}
